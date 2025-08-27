"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProduct = exports.updateStock = exports.getCategories = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const prisma = new client_1.PrismaClient();
const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category, isActive } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        let whereClause = {};
        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (category) {
            whereClause.category = category;
        }
        if (isActive !== undefined) {
            whereClause.isActive = isActive === 'true';
        }
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where: whereClause,
                include: {
                    prices: {
                        where: {
                            OR: [
                                { validUntil: null },
                                { validUntil: { gte: new Date() } }
                            ]
                        },
                        orderBy: { minQuantity: 'asc' }
                    },
                    _count: {
                        select: {
                            quoteItems: true,
                            invoiceItems: true
                        }
                    }
                },
                skip: offset,
                take: Number(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.product.count({ where: whereClause })
        ]);
        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    totalPages: Math.ceil(total / Number(limit))
                }
            }
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
            include: {
                prices: {
                    orderBy: { minQuantity: 'asc' }
                }
            }
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produit non trouvé'
            });
        }
        res.json({
            success: true,
            data: product
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération du produit:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Données invalides',
                errors: errors.array()
            });
        }
        const { sku, name, description, type, category, unit, priceHt, vatRate, costPrice, stockQuantity, stockAlertThreshold, weight, dimensions, imageUrl, prices } = req.body;
        // Vérifier que le SKU n'existe pas déjà
        const existingSku = await prisma.product.findUnique({
            where: { sku }
        });
        if (existingSku) {
            return res.status(400).json({
                success: false,
                message: 'Ce SKU existe déjà'
            });
        }
        const product = await prisma.product.create({
            data: {
                sku,
                name,
                description,
                type,
                category,
                unit,
                priceHt,
                vatRate,
                costPrice,
                stockQuantity: stockQuantity || 0,
                stockAlertThreshold: stockAlertThreshold || 0,
                weight,
                dimensions,
                imageUrl,
                prices: prices ? {
                    create: prices.map((price) => ({
                        customerCategory: price.customerCategory,
                        minQuantity: price.minQuantity || 1,
                        priceHt: price.priceHt,
                        validFrom: price.validFrom ? new Date(price.validFrom) : null,
                        validUntil: price.validUntil ? new Date(price.validUntil) : null
                    }))
                } : undefined
            },
            include: {
                prices: true
            }
        });
        res.status(201).json({
            success: true,
            data: product,
            message: 'Produit créé avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la création du produit:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Données invalides',
                errors: errors.array()
            });
        }
        const existingProduct = await prisma.product.findUnique({
            where: { id: Number(id) }
        });
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Produit non trouvé'
            });
        }
        const { sku, name, description, type, category, unit, priceHt, vatRate, costPrice, stockQuantity, stockAlertThreshold, weight, dimensions, imageUrl, isActive } = req.body;
        // Vérifier que le SKU n'existe pas déjà (sauf pour ce produit)
        if (sku !== existingProduct.sku) {
            const existingSku = await prisma.product.findUnique({
                where: { sku }
            });
            if (existingSku) {
                return res.status(400).json({
                    success: false,
                    message: 'Ce SKU existe déjà'
                });
            }
        }
        const product = await prisma.product.update({
            where: { id: Number(id) },
            data: {
                sku,
                name,
                description,
                type,
                category,
                unit,
                priceHt,
                vatRate,
                costPrice,
                stockQuantity,
                stockAlertThreshold,
                weight,
                dimensions,
                imageUrl,
                isActive
            },
            include: {
                prices: true
            }
        });
        res.json({
            success: true,
            data: product,
            message: 'Produit mis à jour avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour du produit:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const existingProduct = await prisma.product.findUnique({
            where: { id: Number(id) },
            include: {
                _count: {
                    select: {
                        quoteItems: true,
                        invoiceItems: true
                    }
                }
            }
        });
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Produit non trouvé'
            });
        }
        // Vérifier s'il y a des devis ou factures associés
        if (existingProduct._count.quoteItems > 0 || existingProduct._count.invoiceItems > 0) {
            return res.status(400).json({
                success: false,
                message: 'Impossible de supprimer un produit utilisé dans des devis ou factures'
            });
        }
        await prisma.product.delete({
            where: { id: Number(id) }
        });
        res.json({
            success: true,
            message: 'Produit supprimé avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.deleteProduct = deleteProduct;
const getCategories = async (req, res) => {
    try {
        const categories = await prisma.product.findMany({
            where: {
                category: { not: null },
                isActive: true
            },
            select: {
                category: true
            },
            distinct: ['category']
        });
        const categoryList = categories
            .map(p => p.category)
            .filter(Boolean)
            .sort();
        res.json({
            success: true,
            data: categoryList
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getCategories = getCategories;
const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, operation } = req.body; // operation: 'add' | 'subtract' | 'set'
        const product = await prisma.product.findUnique({
            where: { id: Number(id) }
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produit non trouvé'
            });
        }
        let newQuantity = product.stockQuantity;
        switch (operation) {
            case 'add':
                newQuantity += quantity;
                break;
            case 'subtract':
                newQuantity -= quantity;
                break;
            case 'set':
                newQuantity = quantity;
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Opération invalide'
                });
        }
        if (newQuantity < 0) {
            return res.status(400).json({
                success: false,
                message: 'Le stock ne peut pas être négatif'
            });
        }
        const updatedProduct = await prisma.product.update({
            where: { id: Number(id) },
            data: {
                stockQuantity: newQuantity
            }
        });
        res.json({
            success: true,
            data: updatedProduct,
            message: 'Stock mis à jour avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour du stock:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.updateStock = updateStock;
// Validation middleware
exports.validateProduct = [
    (0, express_validator_1.body)('sku').notEmpty().withMessage('SKU requis'),
    (0, express_validator_1.body)('name').notEmpty().withMessage('Nom requis'),
    (0, express_validator_1.body)('type').isIn(['PRODUCT', 'SERVICE', 'SUBSCRIPTION']).withMessage('Type invalide'),
    (0, express_validator_1.body)('priceHt').isFloat({ min: 0 }).withMessage('Prix HT invalide'),
    (0, express_validator_1.body)('vatRate').isFloat({ min: 0, max: 100 }).withMessage('Taux TVA invalide'),
    (0, express_validator_1.body)('stockQuantity').optional().isInt({ min: 0 }).withMessage('Quantité en stock invalide'),
    (0, express_validator_1.body)('stockAlertThreshold').optional().isInt({ min: 0 }).withMessage('Seuil d\'alerte invalide')
];
//# sourceMappingURL=productController.js.map