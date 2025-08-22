# Architecture Technique - Logiciel de Facturation

## Vue d'ensemble de l'architecture

Le logiciel de facturation sera développé selon une architecture client-serveur moderne, conçue pour supporter une gestion multi-services et un workflow de validation hiérarchique. Les technologies clés restent les mêmes, mais l'organisation logique sera adaptée pour gérer les spécificités de chaque service (Commercial, Progitek, RH, Comptabilité, Direction Générale) au sein d'une application unifiée.

### Stack Technologique
- **Frontend** : React.js (avec TypeScript)
- **Backend** : Node.js avec Express.js
- **Base de données** : SQLite (pour le prototypage et les petites/moyennes entreprises, avec possibilité de migration vers PostgreSQL/MySQL pour la scalabilité)
- **Communication** : API REST
- **Authentification** : JWT (JSON Web Tokens)
- **Gestion des rôles et permissions** : Intégration fine des rôles (Employé, Responsable de Service, Directeur Général, Comptable, Administrateur) et des permissions basées sur le service d'appartenance.
## Architecture Générale

L\`architecture générale reste une architecture client-serveur standard, mais avec une logique métier enrichie au niveau du backend pour gérer les spécificités multi-services et le workflow de validation. Le frontend adaptera son affichage et ses fonctionnalités en fonction du rôle et du service de l\`utilisateur connecté.

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐    SQLite    ┌─────────────────┐
│                 │    Requests      │                 │   Queries    │                 │
│   React.js      │◄────────────────►│   Express.js    │◄────────────►│   SQLite DB     │
│   Frontend      │    JSON/REST     │   Backend       │              │                 │
│                 │                  │                 │              │                 │
└─────────────────┘                  └─────────────────┘              └─────────────────┘
```

**Explication des Flux** :
-   **Frontend (React.js)** : L\`interface utilisateur est dynamique et s\`adapte en fonction du rôle (Employé, Responsable de Service, Directeur Général, Comptable, Administrateur) et du service de l\`utilisateur. Les dashboards et les listes de devis/factures affichées seront filtrés en conséquence.
-   **Backend (Express.js)** : Le serveur Express.js gère la logique métier complexe, y compris la validation des devis en plusieurs étapes, la gestion des permissions basées sur les rôles et les services, et le filtrage des données pour les dashboards spécifiques. Il est le point central pour toutes les interactions avec la base de données.
-   **Base de Données (SQLite)** : La base de données stocke toutes les informations, y compris les utilisateurs, leurs rôles, leur service d\`appartenance, les devis avec leur statut de validation, les factures, et les clients qui peuvent être associés à un service. Les relations entre ces entités sont cruciales pour le bon fonctionnement du workflow.

Cette architecture permet une application unifiée où chaque utilisateur voit et interagit uniquement avec les données et les fonctionnalités pertinentes pour son rôle et son service, tout en assurant une traçabilité complète du processus de validation des devis.
## Structure du Projet

```
facturation-app/
├── client/                     # Application React
│   ├── public/
│   ├── src/
│   │   ├── components/         # Composants réutilisables
│   │   ├── pages/             # Pages principales
│   │   ├── services/          # Services API
│   │   ├── hooks/             # Hooks personnalisés
│   │   ├── utils/             # Utilitaires
│   │   ├── types/             # Types TypeScript
│   │   └── styles/            # Styles CSS/SCSS
│   ├── package.json
│   └── tsconfig.json
├── server/                     # API Express
│   ├── src/
│   │   ├── controllers/       # Contrôleurs
│   │   ├── models/            # Modèles de données
│   │   ├── routes/            # Routes API
│   │   ├── middleware/        # Middlewares
│   │   ├── database/          # Configuration DB
│   │   ├── utils/             # Utilitaires
│   │   └── types/             # Types TypeScript
│   ├── database.sqlite        # Base de données SQLite
│   ├── package.json
│   └── tsconfig.json
├── shared/                     # Code partagé
│   └── types/                 # Types partagés
├── docs/                      # Documentation
└── README.md
```

## Technologies et Bibliothèques

### Frontend (React)
- **React** : Framework principal
- **TypeScript** : Typage statique
- **React Router** : Navigation
- **Axios** : Client HTTP
- **React Hook Form** : Gestion des formulaires
- **Material-UI ou Tailwind CSS** : Interface utilisateur
- **React Query/TanStack Query** : Gestion d'état serveur
- **Date-fns** : Manipulation des dates
- **React-PDF** : Génération de PDF

### Backend (Node.js/Express)
- **Express.js** : Framework web
- **TypeScript** : Typage statique
- **SQLite3** : Driver base de données
- **Knex.js** : Query builder SQL
- **bcrypt** : Hachage des mots de passe
- **jsonwebtoken** : Authentification JWT
- **cors** : Gestion CORS
- **helmet** : Sécurité HTTP
- **express-validator** : Validation des données
- **multer** : Upload de fichiers
- **nodemailer** : Envoi d'emails
- **pdfkit** : Génération de PDF côté serveur## Flux de Données

### Authentification et Autorisation
1.  L\`utilisateur se connecte via le frontend en fournissant ses identifiants.
2.  Le backend vérifie les identifiants et récupère le rôle (Employé, Responsable de Service, Directeur Général, Comptable, Administrateur) et le service d\`appartenance de l\`utilisateur.
3.  Un token JWT est généré, incluant le rôle et le service de l\`utilisateur, puis renvoyé au frontend.
4.  Le token est stocké côté client (localStorage/sessionStorage) et inclus dans les headers de chaque requête API subséquente.
5.  Le backend utilise le rôle et le service du token pour appliquer les règles d\`autorisation et filtrer les données accessibles.

### Workflow de Gestion des Devis (Exemple détaillé)
1.  **Création par l\`Employé** :
    *   L\`employé (ex: Commercial) crée un devis via l\`interface React. Le devis est initialement en statut \`Brouillon\`.
    *   La requête POST `/api/v1/quotes` est envoyée au backend. Le backend associe le devis à l\`employé créateur et à son service.
2.  **Soumission pour Validation Service** :
    *   L\`employé soumet le devis pour validation via l\`interface. La requête POST `/api/v1/quotes/:id/submit-for-service-approval` est envoyée.
    *   Le backend met à jour le statut du devis à \`Soumis pour validation service\` et envoie une notification au Responsable de Service de l\`employé.
3.  **Validation par le Responsable de Service** :
    *   Le Responsable de Service accède à son dashboard ou à la liste des devis en attente de validation (filtrée par son service).
    *   Il peut approuver (POST `/api/v1/quotes/:id/approve-by-service-manager`), rejeter (POST `/api/v1/quotes/:id/reject-by-service-manager`), ou demander des modifications (POST `/api/v1/quotes/:id/request-modifications-by-service-manager`).
    *   Le backend met à jour le statut du devis et, en cas d\`approbation, envoie une notification au Directeur Général.
4.  **Validation par le Directeur Général** :
    *   Le Directeur Général accède à son dashboard ou à la liste des devis en attente de validation finale.
    *   Il peut approuver (POST `/api/v1/quotes/:id/approve-by-dg`) ou rejeter (POST `/api/v1/quotes/:id/reject-by-dg`).
    *   Le backend met à jour le statut du devis et envoie des notifications à l\`employé créateur et au Responsable de Service.
5.  **Visibilité pour la Comptabilité** :
    *   Une fois le devis \`Approuvé par DG\` et \`Accepté par client\`, il devient visible pour le service comptable via des requêtes GET filtrées sur le statut.

### Opérations CRUD Générales
1.  L\`utilisateur interagit avec l\`interface React (ex: gestion des clients, produits).
2.  Les actions déclenchent des appels API via Axios.
3.  Express traite les requêtes, valide les données et vérifie les permissions (rôle et service).
4.  Les contrôleurs interagissent avec la base SQLite, en appliquant des filtres basés sur le service si nécessaire (ex: un commercial ne voit que les clients de son service).
5.  Les réponses sont renvoyées au frontend.
6.  L\`interface se met à jour avec les nouvelles données, reflétant les permissions et les filtres appliqués.# Sécurité

### Mesures de Sécurité Implémentées
- **Authentification JWT** : Tokens sécurisés avec expiration courte (1h) et refresh tokens. Le payload du JWT inclura désormais l\`ID de l\`utilisateur, son rôle  et ces permission (Employé, Responsable de Service, Directeur Général, Comptable, Administrateur) et l\`ID de son service d\`appartenance. Ces informations seront utilisées pour les contrôles d\`accès fins.
- **Autorisation basée sur les rôles et services (RBAC)** : Chaque requête au backend sera interceptée par un middleware d\`autorisation qui vérifiera non seulement si l\`utilisateur est authentifié, mais aussi s\`il possède le rôle et les permissions nécessaires pour l\`action demandée, et si l\`action concerne des données de son service ou de son périmètre hiérarchique. Par exemple, un Responsable- **Authentification JWT** : Tokens sécurisés avec expiration courte (1h) et refresh tokens. Le payload du JWT inclura désormais l\`ID de l\`utilisateur, son rôle (Employé, Responsable de Service, Directeur Général, Comptable, Administrateur) et l\`ID de son service d\`appartenance. Ces informations seront utilisées pour les contrôles d\`accès fins.
- **Autorisation basée sur les rôles et services (RBAC)** : Chaque requête au backend sera interceptée par un middleware d\`autorisation qui vérifiera non seulement si l\`utilisateur est authentifié, mais aussi s\`il possède le rôle et les permissions nécessaires pour l\`action demandée, et si l\`action concerne des données de son service ou de son périmètre hiérarchique. Par exemple, un Responsable d- **Authentification JWT** : Tokens sécurisés avec expiration courte (1h) et refresh tokens. Le payload du JWT inclura désormais l\`ID de l\`utilisateur, son rôle (Employé, Responsable de Service, Directeur Général, Comptable, Administrateur) et l\`ID de son service d\`appartenance. Ces informations seront utilisées pour les contrôles d\`accès fins.
- **Autorisation basée sur les rôles et services (RBAC)** : Chaque requête au backend sera interceptée par un middleware d\`autorisation qui vérifiera non seulement si l\`utilisateur est authentifié, mais aussi s\`il possède le rôle et les permissions nécessaires pour l\`action demandée, et si l\`action concerne des données de son service ou de son périmètre hiérarchique. Par exemple, un Responsable de Service ne pourra approuver que les devis de son service.
- **Hachage des mots de passe** : bcrypt avec salt
- **Validation des entrées** : express-validator
- **Protection CORS** : Configuration restrictive
- **Headers de sécurité** : helmet.js
- **Sanitisation des données** : Prévention des injections SQL
- **Rate limiting** : Limitation des requêtes par IP## Performance et Optimisation

### Frontend
- **Code splitting** : Chargement paresseux des composants
- **Memoization** : React.memo, useMemo, useCallback
- **Optimisation des images** : Compression et formats modernes
- **Cache des requêtes** : React Query pour la mise en cache

### Backend
- **Indexation de la base** : Index sur les colonnes fréquemment utilisées
- **Pagination** : Limitation des résultats par page
- **Compression** : gzip pour les réponses HTTP
- **Cache des requêtes** : Mise en cache des données fréquentes

## Déploiement

### Environnements
- **Développement** : Local avec hot-reload
- **Test** : Environnement de test automatisé
- **Production** : Serveur de production avec optimisations

### Configuration
- Variables d'environnement pour la configuration
- Scripts de build et de déploiement automatisés
- Sauvegarde automatique de la base de données



### Audit et Conformité
- **Logs d\`Audit** : Traçabilité complète de toutes les actions sensibles (création/modification de devis, approbations, accès aux données sensibles) avec horodatage, utilisateur et détails de l\`action. Ces logs seront essentiels pour la conformité et le débogage.
- **Conformité RGPD** : Gestion des consentements, droit à l\`oubli et portabilité des données.

