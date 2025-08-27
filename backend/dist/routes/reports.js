"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Route principale pour les rapports, gère les différents types via le paramètre 'endpoint'
router.get('/', (0, audit_1.auditLog)('READ', 'REPORTS'), reportController_1.getReports);
exports.default = router;
//# sourceMappingURL=reports.js.map