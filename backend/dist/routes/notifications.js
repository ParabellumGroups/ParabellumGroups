"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("../controllers/notificationController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes pour les notifications
router.get('/', (0, audit_1.auditLog)('READ', 'NOTIFICATIONS'), notificationController_1.getNotifications);
router.post('/', (0, audit_1.auditLog)('CREATE', 'NOTIFICATION'), notificationController_1.createNotification);
router.patch('/:id/read', (0, audit_1.auditLog)('MARK_READ', 'NOTIFICATION'), notificationController_1.markAsRead);
router.patch('/read-all', (0, audit_1.auditLog)('MARK_ALL_READ', 'NOTIFICATIONS'), notificationController_1.markAllAsRead);
router.delete('/:id', (0, audit_1.auditLog)('DELETE', 'NOTIFICATION'), notificationController_1.deleteNotification);
exports.default = router;
//# sourceMappingURL=notifications.js.map