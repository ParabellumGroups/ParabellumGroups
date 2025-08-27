"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryValidations = exports.leaveValidations = exports.salaryValidations = exports.contractValidations = exports.employeeValidations = exports.productValidations = exports.paymentValidations = exports.invoiceValidations = exports.quoteValidations = exports.customerValidations = exports.userValidations = exports.commonValidations = void 0;
const express_validator_1 = require("express-validator");
// Validations communes
exports.commonValidations = {
    id: (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('ID invalide'),
    email: (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Email invalide'),
    password: (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    phone: (0, express_validator_1.body)('phone').optional().isMobilePhone('any').withMessage('Numéro de téléphone invalide'),
    date: (field) => (0, express_validator_1.body)(field).isISO8601().toDate().withMessage(`${field} doit être une date valide`),
    positiveNumber: (field) => (0, express_validator_1.body)(field).isFloat({ min: 0 }).withMessage(`${field} doit être un nombre positif`),
    requiredString: (field) => (0, express_validator_1.body)(field).notEmpty().trim().withMessage(`${field} est requis`)
};
// Validations pour les utilisateurs
exports.userValidations = {
    create: [
        exports.commonValidations.email,
        exports.commonValidations.password,
        exports.commonValidations.requiredString('firstName'),
        exports.commonValidations.requiredString('lastName'),
        (0, express_validator_1.body)('role').isIn(['ADMIN', 'GENERAL_DIRECTOR', 'SERVICE_MANAGER', 'EMPLOYEE', 'ACCOUNTANT']).withMessage('Rôle invalide'),
        (0, express_validator_1.body)('serviceId').optional().isInt({ min: 1 }).withMessage('Service invalide')
    ],
    update: [
        exports.commonValidations.id,
        exports.commonValidations.email,
        exports.commonValidations.requiredString('firstName'),
        exports.commonValidations.requiredString('lastName'),
        (0, express_validator_1.body)('role').isIn(['ADMIN', 'GENERAL_DIRECTOR', 'SERVICE_MANAGER', 'EMPLOYEE', 'ACCOUNTANT']).withMessage('Rôle invalide'),
        (0, express_validator_1.body)('serviceId').optional().isInt({ min: 1 }).withMessage('Service invalide')
    ],
    updatePassword: [
        exports.commonValidations.id,
        (0, express_validator_1.body)('currentPassword').notEmpty().withMessage('Mot de passe actuel requis'),
        (0, express_validator_1.body)('newPassword').isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
    ]
};
// Validations pour les clients
exports.customerValidations = {
    create: [
        exports.commonValidations.requiredString('name'),
        (0, express_validator_1.body)('type').isIn(['INDIVIDUAL', 'COMPANY']).withMessage('Type de client invalide'),
        (0, express_validator_1.body)('email').optional().isEmail().normalizeEmail().withMessage('Email invalide'),
        (0, express_validator_1.body)('paymentTerms').optional().isInt({ min: 0, max: 365 }).withMessage('Délai de paiement invalide'),
        (0, express_validator_1.body)('creditLimit').optional().isFloat({ min: 0 }).withMessage('Limite de crédit invalide'),
        (0, express_validator_1.body)('discountRate').optional().isFloat({ min: 0, max: 100 }).withMessage('Taux de remise invalide')
    ],
    update: [
        exports.commonValidations.id,
        exports.commonValidations.requiredString('name'),
        (0, express_validator_1.body)('type').isIn(['INDIVIDUAL', 'COMPANY']).withMessage('Type de client invalide'),
        (0, express_validator_1.body)('email').optional().isEmail().normalizeEmail().withMessage('Email invalide'),
        (0, express_validator_1.body)('paymentTerms').optional().isInt({ min: 0, max: 365 }).withMessage('Délai de paiement invalide'),
        (0, express_validator_1.body)('creditLimit').optional().isFloat({ min: 0 }).withMessage('Limite de crédit invalide'),
        (0, express_validator_1.body)('discountRate').optional().isFloat({ min: 0, max: 100 }).withMessage('Taux de remise invalide')
    ]
};
// Validations pour les devis
exports.quoteValidations = {
    create: [
        (0, express_validator_1.body)('customerId').isInt({ min: 1 }).withMessage('Client requis'),
        exports.commonValidations.date('quoteDate'),
        exports.commonValidations.date('validUntil'),
        (0, express_validator_1.body)('items').isArray({ min: 1 }).withMessage('Au moins un article requis'),
        (0, express_validator_1.body)('items.*.description').notEmpty().withMessage('Description requise'),
        (0, express_validator_1.body)('items.*.quantity').isFloat({ min: 0.01 }).withMessage('Quantité invalide'),
        (0, express_validator_1.body)('items.*.unitPriceHt').isFloat({ min: 0 }).withMessage('Prix unitaire invalide'),
        (0, express_validator_1.body)('items.*.vatRate').isFloat({ min: 0, max: 100 }).withMessage('Taux TVA invalide')
    ],
    approval: [
        exports.commonValidations.id,
        (0, express_validator_1.body)('comments').optional().isString().withMessage('Commentaires invalides')
    ]
};
// Validations pour les factures
exports.invoiceValidations = {
    create: [
        (0, express_validator_1.body)('customerId').isInt({ min: 1 }).withMessage('Client requis'),
        exports.commonValidations.date('invoiceDate'),
        (0, express_validator_1.body)('items').isArray({ min: 1 }).withMessage('Au moins un article requis'),
        (0, express_validator_1.body)('items.*.description').notEmpty().withMessage('Description requise'),
        (0, express_validator_1.body)('items.*.quantity').isFloat({ min: 0.01 }).withMessage('Quantité invalide'),
        (0, express_validator_1.body)('items.*.unitPriceHt').isFloat({ min: 0 }).withMessage('Prix unitaire invalide'),
        (0, express_validator_1.body)('items.*.vatRate').isFloat({ min: 0, max: 100 }).withMessage('Taux TVA invalide')
    ],
    updateStatus: [
        exports.commonValidations.id,
        (0, express_validator_1.body)('status').isIn(['DRAFT', 'SENT', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED']).withMessage('Statut invalide')
    ]
};
// Validations pour les paiements
exports.paymentValidations = {
    create: [
        (0, express_validator_1.body)('customerId').isInt({ min: 1 }).withMessage('Client requis'),
        exports.commonValidations.positiveNumber('amount'),
        exports.commonValidations.date('paymentDate'),
        (0, express_validator_1.body)('paymentMethod').isIn(['TRANSFER', 'CHECK', 'CARD', 'CASH', 'OTHER']).withMessage('Mode de paiement invalide'),
        (0, express_validator_1.body)('invoiceAllocations').optional().isArray().withMessage('Allocations invalides'),
        (0, express_validator_1.body)('invoiceAllocations.*.invoiceId').optional().isInt({ min: 1 }).withMessage('ID facture invalide'),
        (0, express_validator_1.body)('invoiceAllocations.*.amount').optional().isFloat({ min: 0.01 }).withMessage('Montant allocation invalide')
    ]
};
// Validations pour les produits
exports.productValidations = {
    create: [
        (0, express_validator_1.body)('sku').notEmpty().trim().withMessage('SKU requis'),
        exports.commonValidations.requiredString('name'),
        (0, express_validator_1.body)('type').isIn(['PRODUCT', 'SERVICE', 'SUBSCRIPTION']).withMessage('Type invalide'),
        exports.commonValidations.positiveNumber('priceHt'),
        (0, express_validator_1.body)('vatRate').isFloat({ min: 0, max: 100 }).withMessage('Taux TVA invalide'),
        (0, express_validator_1.body)('stockQuantity').optional().isInt({ min: 0 }).withMessage('Quantité en stock invalide')
    ],
    update: [
        exports.commonValidations.id,
        (0, express_validator_1.body)('sku').notEmpty().trim().withMessage('SKU requis'),
        exports.commonValidations.requiredString('name'),
        (0, express_validator_1.body)('type').isIn(['PRODUCT', 'SERVICE', 'SUBSCRIPTION']).withMessage('Type invalide'),
        exports.commonValidations.positiveNumber('priceHt'),
        (0, express_validator_1.body)('vatRate').isFloat({ min: 0, max: 100 }).withMessage('Taux TVA invalide'),
        (0, express_validator_1.body)('stockQuantity').optional().isInt({ min: 0 }).withMessage('Quantité en stock invalide')
    ]
};
// Validations pour les employés
exports.employeeValidations = {
    create: [
        exports.commonValidations.requiredString('firstName'),
        exports.commonValidations.requiredString('lastName'),
        (0, express_validator_1.body)('email').optional().isEmail().normalizeEmail().withMessage('Email invalide'),
        exports.commonValidations.date('dateOfBirth'),
        exports.commonValidations.date('hireDate'),
        (0, express_validator_1.body)('serviceId').optional().isInt({ min: 1 }).withMessage('Service invalide'),
        exports.commonValidations.requiredString('position')
    ],
    update: [
        exports.commonValidations.id,
        exports.commonValidations.requiredString('firstName'),
        exports.commonValidations.requiredString('lastName'),
        (0, express_validator_1.body)('email').optional().isEmail().normalizeEmail().withMessage('Email invalide'),
        exports.commonValidations.date('dateOfBirth'),
        (0, express_validator_1.body)('serviceId').optional().isInt({ min: 1 }).withMessage('Service invalide'),
        exports.commonValidations.requiredString('position')
    ]
};
// Validations pour les contrats
exports.contractValidations = {
    create: [
        (0, express_validator_1.body)('employeeId').isInt({ min: 1 }).withMessage('Employé requis'),
        (0, express_validator_1.body)('contractType').isIn(['CDI', 'CDD', 'STAGE', 'FREELANCE']).withMessage('Type de contrat invalide'),
        exports.commonValidations.date('startDate'),
        (0, express_validator_1.body)('endDate').optional().isISO8601().toDate().withMessage('Date de fin invalide'),
        exports.commonValidations.positiveNumber('baseSalary'),
        (0, express_validator_1.body)('workingHours').isFloat({ min: 0, max: 80 }).withMessage('Heures de travail invalides')
    ],
    update: [
        exports.commonValidations.id,
        (0, express_validator_1.body)('contractType').isIn(['CDI', 'CDD', 'STAGE', 'FREELANCE']).withMessage('Type de contrat invalide'),
        exports.commonValidations.date('startDate'),
        (0, express_validator_1.body)('endDate').optional().isISO8601().toDate().withMessage('Date de fin invalide'),
        exports.commonValidations.positiveNumber('baseSalary'),
        (0, express_validator_1.body)('workingHours').isFloat({ min: 0, max: 80 }).withMessage('Heures de travail invalides')
    ]
};
// Validations pour les salaires
exports.salaryValidations = {
    create: [
        (0, express_validator_1.body)('employeeId').isInt({ min: 1 }).withMessage('Employé requis'),
        exports.commonValidations.date('paymentDate'),
        exports.commonValidations.positiveNumber('baseSalary'),
        (0, express_validator_1.body)('overtime').optional().isFloat({ min: 0 }).withMessage('Heures supplémentaires invalides'),
        (0, express_validator_1.body)('bonuses').optional().isFloat({ min: 0 }).withMessage('Primes invalides'),
        (0, express_validator_1.body)('allowances').optional().isFloat({ min: 0 }).withMessage('Indemnités invalides'),
        (0, express_validator_1.body)('socialContributions').optional().isFloat({ min: 0 }).withMessage('Cotisations sociales invalides'),
        (0, express_validator_1.body)('taxes').optional().isFloat({ min: 0 }).withMessage('Impôts invalides'),
        (0, express_validator_1.body)('otherDeductions').optional().isFloat({ min: 0 }).withMessage('Autres déductions invalides')
    ]
};
// Validations pour les congés
exports.leaveValidations = {
    create: [
        (0, express_validator_1.body)('employeeId').isInt({ min: 1 }).withMessage('Employé requis'),
        (0, express_validator_1.body)('leaveType').isIn(['ANNUAL', 'SICK', 'PERSONAL', 'MATERNITY', 'PATERNITY', 'OTHER']).withMessage('Type de congé invalide'),
        exports.commonValidations.date('startDate'),
        exports.commonValidations.date('endDate'),
        exports.commonValidations.requiredString('reason')
    ],
    approval: [
        exports.commonValidations.id,
        (0, express_validator_1.body)('comments').optional().isString().withMessage('Commentaires invalides')
    ]
};
// Validations pour les paramètres de requête
exports.queryValidations = {
    pagination: [
        (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page invalide'),
        (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limite invalide')
    ],
    search: [
        (0, express_validator_1.query)('search').optional().isString().trim().withMessage('Terme de recherche invalide')
    ],
    dateRange: [
        (0, express_validator_1.query)('startDate').optional().isISO8601().withMessage('Date de début invalide'),
        (0, express_validator_1.query)('endDate').optional().isISO8601().withMessage('Date de fin invalide')
    ]
};
exports.default = {
    commonValidations: exports.commonValidations,
    userValidations: exports.userValidations,
    customerValidations: exports.customerValidations,
    quoteValidations: exports.quoteValidations,
    invoiceValidations: exports.invoiceValidations,
    paymentValidations: exports.paymentValidations,
    productValidations: exports.productValidations,
    employeeValidations: exports.employeeValidations,
    contractValidations: exports.contractValidations,
    salaryValidations: exports.salaryValidations,
    leaveValidations: exports.leaveValidations,
    queryValidations: exports.queryValidations
};
//# sourceMappingURL=validation.js.map