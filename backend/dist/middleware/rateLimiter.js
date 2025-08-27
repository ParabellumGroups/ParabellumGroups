"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRateLimitStats = exports.conditionalRateLimit = exports.emailLimiter = exports.exportLimiter = exports.uploadLimiter = exports.reportsLimiter = exports.sensitiveOperationsLimiter = exports.authLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = require("../config/logger");
const config_1 = require("../config");
// Configuration de base pour le rate limiting
const createRateLimiter = (options) => {
    return (0, express_rate_limit_1.default)({
        windowMs: options.windowMs,
        max: options.max,
        message: {
            success: false,
            message: options.message,
            retryAfter: Math.ceil(options.windowMs / 1000)
        },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: options.skipSuccessfulRequests || false,
        skipFailedRequests: options.skipFailedRequests || false,
        handler: (req, res) => {
            logger_1.logger.warn('Rate limit dépassé', {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                url: req.originalUrl,
                method: req.method
            });
            res.status(429).json({
                success: false,
                message: options.message,
                retryAfter: Math.ceil(options.windowMs / 1000)
            });
        },
        keyGenerator: (req) => {
            // Utiliser l'IP du client pour identifier les requêtes
            return req.ip || 'unknown';
        }
    });
};
// Rate limiter général (pour toutes les routes)
exports.generalLimiter = createRateLimiter({
    windowMs: config_1.config.RATE_LIMIT_WINDOW_MS, // 15 minutes
    max: config_1.config.RATE_LIMIT_MAX_REQUESTS, // 100 requêtes par IP
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});
// Rate limiter strict pour l'authentification
exports.authLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 tentatives de connexion par IP
    message: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes.',
    skipSuccessfulRequests: true // Ne pas compter les connexions réussies
});
// Rate limiter pour les opérations sensibles (création, modification, suppression)
exports.sensitiveOperationsLimiter = createRateLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 20, // 20 opérations par IP
    message: 'Trop d\'opérations sensibles, veuillez ralentir le rythme.'
});
// Rate limiter pour les rapports (opérations coûteuses)
exports.reportsLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10, // 10 rapports par IP
    message: 'Trop de demandes de rapports, veuillez patienter.'
});
// Rate limiter pour les uploads de fichiers
exports.uploadLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // 5 uploads par IP
    message: 'Trop d\'uploads de fichiers, veuillez patienter.'
});
// Rate limiter pour les exports de données
exports.exportLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // 3 exports par IP
    message: 'Trop de demandes d\'export, veuillez patienter.'
});
// Rate limiter pour les emails (notifications, relances)
exports.emailLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 50, // 50 emails par IP
    message: 'Trop d\'envois d\'emails, veuillez patienter.'
});
// Middleware conditionnel pour activer/désactiver le rate limiting
const conditionalRateLimit = (limiter) => {
    return (req, res, next) => {
        if (config_1.config.ENABLE_RATE_LIMITING) {
            return limiter(req, res, next);
        }
        next();
    };
};
exports.conditionalRateLimit = conditionalRateLimit;
// Fonction pour obtenir les statistiques de rate limiting
const getRateLimitStats = async (req) => {
    try {
        // Cette fonction pourrait être étendue pour récupérer
        // des statistiques détaillées depuis Redis si nécessaire
        return {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            timestamp: new Date().toISOString()
        };
    }
    catch (error) {
        logger_1.logger.error('Erreur lors de la récupération des stats de rate limiting:', error);
        return null;
    }
};
exports.getRateLimitStats = getRateLimitStats;
exports.default = {
    generalLimiter: exports.generalLimiter,
    authLimiter: exports.authLimiter,
    sensitiveOperationsLimiter: exports.sensitiveOperationsLimiter,
    reportsLimiter: exports.reportsLimiter,
    uploadLimiter: exports.uploadLimiter,
    exportLimiter: exports.exportLimiter,
    emailLimiter: exports.emailLimiter,
    conditionalRateLimit: exports.conditionalRateLimit
};
//# sourceMappingURL=rateLimiter.js.map