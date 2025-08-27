"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaveController_1 = require("../controllers/leaveController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes pour les soldes de congés
router.get('/balance/:employeeId', (0, auth_1.requirePermission)('leaves.read'), (0, audit_1.auditLog)('READ', 'LEAVE_BALANCE'), leaveController_1.getLeaveBalance);
// Routes CRUD pour les demandes de congé
router.get('/', (0, auth_1.requirePermission)('leaves.read'), (0, audit_1.auditLog)('READ', 'LEAVE_REQUESTS'), leaveController_1.getLeaveRequests);
router.get('/:id', (0, auth_1.requirePermission)('leaves.read'), (0, audit_1.auditLog)('READ', 'LEAVE_REQUEST'), leaveController_1.getLeaveRequestById);
router.post('/', (0, auth_1.requirePermission)('leaves.create'), leaveController_1.validateLeaveRequest, (0, audit_1.auditLog)('CREATE', 'LEAVE_REQUEST'), leaveController_1.createLeaveRequest);
router.put('/:id', (0, auth_1.requirePermission)('leaves.update'), leaveController_1.validateLeaveRequest, (0, audit_1.auditLog)('UPDATE', 'LEAVE_REQUEST'), leaveController_1.updateLeaveRequest);
router.post('/:id/approve', (0, auth_1.requirePermission)('leaves.approve'), (0, audit_1.auditLog)('APPROVE', 'LEAVE_REQUEST'), leaveController_1.approveLeaveRequest);
router.post('/:id/reject', (0, auth_1.requirePermission)('leaves.approve'), (0, audit_1.auditLog)('REJECT', 'LEAVE_REQUEST'), leaveController_1.rejectLeaveRequest);
exports.default = router;
//# sourceMappingURL=leaves.js.map