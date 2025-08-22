# Documentation API - Logiciel de Facturation Parabellum

## 🌐 Vue d'ensemble de l'API

L'API REST du logiciel de facturation Parabellum Groups fournit un accès complet à toutes les fonctionnalités du système via des endpoints sécurisés et bien structurés.

### URL de Base
```
http://localhost:3001/api/v1
```

### Authentification
Toutes les routes protégées nécessitent un token JWT dans le header :
```
Authorization: Bearer <token>
```

### Format des Réponses
Toutes les réponses suivent le format standardisé :
```json
{
  "success": boolean,
  "data": object | array,
  "error": {
    "code": string,
    "message": string,
    "details": array
  }
}
```

## 🔐 Authentification

### POST /auth/login
Connexion utilisateur avec génération de token JWT.

**Requête :**
```json
{
  "email": "dg@parabellum.com",
  "password": "password123"
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "dg@parabellum.com",
      "firstName": "Jean",
      "lastName": "Directeur",
      "role": "GENERAL_DIRECTOR",
      "serviceId": 1,
      "serviceName": "Direction Générale"
    },
    "expiresIn": 3600
  }
}
```

### POST /auth/refresh
Renouvellement du token JWT.

### POST /auth/logout
Déconnexion utilisateur.

### GET /auth/profile
Récupération du profil utilisateur actuel.

## 👥 Gestion des Clients

### GET /customers
Récupération de la liste des clients avec pagination et filtres.

**Paramètres de requête :**
- `page` : Numéro de page (défaut: 1)
- `limit` : Éléments par page (défaut: 20, max: 100)
- `search` : Recherche textuelle
- `category` : Filtrage par catégorie
- `active` : Filtrage par statut (true/false)
- `serviceId` : Filtrage par service

**Réponse :**
```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": 1,
        "customerNumber": "CLI-001",
        "name": "Entreprise ABC",
        "type": "COMPANY",
        "email": "contact@abc.com",
        "phone": "01.23.45.67.89",
        "category": "PME",
        "paymentTerms": 30,
        "isActive": true,
        "service": {
          "id": 2,
          "name": "Commercial"
        },
        "defaultAddress": {
          "addressLine1": "123 Rue de la Paix",
          "city": "Paris",
          "postalCode": "75001"
        },
        "stats": {
          "totalInvoices": 5,
          "totalQuotes": 8
        },
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 45,
      "itemsPerPage": 20
    }
  }
}
```

### GET /customers/:id
Récupération des détails d'un client.

### POST /customers
Création d'un nouveau client.

### PUT /customers/:id
Mise à jour d'un client.

### DELETE /customers/:id
Suppression d'un client.

### GET /customers/:id/stats
Statistiques détaillées d'un client.

## 📦 Gestion des Produits

### GET /products
Liste des produits avec filtres.

### GET /products/:id
Détails d'un produit.

### POST /products
Création d'un produit.

### PUT /products/:id
Mise à jour d'un produit.

### DELETE /products/:id
Suppression d'un produit.

## 📄 Gestion des Devis

### GET /quotes
Liste des devis avec filtres par statut, service, client.

**Réponse :**
```json
{
  "success": true,
  "data": {
    "quotes": [
      {
        "id": 1,
        "quoteNumber": "DEV-0001",
        "customer": {
          "id": 1,
          "name": "Entreprise ABC",
          "customerNumber": "CLI-001"
        },
        "status": "APPROVED_BY_DG",
        "quoteDate": "2024-01-15",
        "validUntil": "2024-02-15",
        "subtotalHt": 1500.00,
        "totalVat": 300.00,
        "totalTtc": 1800.00,
        "creator": {
          "firstName": "Pierre",
          "lastName": "Vendeur"
        },
        "items": [
          {
            "description": "Consultation technique",
            "quantity": 10,
            "totalHt": 1500.00
          }
        ],
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 25,
      "itemsPerPage": 20
    }
  }
}
```

### GET /quotes/pending-approvals
Devis en attente d'approbation (selon le rôle).

### POST /quotes
Création d'un nouveau devis.

### PUT /quotes/:id
Mise à jour d'un devis.

### POST /quotes/:id/submit-for-service-approval
Soumission pour validation service.

### POST /quotes/:id/approve-by-service-manager
Approbation par le responsable de service.

### POST /quotes/:id/reject-by-service-manager
Rejet par le responsable de service.

### POST /quotes/:id/approve-by-dg
Approbation par le Directeur Général.

### POST /quotes/:id/reject-by-dg
Rejet par le Directeur Général.

## 🧾 Gestion des Factures

### GET /invoices
Liste des factures avec filtres.

### GET /invoices/:id
Détails d'une facture.

### POST /invoices
Création d'une facture.

### POST /invoices/convert-quote/:quoteId
Conversion d'un devis en facture.

### POST /invoices/:id/send
Envoi de la facture au client.

### GET /invoices/stats
Statistiques des factures.

## 💳 Gestion des Paiements

### GET /payments
Liste des paiements.

### POST /payments
Enregistrement d'un paiement.

**Requête :**
```json
{
  "customerId": 1,
  "amount": 1800.00,
  "paymentDate": "2024-01-20",
  "paymentMethod": "TRANSFER",
  "reference": "VIR-123456",
  "allocations": [
    {
      "invoiceId": 1,
      "amount": 1800.00
    }
  ]
}
```

### GET /payments/stats
Statistiques des paiements.

## 👨‍💼 Gestion des Employés

### GET /employees
Liste des employés avec filtres.

### GET /employees/:id
Détails d'un employé.

### POST /employees
Création d'un employé.

### PUT /employees/:id
Mise à jour d'un employé.

### DELETE /employees/:id
Suppression d'un employé.

## 💰 Gestion des Salaires

### GET /salaries
Liste des salaires avec filtres.

### GET /salaries/:id
Détails d'un salaire.

### POST /salaries
Création d'un salaire.

### PUT /salaries/:id
Mise à jour d'un salaire.

### DELETE /salaries/:id
Suppression d'un salaire.

### POST /salaries/:id/generate-payslip
Génération du bulletin de paie PDF.

## 🏖️ Gestion des Congés

### GET /leaves
Liste des congés avec filtres.

### GET /leaves/:id
Détails d'un congé.

### POST /leaves
Création d'un congé.

### PUT /leaves/:id
Mise à jour d'un congé.

### DELETE /leaves/:id
Suppression d'un congé.

### POST /leaves/:id/approve
Approbation d'un congé.

### POST /leaves/:id/reject
Rejet d'un congé.

## 💸 Gestion des Dépenses

### GET /expenses
Liste des dépenses.

### POST /expenses
Création d'une dépense.

### PUT /expenses/:id
Mise à jour d'une dépense.

### GET /expenses/stats
Statistiques des dépenses.

## 🏢 Gestion des Fournisseurs

### GET /suppliers
Liste des fournisseurs.

### GET /suppliers/:id
Détails d'un fournisseur.

### POST /suppliers
Création d'un fournisseur.

### PUT /suppliers/:id
Mise à jour d'un fournisseur.

### DELETE /suppliers/:id
Suppression d'un fournisseur.

## 📊 Dashboard et Rapports

### GET /dashboard
Données du dashboard principal (adaptées au rôle).

### GET /dashboard/service/:serviceId
Dashboard spécifique à un service.

### GET /dashboard/employee/:employeeId
Dashboard spécifique à un employé.

## ⚙️ Gestion des Erreurs

### Codes d'Erreur Standards

| Code | Description |
|------|-------------|
| `AUTHENTICATION_REQUIRED` | Token manquant ou invalide |
| `INSUFFICIENT_PERMISSIONS` | Permissions insuffisantes |
| `VALIDATION_ERROR` | Données invalides |
| `RESOURCE_NOT_FOUND` | Ressource non trouvée |
| `DUPLICATE_RESOURCE` | Ressource déjà existante |
| `BUSINESS_RULE_VIOLATION` | Violation de règle métier |
| `RATE_LIMIT_EXCEEDED` | Trop de requêtes |
| `INTERNAL_SERVER_ERROR` | Erreur serveur |

### Exemple de Réponse d'Erreur
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Les données fournies ne sont pas valides",
    "details": [
      {
        "field": "email",
        "message": "L'adresse email n'est pas valide"
      },
      {
        "field": "paymentTerms",
        "message": "Le délai de paiement doit être positif"
      }
    ]
  }
}
```

## 🔒 Sécurité

### Headers Requis
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Rate Limiting
- **Limite générale** : 100 requêtes/15 minutes par IP
- **Authentification** : 5 tentatives/15 minutes par IP
- **API sensibles** : Limites spécifiques par endpoint

### Validation
- **Validation Zod** sur toutes les entrées
- **Sanitisation** des données
- **Protection XSS** et injection SQL
- **CORS** configuré strictement

## 📈 Performance

### Pagination
Toutes les listes supportent la pagination :
```
GET /customers?page=1&limit=20
```

### Cache
- **Cache des requêtes** fréquentes
- **Headers de cache** appropriés
- **Invalidation** automatique

### Compression
- **Gzip** activé pour toutes les réponses
- **Minification** des réponses JSON

---

Cette documentation API complète permet aux développeurs de comprendre et d'utiliser efficacement tous les endpoints du logiciel de facturation Parabellum Groups.