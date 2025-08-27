"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoiceController_1 = require("../controllers/invoiceController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes CRUD pour les factures
router.get('/', (0, auth_1.requirePermission)('invoices.read'), (0, audit_1.auditLog)('READ', 'INVOICES'), invoiceController_1.getInvoices);
router.get('/:id', (0, auth_1.requirePermission)('invoices.read'), (0, audit_1.auditLog)('READ', 'INVOICE'), invoiceController_1.getInvoiceById);
router.post('/', (0, auth_1.requirePermission)('invoices.create'), invoiceController_1.validateInvoice, (0, audit_1.auditLog)('CREATE', 'INVOICE'), invoiceController_1.createInvoice);
router.post('/from-quote/:quoteId', (0, auth_1.requirePermission)('invoices.create'), (0, audit_1.auditLog)('CREATE_FROM_QUOTE', 'INVOICE'), invoiceController_1.createInvoiceFromQuote);
router.patch('/:id/status', (0, auth_1.requirePermission)('invoices.update'), (0, audit_1.auditLog)('UPDATE_STATUS', 'INVOICE'), invoiceController_1.updateInvoiceStatus);
exports.default = router;
//# sourceMappingURL=invoices.js.map