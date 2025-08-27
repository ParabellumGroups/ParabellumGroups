"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLog = void 0;
const database_1 = require("../config/database");
const prisma = (0, database_1.getPrismaClient)();
const auditLog = (action, resource) => {
    return async (req, res, next) => {
        const originalSend = res.send;
        res.send = function (data) {
            // Log seulement si la requête est réussie
            if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                const auditData = {
                    userId: req.user.userId,
                    action,
                    resource,
                    resourceId: req.params.id ? parseInt(req.params.id) : undefined,
                    details: {
                        method: req.method,
                        url: req.originalUrl,
                        body: req.method !== 'GET' ? req.body : undefined,
                        query: req.query
                    },
                    ipAddress: req.ip,
                    userAgent: req.get('User-Agent')
                };
                // Log asynchrone pour ne pas bloquer la réponse
                prisma.auditLog.create({
                    data: {
                        userId: auditData.userId,
                        action: `${auditData.action} ${auditData.resource}`,
                        details: JSON.stringify(auditData.details)
                    }
                }).catch(console.error);
            }
            return originalSend.call(this, data);
        };
        next();
    };
};
exports.auditLog = auditLog;
//# sourceMappingURL=audit.js.map