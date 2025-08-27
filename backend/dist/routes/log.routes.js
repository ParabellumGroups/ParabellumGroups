"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /logs:
 *   post:
 *     summary: Enregistre un log provenant du client
 *     tags: [Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               level:
 *                 type: string
 *                 enum: [error, warn, info, debug]
 *                 description: Le niveau du log.
 *               message:
 *                 type: string
 *                 description: Le message de log.
 *               metadata:
 *                 type: object
 *                 description: Données contextuelles supplémentaires.
 *     responses:
 *       201:
 *         description: Log enregistré avec succès.
 */
router.get('/logs', admin_controller_1.listLogFiles);
router.get('/logs/:filename', admin_controller_1.getLogFileContent);
exports.default = router;
//# sourceMappingURL=log.routes.js.map