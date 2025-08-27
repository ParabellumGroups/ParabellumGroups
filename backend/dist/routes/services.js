"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceController_1 = require("../controllers/serviceController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes CRUD pour les services
router.get('/', (0, auth_1.requirePermission)('admin.system_settings'), (0, audit_1.auditLog)('READ', 'SERVICES'), serviceController_1.getServices);
router.get('/:id', (0, auth_1.requirePermission)('admin.system_settings'), (0, audit_1.auditLog)('READ', 'SERVICE'), serviceController_1.getServiceById);
router.post('/', (0, auth_1.requirePermission)('admin.system_settings'), serviceController_1.validateService, (0, audit_1.auditLog)('CREATE', 'SERVICE'), serviceController_1.createService);
router.put('/:id', (0, auth_1.requirePermission)('admin.system_settings'), serviceController_1.validateService, (0, audit_1.auditLog)('UPDATE', 'SERVICE'), serviceController_1.updateService);
router.delete('/:id', (0, auth_1.requirePermission)('admin.system_settings'), (0, audit_1.auditLog)('DELETE', 'SERVICE'), serviceController_1.deleteService);
exports.default = router;
//# sourceMappingURL=services.js.map