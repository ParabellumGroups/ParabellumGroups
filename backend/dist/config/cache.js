"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheMiddleware = exports.CACHE_TTL = exports.CACHE_KEYS = exports.cacheService = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = require("./logger");
// Configuration Redis
const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    keepAlive: 30000,
    connectTimeout: 10000,
    commandTimeout: 5000
};
class CacheService {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }
    // Connexion à Redis
    async connect() {
        try {
            if (process.env.NODE_ENV === 'development' && !process.env.REDIS_HOST) {
                logger_1.logger.info('🔄 Mode développement sans Redis - Cache désactivé');
                return;
            }
            this.client = new ioredis_1.default(redisConfig);
            this.client.on('connect', () => {
                logger_1.logger.info('🔗 Connexion à Redis établie');
                this.isConnected = true;
            });
            this.client.on('ready', () => {
                logger_1.logger.info('✅ Redis prêt');
            });
            this.client.on('error', (error) => {
                logger_1.logger.error('❌ Erreur Redis:', error);
                this.isConnected = false;
            });
            this.client.on('close', () => {
                logger_1.logger.warn('⚠️ Connexion Redis fermée');
                this.isConnected = false;
            });
            this.client.on('reconnecting', () => {
                logger_1.logger.info('🔄 Reconnexion à Redis...');
            });
            // Test de connexion
            await this.client.ping();
            logger_1.logger.info('✅ Cache Redis configuré avec succès');
        }
        catch (error) {
            logger_1.logger.error('❌ Erreur lors de la connexion à Redis:', error);
            this.client = null;
        }
    }
    // Déconnexion de Redis
    async disconnect() {
        try {
            if (this.client) {
                await this.client.quit();
                this.client = null;
                this.isConnected = false;
                logger_1.logger.info('✅ Connexion Redis fermée proprement');
            }
        }
        catch (error) {
            logger_1.logger.error('❌ Erreur lors de la déconnexion Redis:', error);
        }
    }
    // Vérifier si le cache est disponible
    isAvailable() {
        return this.client !== null && this.isConnected;
    }
    // Obtenir une valeur du cache
    async get(key) {
        try {
            if (!this.isAvailable())
                return null;
            const value = await this.client.get(key);
            if (!value)
                return null;
            return JSON.parse(value);
        }
        catch (error) {
            logger_1.logger.error('❌ Erreur lors de la lecture du cache:', { key, error });
            return null;
        }
    }
    // Définir une valeur dans le cache
    async set(key, value, ttlSeconds) {
        try {
            if (!this.isAvailable())
                return false;
            const serializedValue = JSON.stringify(value);
            if (ttlSeconds) {
                await this.client.setex(key, ttlSeconds, serializedValue);
            }
            else {
                await this.client.set(key, serializedValue);
            }
            return true;
        }
        catch (error) {
            logger_1.logger.error('❌ Erreur lors de l\'écriture du cache:', { key, error });
            return false;
        }
    }
    // Supprimer une valeur du cache
    async delete(key) {
        try {
            if (!this.isAvailable())
                return false;
            const result = await this.client.del(key);
            return result > 0;
        }
        catch (error) {
            logger_1.logger.error('❌ Erreur lors de la suppression du cache:', { key, error });
            return false;
        }
    }
    // Supprimer plusieurs clés par pattern
    async deletePattern(pattern) {
        try {
            if (!this.isAvailable())
                return 0;
            const keys = await this.client.keys(pattern);
            if (keys.length === 0)
                return 0;
            const result = await this.client.del(...keys);
            return result;
        }
        catch (error) {
            logger_1.logger.error('❌ Erreur lors de la suppression par pattern:', { pattern, error });
            return 0;
        }
    }
    // Vérifier l'existence d'une clé
    async exists(key) {
        try {
            if (!this.isAvailable())
                return false;
            const result = await this.client.exists(key);
            return result === 1;
        }
        catch (error) {
            logger_1.logger.error('❌ Erreur lors de la vérification d\'existence:', { key, error });
            return false;
        }
    }
    // Définir une expiration sur une clé existante
    async expire(key, ttlSeconds) {
        try {
            if (!this.isAvailable())
                return false;
            const result = await this.client.expire(key, ttlSeconds);
            return result === 1;
        }
        catch (error) {
            logger_1.logger.error('❌ Erreur lors de la définition d\'expiration:', { key, ttlSeconds, error });
            return false;
        }
    }
    // Obtenir le TTL d'une clé
    async getTtl(key) {
        try {
            if (!this.isAvailable())
                return -1;
            return await this.client.ttl(key);
        }
        catch (error) {
            logger_1.logger.error('❌ Erreur lors de la récupération du TTL:', { key, error });
            return -1;
        }
    }
    // Incrémenter une valeur numérique
    async increment(key, amount = 1) {
        try {
            if (!this.isAvailable())
                return null;
            return await this.client.incrby(key, amount);
        }
        catch (error) {
            logger_1.logger.error('❌ Erreur lors de l\'incrémentation:', { key, amount, error });
            return null;
        }
    }
    // Obtenir des statistiques du cache
    async getStats() {
        try {
            if (!this.isAvailable()) {
                return { status: 'disconnected' };
            }
            const info = await this.client.info('memory');
            const keyspace = await this.client.info('keyspace');
            return {
                status: 'connected',
                memory: info,
                keyspace: keyspace,
                isConnected: this.isConnected
            };
        }
        catch (error) {
            logger_1.logger.error('❌ Erreur lors de la récupération des stats:', error);
            return {
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }
    // Vider le cache (attention en production !)
    async flush() {
        try {
            if (!this.isAvailable())
                return false;
            await this.client.flushdb();
            logger_1.logger.warn('⚠️ Cache Redis vidé');
            return true;
        }
        catch (error) {
            logger_1.logger.error('❌ Erreur lors du vidage du cache:', error);
            return false;
        }
    }
}
// Instance singleton du service de cache
exports.cacheService = new CacheService();
// Clés de cache prédéfinies
exports.CACHE_KEYS = {
    // Utilisateurs
    USER_PROFILE: (userId) => `user:profile:${userId}`,
    USER_PERMISSIONS: (userId) => `user:permissions:${userId}`,
    // Clients
    CUSTOMER_LIST: (serviceId, page) => `customers:list:${serviceId || 'all'}:${page || 1}`,
    CUSTOMER_DETAIL: (customerId) => `customer:detail:${customerId}`,
    // Devis
    QUOTE_LIST: (serviceId, status) => `quotes:list:${serviceId || 'all'}:${status || 'all'}`,
    QUOTE_DETAIL: (quoteId) => `quote:detail:${quoteId}`,
    // Factures
    INVOICE_LIST: (serviceId, status) => `invoices:list:${serviceId || 'all'}:${status || 'all'}`,
    INVOICE_DETAIL: (invoiceId) => `invoice:detail:${invoiceId}`,
    // Rapports
    DASHBOARD_STATS: (serviceId) => `dashboard:stats:${serviceId || 'all'}`,
    SALES_REPORT: (period, serviceId) => `reports:sales:${period}:${serviceId || 'all'}`,
    // Système
    SERVICES_LIST: 'system:services',
    ROLES_LIST: 'system:roles',
    PERMISSIONS_LIST: 'system:permissions'
};
// TTL par défaut (en secondes)
exports.CACHE_TTL = {
    SHORT: 300, // 5 minutes
    MEDIUM: 1800, // 30 minutes
    LONG: 3600, // 1 heure
    VERY_LONG: 86400 // 24 heures
};
// Middleware pour le cache des réponses
const cacheMiddleware = (ttl = exports.CACHE_TTL.MEDIUM) => {
    return async (req, res, next) => {
        // Générer une clé de cache basée sur la route et les paramètres
        const cacheKey = `route:${req.method}:${req.originalUrl}:${JSON.stringify(req.query)}`;
        try {
            // Vérifier si la réponse est en cache
            const cachedResponse = await exports.cacheService.get(cacheKey);
            if (cachedResponse) {
                logger_1.logger.debug('✅ Réponse servie depuis le cache', { cacheKey });
                return res.json(cachedResponse);
            }
            // Intercepter la réponse pour la mettre en cache
            const originalSend = res.send;
            res.send = function (data) {
                // Mettre en cache seulement les réponses de succès
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    exports.cacheService.set(cacheKey, JSON.parse(data), ttl)
                        .catch(error => logger_1.logger.error('❌ Erreur mise en cache:', error));
                }
                return originalSend.call(this, data);
            };
            next();
        }
        catch (error) {
            logger_1.logger.error('❌ Erreur middleware cache:', error);
            next();
        }
    };
};
exports.cacheMiddleware = cacheMiddleware;
exports.default = exports.cacheService;
//# sourceMappingURL=cache.js.map