import { ValidationChain } from 'express-validator';
export declare const commonValidations: {
    id: ValidationChain;
    email: ValidationChain;
    password: ValidationChain;
    phone: ValidationChain;
    date: (field: string) => ValidationChain;
    positiveNumber: (field: string) => ValidationChain;
    requiredString: (field: string) => ValidationChain;
};
export declare const userValidations: {
    create: ValidationChain[];
    update: ValidationChain[];
    updatePassword: ValidationChain[];
};
export declare const customerValidations: {
    create: ValidationChain[];
    update: ValidationChain[];
};
export declare const quoteValidations: {
    create: ValidationChain[];
    approval: ValidationChain[];
};
export declare const invoiceValidations: {
    create: ValidationChain[];
    updateStatus: ValidationChain[];
};
export declare const paymentValidations: {
    create: ValidationChain[];
};
export declare const productValidations: {
    create: ValidationChain[];
    update: ValidationChain[];
};
export declare const employeeValidations: {
    create: ValidationChain[];
    update: ValidationChain[];
};
export declare const contractValidations: {
    create: ValidationChain[];
    update: ValidationChain[];
};
export declare const salaryValidations: {
    create: ValidationChain[];
};
export declare const leaveValidations: {
    create: ValidationChain[];
    approval: ValidationChain[];
};
export declare const queryValidations: {
    pagination: ValidationChain[];
    search: ValidationChain[];
    dateRange: ValidationChain[];
};
declare const _default: {
    commonValidations: {
        id: ValidationChain;
        email: ValidationChain;
        password: ValidationChain;
        phone: ValidationChain;
        date: (field: string) => ValidationChain;
        positiveNumber: (field: string) => ValidationChain;
        requiredString: (field: string) => ValidationChain;
    };
    userValidations: {
        create: ValidationChain[];
        update: ValidationChain[];
        updatePassword: ValidationChain[];
    };
    customerValidations: {
        create: ValidationChain[];
        update: ValidationChain[];
    };
    quoteValidations: {
        create: ValidationChain[];
        approval: ValidationChain[];
    };
    invoiceValidations: {
        create: ValidationChain[];
        updateStatus: ValidationChain[];
    };
    paymentValidations: {
        create: ValidationChain[];
    };
    productValidations: {
        create: ValidationChain[];
        update: ValidationChain[];
    };
    employeeValidations: {
        create: ValidationChain[];
        update: ValidationChain[];
    };
    contractValidations: {
        create: ValidationChain[];
        update: ValidationChain[];
    };
    salaryValidations: {
        create: ValidationChain[];
    };
    leaveValidations: {
        create: ValidationChain[];
        approval: ValidationChain[];
    };
    queryValidations: {
        pagination: ValidationChain[];
        search: ValidationChain[];
        dateRange: ValidationChain[];
    };
};
export default _default;
//# sourceMappingURL=validation.d.ts.map