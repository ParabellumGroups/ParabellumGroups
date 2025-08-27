"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const missionController_1 = require("../controllers/missionController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes CRUD pour les missions
router.get('/', (0, auth_1.requirePermission)('missions.read'), (0, audit_1.auditLog)('READ', 'MISSIONS'), missionController_1.getMissions);
router.get('/:numIntervention', (0, auth_1.requirePermission)('missions.read'), (0, audit_1.auditLog)('READ', 'MISSION'), missionController_1.getMissionById);
router.post('/', (0, auth_1.requirePermission)('missions.create'), missionController_1.validateMission, (0, audit_1.auditLog)('CREATE', 'MISSION'), missionController_1.createMission);
router.put('/:numIntervention', (0, auth_1.requirePermission)('missions.update'), missionController_1.validateMission, (0, audit_1.auditLog)('UPDATE', 'MISSION'), missionController_1.updateMission);
router.delete('/:numIntervention', (0, auth_1.requirePermission)('missions.delete'), (0, audit_1.auditLog)('DELETE', 'MISSION'), missionController_1.deleteMission);
exports.default = router;
//# sourceMappingURL=missions.js.map