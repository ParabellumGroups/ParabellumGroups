# Spécifications Techniques et Interfaces - Logiciel de Facturation

## Introduction

Ce document présente les spécifications techniques détaillées pour l'implémentation du logiciel de facturation. Il couvre l'architecture des API RESTful, la structure des composants React, les interfaces utilisateur et tous les aspects techniques nécessaires au développement de l'application.

## Architecture API RESTful

### Principes de Conception

L'API REST suit les principes RESTful standard avec une architecture stateless utilisant les tokens JWT pour l'authentification. Toutes les réponses sont au format JSON avec des codes de statut HTTP appropriés. L'API implémente la pagination pour les listes importantes et inclut des mécanismes de validation robustes.

### Structure des URLs

L'API utilise une structure d'URLs cohérente et prévisible :
- `/api/v1/auth/*` - Authentification et gestion des sessions
- `/api/v1/users/*` - Gestion des utilisateurs
- `/api/v1/customers/*` - Gestion des clients
- `/api/v1/products/*` - Gestion des produits et services
- `/api/v1/quotes/*` - Gestion des devis
- `/api/v1/invoices/*` - Gestion des factures
- `/api/v1/payments/*` - Gestion des paiements
- `/api/v1/reports/*` - Génération de rapports
- `/api/v1/settings/*` - Configuration système

### Endpoints d'Authentification

#### POST /api/v1/auth/login
Authentification utilisateur avec génération de token JWT.

**Requête** :
```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Réponse Succès (200)** :
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "Jean",
      "lastName": "Dupont",
      "role": "admin"
    },
    "expiresIn": 3600
  }
}
```

**Réponse Erreur (401)** :
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email ou mot de passe incorrect"
  }
}
```

#### POST /api/v1/auth/refresh
Renouvellement du token JWT avant expiration.

#### POST /api/v1/auth/logout
Invalidation du token côté serveur.

#### POST /api/v1/auth/forgot-password
Demande de réinitialisation de mot de passe.

### Endpoints de Gestion des Clients

#### GET /api/v1/customers
Récupération de la liste des clients avec pagination et filtres.

**Paramètres de requête** :
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre d'éléments par page (défaut: 20, max: 100)
- `search` : Recherche textuelle sur nom/email
- `category` : Filtrage par catégorie
- `active` : Filtrage par statut actif/inactif

**Réponse** :
```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": 1,
        "customerNumber": "CLI-001",
        "name": "Entreprise ABC",
        "email": "contact@abc.com",
        "phone": "01.23.45.67.89",
        "category": "Professionnel",
        "paymentTerms": 30,
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 95,
      "itemsPerPage": 20
    }
  }
}
```

#### GET /api/v1/customers/:id
Récupération des détails d'un client spécifique avec ses adresses.

#### POST /api/v1/customers
Création d'un nouveau client.

**Requête** :
```json
{
  "name": "Nouvelle Entreprise",
  "email": "contact@nouvelle.com",
  "phone": "01.23.45.67.89",
  "type": "company",
  "paymentTerms": 30,
  "addresses": [
    {
      "type": "billing",
      "addressLine1": "123 Rue de la Paix",
      "postalCode": "75001",
      "city": "Paris",
      "isDefault": true
    }
  ]
}
```

#### PUT /api/v1/customers/:id
Mise à jour d'un client existant.

#### DELETE /api/v1/customers/:id
Suppression d'un client (soft delete si factures associées).

### Endpoints de Gestion des Produits

#### GET /api/v1/products
Liste des produits avec filtres par catégorie, statut et recherche textuelle.

#### GET /api/v1/products/:id
Détails d'un produit avec historique des prix.

#### POST /api/v1/products
Création d'un nouveau produit.

**Requête** :
```json
{
  "sku": "PROD-001",
  "name": "Service de Consultation",
  "description": "Consultation technique spécialisée",
  "type": "service",
  "category": "Conseil",
  "unit": "heure",
  "priceHt": 150.00,
  "vatRate": 20.00,
  "isActive": true
}
```

#### PUT /api/v1/products/:id
Mise à jour d'un produit.

#### DELETE /api/v1/products/:id
Suppression d'un produit.

### Endpoints de Gestion des Devis

#### GET /api/v1/quotes
Liste des devis avec filtres par statut, client, période et service.

#### GET /api/v1/quotes/:id
Détails complets d'un devis avec ses lignes et son historique de validation.

#### POST /api/v1/quotes
Création d'un nouveau devis. Le statut initial est 'Brouillon'.

#### PUT /api/v1/quotes/:id
Mise à jour d'un devis (si statut 'Brouillon' ou 'Modifications demandées').

#### POST /api/v1/quotes/:id/submit-for-service-approval
Soumission du devis pour validation par le responsable de service. Le statut passe à 'Soumis pour validation service'.

#### POST /api/v1/quotes/:id/approve-by-service-manager
Approbation d'un devis par le responsable de service. Le statut passe à 'Approuvé par responsable service'.

#### POST /api/v1/quotes/:id/reject-by-service-manager
Rejet d'un devis par le responsable de service avec commentaires. Le statut passe à 'Rejeté par responsable service'.

#### POST /api/v1/quotes/:id/request-modifications-by-service-manager
Demande de modifications sur un devis par le responsable de service avec commentaires. Le statut reste 'Soumis pour validation service' avec un indicateur 'Modifications demandées'.

#### POST /api/v1/quotes/:id/approve-by-dg
Approbation d'un devis par le Directeur Général. Le statut passe à 'Approuvé par DG'.

#### POST /api/v1/quotes/:id/reject-by-dg
Rejet d'un devis par le Directeur Général avec commentaires. Le statut passe à 'Rejeté par DG'.

#### POST /api/v1/quotes/:id/send
Envoi du devis par email au client (uniquement si 'Approuvé par DG').

#### POST /api/v1/quotes/:id/accept
Acceptation du devis par le client (changement de statut à 'Accepté par client').

#### POST /api/v1/quotes/:id/convert-to-invoice
Conversion du devis en facture (uniquement si 'Approuvé par DG' et 'Accepté par client').

### Endpoints de Gestion des Factures

#### GET /api/v1/invoices
Liste des factures avec filtres avancés.

#### GET /api/v1/invoices/:id
Détails d'une facture avec historique des paiements.

#### POST /api/v1/invoices
Création d'une nouvelle facture.

#### PUT /api/v1/invoices/:id
Mise à jour d'une facture (si statut brouillon).

#### POST /api/v1/invoices/:id/send
Envoi de la facture par email.

#### GET /api/v1/invoices/:id/pdf
Génération et téléchargement du PDF de la facture.

### Endpoints de Gestion des Paiements

#### GET /api/v1/payments
Liste des paiements avec filtres.

#### POST /api/v1/payments
Enregistrement d'un nouveau paiement.

**Requête** :
```json
{
  "customerId": 1,
  "amount": 1800.00,
  "paymentDate": "2024-01-20",
  "paymentMethod": "transfer",
  "reference": "VIR-123456",
  "allocations": [
    {
      "invoiceId": 1,
      "amount": 1800.00
    }
  ]
}
```

#### PUT /api/v1/payments/:id
Modification d'un paiement.

#### DELETE /api/v1/payments/:id
Suppression d'un paiement.

### Endpoints de Reporting

#### GET /api/v1/reports/dashboard
Données du tableau de bord principal.

#### GET /api/v1/reports/dashboard/service/:serviceId
Données du tableau de bord spécifique à un service.

#### GET /api/v1/reports/dashboard/employee/:employeeId
Données du tableau de bord spécifique à un employé.

#### GET /api/v1/reports/sales
Rapport des ventes par période.

#### GET /api/v1/reports/customers
Analyse des clients et de leur rentabilité.

#### GET /api/v1/reports/vat
Rapport de TVA pour les déclarations.

### Gestion des Erreurs

L'API implémente une gestion d'erreur standardisée avec des codes d'erreur spécifiques et des messages explicites en français.

**Structure des Erreurs** :
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
      }
    ]
  }
}
```

**Codes d'Erreur Principaux** :
- `VALIDATION_ERROR` : Erreur de validation des données
- `AUTHENTICATION_REQUIRED` : Authentification requise
- `INSUFFICIENT_PERMISSIONS` : Permissions insuffisantes
- `RESOURCE_NOT_FOUND` : Ressource non trouvée
- `DUPLICATE_RESOURCE` : Ressource déjà existante
- `BUSINESS_RULE_VIOLATION` : Violation de règle métier
- `INTERNAL_SERVER_ERROR` : Erreur serveur interne

### Middleware et Sécurité

#### Middleware d'Authentification
Vérification du token JWT sur toutes les routes protégées avec gestion de l'expiration et du renouvellement automatique.

#### Middleware de Validation
Validation automatique des données d'entrée selon des schémas prédéfinis utilisant Joi ou express-validator.

#### Middleware de Logging
Journalisation de toutes les requêtes avec niveau de détail configurable et rotation automatique des logs.

#### Middleware de Rate Limiting
Limitation du nombre de requêtes par IP et par utilisateur pour prévenir les abus et attaques DDoS.

## Architecture Frontend React

### Structure des Composants

L'application React suit une architecture modulaire avec séparation claire des responsabilités entre composants de présentation et composants logiques.

### Composants de Layout

#### AppLayout
Composant racine gérant la structure générale de l'application avec navigation, header et zone de contenu principal.

```jsx
const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Header 
          user={user} 
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={logout}
        />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};
```

#### Sidebar
Navigation principale avec menu hiérarchique et gestion des permissions d'accès selon le rôle utilisateur.

#### Header
Barre supérieure avec informations utilisateur, notifications et actions rapides.

### Composants de Gestion des Clients

#### CustomerList
Liste paginée des clients avec fonctionnalités de recherche, filtrage et tri.

```jsx
const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    active: true
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20
  });

  const { data, isLoading, error } = useQuery(
    ['customers', filters, pagination],
    () => customerService.getCustomers({ ...filters, ...pagination }),
    { keepPreviousData: true }
  );

  return (
    <div className="customer-list">
      <CustomerFilters 
        filters={filters} 
        onFiltersChange={setFilters} 
      />
      <CustomerTable 
        customers={data?.customers || []} 
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Pagination 
        {...data?.pagination} 
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
      />
    </div>
  );
};
```

#### CustomerForm
Formulaire de création/modification de client avec validation en temps réel.

#### CustomerDetail
Vue détaillée d'un client avec historique des transactions et actions rapides.

### Composants de Facturation

#### InvoiceBuilder
Constructeur de facture interactif avec ajout dynamique de lignes et calculs automatiques.

```jsx
const InvoiceBuilder = ({ initialData, onSave }) => {
  const [invoice, setInvoice] = useState(initialData || {
    customerId: null,
    items: [],
    subtotalHt: 0,
    totalVat: 0,
    totalTtc: 0
  });

  const addItem = (product) => {
    const newItem = {
      id: Date.now(),
      productId: product.id,
      description: product.name,
      quantity: 1,
      unitPriceHt: product.priceHt,
      vatRate: product.vatRate,
      totalHt: product.priceHt
    };
    
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateItem = (itemId, updates) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId 
          ? { ...item, ...updates, totalHt: updates.quantity * updates.unitPriceHt }
          : item
      )
    }));
  };

  const calculateTotals = useCallback(() => {
    const subtotalHt = invoice.items.reduce((sum, item) => sum + item.totalHt, 0);
    const totalVat = invoice.items.reduce((sum, item) => 
      sum + (item.totalHt * item.vatRate / 100), 0
    );
    
    setInvoice(prev => ({
      ...prev,
      subtotalHt,
      totalVat,
      totalTtc: subtotalHt + totalVat
    }));
  }, [invoice.items]);

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  return (
    <div className="invoice-builder">
      <CustomerSelector 
        value={invoice.customerId}
        onChange={(customerId) => setInvoice(prev => ({ ...prev, customerId }))}
      />
      <ItemsTable 
        items={invoice.items}
        onUpdateItem={updateItem}
        onRemoveItem={removeItem}
      />
      <ProductSelector onAddProduct={addItem} />
      <InvoiceTotals 
        subtotalHt={invoice.subtotalHt}
        totalVat={invoice.totalVat}
        totalTtc={invoice.totalTtc}
      />
      <InvoiceActions 
        onSave={() => onSave(invoice)}
        onSend={() => handleSend(invoice)}
      />
    </div>
  );
};
```

#### InvoiceList
Liste des factures avec filtres avancés et actions en lot.

#### InvoicePreview
Aperçu de la facture avant envoi avec possibilité de modification.

### Composants de Reporting

#### Dashboard
Tableau de bord principal avec widgets interactifs et graphiques en temps réel, adaptable par rôle et par service.

```jsx
const Dashboard = () => {
  const { user } = useAuth(); // Récupérer les informations de l'utilisateur (rôle, service)
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        let data;
        if (user.role === 'admin' || user.role === 'director') {
          data = await reportService.getDashboardData(); // Dashboard principal pour DG/Admin
        } else if (user.role === 'service_manager' && user.serviceId) {
          data = await reportService.getServiceDashboardData(user.serviceId); // Dashboard par service
        } else if (user.role === 'employee' && user.employeeId) {
          data = await reportService.getEmployeeDashboardData(user.employeeId); // Dashboard par employé
        } else {
          data = {}; // Fallback ou dashboard vide
        }
        setDashboardData(data);
      } catch (error) {
        console.error('Erreur lors du chargement du ta#### Dashboard
Tableau de bord principal avec widgets interactifs et graphiques en temps réel, adaptable par rôle et par service.

```jsx
const Dashboard = () => {
  const { user } = useAuth(); // Récupérer les informations de l\'utilisateur (rôle, service)
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        let data;
        if (user.role === \'admin\' || user.role === \'director\') {
          data = await reportService.getDashboardData(); // Dashboard principal pour DG/Admin
        } else if (user.role === \'service_manager\' && user.serviceId) {
          data = await reportService.getServiceDashboardData(user.serviceId); // Dashboard par service
        } else if (user.role === \'employee\' && user.employeeId) {
          data = await reportService.getEmployeeDashboardData(user.employeeId); // Dashboard par employé
        } else {
          data = {}; // Fallback ou dashboard vide
        }
        setDashboardData(data);
      } catch (error) {
        console.error(\'Erreur lors du chargement du tableau de bord:\', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) return <LoadingSpinner />;
  if (!dashboardData) return <p>Impossible de charger les données du tableau de bord.</p>;

  return (
    <div className="dashboard">
      <div className="metrics-grid">
        <MetricCard 
          title="Chiffre d\'Affaires du Mois"
          value={dashboardData?.revenue?.thisMonth}
          growth={dashboardData?.revenue?.growth}
          format="currency"
        />
        <MetricCard 
          title="Factures en Attente"
          value={dashboardData?.invoices?.pending}
          color="warning"
        />
        <MetricCard 
          title="Factures Échues"
          value={dashboardData?.invoices?.overdue}
          color="danger"
        />
        <MetricCard 
          title="Nouveaux Clients"
          value={dashboardData?.customers?.new}
          color="success"
        />
      </div>
      
      <div className="charts-section">
        <RevenueChart data={dashboardData?.revenueChart} />
        <InvoiceStatusChart data={dashboardData?.invoiceStatus} />
      </div>
      
      <RecentActivity activities={dashboardData?.recentActivity} />
    </div>
  );
};;);
};
```

#### ReportBuilder
Constructeur de rapports personnalisés avec sélection de critères et export.

### Hooks Personnalisés

#### useAuth
Gestion de l'authentification et des permissions utilisateur.

```jsx
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Erreur de connexion'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || user?.role === 'admin';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.verifyToken(token)
        .then(response => setUser(response.data.user))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return { user, login, logout, hasPermission, loading };
};
```

#### useApi
Hook générique pour les appels API avec gestion d'erreur et loading.

#### useLocalStorage
Persistance locale des préférences utilisateur.

### Services API

#### Structure des Services
Chaque entité dispose d'un service dédié encapsulant les appels API correspondants.

```jsx
class CustomerService {
  async getCustomers(params = {}) {
    const response = await apiClient.get('/customers', { params });
    return response.data;
  }

  async getCustomer(id) {
    const response = await apiClient.get(`/customers/${id}`);
    return response.data;
  }

  async createCustomer(customerData) {
    const response = await apiClient.post('/customers', customerData);
    return response.data;
  }

  async updateCustomer(id, customerData) {
    const response = await apiClient.put(`/customers/${id}`, customerData);
    return response.data;
  }

  async deleteCustomer(id) {
    const response = await apiClient.delete(`/customers/${id}`);
    return response.data;
  }
}

export const customerService = new CustomerService();
```

### Gestion d'État

L'application utilise React Query pour la gestion d'état serveur et Context API pour l'état global de l'application.

#### Configuration React Query
```jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false
    }
  }
});
```

#### Contextes Globaux
- AuthContext : État d'authentification
- ThemeContext : Préférences d'affichage
- NotificationContext : Système de notifications


## Spécifications d'Interface Utilisateur

### Principes de Design

L'interface utilisateur suit les principes du Material Design avec une adaptation aux besoins spécifiques d'un logiciel de gestion. L'accent est mis sur la clarté, l'efficacité et l'accessibilité pour permettre une utilisation intensive par des professionnels.

#### Palette de Couleurs
- **Primaire** : #1976D2 (Bleu professionnel)
- **Secondaire** : #388E3C (Vert validation)
- **Accent** : #F57C00 (Orange attention)
- **Erreur** : #D32F2F (Rouge erreur)
- **Avertissement** : #F9A825 (Jaune avertissement)
- **Succès** : #388E3C (Vert succès)
- **Neutre** : #616161 (Gris texte)
- **Arrière-plan** : #FAFAFA (Gris clair)

#### Typographie
- **Police principale** : Inter (sans-serif moderne)
- **Police monospace** : JetBrains Mono (pour les codes et références)
- **Tailles** : 
  - H1: 32px (Titres principaux)
  - H2: 24px (Titres de section)
  - H3: 20px (Sous-titres)
  - Body: 16px (Texte principal)
  - Caption: 14px (Texte secondaire)
  - Small: 12px (Annotations)

#### Espacement et Grille
- **Unité de base** : 8px
- **Grille** : 12 colonnes responsive
- **Breakpoints** :
  - Mobile : < 768px
  - Tablette : 768px - 1024px
  - Desktop : > 1024px

### Écrans Principaux

#### Écran de Connexion
Interface épurée centrée sur l'authentification avec validation en temps réel et récupération de mot de passe.

**Éléments** :
- Logo de l'entreprise
- Formulaire de connexion (email/mot de passe)
- Case "Se souvenir de moi"
- Lien "Mot de passe oublié"
- Bouton de connexion avec état de chargement
- Messages d'erreur contextuels

**Responsive** : Adaptation mobile avec formulaire pleine largeur et navigation tactile optimisée.

#### Tableau de Bord Principal
Vue d'ensemble des indicateurs clés avec widgets interactifs et navigation rapide.

**Layout** :
```
┌─────────────────────────────────────────────────────────┐
│ Header (Logo, Navigation, Profil utilisateur)          │
├─────────────────────────────────────────────────────────┤
│ Métriques Principales (4 cartes)                       │
├─────────────────────────────────────────────────────────┤
│ Graphiques (Revenus, Statuts factures)                 │
├─────────────────────────────────────────────────────────┤
│ Activité Récente | Factures Échues                     │
└─────────────────────────────────────────────────────────┘
```

**Widgets** :
- Cartes métriques avec évolution (CA, factures, clients)
- Graphique d'évolution du chiffre d'affaires
- Répartition des statuts de factures (camembert)
- Liste des activités récentes
- Alertes factures échues

#### Liste des Clients
Interface de gestion complète avec recherche avancée et actions en lot.

**Fonctionnalités** :
- Barre de recherche avec suggestions
- Filtres par catégorie, statut, zone géographique
- Tableau avec tri sur toutes les colonnes
- Actions rapides (éditer, supprimer, voir détails)
- Pagination avec sélection du nombre d'éléments
- Export CSV/Excel
- Bouton d'ajout de nouveau client

**Colonnes du Tableau** :
- Numéro client
- Nom/Raison sociale
- Email
- Téléphone
- Catégorie
- Dernière facture
- Solde dû
- Statut
- Actions

#### Formulaire Client
Interface de saisie optimisée avec validation en temps réel et gestion des adresses multiples.

**Sections** :
1. **Informations Générales** : Nom, type, coordonnées
2. **Informations Fiscales** : SIRET, TVA, conditions de paiement
3. **Adresses** : Facturation, livraison avec gestion multiple
4. **Préférences** : Catégorie, remises, notes

**Validation** :
- Vérification format email en temps réel
- Validation numéro de TVA européen
- Contrôle cohérence codes postaux/villes
- Messages d'erreur contextuels sous chaque champ

#### Constructeur de Facture
Interface intuitive pour la création de factures avec calculs automatiques.

**Layout** :
```
┌─────────────────────────────────────────────────────────┐
│ Sélection Client | Informations Facture                │
├─────────────────────────────────────────────────────────┤
│ Tableau des Lignes de Facture                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Produit | Qté | Prix U. | TVA | Total               │ │
│ │ [Ligne 1]                                           │ │
│ │ [Ligne 2]                                           │ │
│ │ [+ Ajouter une ligne]                               │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Sélecteur de Produits (Modal/Sidebar)                  │
├─────────────────────────────────────────────────────────┤
│ Totaux | Actions (Sauvegarder, Envoyer, Aperçu)       │
└─────────────────────────────────────────────────────────┘
```

**Fonctionnalités Avancées** :
- Auto-complétion produits avec recherche
- Calculs automatiques des totaux
- Gestion des remises par ligne et globales
- Aperçu PDF en temps réel
- Sauvegarde automatique en brouillon
- Conversion devis vers facture

#### Aperçu PDF
Prévisualisation fidèle du document avant génération finale.

**Éléments** :
- En-tête avec logo et informations entreprise
- Coordonnées client et adresse de facturation
- Tableau détaillé des prestations
- Récapitulatif des totaux avec TVA
- Conditions de paiement et mentions légales
- Pied de page avec coordonnées bancaires

### Composants d'Interface Réutilisables

#### DataTable
Composant de tableau avancé avec tri, filtrage et pagination.

```jsx
const DataTable = ({
  columns,
  data,
  loading,
  pagination,
  onSort,
  onFilter,
  onPageChange,
  actions
}) => {
  return (
    <div className="data-table">
      <TableFilters columns={columns} onFilter={onFilter} />
      <Table>
        <TableHeader columns={columns} onSort={onSort} />
        <TableBody 
          data={data} 
          loading={loading}
          actions={actions}
        />
      </Table>
      <TablePagination 
        {...pagination} 
        onPageChange={onPageChange} 
      />
    </div>
  );
};
```

#### FormBuilder
Générateur de formulaires avec validation intégrée.

```jsx
const FormBuilder = ({ schema, onSubmit, initialValues }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-builder">
      {schema.fields.map(field => (
        <FormField
          key={field.name}
          field={field}
          register={register}
          error={errors[field.name]}
        />
      ))}
      <FormActions />
    </form>
  );
};
```

#### Modal
Composant modal réutilisable avec gestion du focus et de l'accessibilité.

#### NotificationSystem
Système de notifications toast avec différents types et positions.

#### LoadingSpinner
Indicateurs de chargement adaptés aux différents contextes.

### Responsive Design

#### Stratégie Mobile-First
L'interface est conçue en priorité pour les appareils mobiles puis adaptée aux écrans plus grands.

#### Adaptations Mobiles
- Navigation par onglets en bas d'écran
- Formulaires en pleine largeur avec champs empilés
- Tableaux avec défilement horizontal et colonnes prioritaires
- Actions contextuelles via swipe gestures
- Boutons d'action flottants pour les actions principales

#### Adaptations Tablette
- Sidebar rétractable pour la navigation
- Formulaires en deux colonnes
- Tableaux avec toutes les colonnes visibles
- Modals en overlay centré

#### Adaptations Desktop
- Navigation latérale fixe
- Formulaires multi-colonnes optimisés
- Tableaux complets avec actions inline
- Raccourcis clavier pour les actions fréquentes

### Accessibilité

#### Conformité WCAG 2.1 AA
- Contraste minimum 4.5:1 pour le texte normal
- Contraste minimum 3:1 pour le texte large
- Navigation au clavier complète
- Lecteurs d'écran supportés
- Focus visible sur tous les éléments interactifs

#### Fonctionnalités d'Accessibilité
- Textes alternatifs pour toutes les images
- Labels explicites pour tous les champs de formulaire
- Messages d'erreur associés aux champs concernés
- Navigation par landmarks ARIA
- Annonces des changements d'état dynamiques

### Animations et Transitions

#### Principes d'Animation
- Durée standard : 200ms pour les micro-interactions
- Durée longue : 300ms pour les transitions de page
- Easing : ease-out pour les entrées, ease-in pour les sorties
- Respect des préférences utilisateur (prefers-reduced-motion)

#### Types d'Animations
- **Hover States** : Changement de couleur et élévation des boutons
- **Loading States** : Spinners et skeleton screens
- **Page Transitions** : Slide et fade entre les vues
- **Form Feedback** : Validation visuelle en temps réel
- **Data Updates** : Highlight des changements dans les tableaux

### Thèmes et Personnalisation

#### Thème Clair (Défaut)
Thème principal avec arrière-plan clair et contrastes optimisés pour un usage professionnel prolongé.

#### Thème Sombre
Alternative avec arrière-plan sombre pour réduire la fatigue oculaire en environnement peu éclairé.

#### Personnalisation Entreprise
- Upload du logo entreprise
- Couleurs personnalisées pour l'identité visuelle
- Modèles de documents aux couleurs de l'entreprise
- Favicon et titre d'application personnalisés

## Spécifications de Performance

### Métriques de Performance Cibles

#### Temps de Chargement
- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Time to Interactive** : < 3s
- **Cumulative Layout Shift** : < 0.1

#### Réactivité Interface
- **Réponse aux interactions** : < 100ms
- **Transitions fluides** : 60 FPS
- **Scroll fluide** : Pas de janks perceptibles

### Optimisations Frontend

#### Code Splitting
- Chargement paresseux des routes
- Composants lourds en lazy loading
- Bibliothèques tierces en chunks séparés

#### Optimisation des Assets
- Images optimisées avec formats modernes (WebP, AVIF)
- Compression gzip/brotli des ressources
- CDN pour les assets statiques
- Mise en cache aggressive des ressources

#### Optimisation React
- Memoization des composants coûteux
- Virtualisation des listes longues
- Debouncing des recherches et filtres
- Optimisation des re-renders

### Optimisations Backend

#### Cache Stratégique
- Cache Redis pour les données fréquemment accédées
- Cache des requêtes complexes
- Invalidation intelligente du cache

#### Optimisation Base de Données
- Index sur les colonnes de recherche et tri
- Requêtes optimisées avec EXPLAIN
- Pagination efficace avec curseurs
- Connexions poolées

#### Compression et Minification
- Compression gzip des réponses JSON
- Minification des réponses
- Optimisation des requêtes SQL

## Spécifications de Sécurité

### Authentification et Autorisation

#### JWT Security
- Tokens avec expiration courte (1h)
- Refresh tokens sécurisés (7 jours)
- Révocation de tokens en cas de compromission
- Signature avec clés asymétriques

#### Gestion des Sessions
- Limitation des sessions simultanées
- Déconnexion automatique après inactivité
- Détection des connexions suspectes
- Logs d'authentification détaillés

### Protection des Données

#### Chiffrement
- HTTPS obligatoire (TLS 1.3)
- Chiffrement des données sensibles en base
- Hachage sécurisé des mots de passe (bcrypt)
- Chiffrement des communications internes

#### Validation et Sanitisation
- Validation stricte des entrées utilisateur
- Protection contre l'injection SQL
- Sanitisation des données affichées (XSS)
- Validation des types de fichiers uploadés

### Audit et Conformité

#### Logs d'Audit
- Traçabilité de toutes les actions sensibles
- Logs horodatés et signés
- Rétention des logs selon obligations légales
- Alertes sur les actions suspectes

#### Conformité RGPD
- Consentement explicite pour les données
- Droit à l'oubli implémenté
- Portabilité des données
- Notification des violations de données

Cette spécification technique complète fournit tous les éléments nécessaires pour le développement du logiciel de facturation, garantissant une implémentation cohérente, performante et sécurisée.



### Nouveaux Endpoints API pour les Fonctionnalités Étendues

#### Endpoints de Gestion des Employés

##### GET /api/v1/employees
Récupération de la liste des employés.

##### GET /api/v1/employees/:id
Détails d'un employé spécifique.

##### POST /api/v1/employees
Création d'un nouvel employé.

##### PUT /api/v1/employees/:id
Mise à jour d'un employé existant.

##### DELETE /api/v1/employees/:id
Suppression d'un employé.

#### Endpoints de Gestion de la Paie

##### GET /api/v1/salaries
Récupération de la liste des paies.

##### GET /api/v1/salaries/:id
Détails d'une paie spécifique.

##### POST /api/v1/salaries
Création d'une nouvelle paie.

##### PUT /api/v1/salaries/:id
Mise à jour d'une paie existante.

##### DELETE /api/v1/salaries/:id
Suppression d'une paie.

#### Endpoints de Gestion des Dépenses

##### GET /api/v1/expenses
Récupération de la liste des dépenses.

##### GET /api/v1/expenses/:id
Détails d'une dépense spécifique.

##### POST /api/v1/expenses
Création d'une nouvelle dépense.

##### PUT /api/v1/expenses/:id
Mise à jour d'une dépense existante.

##### DELETE /api/v1/expenses/:id
Suppression d'une dépense.

#### Endpoints de Gestion des Fournisseurs

##### GET /api/v1/suppliers
Récupération de la liste des fournisseurs.

##### GET /api/v1/suppliers/:id
Détails d'un fournisseur spécifique.

##### POST /api/v1/suppliers
Création d'un nouveau fournisseur.

##### PUT /api/v1/suppliers/:id
Mise à jour d'un fournisseur existant.

##### DELETE /api/v1/suppliers/:id
Suppression d'un fournisseur.

#### Endpoints de Comptabilité Générale

##### GET /api/v1/accounting/entries
Récupération des écritures comptables.

##### POST /api/v1/accounting/reconcile
Lancement du rapprochement bancaire.

##### GET /api/v1/accounting/balance-sheet
Récupération du bilan.

##### GET /api/v1/accounting/profit-loss
Récupération du compte de résultat.

#### Endpoints de Suivi de Trésorerie

##### GET /api/v1/cash-flow
Récupération des mouvements de trésorerie.

##### GET /api/v1/cash-flow/balance
Récupération du solde de caisse.

##### GET /api/v1/cash-flow/forecast
Récupération des prévisions de trésorerie.

#### Endpoints de Validation des Devis

##### GET /api/v1/quotes/pending-approval
Récupération des devis en attente d'approbation.

##### POST /api/v1/quotes/:id/approve
Approbation d'un devis.

##### POST /api/v1/quotes/:id/reject
Rejet d'un devis avec commentaires.

### Nouveaux Composants Frontend React pour les Fonctionnalités Étendues

#### Composants de Gestion des Employés

##### EmployeeList
Liste des employés avec recherche et filtres.

##### EmployeeForm
Formulaire de création/modification d'employé.

##### SalaryHistory
Historique des paies pour un employé.

#### Composants de Gestion des Dépenses

##### ExpenseList
Liste des dépenses avec recherche, filtres et catégorisation.

##### ExpenseForm
Formulaire de saisie de dépense avec justificatif.

##### SupplierList
Liste des fournisseurs.

##### SupplierForm
Formulaire de création/modification de fournisseur.

#### Composants de Comptabilité

##### AccountingDashboard
Tableau de bord comptable avec bilan, compte de résultat et indicateurs clés.

##### AccountingEntries
Visualisation des écritures comptables.

##### BankReconciliation
Interface pour le rapprochement bancaire.

#### Composants de Trésorerie

##### CashFlowDashboard
Tableau de bord de trésorerie avec solde de caisse et prévisions.

##### CashFlowTransactions
Liste des transactions de trésorerie.

#### Composants de Validation des Devis

##### QuoteApprovalList
Liste des devis en attente d'approbation pour le responsable de service et le Directeur Général, avec filtres par service et statut.

##### QuoteApprovalDetail
Détail d'un devis en attente avec options d'approbation/rejet/demande de modifications, et affichage de l'historique de validation.

Ces ajouts aux spécifications techniques et interfaces permettront d'intégrer pleinement les nouvelles fonctionnalités de comptabilité, de gestion des dépenses, de paie et de validation des devis dans le logiciel de facturation.

