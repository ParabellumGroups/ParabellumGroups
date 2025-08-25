# 📋 FICHE TECHNIQUE - PARABELLUM GROUPS

## 🏢 Présentation du Projet

**Parabellum Groups** est une application complète de gestion d'entreprise développée pour optimiser les processus commerciaux, financiers et RH. L'application offre un système de permissions granulaires et un workflow d'approbation sophistiqué.

### 🎯 Objectifs
- Centraliser la gestion commerciale (clients, devis, factures)
- Automatiser les processus d'approbation
- Optimiser la gestion des ressources humaines
- Fournir des rapports et analyses en temps réel
- Assurer la conformité réglementaire (Côte d'Ivoire)

## 🏗️ Architecture Technique

### Frontend (React)
```
src/
├── components/          # Composants réutilisables
│   ├── Layout/         # Layout principal et navigation
│   ├── Modals/         # Modales de création/édition
│   ├── Charts/         # Graphiques et visualisations
│   ├── Dashboard/      # Composants du tableau de bord
│   └── PrintComponents/ # Composants d'impression
├── pages/              # Pages de l'application
│   ├── Admin/          # Administration système
│   ├── Commercial/     # Gestion commerciale
│   ├── Customers/      # Gestion clients
│   ├── HR/            # Ressources humaines
│   ├── Invoices/      # Facturation
│   └── Reports/       # Rapports et analyses
├── hooks/             # Hooks React personnalisés
├── services/          # Services API
├── types/             # Types TypeScript
└── utils/             # Utilitaires
```

### Backend (Node.js + Express)
```
Back-end/src/
├── config/            # Configuration (DB, cache, logs)
├── controllers/       # Contrôleurs métier
├── middleware/        # Middlewares (auth, audit, rate limiting)
├── routes/           # Définition des routes API
├── database/         # Schéma Prisma et seeds
├── utils/            # Utilitaires backend
└── types/            # Types backend
```

## 🛠️ Stack Technologique

### Frontend
| Technologie | Version | Usage |
|-------------|---------|-------|
| React | 18.3.1 | Framework UI |
| TypeScript | 5.5.3 | Typage statique |
| Vite | 5.4.2 | Build tool |
| Tailwind CSS | 3.4.1 | Framework CSS |
| React Router | 6.20.1 | Routage |
| React Hook Form | 7.48.2 | Gestion formulaires |
| TanStack Query | 5.8.4 | Gestion état serveur |
| Zod | 3.22.4 | Validation schémas |
| Recharts | 3.1.2 | Graphiques |
| Lucide React | 0.344.0 | Icônes |

### Backend
| Technologie | Version | Usage |
|-------------|---------|-------|
| Node.js | 18+ | Runtime JavaScript |
| Express | 4.18.2 | Framework web |
| TypeScript | 5.3.2 | Typage statique |
| Prisma | 5.7.0 | ORM base de données |
| PostgreSQL | 14+ | Base de données |
| JWT | 9.0.2 | Authentification |
| bcryptjs | 2.4.3 | Hachage mots de passe |
| Winston | 3.17.0 | Logging |
| Redis | 5.7.0 | Cache (optionnel) |

## 🔐 Système d'Authentification

### JWT Tokens
- **Access Token** : 1 heure (opérations courantes)
- **Refresh Token** : 7 jours (renouvellement automatique)
- **Stockage** : localStorage côté client

### Rôles et Permissions
| Rôle | Description | Permissions Clés |
|------|-------------|------------------|
| **ADMIN** | Administrateur système | Accès complet |
| **GENERAL_DIRECTOR** | Directeur Général | Validation finale, rapports complets |
| **SERVICE_MANAGER** | Responsable de Service | Gestion de son service, validation devis |
| **EMPLOYEE** | Employé | Création devis, gestion clients |
| **ACCOUNTANT** | Comptable | Gestion financière, factures, paiements |

### Permissions Granulaires
- **Format** : `resource.action` (ex: `quotes.create`)
- **Contrôle** : Middleware côté API + composants côté client
- **Audit** : Traçabilité complète des actions

## 📊 Modules Fonctionnels

### 1. Gestion Commerciale
- **Clients** : Particuliers et entreprises
- **Prospects** : Workflow de prospection en 5 étapes
- **Devis** : Création avec workflow d'approbation
- **Pipeline CRM** : Suivi des opportunités

### 2. Facturation
- **Factures** : Création manuelle ou depuis devis
- **Paiements** : Enregistrement et allocation
- **Relances** : Système automatisé
- **Factures récurrentes** : Abonnements

### 3. Ressources Humaines
- **Employés** : Gestion complète des dossiers
- **Contrats** : CDI, CDD, stages, freelance
- **Salaires** : Bulletins conformes réglementation CI
- **Congés** : Demandes et approbations
- **Prêts** : Gestion des avances sur salaire

### 4. Gestion Financière
- **Dépenses** : Suivi et catégorisation
- **Trésorerie** : Flux entrants/sortants
- **Comptabilité** : Écritures automatiques
- **Rapports** : Analyses financières

### 5. Administration
- **Utilisateurs** : Gestion des comptes
- **Services** : Organisation entreprise
- **Permissions** : Attribution granulaire
- **Audit** : Logs de sécurité

## 🔄 Workflows Métier

### Workflow Devis
```
DRAFT → SUBMITTED_FOR_SERVICE_APPROVAL → APPROVED_BY_SERVICE_MANAGER 
     → SUBMITTED_FOR_DG_APPROVAL → APPROVED_BY_DG → ACCEPTED_BY_CLIENT
```

### Workflow Prospection
```
Préparation → Recherche → Contact → Découverte → Proposition → Conversion
```

### Workflow Congés
```
PENDING → APPROVED/REJECTED (par Service Manager ou DG)
```

## 📈 Indicateurs de Performance

### KPIs Commerciaux
- Chiffre d'affaires (mensuel, annuel)
- Taux de conversion prospects → clients
- Pipeline des opportunités
- Délai moyen de paiement

### KPIs RH
- Effectifs par service
- Masse salariale
- Taux d'absentéisme
- Soldes de congés

### KPIs Financiers
- Marge brute/nette
- Créances clients
- Trésorerie
- Ratio charges/revenus

## 🔒 Sécurité

### Authentification
- Hachage bcrypt (12 rounds)
- Tokens JWT sécurisés
- Refresh automatique
- Session timeout

### Autorisation
- Permissions granulaires
- Contrôle d'accès par service
- Middleware de vérification
- Interface conditionnelle

### Audit & Conformité
- Logs complets des actions
- Traçabilité des modifications
- Sauvegarde des données sensibles
- Conformité RGPD

## 🌐 API REST

### Structure des Endpoints
```
/api/v1/
├── auth/              # Authentification
├── customers/         # Gestion clients
├── quotes/           # Gestion devis
├── invoices/         # Facturation
├── payments/         # Paiements
├── products/         # Catalogue
├── employees/        # RH - Employés
├── salaries/         # RH - Salaires
├── leaves/           # RH - Congés
├── loans/            # RH - Prêts
├── prospects/        # Commercial - Prospects
├── reports/          # Rapports
└── admin/            # Administration
```

### Format des Réponses
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}
```

## 📱 Interface Utilisateur

### Design System
- **Framework** : Tailwind CSS
- **Composants** : Système cohérent
- **Thème** : Mode sombre/clair
- **Responsive** : Mobile-first

### Navigation
- **Sidebar** : Navigation principale
- **Breadcrumbs** : Fil d'Ariane
- **Permissions** : Menus conditionnels
- **Search** : Recherche globale

## 🔧 Configuration

### Variables d'Environnement Frontend
```env
VITE_API_URL=http://localhost:3001/api/v1
VITE_APP_NAME="Parabellum Groups"
VITE_APP_VERSION="1.0.0"
```

### Variables d'Environnement Backend
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/parabellum_db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
NODE_ENV="production"
PORT=3001
REDIS_HOST="localhost"
REDIS_PORT=6379
```

## 📊 Base de Données

### Schéma Principal
- **Users** : Utilisateurs et authentification
- **Services** : Organisation en services
- **Customers** : Clients et prospects
- **Quotes/Invoices** : Documents commerciaux
- **Products** : Catalogue produits/services
- **Employees** : Gestion RH
- **Accounting** : Écritures comptables

### Relations Clés
- User → Service (appartenance)
- Customer → Service (attribution)
- Quote → Customer (facturation)
- Employee → Service (organisation)

## 🚀 Performance

### Optimisations Frontend
- Code splitting React
- Lazy loading des routes
- Cache des requêtes (React Query)
- Optimisation des images

### Optimisations Backend
- Cache Redis
- Pagination des listes
- Index base de données
- Compression des réponses

## 📋 Tests et Qualité

### Tests
- Tests unitaires (Vitest)
- Tests d'intégration API
- Tests E2E (Playwright)
- Validation TypeScript

### Qualité Code
- ESLint + Prettier
- Husky (pre-commit hooks)
- SonarQube (analyse statique)
- Documentation JSDoc

## 🔄 CI/CD

### Pipeline
1. **Tests** : Unitaires + intégration
2. **Build** : Compilation TypeScript
3. **Security** : Scan vulnérabilités
4. **Deploy** : Déploiement automatique

### Environnements
- **Development** : Local avec hot-reload
- **Staging** : Tests pré-production
- **Production** : Serveur de production

## 📞 Support et Maintenance

### Monitoring
- Logs applicatifs (Winston)
- Métriques performance
- Alertes système
- Health checks

### Sauvegarde
- Base de données (quotidienne)
- Fichiers uploads
- Configuration système
- Logs d'audit

## 📈 Évolutions Futures

### Roadmap
- [ ] Module de gestion de projets
- [ ] Intégration comptabilité externe
- [ ] Application mobile
- [ ] API publique pour intégrations
- [ ] Intelligence artificielle (prédictions)

### Scalabilité
- Architecture microservices
- Load balancing
- CDN pour les assets
- Réplication base de données

---

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2025  
**Équipe** : Parabellum Groups Development Team