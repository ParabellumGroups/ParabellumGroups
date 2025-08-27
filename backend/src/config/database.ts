import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

// Instance globale Prisma
let prisma: PrismaClient;

// Configuration Prisma avec options optimisées
const createPrismaClient = (): PrismaClient => {
  const prisma = new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'warn' },
    ],
    errorFormat: 'pretty',
  });

  // Logging des requêtes en développement
  if (process.env.NODE_ENV === 'development') {
    prisma.$on('query' as any, (e: any) => {
      logger.debug('Prisma Query:', {
        query: e.query,
        params: e.params,
        duration: `${e.duration}ms`,
      });
    });
  }

  // Logging des erreurs
  prisma.$on('error' as any, (e: any) => {
    logger.error('Prisma Error:', e);
  });

  // Logging des infos
  prisma.$on('info' as any, (e: any) => {
    logger.info('Prisma Info:', e);
  });

  // Logging des warnings
  prisma.$on('warn' as any, (e: any) => {
    logger.warn('Prisma Warning:', e);
  });

  return prisma;
};

// Obtenir l'instance Prisma
export const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    prisma = createPrismaClient();
  }
  return prisma;
};

// Tester la connexion à la base de données
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    const client = getPrismaClient();
    await client.$connect();

    // Test simple de requête
    await client.$queryRaw`SELECT 1`;

    logger.info('✅ Connexion à la base de données établie avec succès');
    return true;
  } catch (error) {
    logger.error('❌ Erreur de connexion à la base de données:', error);
    return false;
  }
};

// Fermer la connexion à la base de données
export const closeDatabaseConnection = async (): Promise<void> => {
  try {
    if (prisma) {
      await prisma.$disconnect();
      logger.info('✅ Connexion à la base de données fermée');
    }
  } catch (error) {
    logger.error('❌ Erreur lors de la fermeture de la connexion:', error);
  }
};

// Middleware pour injecter Prisma dans les requêtes
export const injectPrisma = (req: any, res: any, next: any) => {
  req.prisma = getPrismaClient();
  next();
};

// Vérifier la santé de la base de données
export const checkDatabaseHealth = async (): Promise<{
  status: 'healthy' | 'unhealthy';
  details: any;
}> => {
  try {
    const client = getPrismaClient();
    const start = Date.now();

    // Test de connectivité
    await client.$queryRaw`SELECT 1`;

    // Test de performance
    const duration = Date.now() - start;

    // Statistiques de base
    const userCount = await client.user.count();
    const customerCount = await client.customer.count();

    return {
      status: 'healthy',
      details: {
        responseTime: `${duration}ms`,
        userCount,
        customerCount,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    };
  }
};

export default getPrismaClient;