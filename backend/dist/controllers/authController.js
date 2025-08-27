"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.logout = exports.refreshToken = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const permissions_1 = require("../database/permissions");
const prisma = (0, database_1.getPrismaClient)();
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validation des entrées
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email et mot de passe requis'
            });
        }
        // Rechercher l'utilisateur
        const user = await prisma.user.findUnique({
            where: { email },
            include: { service: true }
        });
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Identifiants invalides'
            });
        }
        // Vérifier le mot de passe
        const isValidPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Identifiants invalides'
            });
        }
        // Obtenir les permissions basées sur le rôle
        const customPermissions = user.preferences ? JSON.parse(user.preferences) : null;
        const permissions = customPermissions?.permissions || permissions_1.ROLE_PERMISSIONS[user.role] || [];
        // Générer les tokens
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            serviceId: user.serviceId,
            permissions
        };
        const token = jsonwebtoken_1.default.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        // Mettre à jour la dernière connexion
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });
        // Préparer la réponse
        const response = {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                serviceId: user.serviceId,
                isActive: user.isActive,
                lastLogin: user.lastLogin,
                avatarUrl: user.avatarUrl,
                service: user.service
            },
            token,
            refreshToken,
            permissions: permissions.map((perm) => ({
                id: 0,
                name: perm,
                resource: perm.split('.')[0],
                action: perm.split('.')[1]
            }))
        };
        res.json({
            success: true,
            data: response
        });
    }
    catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token requis'
            });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
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
        const customPermissions = user.preferences ? JSON.parse(user.preferences) : null;
        const permissions = customPermissions?.permissions || permissions_1.ROLE_PERMISSIONS[user.role] || [];
        const newToken = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            role: user.role,
            serviceId: user.serviceId,
            permissions
        }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            success: true,
            data: { token: newToken }
        });
    }
    catch (error) {
        res.status(403).json({
            success: false,
            message: 'Refresh token invalide'
        });
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res) => {
    // Dans une implémentation complète, on pourrait blacklister le token
    res.json({
        success: true,
        message: 'Déconnexion réussie'
    });
};
exports.logout = logout;
const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            include: { service: true }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }
        const customPermissions = user.preferences ? JSON.parse(user.preferences) : null;
        const permissions = customPermissions?.permissions || permissions_1.ROLE_PERMISSIONS[user.role] || [];
        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    serviceId: user.serviceId,
                    isActive: user.isActive,
                    lastLogin: user.lastLogin,
                    avatarUrl: user.avatarUrl,
                    service: user.service
                },
                permissions: permissions.map((perm) => ({
                    id: 0,
                    name: perm,
                    resource: perm.split('.')[0],
                    action: perm.split('.')[1]
                }))
            }
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getProfile = getProfile;
//# sourceMappingURL=authController.js.map