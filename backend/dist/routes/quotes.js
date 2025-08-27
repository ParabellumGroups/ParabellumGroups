"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quoteController_1 = require("../controllers/quoteController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes CRUD pour les devis
router.get('/', (0, auth_1.requirePermission)('quotes.read'), (0, audit_1.auditLog)('READ', 'QUOTES'), quoteController_1.getQuotes);
router.get('/:id', (0, auth_1.requirePermission)('quotes.read'), (0, audit_1.auditLog)('READ', 'QUOTE'), quoteController_1.getQuoteById);
router.post('/', (0, auth_1.requirePermission)('quotes.create'), quoteController_1.validateQuote, (0, audit_1.auditLog)('CREATE', 'QUOTE'), quoteController_1.createQuote);
// Routes de workflow d'approbation
router.post('/:id/submit-for-service-approval', (0, auth_1.requirePermission)('quotes.submit_for_approval'), (0, audit_1.auditLog)('SUBMIT_FOR_APPROVAL', 'QUOTE'), quoteController_1.submitForServiceApproval);
router.post('/:id/approve-by-service-manager', (0, auth_1.requirePermission)('quotes.approve_service'), (0, audit_1.auditLog)('APPROVE_SERVICE', 'QUOTE'), quoteController_1.approveByServiceManager);
router.post('/:id/approve-by-dg', (0, auth_1.requirePermission)('quotes.approve_dg'), (0, audit_1.auditLog)('APPROVE_DG', 'QUOTE'), quoteController_1.approveByDG);
router.post('/:id/reject', (0, audit_1.auditLog)('REJECT', 'QUOTE'), quoteController_1.rejectQuote);
exports.default = router;
//# sourceMappingURL=quotes.js.map