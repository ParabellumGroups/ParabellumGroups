"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireServiceAccess = exports.requireRole = exports.requirePermission = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const prisma = (0, database_1.getPrismaClient)();
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token d\'accès requis'
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Vérifier que l'utilisateur existe toujours et est actif
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: { service: true }
        });
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non trouvé ou inactif'
            });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Token invalide'
        });
    }
};
exports.authenticateToken = authenticateToken;
const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentification requise'
            });
        }
        if (!req.user.permissions.includes(permission)) {
            return res.status(403).json({
                success: false,
                message: 'Permission insuffisante'
            });
        }
        next();
    };
};
exports.requirePermission = requirePermission;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentification requise'
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Rôle insuffisant'
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
const requireServiceAccess = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentification requise'
        });
    }
    // Les admins et DG ont accès à tous les services
    if (['ADMIN', 'GENERAL_DIRECTOR'].includes(req.user.role)) {
        return next();
    }
    // Pour les autres, vérifier l'accès au service
    const resourceServiceId = req.params.serviceId || req.body.serviceId;
    if (resourceServiceId && req.user.serviceId !== parseInt(resourceServiceId)) {
        return res.status(403).json({
            success: false,
            message: 'Accès au service non autorisé'
        });
    }
    next();
};
exports.requireServiceAccess = requireServiceAccess;
//# sourceMappingURL=auth.js.map