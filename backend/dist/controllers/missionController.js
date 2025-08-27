"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMission = exports.deleteMission = exports.updateMission = exports.createMission = exports.getMissionById = exports.getMissions = void 0;
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const prisma = new client_1.PrismaClient();
const getMissions = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, statut, priorite, clientId } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        let whereClause = {};
        if (search) {
            whereClause.OR = [
                { numIntervention: { contains: search, mode: 'insensitive' } },
                { natureIntervention: { contains: search, mode: 'insensitive' } },
                { objectifDuContrat: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (statut) {
            whereClause.statut = statut;
        }
        if (priorite) {
            whereClause.priorite = priorite;
        }
        if (clientId) {
            whereClause.clientId = Number(clientId);
        }
        const [missions, total] = await Promise.all([
            prisma.mission.findMany({
                where: whereClause,
                include: {
                    client: {
                        select: { name: true, customerNumber: true }
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
            prisma.mission.count({ where: whereClause })
        ]);
        res.json({
            success: true,
            data: {
                missions,
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
        console.error('Erreur lors de la récupération des missions:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getMissions = getMissions;
const getMissionById = async (req, res) => {
    try {
        const { numIntervention } = req.params;
        const mission = await prisma.mission.findUnique({
            where: { numIntervention },
            include: {
                client: true,
                interventions: {
                    include: {
                        techniciens: {
                            include: {
                                technicien: {
                                    include: {
                                        specialite: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { dateHeureDebut: 'desc' }
                },
                rapports: {
                    include: {
                        technicien: {
                            select: { nom: true, prenom: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        if (!mission) {
            return res.status(404).json({
                success: false,
                message: 'Mission non trouvée'
            });
        }
        res.json({
            success: true,
            data: mission
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération de la mission:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getMissionById = getMissionById;
const createMission = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Données invalides',
                errors: errors.array()
            });
        }
        const { natureIntervention, objectifDuContrat, description, priorite, dateSortieFicheIntervention, clientId } = req.body;
        // Vérifier que le client existe
        const client = await prisma.customer.findUnique({
            where: { id: clientId }
        });
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client non trouvé'
            });
        }
        // Générer le numéro d'intervention
        const lastMission = await prisma.mission.findFirst({
            orderBy: { numIntervention: 'desc' }
        });
        let nextNumber = 1;
        if (lastMission) {
            const lastNumber = parseInt(lastMission.numIntervention.split('-')[2]);
            nextNumber = lastNumber + 1;
        }
        const numIntervention = `INT-${new Date().getFullYear()}-${nextNumber.toString().padStart(4, '0')}`;
        const mission = await prisma.mission.create({
            data: {
                numIntervention,
                natureIntervention,
                objectifDuContrat,
                description,
                priorite: priorite || 'normale',
                dateSortieFicheIntervention: new Date(dateSortieFicheIntervention),
                clientId
            },
            include: {
                client: true
            }
        });
        res.status(201).json({
            success: true,
            data: mission,
            message: 'Mission créée avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la création de la mission:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.createMission = createMission;
const updateMission = async (req, res) => {
    try {
        const { numIntervention } = req.params;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Données invalides',
                errors: errors.array()
            });
        }
        const existingMission = await prisma.mission.findUnique({
            where: { numIntervention }
        });
        if (!existingMission) {
            return res.status(404).json({
                success: false,
                message: 'Mission non trouvée'
            });
        }
        const { natureIntervention, objectifDuContrat, description, priorite, statut, dateSortieFicheIntervention } = req.body;
        const mission = await prisma.mission.update({
            where: { numIntervention },
            data: {
                natureIntervention,
                objectifDuContrat,
                description,
                priorite,
                statut,
                dateSortieFicheIntervention: dateSortieFicheIntervention ? new Date(dateSortieFicheIntervention) : undefined
            },
            include: {
                client: true
            }
        });
        res.json({
            success: true,
            data: mission,
            message: 'Mission mise à jour avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour de la mission:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.updateMission = updateMission;
const deleteMission = async (req, res) => {
    try {
        const { numIntervention } = req.params;
        const existingMission = await prisma.mission.findUnique({
            where: { numIntervention },
            include: {
                _count: {
                    select: {
                        interventions: true,
                        rapports: true
                    }
                }
            }
        });
        if (!existingMission) {
            return res.status(404).json({
                success: false,
                message: 'Mission non trouvée'
            });
        }
        // Vérifier s'il y a des données associées
        if (existingMission._count.interventions > 0 || existingMission._count.rapports > 0) {
            return res.status(400).json({
                success: false,
                message: 'Impossible de supprimer une mission ayant des interventions ou rapports associés'
            });
        }
        await prisma.mission.delete({
            where: { numIntervention }
        });
        res.json({
            success: true,
            message: 'Mission supprimée avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la suppression de la mission:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.deleteMission = deleteMission;
// Validation middleware
exports.validateMission = [
    (0, express_validator_1.body)('natureIntervention').notEmpty().withMessage('Nature d\'intervention requise'),
    (0, express_validator_1.body)('objectifDuContrat').notEmpty().withMessage('Objectif du contrat requis'),
    (0, express_validator_1.body)('dateSortieFicheIntervention').isISO8601().withMessage('Date de sortie invalide'),
    (0, express_validator_1.body)('clientId').isInt().withMessage('Client requis'),
    (0, express_validator_1.body)('priorite').optional().isIn(['basse', 'normale', 'haute', 'urgente']).withMessage('Priorité invalide')
];
//# sourceMappingURL=missionController.js.map