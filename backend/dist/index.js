"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ✅  : Ces deux lignes doivent être les toutes premières
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const database_1 = require("./config/database");
const logger_1 = require("./config/logger");
const rateLimiter_1 = require("./middleware/rateLimiter");
const swagger_1 = require("./config/swagger");
const cache_1 = require("./config/cache");
const routes_1 = __importDefault(require("./routes")); // Importe le routeur principal depuis index.ts
const app = (0, express_1.default)();
// --- Configuration Essentielle ---
// Faire confiance au premier proxy (Nginx) pour obtenir la vraie IP du client
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
// --- Configuration CORS Robuste ---
const allowedOrigins = [
    'http://180.149.199.94', // Accès via IP publique (port 80 par défaut )
    'http://progiteck.tail', // Accès via Tailscale
    'https://100.115.117.118' // Accès HTTPS via Tailscale
];
if (NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:5173');
}
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            logger_1.logger.warn(`Origine CORS bloquée : ${origin}`);
            callback(new Error('Cette origine n\'est pas autorisée par la politique CORS.'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};
// --- Middlewares Globaux ---
app.use((0, helmet_1.default)()); // Sécurité des en-têtes HTTP
app.use((0, cors_1.default)(corsOptions)); // Gestion des requêtes cross-origin
app.options('*', (0, cors_1.default)(corsOptions)); // Gère les requêtes pre-flight
app.use((0, compression_1.default)()); // Compression des réponses
app.use(express_1.default.json({ limit: '10mb' })); // Parsing des body JSON
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' })); // Parsing des body URL-encoded
app.use(rateLimiter_1.generalLimiter); // Limite de taux globale
// Middleware de logging des requêtes
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger_1.logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`, {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
    });
    next();
});
// --- Routes de l'Application ---
app.use('/api', routes_1.default); // Utilise le routeur principal pour toutes les routes /api
// --- Documentation API (Swagger) ---
(0, swagger_1.setupSwagger)(app);
// --- Gestion des Erreurs ---
// Middleware pour les routes non trouvées (404)
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée',
        error: `Cannot ${_req.method} ${_req.originalUrl}`
    });
});
// Middleware de gestion des erreurs globales (doit être le dernier `app.use`)
app.use((error, _req, res, _next) => {
    logger_1.logger.error('Unhandled error:', { message: error.message, stack: error.stack });
    res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: NODE_ENV === 'development' ? error.message : 'Une erreur inattendue est survenue.'
    });
});
// --- Démarrage du Serveur ---
const startServer = async () => {
    try {
        // 1. Connexion à la base de données
        const dbConnected = await (0, database_1.testDatabaseConnection)();
        if (!dbConnected) {
            logger_1.logger.error('Échec de la connexion à la base de données. Arrêt du serveur.');
            process.exit(1);
        }
        // 2. Connexion au cache Redis
        await cache_1.cacheService.connect();
        // 3. Démarrage du serveur Express
        const server = app.listen(PORT, () => {
            logger_1.logger.info(`🚀 Serveur Parabellum démarré sur le port ${PORT}`);
            logger_1.logger.info(`📊 Environnement: ${NODE_ENV}`);
            logger_1.logger.info(`🛡️  Paramètre 'trust proxy' configuré sur : ${app.get('trust proxy')}`);
            logger_1.logger.info(`📚 Documentation API disponible sur http://localhost:${PORT}/api-docs`);
        });
        // 4. Gestion de l'arrêt propre (graceful shutdown)
        const gracefulShutdown = async (signal) => {
            logger_1.logger.info(`${signal} reçu, arrêt du serveur...`);
            server.close(async () => {
                logger_1.logger.info('Serveur HTTP fermé.');
                try {
                    await cache_1.cacheService.disconnect();
                    await (0, database_1.closeDatabaseConnection)();
                    logger_1.logger.info('Connexions aux services externes fermées.');
                    process.exit(0);
                }
                catch (error) {
                    logger_1.logger.error('Erreur lors de la fermeture des connexions:', error);
                    process.exit(1);
                }
            });
        };
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    }
    catch (error) {
        logger_1.logger.error('Erreur critique lors du démarrage du serveur:', error);
        process.exit(1);
    }
};
// Lancement du serveur
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map