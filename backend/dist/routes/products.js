"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../middleware/audit");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_1.authenticateToken);
// Routes CRUD pour les produits
router.get('/', (0, auth_1.requirePermission)('products.read'), (0, audit_1.auditLog)('READ', 'PRODUCTS'), productController_1.getProducts);
router.get('/categories', (0, auth_1.requirePermission)('products.read'), productController_1.getCategories);
router.get('/:id', (0, auth_1.requirePermission)('products.read'), (0, audit_1.auditLog)('READ', 'PRODUCT'), productController_1.getProductById);
router.post('/', (0, auth_1.requirePermission)('products.create'), productController_1.validateProduct, (0, audit_1.auditLog)('CREATE', 'PRODUCT'), productController_1.createProduct);
router.put('/:id', (0, auth_1.requirePermission)('products.update'), productController_1.validateProduct, (0, audit_1.auditLog)('UPDATE', 'PRODUCT'), productController_1.updateProduct);
router.delete('/:id', (0, auth_1.requirePermission)('products.delete'), (0, audit_1.auditLog)('DELETE', 'PRODUCT'), productController_1.deleteProduct);
router.patch('/:id/stock', (0, auth_1.requirePermission)('products.update'), (0, audit_1.auditLog)('UPDATE_STOCK', 'PRODUCT'), productController_1.updateStock);
exports.default = router;
//# sourceMappingURL=products.js.map