import { PrismaClient } from '@prisma/client';
export declare const getPrismaClient: () => PrismaClient;
export declare const testDatabaseConnection: () => Promise<boolean>;
export declare const closeDatabaseConnection: () => Promise<void>;
export declare const injectPrisma: (req: any, res: any, next: any) => void;
export declare const checkDatabaseHealth: () => Promise<{
    status: "healthy" | "unhealthy";
    details: any;
}>;
export default getPrismaClient;
//# sourceMappingURL=database.d.ts.map