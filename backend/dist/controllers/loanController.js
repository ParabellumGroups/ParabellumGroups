"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoan = exports.createLoanPayment = exports.getLoanPayments = exports.deleteLoan = exports.updateLoan = exports.createLoan = exports.getLoanById = exports.getLoans = void 0;
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const prisma = new client_1.PrismaClient();
const getLoans = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status, employeeId } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        let whereClause = {};
        if (search) {
            whereClause.OR = [
                { loanNumber: { contains: search, mode: 'insensitive' } },
                { employee: {
                        OR: [
                            { firstName: { contains: search, mode: 'insensitive' } },
                            { lastName: { contains: search, mode: 'insensitive' } }
                        ]
                    } },
                { purpose: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (status) {
            whereClause.status = status;
        }
        if (employeeId) {
            whereClause.employeeId = Number(employeeId);
        }
        // Filtrage par service pour les non-admin
        if (!['ADMIN', 'GENERAL_DIRECTOR'].includes(req.user.role)) {
            whereClause.employee = {
                serviceId: req.user.serviceId
            };
        }
        const [loans, total] = await Promise.all([
            prisma.loan.findMany({
                where: whereClause,
                include: {
                    employee: {
                        include: {
                            service: true
                        }
                    },
                    payments: {
                        orderBy: { paymentDate: 'desc' },
                        take: 5
                    }
                },
                skip: offset,
                take: Number(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.loan.count({ where: whereClause })
        ]);
        res.json({
            success: true,
            data: {
                loans,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    totalPages: Math.ceil(total / Number(limit))
                }
            }
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des prêts:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getLoans = getLoans;
const getLoanById = async (req, res) => {
    try {
        const { id } = req.params;
        const loan = await prisma.loan.findUnique({
            where: { id: Number(id) },
            include: {
                employee: {
                    include: {
                        service: true
                    }
                },
                payments: {
                    orderBy: { paymentDate: 'desc' }
                }
            }
        });
        if (!loan) {
            return res.status(404).json({
                success: false,
                message: 'Prêt non trouvé'
            });
        }
        res.json({
            success: true,
            data: loan
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération du prêt:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getLoanById = getLoanById;
const createLoan = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Données invalides',
                errors: errors.array()
            });
        }
        const { employeeId, amount, interestRate, monthlyPayment, startDate, endDate, purpose, notes } = req.body;
        // Générer le numéro de prêt
        const lastLoan = await prisma.loan.findFirst({
            orderBy: { loanNumber: 'desc' }
        });
        let nextNumber = 1;
        if (lastLoan) {
            const lastNumber = parseInt(lastLoan.loanNumber.split('-')[1]);
            nextNumber = lastNumber + 1;
        }
        const loanNumber = `PRET-${nextNumber.toString().padStart(4, '0')}`;
        const loan = await prisma.loan.create({
            data: {
                loanNumber,
                employeeId,
                amount,
                interestRate: interestRate || 0,
                monthlyPayment,
                remainingAmount: amount,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                purpose,
                notes,
                createdBy: req.user.userId
            },
            include: {
                employee: {
                    include: {
                        service: true
                    }
                }
            }
        });
        res.status(201).json({
            success: true,
            data: loan,
            message: 'Prêt créé avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la création du prêt:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.createLoan = createLoan;
const updateLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Données invalides',
                errors: errors.array()
            });
        }
        const existingLoan = await prisma.loan.findUnique({
            where: { id: Number(id) }
        });
        if (!existingLoan) {
            return res.status(404).json({
                success: false,
                message: 'Prêt non trouvé'
            });
        }
        const loan = await prisma.loan.update({
            where: { id: Number(id) },
            data: req.body,
            include: {
                employee: {
                    include: {
                        service: true
                    }
                }
            }
        });
        res.json({
            success: true,
            data: loan,
            message: 'Prêt mis à jour avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour du prêt:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.updateLoan = updateLoan;
const deleteLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const existingLoan = await prisma.loan.findUnique({
            where: { id: Number(id) },
            include: {
                _count: {
                    select: {
                        payments: true
                    }
                }
            }
        });
        if (!existingLoan) {
            return res.status(404).json({
                success: false,
                message: 'Prêt non trouvé'
            });
        }
        if (existingLoan._count.payments > 0) {
            return res.status(400).json({
                success: false,
                message: 'Impossible de supprimer un prêt ayant des paiements'
            });
        }
        await prisma.loan.delete({
            where: { id: Number(id) }
        });
        res.json({
            success: true,
            message: 'Prêt supprimé avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la suppression du prêt:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.deleteLoan = deleteLoan;
const getLoanPayments = async (req, res) => {
    try {
        const { id } = req.params;
        const payments = await prisma.loanPayment.findMany({
            where: { loanId: Number(id) },
            include: {
                salary: {
                    select: { paymentDate: true }
                }
            },
            orderBy: { paymentDate: 'desc' }
        });
        res.json({
            success: true,
            data: payments
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des paiements:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getLoanPayments = getLoanPayments;
const createLoanPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, paymentDate, salaryId, notes } = req.body;
        const loan = await prisma.loan.findUnique({
            where: { id: Number(id) }
        });
        if (!loan) {
            return res.status(404).json({
                success: false,
                message: 'Prêt non trouvé'
            });
        }
        if (amount > loan.remainingAmount) {
            return res.status(400).json({
                success: false,
                message: 'Le montant dépasse le solde restant'
            });
        }
        // Calculer principal et intérêts
        const monthlyInterest = (loan.interestRate / 100) / 12;
        const interest = loan.remainingAmount * monthlyInterest;
        const principal = Math.min(amount - interest, loan.remainingAmount);
        const payment = await prisma.loanPayment.create({
            data: {
                loanId: Number(id),
                salaryId,
                amount,
                paymentDate: new Date(paymentDate),
                principal,
                interest,
                notes
            }
        });
        // Mettre à jour le solde restant
        const newRemainingAmount = loan.remainingAmount - principal;
        const newStatus = newRemainingAmount <= 0 ? 'COMPLETED' : 'ACTIVE';
        await prisma.loan.update({
            where: { id: Number(id) },
            data: {
                remainingAmount: newRemainingAmount,
                status: newStatus
            }
        });
        res.status(201).json({
            success: true,
            data: payment,
            message: 'Paiement enregistré avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la création du paiement:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.createLoanPayment = createLoanPayment;
// Validation middleware
exports.validateLoan = [
    (0, express_validator_1.body)('employeeId').isInt().withMessage('Employé requis'),
    (0, express_validator_1.body)('amount').isFloat({ min: 1 }).withMessage('Montant invalide'),
    (0, express_validator_1.body)('monthlyPayment').isFloat({ min: 1 }).withMessage('Mensualité invalide'),
    (0, express_validator_1.body)('startDate').isISO8601().withMessage('Date de début invalide'),
    (0, express_validator_1.body)('endDate').isISO8601().withMessage('Date de fin invalide'),
    (0, express_validator_1.body)('purpose').notEmpty().withMessage('Objet du prêt requis')
];
//# sourceMappingURL=loanController.js.map