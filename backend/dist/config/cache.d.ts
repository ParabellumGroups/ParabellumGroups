declare class CacheService {
    private client;
    private isConnected;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isAvailable(): boolean;
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttlSeconds?: number): Promise<boolean>;
    delete(key: string): Promise<boolean>;
    deletePattern(pattern: string): Promise<number>;
    exists(key: string): Promise<boolean>;
    expire(key: string, ttlSeconds: number): Promise<boolean>;
    getTtl(key: string): Promise<number>;
    increment(key: string, amount?: number): Promise<number | null>;
    getStats(): Promise<any>;
    flush(): Promise<boolean>;
}
export declare const cacheService: CacheService;
export declare const CACHE_KEYS: {
    USER_PROFILE: (userId: number) => string;
    USER_PERMISSIONS: (userId: number) => string;
    CUSTOMER_LIST: (serviceId?: number, page?: number) => string;
    CUSTOMER_DETAIL: (customerId: number) => string;
    QUOTE_LIST: (serviceId?: number, status?: string) => string;
    QUOTE_DETAIL: (quoteId: number) => string;
    INVOICE_LIST: (serviceId?: number, status?: string) => string;
    INVOICE_DETAIL: (invoiceId: number) => string;
    DASHBOARD_STATS: (serviceId?: number) => string;
    SALES_REPORT: (period: string, serviceId?: number) => string;
    SERVICES_LIST: string;
    ROLES_LIST: string;
    PERMISSIONS_LIST: string;
};
export declare const CACHE_TTL: {
    SHORT: number;
    MEDIUM: number;
    LONG: number;
    VERY_LONG: number;
};
export declare const cacheMiddleware: (ttl?: number) => (req: any, res: any, next: any) => Promise<any>;
export default cacheService;
//# sourceMappingURL=cache.d.ts.map