"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerController_1 = require("../controllers/customerController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes CRUD pour les clients
router.get('/', (0, auth_1.requirePermission)('customers.read'), (0, audit_1.auditLog)('READ', 'CUSTOMERS'), customerController_1.getCustomers);
router.get('/:id', (0, auth_1.requirePermission)('customers.read'), (0, audit_1.auditLog)('READ', 'CUSTOMER'), customerController_1.getCustomerById);
router.post('/', (0, auth_1.requirePermission)('customers.create'), customerController_1.validateCustomer, (0, audit_1.auditLog)('CREATE', 'CUSTOMER'), customerController_1.createCustomer);
router.put('/:id', (0, auth_1.requirePermission)('customers.update'), customerController_1.validateCustomer, (0, audit_1.auditLog)('UPDATE', 'CUSTOMER'), customerController_1.updateCustomer);
router.delete('/:id', (0, auth_1.requirePermission)('customers.delete'), (0, audit_1.auditLog)('DELETE', 'CUSTOMER'), customerController_1.deleteCustomer);
exports.default = router;
//# sourceMappingURL=customers.js.map