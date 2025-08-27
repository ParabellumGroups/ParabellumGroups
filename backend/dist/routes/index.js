"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logger_1 = require("../config/logger");
// Import des routes
const auth_1 = __importDefault(require("./auth"));
const customers_1 = __importDefault(require("./customers"));
const quotes_1 = __importDefault(require("./quotes"));
const invoices_1 = __importDefault(require("./invoices"));
const payments_1 = __importDefault(require("./payments"));
const products_1 = __importDefault(require("./products"));
const reports_1 = __importDefault(require("./reports"));
const users_1 = __importDefault(require("./users"));
const employees_1 = __importDefault(require("./employees"));
const contracts_1 = __importDefault(require("./contracts"));
const salaries_1 = __importDefault(require("./salaries"));
const leaves_1 = __importDefault(require("./leaves"));
const expenses_1 = __importDefault(require("./expenses"));
const services_1 = __importDefault(require("./services"));
const prospects_1 = __importDefault(require("./prospects"));
const interventions_1 = __importDefault(require("./interventions"));
const specialites_1 = __importDefault(require("./specialites"));
const techniciens_1 = __importDefault(require("./techniciens"));
const missions_1 = __importDefault(require("./missions"));
const materiels_1 = __importDefault(require("./materiels"));
const rapports_1 = __importDefault(require("./rapports"));
const notifications_1 = __importDefault(require("./notifications"));
const router = (0, express_1.Router)();
// Route de santé de l'API
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API Parabellum Groups opérationnelle',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});
// Routes v1 de l'API
router.use('/v1/auth', auth_1.default);
router.use('/v1/reports', reports_1.default);
router.use('/v1/customers', customers_1.default);
router.use('/v1/quotes', quotes_1.default);
router.use('/v1/invoices', invoices_1.default);
router.use('/v1/payments', payments_1.default);
router.use('/v1/products', products_1.default);
router.use('/v1/users', users_1.default);
router.use('/v1/employees', employees_1.default);
router.use('/v1/contracts', contracts_1.default);
router.use('/v1/salaries', salaries_1.default);
router.use('/v1/leaves', leaves_1.default);
router.use('/v1/loans', require('./loans').default);
router.use('/v1/expenses', expenses_1.default);
router.use('/v1/services', services_1.default);
router.use('/v1/prospects', prospects_1.default);
router.use('/v1/interventions', interventions_1.default);
router.use('/v1/specialites', specialites_1.default);
router.use('/v1/techniciens', techniciens_1.default);
router.use('/v1/missions', missions_1.default);
router.use('/v1/materiels', materiels_1.default);
router.use('/v1/rapports', rapports_1.default);
router.use('/v1/notifications', notifications_1.default);
router.use('/v1/messages', require('./messages').default);
// Middleware pour logger les routes non trouvées
router.use('*', (req, res) => {
    logger_1.logger.warn('Route API non trouvée:', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip
    });
    res.status(404).json({
        success: false,
        message: 'Endpoint API non trouvé',
        availableEndpoints: [
            '/api/v1/auth',
            '/api/v1/reports',
            '/api/v1/customers',
            '/api/v1/quotes',
            '/api/v1/invoices',
            '/api/v1/payments',
            '/api/v1/products',
            '/api/v1/users',
            '/api/v1/employees',
            '/api/v1/contracts',
            '/api/v1/salaries',
            '/api/v1/leaves',
            '/api/v1/expenses',
            '/api/v1/services',
            '/api/v1/interventions'
        ]
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map