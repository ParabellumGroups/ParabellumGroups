"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDatabaseHealth = exports.injectPrisma = exports.closeDatabaseConnection = exports.testDatabaseConnection = exports.getPrismaClient = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("./logger");
// Instance globale Prisma
let prisma;
// Configuration Prisma avec options optimisées
const createPrismaClient = () => {
    const prisma = new client_1.PrismaClient({
        log: [
            { emit: 'event', level: 'query' },
            { emit: 'event', level: 'error' },
            { emit: 'event', level: 'info' },
            { emit: 'event', level: 'warn' },
        ],
        errorFormat: 'pretty',
    });
    // Logging des requêtes en développement
    if (process.env.NODE_ENV === 'development') {
        prisma.$on('query', (e) => {
            logger_1.logger.debug('Prisma Query:', {
                query: e.query,
                params: e.params,
                duration: `${e.duration}ms`,
            });
        });
    }
    // Logging des erreurs
    prisma.$on('error', (e) => {
        logger_1.logger.error('Prisma Error:', e);
    });
    // Logging des infos
    prisma.$on('info', (e) => {
        logger_1.logger.info('Prisma Info:', e);
    });
    // Logging des warnings
    prisma.$on('warn', (e) => {
        logger_1.logger.warn('Prisma Warning:', e);
    });
    return prisma;
};
// Obtenir l'instance Prisma
const getPrismaClient = () => {
    if (!prisma) {
        prisma = createPrismaClient();
    }
    return prisma;
};
exports.getPrismaClient = getPrismaClient;
// Tester la connexion à la base de données
const testDatabaseConnection = async () => {
    try {
        const client = (0, exports.getPrismaClient)();
        await client.$connect();
        // Test simple de requête
        await client.$queryRaw `SELECT 1`;
        logger_1.logger.info('✅ Connexion à la base de données établie avec succès');
        return true;
    }
    catch (error) {
        logger_1.logger.error('❌ Erreur de connexion à la base de données:', error);
        return false;
    }
};
exports.testDatabaseConnection = testDatabaseConnection;
// Fermer la connexion à la base de données
const closeDatabaseConnection = async () => {
    try {
        if (prisma) {
            await prisma.$disconnect();
            logger_1.logger.info('✅ Connexion à la base de données fermée');
        }
    }
    catch (error) {
        logger_1.logger.error('❌ Erreur lors de la fermeture de la connexion:', error);
    }
};
exports.closeDatabaseConnection = closeDatabaseConnection;
// Middleware pour injecter Prisma dans les requêtes
const injectPrisma = (req, res, next) => {
    req.prisma = (0, exports.getPrismaClient)();
    next();
};
exports.injectPrisma = injectPrisma;
// Vérifier la santé de la base de données
const checkDatabaseHealth = async () => {
    try {
        const client = (0, exports.getPrismaClient)();
        const start = Date.now();
        // Test de connectivité
        await client.$queryRaw `SELECT 1`;
        // Test de performance
        const duration = Date.now() - start;
        // Statistiques de base
        const userCount = await client.user.count();
        const customerCount = await client.customer.count();
        return {
            status: 'healthy',
            details: {
                responseTime: `${duration}ms`,
                userCount,
                customerCount,
                timestamp: new Date().toISOString()
            }
        };
    }
    catch (error) {
        return {
            status: 'unhealthy',
            details: {
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            }
        };
    }
};
exports.checkDatabaseHealth = checkDatabaseHealth;
exports.default = exports.getPrismaClient;
//# sourceMappingURL=database.js.map