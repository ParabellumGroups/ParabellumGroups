"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const materielController_1 = require("../controllers/materielController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes pour les alertes stock
router.get('/alerts', (0, auth_1.requirePermission)('materiels.read'), materielController_1.getStockAlerts);
// Routes CRUD pour les matériels
router.get('/', (0, auth_1.requirePermission)('materiels.read'), (0, audit_1.auditLog)('READ', 'MATERIELS'), materielController_1.getMateriels);
router.get('/:id', (0, auth_1.requirePermission)('materiels.read'), (0, audit_1.auditLog)('READ', 'MATERIEL'), materielController_1.getMaterielById);
router.post('/', (0, auth_1.requirePermission)('materiels.create'), materielController_1.validateMateriel, (0, audit_1.auditLog)('CREATE', 'MATERIEL'), materielController_1.createMateriel);
router.put('/:id', (0, auth_1.requirePermission)('materiels.update'), materielController_1.validateMateriel, (0, audit_1.auditLog)('UPDATE', 'MATERIEL'), materielController_1.updateMateriel);
router.delete('/:id', (0, auth_1.requirePermission)('materiels.delete'), (0, audit_1.auditLog)('DELETE', 'MATERIEL'), materielController_1.deleteMateriel);
// Routes pour les mouvements de stock
router.post('/:id/sortie', (0, auth_1.requirePermission)('materiels.update'), materielController_1.validateSortieMateriel, (0, audit_1.auditLog)('SORTIE', 'MATERIEL'), materielController_1.createSortieMateriel);
router.post('/:id/entree', (0, auth_1.requirePermission)('materiels.update'), materielController_1.validateEntreeMateriel, (0, audit_1.auditLog)('ENTREE', 'MATERIEL'), materielController_1.createEntreeMateriel);
exports.default = router;
//# sourceMappingURL=materiels.js.map