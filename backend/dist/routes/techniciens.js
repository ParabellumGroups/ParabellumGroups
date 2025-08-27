"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const technicienController_1 = require("../controllers/technicienController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes CRUD pour les techniciens
router.get('/', (0, auth_1.requirePermission)('techniciens.read'), (0, audit_1.auditLog)('READ', 'TECHNICIENS'), technicienController_1.getTechniciens);
router.get('/:id', (0, auth_1.requirePermission)('techniciens.read'), (0, audit_1.auditLog)('READ', 'TECHNICIEN'), technicienController_1.getTechnicienById);
router.post('/', (0, auth_1.requirePermission)('techniciens.create'), technicienController_1.validateTechnicien, (0, audit_1.auditLog)('CREATE', 'TECHNICIEN'), technicienController_1.createTechnicien);
router.put('/:id', (0, auth_1.requirePermission)('techniciens.update'), technicienController_1.validateTechnicien, (0, audit_1.auditLog)('UPDATE', 'TECHNICIEN'), technicienController_1.updateTechnicien);
router.delete('/:id', (0, auth_1.requirePermission)('techniciens.delete'), (0, audit_1.auditLog)('DELETE', 'TECHNICIEN'), technicienController_1.deleteTechnicien);
exports.default = router;
//# sourceMappingURL=techniciens.js.map