// Définition des permissions granulaires
export const PERMISSIONS_LIST = {
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

  // Contrats
  'contracts.create': 'Créer des contrats',
  'contracts.read': 'Consulter les contrats',
  'contracts.update': 'Modifier les contrats',
  'contracts.delete': 'Supprimer les contrats',

  // Salaires
  'salaries.create': 'Créer des salaires',
  'salaries.read': 'Consulter les salaires',
  'salaries.update': 'Modifier les salaires',
  'salaries.delete': 'Supprimer les salaires',

  // Congés
  'leaves.create': 'Créer des demandes de congé',
  'leaves.read': 'Consulter les demandes de congé',
  'leaves.update': 'Modifier les demandes de congé',
  'leaves.delete': 'Supprimer les demandes de congé',
  'leaves.approve': 'Approuver les demandes de congé',
  'leaves.reject': 'Rejeter les demandes de congé',

  // Prêts
  'loans.create': 'Créer des prêts',
  'loans.read': 'Consulter les prêts',
  'loans.update': 'Modifier les prêts',
  'loans.delete': 'Supprimer les prêts',

  // Services Techniques
  'specialites.create': 'Créer des spécialités',
  'specialites.read': 'Consulter les spécialités',
  'specialites.update': 'Modifier les spécialités',
  'specialites.delete': 'Supprimer les spécialités',

  'techniciens.create': 'Créer des techniciens',
  'techniciens.read': 'Consulter les techniciens',
  'techniciens.update': 'Modifier les techniciens',
  'techniciens.delete': 'Supprimer les techniciens',

  'missions.create': 'Créer des missions',
  'missions.read': 'Consulter les missions',
  'missions.update': 'Modifier les missions',
  'missions.delete': 'Supprimer les missions',

  'interventions.create': 'Créer des interventions',
  'interventions.read': 'Consulter les interventions',
  'interventions.update': 'Modifier les interventions',
  'interventions.delete': 'Supprimer les interventions',

  'materiels.create': 'Créer du matériel',
  'materiels.read': 'Consulter le matériel',
  'materiels.update': 'Modifier le matériel',
  'materiels.delete': 'Supprimer le matériel',

  'rapports.create': 'Créer des rapports de mission',
  'rapports.read': 'Consulter les rapports de mission',
  'rapports.update': 'Modifier les rapports de mission',
  'rapports.validate': 'Valider les rapports de mission'
} as const;

// Permissions par rôle
export const ROLE_PERMISSIONS = {
  ADMIN: Object.keys(PERMISSIONS_LIST),
  
  GENERAL_DIRECTOR: [
    'users.read', 'customers.read', 'quotes.read', 'quotes.approve_dg',
    'invoices.read', 'payments.read', 'products.read', 'expenses.read',
    'reports.financial', 'reports.sales', 'reports.audit',
    'employees.read', 'contracts.read', 'salaries.read',
    'leaves.read', 'leaves.approve', 'leaves.reject',
    'loans.read'
  ],
  
  SERVICE_MANAGER: [
    'users.read', 'customers.create', 'customers.read', 'customers.update',
    'quotes.create', 'quotes.read', 'quotes.update', 'quotes.approve_service',
    'invoices.read', 'payments.read', 'products.read', 'expenses.read',
    'reports.sales', 'prospects.create', 'prospects.read', 'prospects.update', 'prospects.assign',
    'employees.create', 'employees.read', 'employees.update',
    'contracts.create', 'contracts.read', 'contracts.update',
    'leaves.read', 'leaves.approve', 'leaves.reject',
    'loans.create', 'loans.read', 'loans.update',
    'specialites.create', 'specialites.read', 'specialites.update',
    'techniciens.create', 'techniciens.read', 'techniciens.update',
    'missions.create', 'missions.read', 'missions.update',
    'interventions.create', 'interventions.read', 'interventions.update',
    'materiels.create', 'materiels.read', 'materiels.update',
    'rapports.read', 'rapports.validate'
  ],
  
  EMPLOYEE: [
    'customers.create', 'customers.read', 'customers.update',
    'quotes.create', 'quotes.read', 'quotes.update', 'quotes.submit_for_approval',
    'products.read', 'prospects.create', 'prospects.read', 'prospects.update',
    'leaves.create', 'leaves.read',
    'loans.read',
    'techniciens.read', 'missions.read', 'interventions.read', 'materiels.read',
    'rapports.create', 'rapports.read'
  ],
  
  ACCOUNTANT: [
    'customers.read', 'quotes.read', 'invoices.create', 'invoices.read',
    'invoices.update', 'invoices.send', 'payments.create', 'payments.read',
    'payments.update', 'expenses.create', 'expenses.read', 'expenses.update',
    'reports.financial', 'salaries.create', 'salaries.read', 'salaries.update',
    'loans.create', 'loans.read', 'loans.update'
  ]
};

// Fonction utilitaire pour vérifier les permissions
export const hasPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  return userPermissions.includes(requiredPermission);
};

// Fonction pour obtenir les permissions d'un rôle
export const getRolePermissions = (role: keyof typeof ROLE_PERMISSIONS): string[] => {
  return ROLE_PERMISSIONS[role] || [];
};

// Fonction pour valider une permission
export const isValidPermission = (permission: string): boolean => {
  return Object.keys(PERMISSIONS_LIST).includes(permission);
};