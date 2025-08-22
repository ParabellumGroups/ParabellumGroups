// Définition des permissions granulaires
export const PERMISSIONS = {
  // Utilisateurs
  'users.create': 'Créer des utilisateurs',
  'users.read': 'Consulter les utilisateurs',
  'users.update': 'Modifier les utilisateurs',
  'users.delete': 'Supprimer les utilisateurs',
  'users.manage_permissions': 'Gérer les permissions',

  // Clients
  'customers.create': 'Créer des clients',
  'customers.read': 'Consulter les clients',
  'customers.update': 'Modifier les clients',
  'customers.delete': 'Supprimer les clients',

  // Devis
  'quotes.create': 'Créer des devis',
  'quotes.read': 'Consulter les devis',
  'quotes.update': 'Modifier les devis',
  'quotes.delete': 'Supprimer les devis',
  'quotes.submit_for_approval': 'Soumettre pour approbation',
  'quotes.approve_service': 'Approuver (Responsable Service)',
  'quotes.approve_dg': 'Approuver (Directeur Général)',
  'quotes.reject': 'Rejeter les devis',

  // Factures
  'invoices.create': 'Créer des factures',
  'invoices.read': 'Consulter les factures',
  'invoices.update': 'Modifier les factures',
  'invoices.delete': 'Supprimer les factures',
  'invoices.send': 'Envoyer les factures',

  // Paiements
  'payments.create': 'Enregistrer des paiements',
  'payments.read': 'Consulter les paiements',
  'payments.update': 'Modifier les paiements',
  'payments.delete': 'Supprimer les paiements',

  // Produits
  'products.create': 'Créer des produits',
  'products.read': 'Consulter les produits',
  'products.update': 'Modifier les produits',
  'products.delete': 'Supprimer les produits',

  // Dépenses
  'expenses.create': 'Créer des dépenses',
  'expenses.read': 'Consulter les dépenses',
  'expenses.update': 'Modifier les dépenses',
  'expenses.delete': 'Supprimer les dépenses',

  // Rapports
  'reports.financial': 'Consulter les rapports financiers',
  'reports.sales': 'Consulter les rapports de vente',
  'reports.audit': 'Consulter les logs d\'audit',

  // Administration
  'admin.system_settings': 'Gérer les paramètres système',
  'admin.backup': 'Gérer les sauvegardes',
  'admin.logs': 'Consulter les logs système',

  // Employés
  'employees.create': 'Créer des employés',
  'employees.read': 'Consulter les employés',
  'employees.update': 'Modifier les employés',
  'employees.delete': 'Supprimer les employés',

  // Congés
  'leaves.create': 'Créer des demandes de congé',
  'leaves.read': 'Consulter les demandes de congé',
  'leaves.update': 'Modifier les demandes de congé',
  'leaves.delete': 'Supprimer les demandes de congé',
  'leaves.approve': 'Approuver les demandes de congé',
  'leaves.reject': 'Rejeter les demandes de congé'
} as const;

// Permissions par rôle
export const ROLE_PERMISSIONS = {
  ADMIN: Object.keys(PERMISSIONS),
  
  GENERAL_DIRECTOR: [
    'users.read', 'customers.read', 'quotes.read', 'quotes.approve_dg',
    'invoices.read', 'payments.read', 'products.read', 'expenses.read',
    'reports.financial', 'reports.sales', 'reports.audit',
    'employees.read', 'leaves.read', 'leaves.approve', 'leaves.reject'
  ],
  
  SERVICE_MANAGER: [
    'users.read', 'customers.create', 'customers.read', 'customers.update',
    'quotes.create', 'quotes.read', 'quotes.update', 'quotes.approve_service',
    'invoices.read', 'payments.read', 'products.read', 'expenses.read',
    'reports.sales', 'employees.create', 'employees.read', 'employees.update',
    'leaves.read', 'leaves.approve', 'leaves.reject'
  ],
  
  EMPLOYEE: [
    'customers.create', 'customers.read', 'customers.update',
    'quotes.create', 'quotes.read', 'quotes.update', 'quotes.submit_for_approval',
    'products.read', 'leaves.create', 'leaves.read'
  ],
  
  ACCOUNTANT: [
    'customers.read', 'quotes.read', 'invoices.create', 'invoices.read',
    'invoices.update', 'invoices.send', 'payments.create', 'payments.read',
    'payments.update', 'expenses.create', 'expenses.read', 'expenses.update',
    'reports.financial'
  ]
};