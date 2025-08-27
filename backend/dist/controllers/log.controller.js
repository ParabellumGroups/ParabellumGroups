"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientLog = void 0;
const logger_1 = require("@/config/logger");
/**
 * Reçoit et enregistre un log provenant du client (frontend).
 * @param req - La requête Express. Le corps doit contenir { level, message, metadata }.
 * @param res - La réponse Express.
 */
const createClientLog = (req, res) => {
    // 1. Extraire les données du corps de la requête
    const { level = 'info', message = 'Log client sans message', metadata = {} } = req.body;
    // 2. Valider le niveau de log pour la sécurité
    const allowedLevels = ['error', 'warn', 'info', 'debug'];
    const logLevel = allowedLevels.includes(level) ? level : 'info';
    // 3. Enrichir les métadonnées avec des informations sur le client
    const clientMetadata = {
        ...metadata,
        clientIp: req.ip, // Grâce à `app.set('trust proxy', 1)`, c'est la vraie IP
        userAgent: req.get('User-Agent'),
        source: 'frontend' // Pour distinguer ce log des logs backend
    };
    // 4. Enregistrer le log en utilisant Winston
    logger_1.logger.log(logLevel, `[FRONTEND] ${message}`, clientMetadata);
    // 5. Renvoyer une réponse de succès
    res.status(201).json({ success: true, message: 'Log enregistré avec succès' });
};
exports.createClientLog = createClientLog;
//# sourceMappingURL=log.controller.js.map