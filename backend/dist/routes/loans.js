"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loanController_1 = require("../controllers/loanController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes pour les paiements de prêt
router.get('/:id/payments', (0, auth_1.requirePermission)('loans.read'), (0, audit_1.auditLog)('READ', 'LOAN_PAYMENTS'), loanController_1.getLoanPayments);
router.post('/:id/payments', (0, auth_1.requirePermission)('loans.update'), (0, audit_1.auditLog)('CREATE', 'LOAN_PAYMENT'), loanController_1.createLoanPayment);
// Routes CRUD pour les prêts
router.get('/', (0, auth_1.requirePermission)('loans.read'), (0, audit_1.auditLog)('READ', 'LOANS'), loanController_1.getLoans);
router.get('/:id', (0, auth_1.requirePermission)('loans.read'), (0, audit_1.auditLog)('READ', 'LOAN'), loanController_1.getLoanById);
router.post('/', (0, auth_1.requirePermission)('loans.create'), loanController_1.validateLoan, (0, audit_1.auditLog)('CREATE', 'LOAN'), loanController_1.createLoan);
router.put('/:id', (0, auth_1.requirePermission)('loans.update'), loanController_1.validateLoan, (0, audit_1.auditLog)('UPDATE', 'LOAN'), loanController_1.updateLoan);
router.delete('/:id', (0, auth_1.requirePermission)('loans.delete'), (0, audit_1.auditLog)('DELETE', 'LOAN'), loanController_1.deleteLoan);
exports.default = router;
//# sourceMappingURL=loans.js.map