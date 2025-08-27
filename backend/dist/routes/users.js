"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes utilitaires
router.get('/roles', userController_1.getRoles);
router.get('/services', userController_1.getServices);
// Routes CRUD pour les utilisateurs
router.get('/', (0, auth_1.requirePermission)('users.read'), (0, audit_1.auditLog)('READ', 'USERS'), userController_1.getUsers);
router.get('/:id', (0, auth_1.requirePermission)('users.read'), (0, audit_1.auditLog)('READ', 'USER'), userController_1.getUserById);
router.post('/', (0, auth_1.requirePermission)('users.create'), userController_1.validateUserCreation, (0, audit_1.auditLog)('CREATE', 'USER'), userController_1.createUser);
router.put('/:id', (0, auth_1.requirePermission)('users.update'), userController_1.validateUser, (0, audit_1.auditLog)('UPDATE', 'USER'), userController_1.updateUser);
router.delete('/:id', (0, auth_1.requirePermission)('users.delete'), (0, audit_1.auditLog)('DELETE', 'USER'), userController_1.deleteUser);
router.patch('/:id/password', userController_1.validatePasswordUpdate, (0, audit_1.auditLog)('UPDATE_PASSWORD', 'USER'), userController_1.updatePassword);
// Routes pour la gestion des permissions
router.get('/:id/permissions', (0, auth_1.requirePermission)('users.manage_permissions'), (0, audit_1.auditLog)('READ', 'USER_PERMISSIONS'), userController_1.getUserPermissions);
router.put('/:id/permissions', (0, auth_1.requirePermission)('users.manage_permissions'), (0, audit_1.auditLog)('UPDATE', 'USER_PERMISSIONS'), userController_1.updateUserPermissions);
exports.default = router;
//# sourceMappingURL=users.js.map