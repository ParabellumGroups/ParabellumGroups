import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest, AuditLogData } from '../types';

const prisma = new PrismaClient();

export const auditLog = (action: string, resource: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log seulement si la requête est réussie
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        const auditData: AuditLogData = {
          userId: req.user.userId,
          action,
          resource,
          resourceId: req.params.id ? parseInt(req.params.id) : undefined,
          details: {
            method: req.method,
            url: req.originalUrl,
            body: req.method !== 'GET' ? req.body : undefined,
            query: req.query
          },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        };

        // Log asynchrone pour ne pas bloquer la réponse
        prisma.auditLog.create({
          data: {
            userId: auditData.userId,
            action: `${auditData.action} ${auditData.resource}`,
            details: JSON.stringify(auditData.details)
          }
        }).catch(console.error);
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };
};