"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expenseController_1 = require("../controllers/expenseController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes utilitaires
router.get('/categories', (0, auth_1.requirePermission)('expenses.read'), expenseController_1.getExpenseCategories);
// Routes CRUD pour les dépenses
router.get('/', (0, auth_1.requirePermission)('expenses.read'), (0, audit_1.auditLog)('READ', 'EXPENSES'), expenseController_1.getExpenses);
router.get('/:id', (0, auth_1.requirePermission)('expenses.read'), (0, audit_1.auditLog)('READ', 'EXPENSE'), expenseController_1.getExpenseById);
router.post('/', (0, auth_1.requirePermission)('expenses.create'), expenseController_1.validateExpense, (0, audit_1.auditLog)('CREATE', 'EXPENSE'), expenseController_1.createExpense);
router.put('/:id', (0, auth_1.requirePermission)('expenses.update'), expenseController_1.validateExpense, (0, audit_1.auditLog)('UPDATE', 'EXPENSE'), expenseController_1.updateExpense);
router.delete('/:id', (0, auth_1.requirePermission)('expenses.delete'), (0, audit_1.auditLog)('DELETE', 'EXPENSE'), expenseController_1.deleteExpense);
exports.default = router;
//# sourceMappingURL=expenses.js.map