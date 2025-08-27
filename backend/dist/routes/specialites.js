"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const specialiteController_1 = require("../controllers/specialiteController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes CRUD pour les spécialités
router.get('/', (0, auth_1.requirePermission)('specialites.read'), (0, audit_1.auditLog)('READ', 'SPECIALITES'), specialiteController_1.getSpecialites);
router.get('/:id', (0, auth_1.requirePermission)('specialites.read'), (0, audit_1.auditLog)('READ', 'SPECIALITE'), specialiteController_1.getSpecialiteById);
router.post('/', (0, auth_1.requirePermission)('specialites.create'), specialiteController_1.validateSpecialite, (0, audit_1.auditLog)('CREATE', 'SPECIALITE'), specialiteController_1.createSpecialite);
router.put('/:id', (0, auth_1.requirePermission)('specialites.update'), specialiteController_1.validateSpecialite, (0, audit_1.auditLog)('UPDATE', 'SPECIALITE'), specialiteController_1.updateSpecialite);
router.delete('/:id', (0, auth_1.requirePermission)('specialites.delete'), (0, audit_1.auditLog)('DELETE', 'SPECIALITE'), specialiteController_1.deleteSpecialite);
exports.default = router;
//# sourceMappingURL=specialites.js.map