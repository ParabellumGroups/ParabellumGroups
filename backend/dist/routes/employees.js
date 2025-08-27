"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employeeController_1 = require("../controllers/employeeController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes CRUD pour les employés
router.get('/', (0, auth_1.requirePermission)('employees.read'), (0, audit_1.auditLog)('READ', 'EMPLOYEES'), employeeController_1.getEmployees);
router.get('/:id', (0, auth_1.requirePermission)('employees.read'), (0, audit_1.auditLog)('READ', 'EMPLOYEE'), employeeController_1.getEmployeeById);
router.post('/', (0, auth_1.requirePermission)('employees.create'), employeeController_1.validateEmployee, (0, audit_1.auditLog)('CREATE', 'EMPLOYEE'), employeeController_1.createEmployee);
router.put('/:id', (0, auth_1.requirePermission)('employees.update'), employeeController_1.validateEmployee, (0, audit_1.auditLog)('UPDATE', 'EMPLOYEE'), employeeController_1.updateEmployee);
router.delete('/:id', (0, auth_1.requirePermission)('employees.delete'), (0, audit_1.auditLog)('DELETE', 'EMPLOYEE'), employeeController_1.deleteEmployee);
exports.default = router;
//# sourceMappingURL=employees.js.map