"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTechnicien = exports.deleteTechnicien = exports.updateTechnicien = exports.createTechnicien = exports.getTechnicienById = exports.getTechniciens = void 0;
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const prisma = new client_1.PrismaClient();
const getTechniciens = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, specialiteId, isActive } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        let whereClause = {};
        if (search) {
            whereClause.OR = [
                { nom: { contains: search, mode: 'insensitive' } },
                { prenom: { contains: search, mode: 'insensitive' } },
                { contact: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (specialiteId) {
            whereClause.specialiteId = Number(specialiteId);
        }
        if (isActive !== undefined) {
            whereClause.isActive = isActive === 'true';
        }
        const [techniciens, total] = await Promise.all([
            prisma.technicien.findMany({
                where: whereClause,
                include: {
                    specialite: true,
                    utilisateur: {
                        select: { id: true, firstName: true, lastName: true, email: true, role: true }
                    },
                    _count: {
                        select: {
                            interventions: true,
                            rapports: true
                        }
                    }
                },
                skip: offset,
                take: Number(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.technicien.count({ where: whereClause })
        ]);
        res.json({
            success: true,
            data: {
                techniciens,
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
        console.error('Erreur lors de la récupération des techniciens:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getTechniciens = getTechniciens;
const getTechnicienById = async (req, res) => {
    try {
        const { id } = req.params;
        const technicien = await prisma.technicien.findUnique({
            where: { id: Number(id) },
            include: {
                specialite: true,
                utilisateur: {
                    select: { id: true, firstName: true, lastName: true, email: true, role: true }
                },
                interventions: {
                    include: {
                        intervention: {
                            include: {
                                mission: {
                                    include: {
                                        client: {
                                            select: { name: true }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10
                },
                rapports: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
            }
        });
        if (!technicien) {
            return res.status(404).json({
                success: false,
                message: 'Technicien non trouvé'
            });
        }
        res.json({
            success: true,
            data: technicien
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération du technicien:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getTechnicienById = getTechnicienById;
const createTechnicien = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Données invalides',
                errors: errors.array()
            });
        }
        const { nom, prenom, contact, specialiteId, utilisateurId } = req.body;
        // Vérifier que la spécialité existe
        const specialite = await prisma.specialite.findUnique({
            where: { id: specialiteId }
        });
        if (!specialite) {
            return res.status(404).json({
                success: false,
                message: 'Spécialité non trouvée'
            });
        }
        // Vérifier que l'utilisateur existe et n'est pas déjà associé
        if (utilisateurId) {
            const utilisateur = await prisma.user.findUnique({
                where: { id: utilisateurId }
            });
            if (!utilisateur) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }
            const existingTechnicien = await prisma.technicien.findUnique({
                where: { utilisateurId }
            });
            if (existingTechnicien) {
                return res.status(400).json({
                    success: false,
                    message: 'Cet utilisateur est déjà associé à un technicien'
                });
            }
        }
        const technicien = await prisma.technicien.create({
            data: {
                nom,
                prenom,
                contact,
                specialiteId,
                utilisateurId
            },
            include: {
                specialite: true,
                utilisateur: {
                    select: { id: true, firstName: true, lastName: true, email: true, role: true }
                }
            }
        });
        res.status(201).json({
            success: true,
            data: technicien,
            message: 'Technicien créé avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la création du technicien:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.createTechnicien = createTechnicien;
const updateTechnicien = async (req, res) => {
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
        const existingTechnicien = await prisma.technicien.findUnique({
            where: { id: Number(id) }
        });
        if (!existingTechnicien) {
            return res.status(404).json({
                success: false,
                message: 'Technicien non trouvé'
            });
        }
        const { nom, prenom, contact, specialiteId, utilisateurId, isActive } = req.body;
        const technicien = await prisma.technicien.update({
            where: { id: Number(id) },
            data: {
                nom,
                prenom,
                contact,
                specialiteId,
                utilisateurId,
                isActive
            },
            include: {
                specialite: true,
                utilisateur: {
                    select: { id: true, firstName: true, lastName: true, email: true, role: true }
                }
            }
        });
        res.json({
            success: true,
            data: technicien,
            message: 'Technicien mis à jour avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour du technicien:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.updateTechnicien = updateTechnicien;
const deleteTechnicien = async (req, res) => {
    try {
        const { id } = req.params;
        const existingTechnicien = await prisma.technicien.findUnique({
            where: { id: Number(id) },
            include: {
                _count: {
                    select: {
                        interventions: true,
                        rapports: true
                    }
                }
            }
        });
        if (!existingTechnicien) {
            return res.status(404).json({
                success: false,
                message: 'Technicien non trouvé'
            });
        }
        // Vérifier s'il y a des données associées
        if (existingTechnicien._count.interventions > 0 || existingTechnicien._count.rapports > 0) {
            // Désactiver au lieu de supprimer
            await prisma.technicien.update({
                where: { id: Number(id) },
                data: { isActive: false }
            });
            res.json({
                success: true,
                message: 'Technicien désactivé (des données lui sont associées)'
            });
        }
        else {
            await prisma.technicien.delete({
                where: { id: Number(id) }
            });
            res.json({
                success: true,
                message: 'Technicien supprimé avec succès'
            });
        }
    }
    catch (error) {
        console.error('Erreur lors de la suppression du technicien:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.deleteTechnicien = deleteTechnicien;
// Validation middleware
exports.validateTechnicien = [
    (0, express_validator_1.body)('nom').notEmpty().withMessage('Nom requis'),
    (0, express_validator_1.body)('prenom').notEmpty().withMessage('Prénom requis'),
    (0, express_validator_1.body)('contact').notEmpty().withMessage('Contact requis'),
    (0, express_validator_1.body)('specialiteId').isInt().withMessage('Spécialité requise')
];
//# sourceMappingURL=technicienController.js.map