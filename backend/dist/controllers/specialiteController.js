"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSpecialite = exports.deleteSpecialite = exports.updateSpecialite = exports.createSpecialite = exports.getSpecialiteById = exports.getSpecialites = void 0;
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const prisma = new client_1.PrismaClient();
const getSpecialites = async (req, res) => {
    try {
        const { search } = req.query;
        let whereClause = {};
        if (search) {
            whereClause.OR = [
                { libelle: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        const specialites = await prisma.specialite.findMany({
            where: whereClause,
            include: {
                _count: {
                    select: {
                        techniciens: true
                    }
                }
            },
            orderBy: { libelle: 'asc' }
        });
        res.json({
            success: true,
            data: { specialites }
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des spécialités:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getSpecialites = getSpecialites;
const getSpecialiteById = async (req, res) => {
    try {
        const { id } = req.params;
        const specialite = await prisma.specialite.findUnique({
            where: { id: Number(id) },
            include: {
                techniciens: {
                    include: {
                        utilisateur: {
                            select: { firstName: true, lastName: true, email: true }
                        }
                    }
                }
            }
        });
        if (!specialite) {
            return res.status(404).json({
                success: false,
                message: 'Spécialité non trouvée'
            });
        }
        res.json({
            success: true,
            data: specialite
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération de la spécialité:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getSpecialiteById = getSpecialiteById;
const createSpecialite = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Données invalides',
                errors: errors.array()
            });
        }
        const { libelle, description } = req.body;
        // Vérifier que le libellé n'existe pas déjà
        const existingSpecialite = await prisma.specialite.findUnique({
            where: { libelle }
        });
        if (existingSpecialite) {
            return res.status(400).json({
                success: false,
                message: 'Cette spécialité existe déjà'
            });
        }
        const specialite = await prisma.specialite.create({
            data: {
                libelle,
                description
            },
            include: {
                _count: {
                    select: {
                        techniciens: true
                    }
                }
            }
        });
        res.status(201).json({
            success: true,
            data: specialite,
            message: 'Spécialité créée avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la création de la spécialité:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.createSpecialite = createSpecialite;
const updateSpecialite = async (req, res) => {
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
        const existingSpecialite = await prisma.specialite.findUnique({
            where: { id: Number(id) }
        });
        if (!existingSpecialite) {
            return res.status(404).json({
                success: false,
                message: 'Spécialité non trouvée'
            });
        }
        const { libelle, description } = req.body;
        // Vérifier que le libellé n'existe pas déjà (sauf pour cette spécialité)
        if (libelle !== existingSpecialite.libelle) {
            const libelleExists = await prisma.specialite.findUnique({
                where: { libelle }
            });
            if (libelleExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Ce libellé existe déjà'
                });
            }
        }
        const specialite = await prisma.specialite.update({
            where: { id: Number(id) },
            data: {
                libelle,
                description
            },
            include: {
                _count: {
                    select: {
                        techniciens: true
                    }
                }
            }
        });
        res.json({
            success: true,
            data: specialite,
            message: 'Spécialité mise à jour avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour de la spécialité:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.updateSpecialite = updateSpecialite;
const deleteSpecialite = async (req, res) => {
    try {
        const { id } = req.params;
        const existingSpecialite = await prisma.specialite.findUnique({
            where: { id: Number(id) },
            include: {
                _count: {
                    select: {
                        techniciens: true
                    }
                }
            }
        });
        if (!existingSpecialite) {
            return res.status(404).json({
                success: false,
                message: 'Spécialité non trouvée'
            });
        }
        // Vérifier s'il y a des techniciens associés
        if (existingSpecialite._count.techniciens > 0) {
            return res.status(400).json({
                success: false,
                message: 'Impossible de supprimer une spécialité ayant des techniciens associés'
            });
        }
        await prisma.specialite.delete({
            where: { id: Number(id) }
        });
        res.json({
            success: true,
            message: 'Spécialité supprimée avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la suppression de la spécialité:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.deleteSpecialite = deleteSpecialite;
// Validation middleware
exports.validateSpecialite = [
    (0, express_validator_1.body)('libelle').notEmpty().withMessage('Libellé requis'),
    (0, express_validator_1.body)('description').optional().isString().withMessage('Description invalide')
];
//# sourceMappingURL=specialiteController.js.map