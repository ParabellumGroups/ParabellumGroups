import { Router } from 'express';
import { logger } from '../config/logger';

// Import des routes
import authRoutes from './auth';
import customerRoutes from './customers';
import quoteRoutes from './quotes';
import invoiceRoutes from './invoices';
import paymentRoutes from './payments';
import productRoutes from './products';
import reportRoutes from './reports';
import userRoutes from './users';
import employeeRoutes from './employees';
import contractRoutes from './contracts';
import salaryRoutes from './salaries';
import leaveRoutes from './leaves';
import expenseRoutes from './expenses';
import serviceRoutes from './services';
import prospectRoutes from './prospects';
import interventionRoutes from './interventions';
import specialiteRoutes from './specialites';
import technicienRoutes from './techniciens';
import missionRoutes from './missions';
import materielRoutes from './materiels';
import rapportRoutes from './rapports';
import notificationRoutes from './notifications';

const router = Router();

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
router.use('/v1/auth', authRoutes);
router.use('/v1/reports', reportRoutes);
router.use('/v1/customers', customerRoutes);
router.use('/v1/quotes', quoteRoutes);
router.use('/v1/invoices', invoiceRoutes);
router.use('/v1/payments', paymentRoutes);
router.use('/v1/products', productRoutes);
router.use('/v1/users', userRoutes);
router.use('/v1/employees', employeeRoutes);
router.use('/v1/contracts', contractRoutes);
router.use('/v1/salaries', salaryRoutes);
router.use('/v1/leaves', leaveRoutes);
router.use('/v1/loans', require('./loans').default);
router.use('/v1/expenses', expenseRoutes);
router.use('/v1/services', serviceRoutes);
router.use('/v1/prospects', prospectRoutes);
router.use('/v1/interventions', interventionRoutes);
router.use('/v1/specialites', specialiteRoutes);
router.use('/v1/techniciens', technicienRoutes);
router.use('/v1/missions', missionRoutes);
router.use('/v1/materiels', materielRoutes);
router.use('/v1/rapports', rapportRoutes);
router.use('/v1/notifications', notificationRoutes);
router.use('/v1/messages', require('./messages').default);

// Middleware pour logger les routes non trouvées
router.use('*', (req, res) => {
  logger.warn('Route API non trouvée:', {
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

export default router;