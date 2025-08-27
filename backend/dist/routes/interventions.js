"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const interventionController_1 = require("../controllers/interventionController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes CRUD pour les interventions
router.get('/', (0, auth_1.requirePermission)('interventions.read'), (0, audit_1.auditLog)('READ', 'INTERVENTIONS'), interventionController_1.getInterventions);
router.get('/:id', (0, auth_1.requirePermission)('interventions.read'), (0, audit_1.auditLog)('READ', 'INTERVENTION'), interventionController_1.getInterventionById);
router.post('/', (0, auth_1.requirePermission)('interventions.create'), interventionController_1.validateIntervention, (0, audit_1.auditLog)('CREATE', 'INTERVENTION'), interventionController_1.createIntervention);
router.put('/:id', (0, auth_1.requirePermission)('interventions.update'), interventionController_1.validateIntervention, (0, audit_1.auditLog)('UPDATE', 'INTERVENTION'), interventionController_1.updateIntervention);
router.delete('/:id', (0, auth_1.requirePermission)('interventions.delete'), (0, audit_1.auditLog)('DELETE', 'INTERVENTION'), interventionController_1.deleteIntervention);
// Routes pour la gestion du temps
router.post('/:id/start', (0, auth_1.requirePermission)('interventions.update'), (0, audit_1.auditLog)('START', 'INTERVENTION'), interventionController_1.startIntervention);
router.post('/:id/end', (0, auth_1.requirePermission)('interventions.update'), (0, audit_1.auditLog)('END', 'INTERVENTION'), interventionController_1.endIntervention);
// Routes pour la gestion des techniciens
router.post('/:id/assign-technicien', (0, auth_1.requirePermission)('interventions.update'), (0, audit_1.auditLog)('ASSIGN_TECHNICIEN', 'INTERVENTION'), interventionController_1.assignTechnicien);
router.delete('/:id/technicien/:technicienId', (0, auth_1.requirePermission)('interventions.update'), (0, audit_1.auditLog)('REMOVE_TECHNICIEN', 'INTERVENTION'), interventionController_1.removeTechnicien);
exports.default = router;
//# sourceMappingURL=interventions.js.map