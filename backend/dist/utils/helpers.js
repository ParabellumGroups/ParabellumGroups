"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationHelpers = exports.permissionHelpers = exports.errorHandlers = exports.businessValidations = exports.formatters = exports.calculations = exports.generateNumber = void 0;
const logger_1 = require("@/config/logger");
const config_1 = require("@/config");
// Utilitaires pour la génération de numéros
exports.generateNumber = {
    customer: async (prisma) => {
        const lastCustomer = await prisma.customer.findFirst({
            orderBy: { customerNumber: 'desc' }
        });
        let nextNumber = 1;
        if (lastCustomer) {
            const lastNumber = parseInt(lastCustomer.customerNumber.split('-')[1]);
            nextNumber = lastNumber + 1;
        }
        return `CLI-${nextNumber.toString().padStart(3, '0')}`;
    },
    quote: async (prisma) => {
        const lastQuote = await prisma.quote.findFirst({
            orderBy: { quoteNumber: 'desc' }
        });
        let nextNumber = 1;
        if (lastQuote) {
            const lastNumber = parseInt(lastQuote.quoteNumber.split('-')[2]);
            nextNumber = lastNumber + 1;
        }
        return `${config_1.config.QUOTE_PREFIX}-${new Date().getFullYear()}-${nextNumber.toString().padStart(3, '0')}`;
    },
    invoice: async (prisma) => {
        const lastInvoice = await prisma.invoice.findFirst({
            orderBy: { invoiceNumber: 'desc' }
        });
        let nextNumber = 1;
        if (lastInvoice) {
            const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
            nextNumber = lastNumber + 1;
        }
        return `${config_1.config.INVOICE_PREFIX}-${new Date().getFullYear()}-${nextNumber.toString().padStart(3, '0')}`;
    },
    payment: async (prisma) => {
        const lastPayment = await prisma.payment.findFirst({
            orderBy: { paymentNumber: 'desc' }
        });
        let nextNumber = 1;
        if (lastPayment) {
            const lastNumber = parseInt(lastPayment.paymentNumber.split('-')[2]);
            nextNumber = lastNumber + 1;
        }
        return `${config_1.config.PAYMENT_PREFIX}-${new Date().getFullYear()}-${nextNumber.toString().padStart(3, '0')}`;
    },
    employee: async (prisma) => {
        const lastEmployee = await prisma.employee.findFirst({
            orderBy: { employeeNumber: 'desc' }
        });
        let nextNumber = 1;
        if (lastEmployee) {
            const lastNumber = parseInt(lastEmployee.employeeNumber.split('-')[1]);
            nextNumber = lastNumber + 1;
        }
        return `EMP-${nextNumber.toString().padStart(4, '0')}`;
    }
};
// Utilitaires pour les calculs financiers
exports.calculations = {
    // Calculer le total HT d'une ligne
    calculateLineTotal: (quantity, unitPrice, discountRate = 0) => {
        return quantity * unitPrice * (1 - discountRate / 100);
    },
    // Calculer la TVA
    calculateVat: (amountHt, vatRate) => {
        return amountHt * (vatRate / 100);
    },
    // Calculer le total TTC
    calculateTotalTtc: (amountHt, vatAmount) => {
        return amountHt + vatAmount;
    },
    // Calculer les totaux d'un document (devis/facture)
    calculateDocumentTotals: (items) => {
        let subtotalHt = 0;
        let totalVat = 0;
        items.forEach(item => {
            const lineTotal = exports.calculations.calculateLineTotal(item.quantity, item.unitPriceHt, item.discountRate || 0);
            const lineVat = exports.calculations.calculateVat(lineTotal, item.vatRate);
            subtotalHt += lineTotal;
            totalVat += lineVat;
        });
        return {
            subtotalHt: Math.round(subtotalHt * 100) / 100,
            totalVat: Math.round(totalVat * 100) / 100,
            totalTtc: Math.round((subtotalHt + totalVat) * 100) / 100
        };
    },
    // Calculer les jours entre deux dates
    calculateDaysBetween: (startDate, endDate) => {
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    },
    // Calculer le salaire net
    calculateNetSalary: (baseSalary, overtime = 0, bonuses = 0, allowances = 0, socialContributions = 0, taxes = 0, otherDeductions = 0) => {
        const grossSalary = baseSalary + overtime + bonuses + allowances;
        const totalDeductions = socialContributions + taxes + otherDeductions;
        const netSalary = grossSalary - totalDeductions;
        return {
            grossSalary: Math.round(grossSalary * 100) / 100,
            totalDeductions: Math.round(totalDeductions * 100) / 100,
            netSalary: Math.round(netSalary * 100) / 100
        };
    }
};
// Utilitaires pour le formatage
exports.formatters = {
    // Formater un montant en devise
    currency: (amount) => {
        return new Intl.NumberFormat(config_1.CURRENCY.LOCALE, {
            style: 'currency',
            currency: config_1.CURRENCY.CODE,
            minimumFractionDigits: config_1.CURRENCY.DECIMAL_PLACES,
            maximumFractionDigits: config_1.CURRENCY.DECIMAL_PLACES
        }).format(amount);
    },
    // Formater une date
    date: (date, format = 'short') => {
        switch (format) {
            case 'long':
                return new Intl.DateTimeFormat('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }).format(date);
            case 'iso':
                return date.toISOString();
            default:
                return new Intl.DateTimeFormat('fr-FR').format(date);
        }
    },
    // Formater un pourcentage
    percentage: (value) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);
    },
    // Formater un numéro de téléphone
    phone: (phone) => {
        // Supprimer tous les caractères non numériques
        const cleaned = phone.replace(/\D/g, '');
        // Format ivoirien : +225 07 07 07 07 07
        if (cleaned.startsWith('225') && cleaned.length === 13) {
            return `+225 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9, 11)} ${cleaned.slice(11)}`;
        }
        return phone; // Retourner tel quel si format non reconnu
    }
};
// Utilitaires pour la validation métier
exports.businessValidations = {
    // Vérifier si une date est dans le futur
    isFutureDate: (date) => {
        return date > new Date();
    },
    // Vérifier si un devis est encore valide
    isQuoteValid: (validUntil) => {
        return new Date() <= validUntil;
    },
    // Vérifier si une facture est en retard
    isInvoiceOverdue: (dueDate, status) => {
        return new Date() > dueDate && !['PAID', 'CANCELLED'].includes(status);
    },
    // Vérifier si un employé peut prendre des congés
    canTakeLeave: (hireDate, leaveStartDate) => {
        const monthsWorked = (leaveStartDate.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
        return monthsWorked >= 1; // Au moins 1 mois de travail
    }
};
// Utilitaires pour les erreurs
exports.errorHandlers = {
    // Créer une erreur standardisée
    createError: (message, statusCode = 400, details) => {
        const error = new Error(message);
        error.statusCode = statusCode;
        error.details = details;
        return error;
    },
    // Gérer les erreurs Prisma
    handlePrismaError: (error) => {
        logger_1.logger.error('Erreur Prisma:', error);
        switch (error.code) {
            case 'P2002':
                return exports.errorHandlers.createError('Cette valeur existe déjà', 409, {
                    field: error.meta?.target
                });
            case 'P2025':
                return exports.errorHandlers.createError('Enregistrement non trouvé', 404);
            case 'P2003':
                return exports.errorHandlers.createError('Violation de contrainte de clé étrangère', 400);
            case 'P2014':
                return exports.errorHandlers.createError('Violation de contrainte de relation', 400);
            default:
                return exports.errorHandlers.createError('Erreur de base de données', 500);
        }
    }
};
// Utilitaires pour les permissions
exports.permissionHelpers = {
    // Vérifier si un utilisateur a une permission
    hasPermission: (userPermissions, requiredPermission) => {
        return userPermissions.includes(requiredPermission);
    },
    // Vérifier si un utilisateur a un rôle
    hasRole: (userRole, allowedRoles) => {
        return allowedRoles.includes(userRole);
    },
    // Vérifier l'accès à un service
    hasServiceAccess: (userServiceId, resourceServiceId, userRole) => {
        // Admin et DG ont accès à tous les services
        if (['ADMIN', 'GENERAL_DIRECTOR'].includes(userRole)) {
            return true;
        }
        // Pour les autres, vérifier le service
        return userServiceId === resourceServiceId;
    }
};
// Utilitaires pour la pagination
exports.paginationHelpers = {
    // Calculer l'offset pour la pagination
    calculateOffset: (page, limit) => {
        return (page - 1) * limit;
    },
    // Créer un objet de pagination
    createPaginationInfo: (page, limit, total) => {
        return {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
        };
    }
};
exports.default = {
    generateNumber: exports.generateNumber,
    calculations: exports.calculations,
    formatters: exports.formatters,
    businessValidations: exports.businessValidations,
    errorHandlers: exports.errorHandlers,
    permissionHelpers: exports.permissionHelpers,
    paginationHelpers: exports.paginationHelpers
};
//# sourceMappingURL=helpers.js.map