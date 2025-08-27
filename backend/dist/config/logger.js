"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logPerformance = exports.logAudit = exports.logError = exports.performanceLogger = exports.auditLogger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const path_1 = __importDefault(require("path"));
const { combine, timestamp, errors, json, printf, colorize } = winston_1.default.format;
// Format personnalisé pour les logs en développement
const developmentFormat = printf(({ level, message, timestamp, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
        log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    return log;
});
// Configuration des transports
const transports = [];
// Console transport (toujours actif)
transports.push(new winston_1.default.transports.Console({
    format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), process.env.NODE_ENV === 'development' ? developmentFormat : json())
}));
// File transports (seulement en production)
if (process.env.NODE_ENV === 'production') {
    // Logs d'erreur
    transports.push(new winston_daily_rotate_file_1.default({
        filename: path_1.default.join(process.cwd(), 'logs', 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxSize: '20m',
        maxFiles: '14d',
        format: combine(timestamp(), errors({ stack: true }), json())
    }));
    // Logs combinés
    transports.push(new winston_daily_rotate_file_1.default({
        filename: path_1.default.join(process.cwd(), 'logs', 'combined-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '30d',
        format: combine(timestamp(), errors({ stack: true }), json())
    }));
    // Logs d'audit (actions sensibles)
    transports.push(new winston_daily_rotate_file_1.default({
        filename: path_1.default.join(process.cwd(), 'logs', 'audit-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'info',
        maxSize: '50m',
        maxFiles: '90d',
        format: combine(timestamp(), json())
    }));
}
// Créer le logger
exports.logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'development' ? 'debug' : 'info'),
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta: {
        service: 'parabellum-api',
        version: process.env.npm_package_version || '1.0.0'
    },
    transports,
    // Ne pas quitter sur les erreurs
    exitOnError: false
});
// Logger spécialisé pour l'audit
exports.auditLogger = winston_1.default.createLogger({
    level: 'info',
    format: combine(timestamp(), json()),
    defaultMeta: {
        service: 'parabellum-audit',
        type: 'audit'
    },
    transports: [
        new winston_1.default.transports.Console({
            format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), printf(({ timestamp, level, message, ...meta }) => {
                return `${timestamp} [AUDIT]: ${message} ${JSON.stringify(meta)}`;
            }))
        }),
        ...(process.env.NODE_ENV === 'production' ? [
            new winston_daily_rotate_file_1.default({
                filename: path_1.default.join(process.cwd(), 'logs', 'audit-%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                maxSize: '50m',
                maxFiles: '365d',
                format: combine(timestamp(), json())
            })
        ] : [])
    ]
});
// Logger pour les performances
exports.performanceLogger = winston_1.default.createLogger({
    level: 'info',
    format: combine(timestamp(), json()),
    defaultMeta: {
        service: 'parabellum-performance',
        type: 'performance'
    },
    transports: [
        ...(process.env.NODE_ENV === 'production' ? [
            new winston_daily_rotate_file_1.default({
                filename: path_1.default.join(process.cwd(), 'logs', 'performance-%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                maxSize: '20m',
                maxFiles: '7d',
                format: combine(timestamp(), json())
            })
        ] : [])
    ]
});
// Fonction utilitaire pour logger les erreurs avec contexte
const logError = (error, context) => {
    exports.logger.error('Application Error:', {
        message: error.message,
        stack: error.stack,
        context
    });
};
exports.logError = logError;
// Fonction utilitaire pour logger les actions d'audit
const logAudit = (action, userId, details) => {
    exports.auditLogger.info(action, {
        userId,
        action,
        details,
        timestamp: new Date().toISOString()
    });
};
exports.logAudit = logAudit;
// Fonction utilitaire pour logger les performances
const logPerformance = (operation, duration, details) => {
    exports.performanceLogger.info(operation, {
        operation,
        duration,
        details,
        timestamp: new Date().toISOString()
    });
};
exports.logPerformance = logPerformance;
exports.default = exports.logger;
//# sourceMappingURL=logger.js.map