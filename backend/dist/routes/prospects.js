"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prospectController_1 = require("../controllers/prospectController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes pour les statistiques
router.get('/stats', (0, auth_1.requirePermission)('prospects.read'), (0, audit_1.auditLog)('READ', 'PROSPECTION_STATS'), prospectController_1.getProspectionStats);
// Routes CRUD pour les prospects
router.get('/', (0, auth_1.requirePermission)('prospects.read'), (0, audit_1.auditLog)('READ', 'PROSPECTS'), prospectController_1.getProspects);
router.get('/:id', (0, auth_1.requirePermission)('prospects.read'), (0, audit_1.auditLog)('READ', 'PROSPECT'), prospectController_1.getProspectById);
router.post('/', (0, auth_1.requirePermission)('prospects.create'), prospectController_1.validateProspect, (0, audit_1.auditLog)('CREATE', 'PROSPECT'), prospectController_1.createProspect);
router.put('/:id', (0, auth_1.requirePermission)('prospects.update'), prospectController_1.validateProspect, (0, audit_1.auditLog)('UPDATE', 'PROSPECT'), prospectController_1.updateProspect);
router.delete('/:id', (0, auth_1.requirePermission)('prospects.delete'), (0, audit_1.auditLog)('DELETE', 'PROSPECT'), prospectController_1.deleteProspect);
router.post('/:id/move', (0, auth_1.requirePermission)('prospects.update'), (0, audit_1.auditLog)('MOVE_STAGE', 'PROSPECT'), prospectController_1.moveProspectStage);
exports.default = router;
//# sourceMappingURL=prospects.js.map