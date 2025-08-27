"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const salaryController_1 = require("../controllers/salaryController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes pour les rapports
router.get('/report', (0, auth_1.requirePermission)('salaries.read'), (0, audit_1.auditLog)('READ', 'SALARY_REPORT'), salaryController_1.getSalaryReport);
// Routes CRUD pour les salaires
router.get('/', (0, auth_1.requirePermission)('salaries.read'), (0, audit_1.auditLog)('READ', 'SALARIES'), salaryController_1.getSalaries);
router.get('/:id', (0, auth_1.requirePermission)('salaries.read'), (0, audit_1.auditLog)('READ', 'SALARY'), salaryController_1.getSalaryById);
router.post('/', (0, auth_1.requirePermission)('salaries.create'), salaryController_1.validateSalary, (0, audit_1.auditLog)('CREATE', 'SALARY'), salaryController_1.createSalary);
router.put('/:id', (0, auth_1.requirePermission)('salaries.update'), salaryController_1.validateSalary, (0, audit_1.auditLog)('UPDATE', 'SALARY'), salaryController_1.updateSalary);
router.delete('/:id', (0, auth_1.requirePermission)('salaries.delete'), (0, audit_1.auditLog)('DELETE', 'SALARY'), salaryController_1.deleteSalary);
// Route pour marquer un salaire comme payé
router.post('/:id/pay', (0, auth_1.requirePermission)('salaries.update'), (0, audit_1.auditLog)('PAY', 'SALARY'), salaryController_1.paySalary);
exports.default = router;
//# sourceMappingURL=salaries.js.map