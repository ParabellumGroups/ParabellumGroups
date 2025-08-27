export declare const generateNumber: {
    customer: (prisma: any) => Promise<string>;
    quote: (prisma: any) => Promise<string>;
    invoice: (prisma: any) => Promise<string>;
    payment: (prisma: any) => Promise<string>;
    employee: (prisma: any) => Promise<string>;
};
export declare const calculations: {
    calculateLineTotal: (quantity: number, unitPrice: number, discountRate?: number) => number;
    calculateVat: (amountHt: number, vatRate: number) => number;
    calculateTotalTtc: (amountHt: number, vatAmount: number) => number;
    calculateDocumentTotals: (items: any[]) => {
        subtotalHt: number;
        totalVat: number;
        totalTtc: number;
    };
    calculateDaysBetween: (startDate: Date, endDate: Date) => number;
    calculateNetSalary: (baseSalary: number, overtime?: number, bonuses?: number, allowances?: number, socialContributions?: number, taxes?: number, otherDeductions?: number) => {
        grossSalary: number;
        totalDeductions: number;
        netSalary: number;
    };
};
export declare const formatters: {
    currency: (amount: number) => string;
    date: (date: Date, format?: "short" | "long" | "iso") => string;
    percentage: (value: number) => string;
    phone: (phone: string) => string;
};
export declare const businessValidations: {
    isFutureDate: (date: Date) => boolean;
    isQuoteValid: (validUntil: Date) => boolean;
    isInvoiceOverdue: (dueDate: Date, status: string) => boolean;
    canTakeLeave: (hireDate: Date, leaveStartDate: Date) => boolean;
};
export declare const errorHandlers: {
    createError: (message: string, statusCode?: number, details?: any) => any;
    handlePrismaError: (error: any) => any;
};
export declare const permissionHelpers: {
    hasPermission: (userPermissions: string[], requiredPermission: string) => boolean;
    hasRole: (userRole: string, allowedRoles: string[]) => boolean;
    hasServiceAccess: (userServiceId: number | null, resourceServiceId: number | null, userRole: string) => boolean;
};
export declare const paginationHelpers: {
    calculateOffset: (page: number, limit: number) => number;
    createPaginationInfo: (page: number, limit: number, total: number) => {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
};
declare const _default: {
    generateNumber: {
        customer: (prisma: any) => Promise<string>;
        quote: (prisma: any) => Promise<string>;
        invoice: (prisma: any) => Promise<string>;
        payment: (prisma: any) => Promise<string>;
        employee: (prisma: any) => Promise<string>;
    };
    calculations: {
        calculateLineTotal: (quantity: number, unitPrice: number, discountRate?: number) => number;
        calculateVat: (amountHt: number, vatRate: number) => number;
        calculateTotalTtc: (amountHt: number, vatAmount: number) => number;
        calculateDocumentTotals: (items: any[]) => {
            subtotalHt: number;
            totalVat: number;
            totalTtc: number;
        };
        calculateDaysBetween: (startDate: Date, endDate: Date) => number;
        calculateNetSalary: (baseSalary: number, overtime?: number, bonuses?: number, allowances?: number, socialContributions?: number, taxes?: number, otherDeductions?: number) => {
            grossSalary: number;
            totalDeductions: number;
            netSalary: number;
        };
    };
    formatters: {
        currency: (amount: number) => string;
        date: (date: Date, format?: "short" | "long" | "iso") => string;
        percentage: (value: number) => string;
        phone: (phone: string) => string;
    };
    businessValidations: {
        isFutureDate: (date: Date) => boolean;
        isQuoteValid: (validUntil: Date) => boolean;
        isInvoiceOverdue: (dueDate: Date, status: string) => boolean;
        canTakeLeave: (hireDate: Date, leaveStartDate: Date) => boolean;
    };
    errorHandlers: {
        createError: (message: string, statusCode?: number, details?: any) => any;
        handlePrismaError: (error: any) => any;
    };
    permissionHelpers: {
        hasPermission: (userPermissions: string[], requiredPermission: string) => boolean;
        hasRole: (userRole: string, allowedRoles: string[]) => boolean;
        hasServiceAccess: (userServiceId: number | null, resourceServiceId: number | null, userRole: string) => boolean;
    };
    paginationHelpers: {
        calculateOffset: (page: number, limit: number) => number;
        createPaginationInfo: (page: number, limit: number, total: number) => {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    };
};
export default _default;
//# sourceMappingURL=helpers.d.ts.map