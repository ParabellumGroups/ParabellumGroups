import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import { logger } from './logger';

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Parabellum Groups API',
      version: '1.0.0',
      description: 'API complète pour la gestion d\'entreprise Parabellum Groups',
      contact: {
        name: 'Équipe Développement',
        email: 'dev@parabellum.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3001/api/v1',
        description: 'Serveur de développement'
      },
      {
        url: 'https://api.parabellum.com/v1',
        description: 'Serveur de production'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT pour l\'authentification'
        }
      },
      schemas: {
        // Schémas de base
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indique si la requête a réussi'
            },
            data: {
              type: 'object',
              description: 'Données de la réponse'
            },
            message: {
              type: 'string',
              description: 'Message descriptif'
            },
            errors: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Liste des erreurs'
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {}
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' }
              }
            }
          }
        },
        // Schémas des entités
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: {
              type: 'string',
              enum: ['ADMIN', 'GENERAL_DIRECTOR', 'SERVICE_MANAGER', 'EMPLOYEE', 'ACCOUNTANT']
            },
            serviceId: { type: 'integer', nullable: true },
            isActive: { type: 'boolean' },
            lastLogin: { type: 'string', format: 'date-time', nullable: true },
            avatarUrl: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Customer: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            customerNumber: { type: 'string' },
            type: {
              type: 'string',
              enum: ['INDIVIDUAL', 'COMPANY']
            },
            name: { type: 'string' },
            legalName: { type: 'string', nullable: true },
            siret: { type: 'string', nullable: true },
            vatNumber: { type: 'string', nullable: true },
            email: { type: 'string', format: 'email', nullable: true },
            phone: { type: 'string', nullable: true },
            mobile: { type: 'string', nullable: true },
            website: { type: 'string', nullable: true },
            paymentTerms: { type: 'integer' },
            paymentMethod: {
              type: 'string',
              enum: ['TRANSFER', 'CHECK', 'CARD', 'CASH', 'OTHER']
            },
            creditLimit: { type: 'number' },
            discountRate: { type: 'number' },
            category: { type: 'string', nullable: true },
            tags: { type: 'string', nullable: true },
            notes: { type: 'string', nullable: true },
            isActive: { type: 'boolean' },
            serviceId: { type: 'integer', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Quote: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            quoteNumber: { type: 'string' },
            customerId: { type: 'integer' },
            status: {
              type: 'string',
              enum: [
                'DRAFT',
                'SUBMITTED_FOR_SERVICE_APPROVAL',
                'APPROVED_BY_SERVICE_MANAGER',
                'REJECTED_BY_SERVICE_MANAGER',
                'SUBMITTED_FOR_DG_APPROVAL',
                'APPROVED_BY_DG',
                'REJECTED_BY_DG',
                'ACCEPTED_BY_CLIENT',
                'REJECTED_BY_CLIENT',
                'EXPIRED'
              ]
            },
            quoteDate: { type: 'string', format: 'date-time' },
            validUntil: { type: 'string', format: 'date-time' },
            subtotalHt: { type: 'number' },
            totalVat: { type: 'number' },
            totalTtc: { type: 'number' },
            terms: { type: 'string', nullable: true },
            notes: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Invoice: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            invoiceNumber: { type: 'string' },
            customerId: { type: 'integer' },
            status: {
              type: 'string',
              enum: ['DRAFT', 'SENT', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED']
            },
            invoiceDate: { type: 'string', format: 'date-time' },
            dueDate: { type: 'string', format: 'date-time' },
            subtotalHt: { type: 'number' },
            totalVat: { type: 'number' },
            totalTtc: { type: 'number' },
            paidAmount: { type: 'number' },
            balanceDue: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Employee: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            employeeNumber: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email', nullable: true },
            phone: { type: 'string', nullable: true },
            position: { type: 'string' },
            department: { type: 'string', nullable: true },
            hireDate: { type: 'string', format: 'date-time' },
            isActive: { type: 'boolean' },
            serviceId: { type: 'integer', nullable: true }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts'
  ]
};

// Générer la spécification Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Configuration de l'interface Swagger UI
const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #1f2937; }
    .swagger-ui .scheme-container { background: #f9fafb; padding: 20px; border-radius: 8px; }
  `,
  customSiteTitle: 'Parabellum Groups API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true
  }
};

// Fonction pour configurer Swagger
export const setupSwagger = (app: Application): void => {
  try {
    // Route pour la spécification JSON
    app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });

    // Interface Swagger UI
    app.use('/api-docs', swaggerUi.serve);
    app.get('/api-docs', swaggerUi.setup(swaggerSpec, swaggerUiOptions));

    // Route de redirection pour faciliter l'accès
    app.get('/docs', (req, res) => {
      res.redirect('/api-docs');
    });

    logger.info('📚 Documentation Swagger configurée sur /api-docs');
  } catch (error) {
    logger.error('❌ Erreur lors de la configuration de Swagger:', error);
  }
};

// Fonction pour ajouter des annotations Swagger aux routes
export const swaggerTags = {
  auth: 'Authentification',
  users: 'Gestion des Utilisateurs',
  customers: 'Gestion des Clients',
  quotes: 'Gestion des Devis',
  invoices: 'Gestion des Factures',
  payments: 'Gestion des Paiements',
  products: 'Gestion des Produits',
  employees: 'Gestion des Employés',
  contracts: 'Gestion des Contrats',
  salaries: 'Gestion des Salaires',
  leaves: 'Gestion des Congés',
  reports: 'Rapports et Analyses',
  admin: 'Administration'
};

export default swaggerSpec;