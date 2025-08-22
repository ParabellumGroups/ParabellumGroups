import { Router } from 'express';
import {
  getDashboardStats,
  getSalesReport,
  getFinancialReport,
  getCashFlowReport
} from '../controllers/reportController';
import { authenticateToken, requirePermission } from '../middleware/auth';
import { auditLog } from '../middleware/audit';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Routes pour les rapports
router.get('/dashboard', 
  auditLog('READ', 'DASHBOARD_STATS'),
  getDashboardStats
);

router.get('/sales', 
  requirePermission('reports.sales'),
  auditLog('READ', 'SALES_REPORT'),
  getSalesReport
);

router.get('/financial', 
  requirePermission('reports.financial'),
  auditLog('READ', 'FINANCIAL_REPORT'),
  getFinancialReport
);

router.get('/cash-flow', 
  requirePermission('reports.financial'),
  auditLog('READ', 'CASH_FLOW_REPORT'),
  getCashFlowReport
);

export default router;