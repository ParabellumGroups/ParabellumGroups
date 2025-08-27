"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRapport = exports.uploadRapportImages = exports.deleteRapport = exports.updateRapport = exports.createRapport = exports.getRapportById = exports.getRapports = void 0;
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const prisma = new client_1.PrismaClient();
const getRapports = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, missionId, technicienId, statut } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        let whereClause = {};
        if (search) {
            whereClause.OR = [
                { titre: { contains: search, mode: 'insensitive' } },
                { contenu: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (missionId) {
            whereClause.missionId = missionId;
        }
        if (technicienId) {
            whereClause.technicienId = Number(technicienId);
        }
        if (statut) {
            whereClause.statut = statut;
        }
        const [rapports, total] = await Promise.all([
            prisma.rapportMission.findMany({
                where: whereClause,
                include: {
                    mission: {
                        include: {
                            client: {
                                select: { name: true }
                            }
                        }
                    },
                    technicien: {
                        include: {
                            specialite: true
                        }
                    },
                    intervention: {
                        select: { id: true, dateHeureDebut: true, dateHeureFin: true }
                    },
                    images: true
                },
                skip: offset,
                take: Number(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.rapportMission.count({ where: whereClause })
        ]);
        res.json({
            success: true,
            data: {
                rapports,
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
        console.error('Erreur lors de la récupération des rapports:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getRapports = getRapports;
const getRapportById = async (req, res) => {
    try {
        const { id } = req.params;
        const rapport = await prisma.rapportMission.findUnique({
            where: { id: Number(id) },
            include: {
                mission: {
                    include: {
                        client: true
                    }
                },
                technicien: {
                    include: {
                        specialite: true,
                        utilisateur: {
                            select: { firstName: true, lastName: true, email: true }
                        }
                    }
                },
                intervention: true,
                images: {
                    orderBy: { ordre: 'asc' }
                }
            }
        });
        if (!rapport) {
            return res.status(404).json({
                success: false,
                message: 'Rapport non trouvé'
            });
        }
        res.json({
            success: true,
            data: rapport
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération du rapport:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getRapportById = getRapportById;
const createRapport = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Données invalides',
                errors: errors.array()
            });
        }
        const { titre, contenu, interventionId, technicienId, missionId, commentaire, images } = req.body;
        const rapport = await prisma.rapportMission.create({
            data: {
                titre,
                contenu,
                interventionId,
                technicienId,
                missionId,
                commentaire,
                images: images ? {
                    create: images.map((img, index) => ({
                        url: img.url,
                        description: img.description,
                        ordre: index + 1
                    }))
                } : undefined
            },
            include: {
                mission: {
                    include: {
                        client: true
                    }
                },
                technicien: {
                    include: {
                        specialite: true
                    }
                },
                images: true
            }
        });
        res.status(201).json({
            success: true,
            data: rapport,
            message: 'Rapport créé avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la création du rapport:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.createRapport = createRapport;
const updateRapport = async (req, res) => {
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
        const existingRapport = await prisma.rapportMission.findUnique({
            where: { id: Number(id) }
        });
        if (!existingRapport) {
            return res.status(404).json({
                success: false,
                message: 'Rapport non trouvé'
            });
        }
        const rapport = await prisma.rapportMission.update({
            where: { id: Number(id) },
            data: req.body,
            include: {
                mission: true,
                technicien: true,
                images: true
            }
        });
        res.json({
            success: true,
            data: rapport,
            message: 'Rapport mis à jour avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour du rapport:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.updateRapport = updateRapport;
const deleteRapport = async (req, res) => {
    try {
        const { id } = req.params;
        const existingRapport = await prisma.rapportMission.findUnique({
            where: { id: Number(id) }
        });
        if (!existingRapport) {
            return res.status(404).json({
                success: false,
                message: 'Rapport non trouvé'
            });
        }
        await prisma.rapportMission.delete({
            where: { id: Number(id) }
        });
        res.json({
            success: true,
            message: 'Rapport supprimé avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la suppression du rapport:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.deleteRapport = deleteRapport;
const uploadRapportImages = async (req, res) => {
    try {
        const { id } = req.params;
        const { images } = req.body;
        const rapport = await prisma.rapportMission.findUnique({
            where: { id: Number(id) }
        });
        if (!rapport) {
            return res.status(404).json({
                success: false,
                message: 'Rapport non trouvé'
            });
        }
        const createdImages = await prisma.rapportImage.createMany({
            data: images.map((img, index) => ({
                rapportId: Number(id),
                url: img.url,
                description: img.description,
                ordre: index + 1
            }))
        });
        res.status(201).json({
            success: true,
            data: createdImages,
            message: 'Images ajoutées avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de l\'upload des images:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.uploadRapportImages = uploadRapportImages;
// Validation middleware
exports.validateRapport = [
    (0, express_validator_1.body)('titre').notEmpty().withMessage('Titre requis'),
    (0, express_validator_1.body)('contenu').notEmpty().withMessage('Contenu requis'),
    (0, express_validator_1.body)('technicienId').isInt().withMessage('Technicien requis'),
    (0, express_validator_1.body)('missionId').notEmpty().withMessage('Mission requise')
];
//# sourceMappingURL=rapportController.js.map