"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateContract = exports.terminateContract = exports.updateContract = exports.createContract = exports.getContractById = exports.getContracts = void 0;
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const prisma = new client_1.PrismaClient();
const getContracts = async (req, res) => {
    try {
        const { page = 1, limit = 10, employeeId, isActive } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        let whereClause = {};
        if (employeeId) {
            whereClause.employeeId = Number(employeeId);
        }
        if (isActive !== undefined) {
            whereClause.isActive = isActive === 'true';
        }
        // Filtrage par service pour les non-admin
        if (!['ADMIN', 'GENERAL_DIRECTOR'].includes(req.user.role)) {
            whereClause.employee = {
                serviceId: req.user.serviceId
            };
        }
        const [contracts, total] = await Promise.all([
            prisma.contract.findMany({
                where: whereClause,
                include: {
                    employee: {
                        include: {
                            service: true
                        }
                    }
                },
                skip: offset,
                take: Number(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.contract.count({ where: whereClause })
        ]);
        res.json({
            success: true,
            data: {
                contracts,
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
        console.error('Erreur lors de la récupération des contrats:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getContracts = getContracts;
const getContractById = async (req, res) => {
    try {
        const { id } = req.params;
        const contract = await prisma.contract.findUnique({
            where: { id: Number(id) },
            include: {
                employee: {
                    include: {
                        service: true
                    }
                }
            }
        });
        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contrat non trouvé'
            });
        }
        // Vérifier les permissions d'accès
        if (!['ADMIN', 'GENERAL_DIRECTOR'].includes(req.user.role) &&
            contract.employee.serviceId !== req.user.serviceId) {
            return res.status(403).json({
                success: false,
                message: 'Accès non autorisé à ce contrat'
            });
        }
        res.json({
            success: true,
            data: contract
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération du contrat:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getContractById = getContractById;
const createContract = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Données invalides',
                errors: errors.array()
            });
        }
        const { employeeId, contractType, startDate, endDate, baseSalary, workingHours, benefits, terms, isActive = true } = req.body;
        // Vérifier que l'employé existe
        const employee = await prisma.employee.findUnique({
            where: { id: employeeId }
        });
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employé non trouvé'
            });
        }
        // Si c'est un nouveau contrat actif, désactiver les anciens
        if (isActive) {
            await prisma.contract.updateMany({
                where: {
                    employeeId,
                    isActive: true
                },
                data: {
                    isActive: false,
                    endDate: new Date()
                }
            });
        }
        const contract = await prisma.contract.create({
            data: {
                employeeId,
                contractType,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                baseSalary,
                workingHours,
                benefits,
                terms,
                isActive
            },
            include: {
                employee: {
                    include: {
                        service: true
                    }
                }
            }
        });
        res.status(201).json({
            success: true,
            data: contract,
            message: 'Contrat créé avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la création du contrat:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.createContract = createContract;
const updateContract = async (req, res) => {
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
        const existingContract = await prisma.contract.findUnique({
            where: { id: Number(id) },
            include: {
                employee: true
            }
        });
        if (!existingContract) {
            return res.status(404).json({
                success: false,
                message: 'Contrat non trouvé'
            });
        }
        // Vérifier les permissions
        if (!['ADMIN', 'GENERAL_DIRECTOR'].includes(req.user.role) &&
            existingContract.employee.serviceId !== req.user.serviceId) {
            return res.status(403).json({
                success: false,
                message: 'Accès non autorisé à ce contrat'
            });
        }
        const { contractType, startDate, endDate, baseSalary, workingHours, benefits, terms, isActive } = req.body;
        const contract = await prisma.contract.update({
            where: { id: Number(id) },
            data: {
                contractType,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : null,
                baseSalary,
                workingHours,
                benefits,
                terms,
                isActive
            },
            include: {
                employee: {
                    include: {
                        service: true
                    }
                }
            }
        });
        res.json({
            success: true,
            data: contract,
            message: 'Contrat mis à jour avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour du contrat:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.updateContract = updateContract;
const terminateContract = async (req, res) => {
    try {
        const { id } = req.params;
        const { endDate, reason } = req.body;
        const contract = await prisma.contract.findUnique({
            where: { id: Number(id) },
            include: {
                employee: true
            }
        });
        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contrat non trouvé'
            });
        }
        const updatedContract = await prisma.contract.update({
            where: { id: Number(id) },
            data: {
                endDate: new Date(endDate),
                isActive: false,
                terms: contract.terms ? `${contract.terms}\n\nRésiliation: ${reason}` : `Résiliation: ${reason}`
            },
            include: {
                employee: {
                    include: {
                        service: true
                    }
                }
            }
        });
        res.json({
            success: true,
            data: updatedContract,
            message: 'Contrat résilié avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la résiliation du contrat:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.terminateContract = terminateContract;
// Validation middleware
exports.validateContract = [
    (0, express_validator_1.body)('employeeId').isInt().withMessage('ID employé requis'),
    (0, express_validator_1.body)('contractType').isIn(['CDI', 'CDD', 'STAGE', 'FREELANCE']).withMessage('Type de contrat invalide'),
    (0, express_validator_1.body)('startDate').isISO8601().withMessage('Date de début invalide'),
    (0, express_validator_1.body)('baseSalary').isFloat({ min: 0 }).withMessage('Salaire de base invalide'),
    (0, express_validator_1.body)('workingHours').isFloat({ min: 0 }).withMessage('Heures de travail invalides')
];
//# sourceMappingURL=contractController.js.map