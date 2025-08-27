import { Request, Response } from 'express';
/**
 * Reçoit et enregistre un log provenant du client (frontend).
 * @param req - La requête Express. Le corps doit contenir { level, message, metadata }.
 * @param res - La réponse Express.
 */
export declare const createClientLog: (req: Request, res: Response) => void;
//# sourceMappingURL=log.controller.d.ts.map