"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes CRUD pour les paiements
router.get('/', (0, auth_1.requirePermission)('payments.read'), (0, audit_1.auditLog)('READ', 'PAYMENTS'), paymentController_1.getPayments);
router.get('/:id', (0, auth_1.requirePermission)('payments.read'), (0, audit_1.auditLog)('READ', 'PAYMENT'), paymentController_1.getPaymentById);
router.post('/', (0, auth_1.requirePermission)('payments.create'), paymentController_1.validatePayment, (0, audit_1.auditLog)('CREATE', 'PAYMENT'), paymentController_1.createPayment);
// Route pour récupérer les factures impayées d'un client
router.get('/customer/:customerId/unpaid-invoices', (0, auth_1.requirePermission)('payments.read'), paymentController_1.getUnpaidInvoices);
exports.default = router;
//# sourceMappingURL=payments.js.map