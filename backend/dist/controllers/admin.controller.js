"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogFileContent = exports.listLogFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const LOG_DIR = process.env.LOG_DIR || path_1.default.join(process.cwd(), 'logs');
//Changer le type de retour de la fonction
const listLogFiles = (_req, res) => {
    fs_1.default.readdir(LOG_DIR, (err, files) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Impossible de lire le dossier des logs." });
        }
        const logFiles = files.filter(file => file.endsWith('.log')).sort().reverse();
        return res.json({ success: true, data: logFiles });
    });
};
exports.listLogFiles = listLogFiles;
//Changer le type de retour de la fonction
const getLogFileContent = (req, res) => {
    const { filename } = req.params;
    if (!filename || filename.includes('..')) {
        return res.status(400).json({ success: false, message: "Nom de fichier invalide." });
    }
    const filePath = path_1.default.join(LOG_DIR, filename);
    fs_1.default.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).json({ success: false, message: "Fichier log introuvable." });
        }
        try {
            const logs = data.split('\n').filter(line => line).map(line => JSON.parse(line));
            return res.json({ success: true, data: logs });
        }
        catch (parseError) {
            return res.status(500).json({ success: false, message: "Erreur lors de l'analyse du fichier de log." });
        }
    });
};
exports.getLogFileContent = getLogFileContent;
//# sourceMappingURL=admin.controller.js.map