"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = exports.deleteNotification = exports.markAllAsRead = exports.markAsRead = exports.getNotifications = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, unreadOnly } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        let whereClause = {
            userId: req.user.userId
        };
        if (unreadOnly === 'true') {
            whereClause.readAt = null;
        }
        const [notifications, total, unreadCount] = await Promise.all([
            prisma.notification.findMany({
                where: whereClause,
                skip: offset,
                take: Number(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.notification.count({ where: whereClause }),
            prisma.notification.count({
                where: {
                    userId: req.user.userId,
                    readAt: null
                }
            })
        ]);
        res.json({
            success: true,
            data: {
                notifications,
                unreadCount,
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
        console.error('Erreur lors de la récupération des notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await prisma.notification.findUnique({
            where: { id: Number(id) }
        });
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification non trouvée'
            });
        }
        if (notification.userId !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Accès non autorisé'
            });
        }
        const updatedNotification = await prisma.notification.update({
            where: { id: Number(id) },
            data: {
                readAt: new Date()
            }
        });
        res.json({
            success: true,
            data: updatedNotification,
            message: 'Notification marquée comme lue'
        });
    }
    catch (error) {
        console.error('Erreur lors du marquage de la notification:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res) => {
    try {
        await prisma.notification.updateMany({
            where: {
                userId: req.user.userId,
                readAt: null
            },
            data: {
                readAt: new Date()
            }
        });
        res.json({
            success: true,
            message: 'Toutes les notifications marquées comme lues'
        });
    }
    catch (error) {
        console.error('Erreur lors du marquage des notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.markAllAsRead = markAllAsRead;
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await prisma.notification.findUnique({
            where: { id: Number(id) }
        });
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification non trouvée'
            });
        }
        if (notification.userId !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Accès non autorisé'
            });
        }
        await prisma.notification.delete({
            where: { id: Number(id) }
        });
        res.json({
            success: true,
            message: 'Notification supprimée'
        });
    }
    catch (error) {
        console.error('Erreur lors de la suppression de la notification:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.deleteNotification = deleteNotification;
const createNotification = async (req, res) => {
    try {
        const { type, message, data, userId } = req.body;
        const notification = await prisma.notification.create({
            data: {
                type,
                message,
                data: data ? JSON.stringify(data) : null,
                userId: userId || req.user.userId
            }
        });
        res.status(201).json({
            success: true,
            data: notification,
            message: 'Notification créée'
        });
    }
    catch (error) {
        console.error('Erreur lors de la création de la notification:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.createNotification = createNotification;
//# sourceMappingURL=notificationController.js.map