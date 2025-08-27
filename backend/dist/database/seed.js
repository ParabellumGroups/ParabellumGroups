"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Début du seeding...');
    // Nettoyer la base de données dans le bon ordre pour respecter les contraintes de clé étrangère
    console.log('🧹 Nettoyage de la base de données...');
    // D'abord les tables avec des clés étrangères vers d'autres tables
    await prisma.paymentAllocation.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.reminder.deleteMany();
    await prisma.invoiceItem.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.quoteItem.deleteMany();
    await prisma.quoteApproval.deleteMany();
    await prisma.quote.deleteMany();
    await prisma.recurringInvoiceItem.deleteMany();
    await prisma.recurringInvoice.deleteMany();
    await prisma.customerAddress.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.productPrice.deleteMany();
    await prisma.product.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.accountingEntry.deleteMany();
    await prisma.cashFlow.deleteMany();
    await prisma.auditLog.deleteMany();
    // Ensuite les utilisateurs
    await prisma.user.deleteMany();
    // Enfin les services
    await prisma.service.deleteMany();
    // Créer les services
    console.log('🏢 Création des services...');
    const serviceCommercial = await prisma.service.create({
        data: {
            name: 'Service Commercial',
            description: 'Service dédié à la vente et relation client'
        }
    });
    const serviceProgitek = await prisma.service.create({
        data: {
            name: 'Service Progitek',
            description: 'Service dédié au développement informatique'
        }
    });
    const serviceComptabilite = await prisma.service.create({
        data: {
            name: 'Service Comptabilité',
            description: 'Service dédié à la gestion financière'
        }
    });
    // Hasher le mot de passe commun
    const hashedPassword = await bcrypt.hash('password123', 12);
    // Créer les utilisateurs
    console.log('👥 Création des utilisateurs...');
    // Directeur Général
    const dg = await prisma.user.create({
        data: {
            email: 'dg@parabellum.com',
            passwordHash: hashedPassword,
            firstName: 'Koffi',
            lastName: 'Kouassi',
            role: client_1.UserRole.GENERAL_DIRECTOR,
            isActive: true,
            avatarUrl: null,
            preferences: null
        }
    });
    // Administrateur
    const admin = await prisma.user.create({
        data: {
            email: 'admin@parabellum.com',
            passwordHash: hashedPassword,
            firstName: 'Ama',
            lastName: 'Yao',
            role: client_1.UserRole.ADMIN,
            isActive: true,
            avatarUrl: null,
            preferences: null
        }
    });
    // Responsable Commercial
    const respCommercial = await prisma.user.create({
        data: {
            email: 'resp.commercial@parabellum.com',
            passwordHash: hashedPassword,
            firstName: 'Fatou',
            lastName: 'Diabaté',
            role: client_1.UserRole.SERVICE_MANAGER,
            serviceId: serviceCommercial.id,
            isActive: true,
            avatarUrl: null,
            preferences: null
        }
    });
    // Commercial
    const commercial = await prisma.user.create({
        data: {
            email: 'commercial@parabellum.com',
            passwordHash: hashedPassword,
            firstName: 'Yao',
            lastName: 'Konan',
            role: client_1.UserRole.EMPLOYEE,
            serviceId: serviceCommercial.id,
            isActive: true,
            avatarUrl: null,
            preferences: null
        }
    });
    // Responsable Progitek
    const respProgitek = await prisma.user.create({
        data: {
            email: 'resp.progitek@parabellum.com',
            passwordHash: hashedPassword,
            firstName: 'Eric',
            lastName: 'Kouadio',
            role: client_1.UserRole.SERVICE_MANAGER,
            serviceId: serviceProgitek.id,
            isActive: true,
            avatarUrl: null,
            preferences: null
        }
    });
    // Développeur Progitek
    const dev = await prisma.user.create({
        data: {
            email: 'dev@parabellum.com',
            passwordHash: hashedPassword,
            firstName: 'Sandrine',
            lastName: 'Gnahoré',
            role: client_1.UserRole.EMPLOYEE,
            serviceId: serviceProgitek.id,
            isActive: true,
            avatarUrl: null,
            preferences: null
        }
    });
    // Comptable
    const comptable = await prisma.user.create({
        data: {
            email: 'comptable@parabellum.com',
            passwordHash: hashedPassword,
            firstName: 'Mariam',
            lastName: 'Cissé',
            role: client_1.UserRole.ACCOUNTANT,
            serviceId: serviceComptabilite.id,
            isActive: true,
            avatarUrl: null,
            preferences: null
        }
    });
    // Créer quelques clients de démonstration
    console.log('🤝 Création des clients...');
    // Client Entreprise
    const clientEntreprise = await prisma.customer.create({
        data: {
            customerNumber: 'CLI-001',
            type: 'COMPANY',
            name: 'SIFCA Group',
            legalName: 'Société Ivoirienne de Fabrication et de Commercialisation Agricole',
            siret: 'CI-123456789',
            vatNumber: 'TVACI123456789',
            email: 'contact@sifca.ci',
            phone: '+225 20 30 40 50',
            mobile: '+225 07 08 09 10 11',
            website: 'https://www.sifca.ci',
            paymentTerms: 30,
            paymentMethod: 'TRANSFER',
            creditLimit: 10000000,
            discountRate: 5,
            category: 'Grande Entreprise',
            tags: JSON.stringify(['agroalimentaire', 'exportateur', 'fidèle']),
            notes: 'Client important du secteur agroalimentaire',
            isActive: true,
            serviceId: serviceCommercial.id,
            createdBy: commercial.id,
            addresses: {
                create: [
                    {
                        type: 'BILLING',
                        name: 'Siège Social',
                        addressLine1: 'Rue du Commerce',
                        addressLine2: 'Plateau',
                        postalCode: '01 BP 1234',
                        city: 'Abidjan',
                        country: 'Côte d\'Ivoire',
                        isDefault: true
                    }
                ]
            }
        }
    });
    // Client PME
    const clientPME = await prisma.customer.create({
        data: {
            customerNumber: 'CLI-002',
            type: 'COMPANY',
            name: 'Progitek Solutions',
            legalName: 'Progitek Solutions SARL',
            siret: 'CI-987654321',
            vatNumber: 'TVACI987654321',
            email: 'contact@progitek.ci',
            phone: '+225 21 31 41 51',
            mobile: '+225 05 06 07 08 09',
            website: 'https://www.progitek.ci',
            paymentTerms: 45,
            paymentMethod: 'TRANSFER',
            creditLimit: 5000000,
            discountRate: 3,
            category: 'PME',
            tags: JSON.stringify(['technologie', 'informatique', 'startup']),
            notes: 'Client dans le secteur des technologies',
            isActive: true,
            serviceId: serviceCommercial.id,
            createdBy: commercial.id,
            addresses: {
                create: [
                    {
                        type: 'BILLING',
                        name: 'Bureau Principal',
                        addressLine1: 'Avenue Dr Jamot',
                        addressLine2: 'Cocody',
                        postalCode: '08 BP 5678',
                        city: 'Abidjan',
                        country: 'Côte d\'Ivoire',
                        isDefault: true
                    }
                ]
            }
        }
    });
    // Client Particulier
    const clientParticulier = await prisma.customer.create({
        data: {
            customerNumber: 'CLI-003',
            type: 'INDIVIDUAL',
            name: 'M. Konan Kouadio',
            email: 'konan.kouadio@email.ci',
            phone: '+225 22 33 44 55',
            mobile: '+225 01 02 03 04 05',
            paymentTerms: 15,
            paymentMethod: 'CARD',
            creditLimit: 1000000,
            discountRate: 2,
            category: 'Particulier',
            tags: JSON.stringify(['profession libérale', 'consultant']),
            notes: 'Consultant indépendant',
            isActive: true,
            serviceId: serviceCommercial.id,
            createdBy: commercial.id,
            addresses: {
                create: [
                    {
                        type: 'BILLING',
                        name: 'Résidence',
                        addressLine1: 'Rue des Jardins',
                        addressLine2: '2 Plateaux',
                        postalCode: '06 BP 9012',
                        city: 'Abidjan',
                        country: 'Côte d\'Ivoire',
                        isDefault: true
                    }
                ]
            }
        }
    });
    // Créer quelques produits/services
    console.log('📦 Création des produits...');
    const produits = await prisma.product.createMany({
        data: [
            {
                sku: 'PROD-001',
                name: 'Développement Site Web',
                description: 'Création de site web responsive moderne',
                type: 'SERVICE',
                category: 'Développement Web',
                unit: 'projet',
                priceHt: 2500000,
                vatRate: 18.00,
                costPrice: 1500000,
                isActive: true
            },
            {
                sku: 'PROD-002',
                name: 'Application Mobile',
                description: 'Développement d\'application mobile iOS/Android',
                type: 'SERVICE',
                category: 'Développement Mobile',
                unit: 'projet',
                priceHt: 5000000,
                vatRate: 18.00,
                costPrice: 3000000,
                isActive: true
            },
            {
                sku: 'PROD-003',
                name: 'Maintenance Mensuelle',
                description: 'Forfait de maintenance et support technique',
                type: 'SERVICE',
                category: 'Maintenance',
                unit: 'mois',
                priceHt: 500000,
                vatRate: 18.00,
                costPrice: 250000,
                isActive: true
            },
            {
                sku: 'PROD-004',
                name: 'Formation Digital',
                description: 'Session de formation aux outils digitaux',
                type: 'SERVICE',
                category: 'Formation',
                unit: 'jour',
                priceHt: 300000,
                vatRate: 18.00,
                costPrice: 150000,
                isActive: true
            }
        ]
    });
    console.log('✅ Paramètres système créés');
    console.log('🎉 Seeding terminé avec succès !');
    console.log('\n📋 Comptes de test créés :');
    console.log('👑 Directeur Général: dg@parabellum.com / password123');
    console.log('🔧 Administrateur: admin@parabellum.com / password123');
    console.log('👔 Resp. Commercial: resp.commercial@parabellum.com / password123');
    console.log('💼 Commercial: commercial@parabellum.com / password123');
    console.log('🚀 Resp. Progitek: resp.progitek@parabellum.com / password123');
    console.log('💻 Développeur: dev@parabellum.com / password123');
    console.log('📊 Comptable: comptable@parabellum.com / password123');
    console.log('\n🤝 Clients de démonstration créés :');
    console.log('🏢 SIFCA Group (Grande Entreprise)');
    console.log('💻 Progitek Solutions (PME Technologie)');
    console.log('👤 M. Konan Kouadio (Particulier)');
    // Créer les spécialités techniques
    console.log('🔧 Création des spécialités techniques...');
    const specialites = await prisma.specialite.createMany({
        data: [
            {
                libelle: 'Électricité',
                description: 'Installation et maintenance électrique'
            },
            {
                libelle: 'Plomberie',
                description: 'Installation et réparation de plomberie'
            },
            {
                libelle: 'Climatisation',
                description: 'Installation et maintenance de systèmes de climatisation'
            },
            {
                libelle: 'Informatique',
                description: 'Support technique informatique et réseaux'
            }
        ]
    });
    // Créer quelques techniciens
    console.log('👷 Création des techniciens...');
    const techniciens = await prisma.technicien.createMany({
        data: [
            {
                nom: 'Kouassi',
                prenom: 'Jean',
                contact: '+225 01 02 03 04 05',
                specialiteId: 1 // Électricité
            },
            {
                nom: 'Diabaté',
                prenom: 'Marie',
                contact: '+225 06 07 08 09 10',
                specialiteId: 2 // Plomberie
            },
            {
                nom: 'Konan',
                prenom: 'Paul',
                contact: '+225 11 12 13 14 15',
                specialiteId: 3 // Climatisation
            }
        ]
    });
    // Créer du matériel de base
    console.log('📦 Création du matériel...');
    const materiels = await prisma.materiel.createMany({
        data: [
            {
                reference: 'MAT-001',
                designation: 'Perceuse électrique',
                description: 'Perceuse électrique 18V avec batterie',
                quantiteTotale: 5,
                quantiteDisponible: 3,
                seuilAlerte: 2,
                emplacement: 'Magasin A',
                categorie: 'Outillage',
                prixUnitaire: 85000
            },
            {
                reference: 'MAT-002',
                designation: 'Multimètre digital',
                description: 'Multimètre digital professionnel',
                quantiteTotale: 10,
                quantiteDisponible: 8,
                seuilAlerte: 3,
                emplacement: 'Magasin A',
                categorie: 'Électrique',
                prixUnitaire: 45000
            },
            {
                reference: 'MAT-003',
                designation: 'Clé à molette',
                description: 'Clé à molette réglable 250mm',
                quantiteTotale: 15,
                quantiteDisponible: 2,
                seuilAlerte: 5,
                emplacement: 'Atelier B',
                categorie: 'Plomberie',
                prixUnitaire: 12000
            }
        ]
    });
    console.log('🔧 Spécialités et techniciens créés');
    console.log('📦 Matériel de base ajouté');
}
main()
    .catch((e) => {
    console.error('❌ Erreur lors du seeding:');
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map