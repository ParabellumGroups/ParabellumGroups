import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { serviceId } = req.query;
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

    // Filtrage par service si nécessaire
    let customerFilter: any = {};
    let quoteFilter: any = {};
    let invoiceFilter: any = {};

    if (!['ADMIN', 'GENERAL_DIRECTOR'].includes(req.user!.role)) {
      const serviceCondition = { creator: { serviceId: req.user!.serviceId } };
      customerFilter.serviceId = req.user!.serviceId;
      quoteFilter = serviceCondition;
      invoiceFilter = serviceCondition;
    } else if (serviceId) {
      const serviceCondition = { creator: { serviceId: Number(serviceId) } };
      customerFilter.serviceId = Number(serviceId);
      quoteFilter = serviceCondition;
      invoiceFilter = serviceCondition;
    }

    const [
      totalCustomers,
      activeCustomers,
      totalQuotes,
      pendingQuotes,
      approvedQuotes,
      totalInvoices,
      paidInvoices,
      unpaidInvoices,
      overdueInvoices,
      monthlyRevenue,
      yearlyRevenue,
      totalRevenue
    ] = await Promise.all([
      // Clients
      prisma.customer.count({
        where: customerFilter
      }),
      prisma.customer.count({
        where: { ...customerFilter, isActive: true }
      }),

      // Devis
      prisma.quote.count({
        where: quoteFilter
      }),
      prisma.quote.count({
        where: {
          ...quoteFilter,
          status: {
            in: ['SUBMITTED_FOR_SERVICE_APPROVAL', 'SUBMITTED_FOR_DG_APPROVAL']
          }
        }
      }),
      prisma.quote.count({
        where: {
          ...quoteFilter,
          status: 'APPROVED_BY_DG'
        }
      }),

      // Factures
      prisma.invoice.count({
        where: invoiceFilter
      }),
      prisma.invoice.count({
        where: {
          ...invoiceFilter,
          status: 'PAID'
        }
      }),
      prisma.invoice.count({
        where: {
          ...invoiceFilter,
          status: {
            in: ['SENT', 'PARTIAL']
          }
        }
      }),
      prisma.invoice.count({
        where: {
          ...invoiceFilter,
          status: 'OVERDUE'
        }
      }),

      // Chiffre d'affaires
      prisma.invoice.aggregate({
        where: {
          ...invoiceFilter,
          status: 'PAID',
          invoiceDate: { gte: startOfMonth }
        },
        _sum: { totalTtc: true }
      }),
      prisma.invoice.aggregate({
        where: {
          ...invoiceFilter,
          status: 'PAID',
          invoiceDate: { gte: startOfYear }
        },
        _sum: { totalTtc: true }
      }),
      prisma.invoice.aggregate({
        where: {
          ...invoiceFilter,
          status: 'PAID'
        },
        _sum: { totalTtc: true }
      })
    ]);

    // Évolution mensuelle du CA
    const monthlyEvolution = await getMonthlyRevenue(invoiceFilter);

    // Top clients
    const topCustomers = await getTopCustomers(customerFilter, invoiceFilter);

    // Créances par ancienneté
    const agingReport = await getAgingReport(invoiceFilter);

    res.json({
      success: true,
      data: {
        customers: {
          total: totalCustomers,
          active: activeCustomers
        },
        quotes: {
          total: totalQuotes,
          pending: pendingQuotes,
          approved: approvedQuotes
        },
        invoices: {
          total: totalInvoices,
          paid: paidInvoices,
          unpaid: unpaidInvoices,
          overdue: overdueInvoices
        },
        revenue: {
          monthly: monthlyRevenue._sum.totalTtc || 0,
          yearly: yearlyRevenue._sum.totalTtc || 0,
          total: totalRevenue._sum.totalTtc || 0,
          evolution: monthlyEvolution
        },
        topCustomers,
        agingReport
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

export const getSalesReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startDate, endDate, serviceId, groupBy = 'month' } = req.query;

    let invoiceFilter: any = {};
    
    if (!['ADMIN', 'GENERAL_DIRECTOR'].includes(req.user!.role)) {
      invoiceFilter.creator = { serviceId: req.user!.serviceId };
    } else if (serviceId) {
      invoiceFilter.creator = { serviceId: Number(serviceId) };
    }

    if (startDate) {
      invoiceFilter.invoiceDate = { gte: new Date(startDate as string) };
    }
    if (endDate) {
      invoiceFilter.invoiceDate = { 
        ...invoiceFilter.invoiceDate,
        lte: new Date(endDate as string) 
      };
    }

    // Ventes par période
    const salesByPeriod = await getSalesByPeriod(invoiceFilter, groupBy as string);

    // Ventes par produit/service
    const salesByProduct = await prisma.invoiceItem.groupBy({
      by: ['productId'],
      where: {
        invoice: invoiceFilter
      },
      _sum: {
        quantity: true,
        totalHt: true
      },
      _count: true
    });

    const productsData = await Promise.all(
      salesByProduct.map(async (item) => {
        const product = item.productId ? await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, sku: true }
        }) : null;

        return {
          product: product || { name: 'Service personnalisé', sku: 'N/A' },
          quantity: item._sum.quantity || 0,
          revenue: item._sum.totalHt || 0,
          count: item._count
        };
      })
    );

    // Ventes par client
    const salesByCustomer = await prisma.invoice.groupBy({
      by: ['customerId'],
      where: {
        ...invoiceFilter,
        status: 'PAID'
      },
      _sum: {
        totalTtc: true
      },
      _count: true,
      orderBy: {
        _sum: {
          totalTtc: 'desc'
        }
      },
      take: 10
    });

    const customersData = await Promise.all(
      salesByCustomer.map(async (item) => {
        const customer = await prisma.customer.findUnique({
          where: { id: item.customerId },
          select: { name: true, customerNumber: true }
        });

        return {
          customer,
          revenue: item._sum.totalTtc || 0,
          invoiceCount: item._count
        };
      })
    );

    res.json({
      success: true,
      data: {
        salesByPeriod,
        salesByProduct: productsData,
        salesByCustomer: customersData
      }
    });
  } catch (error) {
    console.error('Erreur lors de la génération du rapport de ventes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

export const getFinancialReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const currentDate = new Date();
    const start = startDate ? new Date(startDate as string) : new Date(currentDate.getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate as string) : currentDate;

    // Chiffre d'affaires
    const revenue = await prisma.invoice.aggregate({
      where: {
        invoiceDate: { gte: start, lte: end },
        status: 'PAID'
      },
      _sum: { totalTtc: true }
    });

    // Dépenses
    const expenses = await prisma.expense.aggregate({
      where: {
        expenseDate: { gte: start, lte: end },
        status: 'PAID'
      },
      _sum: { totalTtc: true }
    });

    // Créances
    const receivables = await prisma.invoice.aggregate({
      where: {
        status: { in: ['SENT', 'PARTIAL', 'OVERDUE'] }
      },
      _sum: { balanceDue: true }
    });

    // Trésorerie
    const cashFlow = await prisma.cashFlow.aggregate({
      where: {
        transactionDate: { gte: start, lte: end }
      },
      _sum: { amount: true }
    });

    // Évolution mensuelle
    const monthlyData = await getMonthlyFinancialData(start, end);

    res.json({
      success: true,
      data: {
        period: { start, end },
        revenue: revenue._sum.totalTtc || 0,
        expenses: expenses._sum.totalTtc || 0,
        profit: (revenue._sum.totalTtc || 0) - (expenses._sum.totalTtc || 0),
        receivables: receivables._sum.balanceDue || 0,
        cashFlow: cashFlow._sum.amount || 0,
        monthlyData
      }
    });
  } catch (error) {
    console.error('Erreur lors de la génération du rapport financier:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

export const getCashFlowReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const currentDate = new Date();
    const start = startDate ? new Date(startDate as string) : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const end = endDate ? new Date(endDate as string) : currentDate;

    const cashFlowEntries = await prisma.cashFlow.findMany({
      where: {
        transactionDate: { gte: start, lte: end }
      },
      orderBy: { transactionDate: 'desc' },
      take: 100
    });

    // Grouper par type
    const inflows = cashFlowEntries.filter(entry => entry.type === 'INFLOW');
    const outflows = cashFlowEntries.filter(entry => entry.type === 'OUTFLOW');

    const totalInflows = inflows.reduce((sum, entry) => sum + entry.amount, 0);
    const totalOutflows = outflows.reduce((sum, entry) => sum + entry.amount, 0);

    // Solde de trésorerie actuel
    const currentBalance = await prisma.cashFlow.aggregate({
      _sum: { amount: true }
    });

    res.json({
      success: true,
      data: {
        period: { start, end },
        totalInflows,
        totalOutflows,
        netCashFlow: totalInflows - totalOutflows,
        currentBalance: currentBalance._sum.amount || 0,
        entries: cashFlowEntries
      }
    });
  } catch (error) {
    console.error('Erreur lors de la génération du rapport de trésorerie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Fonctions utilitaires
async function getMonthlyRevenue(invoiceFilter: any) {
  const currentDate = new Date();
  const months = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    
    const revenue = await prisma.invoice.aggregate({
      where: {
        ...invoiceFilter,
        status: 'PAID',
        invoiceDate: { gte: date, lt: nextMonth }
      },
      _sum: { totalTtc: true }
    });
    
    months.push({
      month: date.toISOString().substring(0, 7),
      revenue: revenue._sum.totalTtc || 0
    });
  }
  
  return months;
}

async function getTopCustomers(customerFilter: any, invoiceFilter: any) {
  const topCustomers = await prisma.customer.findMany({
    where: customerFilter,
    include: {
      _count: {
        select: { invoices: true }
      },
      invoices: {
        where: { status: 'PAID' },
        select: { totalTtc: true }
      }
    },
    take: 5
  });

  return topCustomers.map(customer => ({
    id: customer.id,
    name: customer.name,
    customerNumber: customer.customerNumber,
    totalRevenue: customer.invoices.reduce((sum, inv) => sum + inv.totalTtc, 0),
    invoiceCount: customer._count.invoices
  })).sort((a, b) => b.totalRevenue - a.totalRevenue);
}

async function getAgingReport(invoiceFilter: any) {
  const currentDate = new Date();
  const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(currentDate.getTime() - 60 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(currentDate.getTime() - 90 * 24 * 60 * 60 * 1000);

  const [current, thirty, sixty, ninety] = await Promise.all([
    prisma.invoice.aggregate({
      where: {
        ...invoiceFilter,
        status: { in: ['SENT', 'PARTIAL'] },
        dueDate: { gte: currentDate }
      },
      _sum: { balanceDue: true }
    }),
    prisma.invoice.aggregate({
      where: {
        ...invoiceFilter,
        status: { in: ['SENT', 'PARTIAL', 'OVERDUE'] },
        dueDate: { gte: thirtyDaysAgo, lt: currentDate }
      },
      _sum: { balanceDue: true }
    }),
    prisma.invoice.aggregate({
      where: {
        ...invoiceFilter,
        status: { in: ['SENT', 'PARTIAL', 'OVERDUE'] },
        dueDate: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }
      },
      _sum: { balanceDue: true }
    }),
    prisma.invoice.aggregate({
      where: {
        ...invoiceFilter,
        status: { in: ['SENT', 'PARTIAL', 'OVERDUE'] },
        dueDate: { lt: ninetyDaysAgo }
      },
      _sum: { balanceDue: true }
    })
  ]);

  return {
    current: current._sum.balanceDue || 0,
    thirtyDays: thirty._sum.balanceDue || 0,
    sixtyDays: sixty._sum.balanceDue || 0,
    ninetyDaysPlus: ninety._sum.balanceDue || 0
  };
}

async function getSalesByPeriod(invoiceFilter: any, groupBy: string) {
  // Cette fonction nécessiterait une implémentation plus complexe
  // pour grouper par différentes périodes (jour, semaine, mois, année)
  return [];
}

async function getMonthlyFinancialData(start: Date, end: Date) {
  // Implémentation similaire à getMonthlyRevenue mais incluant les dépenses
  return [];
}