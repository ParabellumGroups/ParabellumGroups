"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messageController_1 = require("../controllers/messageController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes CRUD pour les messages
router.get('/', (0, auth_1.requirePermission)('messages.read'), (0, audit_1.auditLog)('READ', 'MESSAGES'), messageController_1.getMessages);
router.get('/:id', (0, auth_1.requirePermission)('messages.read'), (0, audit_1.auditLog)('READ', 'MESSAGE'), messageController_1.getMessageById);
router.post('/', (0, auth_1.requirePermission)('messages.create'), messageController_1.validateMessage, (0, audit_1.auditLog)('CREATE', 'MESSAGE'), messageController_1.createMessage);
router.patch('/:id/read', (0, auth_1.requirePermission)('messages.read'), (0, audit_1.auditLog)('MARK_READ', 'MESSAGE'), messageController_1.markAsRead);
router.patch('/:id/archive', (0, auth_1.requirePermission)('messages.update'), (0, audit_1.auditLog)('ARCHIVE', 'MESSAGE'), messageController_1.archiveMessage);
router.post('/:id/reply', (0, auth_1.requirePermission)('messages.create'), messageController_1.validateMessage, (0, audit_1.auditLog)('REPLY', 'MESSAGE'), messageController_1.replyToMessage);
exports.default = router;
//# sourceMappingURL=messages.js.map