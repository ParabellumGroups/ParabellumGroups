import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getProducts: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getProductById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createProduct: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateProduct: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteProduct: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getCategories: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateStock: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateProduct: import("express-validator").ValidationChain[];
//# sourceMappingURL=productController.d.ts.map