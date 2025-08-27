"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contractController_1 = require("../controllers/contractController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes CRUD pour les contrats
router.get('/', (0, auth_1.requirePermission)('contracts.read'), (0, audit_1.auditLog)('READ', 'CONTRACTS'), contractController_1.getContracts);
router.get('/:id', (0, auth_1.requirePermission)('contracts.read'), (0, audit_1.auditLog)('READ', 'CONTRACT'), contractController_1.getContractById);
router.post('/', (0, auth_1.requirePermission)('contracts.create'), contractController_1.validateContract, (0, audit_1.auditLog)('CREATE', 'CONTRACT'), contractController_1.createContract);
router.put('/:id', (0, auth_1.requirePermission)('contracts.update'), contractController_1.validateContract, (0, audit_1.auditLog)('UPDATE', 'CONTRACT'), contractController_1.updateContract);
router.post('/:id/terminate', (0, auth_1.requirePermission)('contracts.update'), (0, audit_1.auditLog)('TERMINATE', 'CONTRACT'), contractController_1.terminateContract);
exports.default = router;
//# sourceMappingURL=contracts.js.map