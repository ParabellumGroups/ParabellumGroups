"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
router.post('/login', (0, audit_1.auditLog)('LOGIN', 'AUTH'), authController_1.login);
router.post('/refresh', authController_1.refreshToken);
router.post('/logout', auth_1.authenticateToken, (0, audit_1.auditLog)('LOGOUT', 'AUTH'), authController_1.logout);
router.get('/profile', auth_1.authenticateToken, authController_1.getProfile);
exports.default = router;
//# sourceMappingURL=auth.js.map