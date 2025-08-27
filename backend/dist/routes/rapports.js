"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rapportController_1 = require("../controllers/rapportController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes CRUD pour les rapports
router.get('/', (0, auth_1.requirePermission)('rapports.read'), (0, audit_1.auditLog)('READ', 'RAPPORTS'), rapportController_1.getRapports);
router.get('/:id', (0, auth_1.requirePermission)('rapports.read'), (0, audit_1.auditLog)('READ', 'RAPPORT'), rapportController_1.getRapportById);
router.post('/', (0, auth_1.requirePermission)('rapports.create'), rapportController_1.validateRapport, (0, audit_1.auditLog)('CREATE', 'RAPPORT'), rapportController_1.createRapport);
router.put('/:id', (0, auth_1.requirePermission)('rapports.update'), rapportController_1.validateRapport, (0, audit_1.auditLog)('UPDATE', 'RAPPORT'), rapportController_1.updateRapport);
router.delete('/:id', (0, auth_1.requirePermission)('rapports.delete'), (0, audit_1.auditLog)('DELETE', 'RAPPORT'), rapportController_1.deleteRapport);
// Route pour upload d'images
router.post('/:id/images', (0, auth_1.requirePermission)('rapports.update'), (0, audit_1.auditLog)('UPLOAD_IMAGES', 'RAPPORT'), rapportController_1.uploadRapportImages);
exports.default = router;
//# sourceMappingURL=rapports.js.map