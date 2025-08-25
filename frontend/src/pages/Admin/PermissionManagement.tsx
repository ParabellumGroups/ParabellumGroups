import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Users, Settings, Eye, Edit, Search, Save, X, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { createCrudService } from '../../services/api';

const userService = createCrudService('users');

const roleLabels = {
  ADMIN: 'Administrateur',
  GENERAL_DIRECTOR: 'Directeur Général',
  SERVICE_MANAGER: 'Responsable de Service',
  EMPLOYEE: 'Employé',
  ACCOUNTANT: 'Comptable'
};

const permissionCategories = {
  users: {
    label: 'Utilisateurs',
    color: 'bg-blue-100 text-blue-800',
    permissions: [
      { key: 'users.create', label: 'Créer des utilisateurs' },
      { key: 'users.read', label: 'Consulter les utilisateurs' },
      { key: 'users.update', label: 'Modifier les utilisateurs' },
      { key: 'users.delete', label: 'Supprimer les utilisateurs' },
      { key: 'users.manage_permissions', label: 'Gérer les permissions' }
    ]
  },
  customers: {
    label: 'Clients',
    color: 'bg-green-100 text-green-800',
    permissions: [
      { key: 'customers.create', label: 'Créer des clients' },
      { key: 'customers.read', label: 'Consulter les clients' },
      { key: 'customers.update', label: 'Modifier les clients' },
      { key: 'customers.delete', label: 'Supprimer les clients' }
    ]
  },
  quotes: {
    label: 'Devis',
    color: 'bg-yellow-100 text-yellow-800',
    permissions: [
      { key: 'quotes.create', label: 'Créer des devis' },
      { key: 'quotes.read', label: 'Consulter les devis' },
      { key: 'quotes.update', label: 'Modifier les devis' },
      { key: 'quotes.delete', label: 'Supprimer les devis' },
      { key: 'quotes.submit_for_approval', label: 'Soumettre pour approbation' },
      { key: 'quotes.approve_service', label: 'Approuver (Service)' },
      { key: 'quotes.approve_dg', label: 'Approuver (DG)' }
    ]
  },
  invoices: {
    label: 'Factures',
    color: 'bg-purple-100 text-purple-800',
    permissions: [
      { key: 'invoices.create', label: 'Créer des factures' },
      { key: 'invoices.read', label: 'Consulter les factures' },
      { key: 'invoices.update', label: 'Modifier les factures' },
      { key: 'invoices.delete', label: 'Supprimer les factures' },
      { key: 'invoices.send', label: 'Envoyer les factures' }
    ]
  },
  payments: {
    label: 'Paiements',
    color: 'bg-indigo-100 text-indigo-800',
    permissions: [
      { key: 'payments.create', label: 'Enregistrer des paiements' },
      { key: 'payments.read', label: 'Consulter les paiements' },
      { key: 'payments.update', label: 'Modifier les paiements' },
      { key: 'payments.delete', label: 'Supprimer les paiements' }
    ]
  },
  products: {
    label: 'Produits',
    color: 'bg-pink-100 text-pink-800',
    permissions: [
      { key: 'products.create', label: 'Créer des produits' },
      { key: 'products.read', label: 'Consulter les produits' },
      { key: 'products.update', label: 'Modifier les produits' },
      { key: 'products.delete', label: 'Supprimer les produits' }
    ]
  },
  expenses: {
    label: 'Dépenses',
    color: 'bg-red-100 text-red-800',
    permissions: [
      { key: 'expenses.create', label: 'Créer des dépenses' },
      { key: 'expenses.read', label: 'Consulter les dépenses' },
      { key: 'expenses.update', label: 'Modifier les dépenses' },
      { key: 'expenses.delete', label: 'Supprimer les dépenses' }
    ]
  },
  reports: {
    label: 'Rapports',
    color: 'bg-gray-100 text-gray-800',
    permissions: [
      { key: 'reports.financial', label: 'Rapports financiers' },
      { key: 'reports.sales', label: 'Rapports de vente' },
      { key: 'reports.audit', label: 'Logs d\'audit' }
    ]
  },
  employees: {
    label: 'Employés',
    color: 'bg-teal-100 text-teal-800',
    permissions: [
      { key: 'employees.create', label: 'Créer des employés' },
      { key: 'employees.read', label: 'Consulter les employés' },
      { key: 'employees.update', label: 'Modifier les employés' },
      { key: 'employees.delete', label: 'Supprimer les employés' }
    ]
  },
  leaves: {
    label: 'Congés',
    color: 'bg-cyan-100 text-cyan-800',
    permissions: [
      { key: 'leaves.create', label: 'Créer des demandes' },
      { key: 'leaves.read', label: 'Consulter les demandes' },
      { key: 'leaves.update', label: 'Modifier les demandes' },
      { key: 'leaves.approve', label: 'Approuver les demandes' }
    ]
  },
  admin: {
    label: 'Administration',
    color: 'bg-orange-100 text-orange-800',
    permissions: [
      { key: 'admin.system_settings', label: 'Paramètres système' },
      { key: 'admin.backup', label: 'Sauvegardes' },
      { key: 'admin.logs', label: 'Logs système' }
    ]
  }
};

export const PermissionManagement: React.FC = () => {
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', search],
    queryFn: () => userService.getAll({ search, limit: 100 })
  });

  const updatePermissionsMutation = useMutation({
    mutationFn: ({ userId, permissions }: { userId: number; permissions: string[] }) =>
      fetch(`/api/v1/users/${userId}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ permissions })
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditing(false);
    }
  });

  const handleUserSelect = async (user: any) => {
    setSelectedUser(user);
    setIsEditing(false);
    
    // Récupérer les permissions actuelles de l'utilisateur
    try {
      const response = await fetch(`/api/v1/users/${user.id}/permissions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUserPermissions(data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des permissions:', error);
      setUserPermissions([]);
    }
  };

  const handlePermissionToggle = (permission: string) => {
    setUserPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;
    
    try {
      await updatePermissionsMutation.mutateAsync({
        userId: selectedUser.id,
        permissions: userPermissions
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const getAllPermissions = () => {
    return Object.values(permissionCategories).flatMap(category => 
      category.permissions.map(p => p.key)
    );
  };

  const handleSelectAll = () => {
    setUserPermissions(getAllPermissions());
  };

  const handleDeselectAll = () => {
    setUserPermissions([]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const usersList = users?.data?.users || [];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Permissions</h1>
          <p className="text-gray-600">Attribuez des permissions spécifiques à chaque utilisateur</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des utilisateurs */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Utilisateurs</h3>
              <div className="mt-3 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {usersList.map((user: any) => (
                <div
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedUser?.id === user.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-700">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                      <div className="text-xs text-blue-600">
                        {roleLabels[user.role as keyof typeof roleLabels]}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Configuration des permissions */}
        <div className="lg:col-span-2">
          {selectedUser ? (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Permissions de {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {roleLabels[selectedUser.role as keyof typeof roleLabels]} • {selectedUser.service?.name || 'Aucun service'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Modifier</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSavePermissions}
                          disabled={updatePermissionsMutation.isPending}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2 disabled:opacity-50"
                        >
                          <Save className="h-4 w-4" />
                          <span>Sauvegarder</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            handleUserSelect(selectedUser);
                          }}
                          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center space-x-2"
                        >
                          <X className="h-4 w-4" />
                          <span>Annuler</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {isEditing && (
                  <div className="mt-4 flex items-center space-x-4">
                    <button
                      onClick={handleSelectAll}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Tout sélectionner
                    </button>
                    <button
                      onClick={handleDeselectAll}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Tout désélectionner
                    </button>
                    <div className="text-sm text-gray-500">
                      {userPermissions.length} permission(s) sélectionnée(s)
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {Object.entries(permissionCategories).map(([categoryKey, category]) => (
                    <div key={categoryKey} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-gray-400 mr-2" />
                          <h4 className="text-lg font-medium text-gray-900">{category.label}</h4>
                          <span className={`ml-2 inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${category.color}`}>
                            {category.permissions.length} permissions
                          </span>
                        </div>
                        {isEditing && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                const categoryPermissions = category.permissions.map(p => p.key);
                                const hasAll = categoryPermissions.every(p => userPermissions.includes(p));
                                if (hasAll) {
                                  setUserPermissions(prev => prev.filter(p => !categoryPermissions.includes(p)));
                                } else {
                                  setUserPermissions(prev => [...new Set([...prev, ...categoryPermissions])]);
                                }
                              }}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              {category.permissions.every(p => userPermissions.includes(p.key)) ? 'Désélectionner tout' : 'Sélectionner tout'}
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {category.permissions.map((permission) => (
                          <div key={permission.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-3 ${
                                userPermissions.includes(permission.key) 
                                  ? 'bg-green-500' 
                                  : 'bg-gray-300'
                              }`}></div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {permission.label}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {permission.key}
                                </div>
                              </div>
                            </div>
                            {isEditing && (
                              <button
                                onClick={() => handlePermissionToggle(permission.key)}
                                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                                  userPermissions.includes(permission.key)
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'border-gray-300 hover:border-blue-500'
                                }`}
                              >
                                {userPermissions.includes(permission.key) && (
                                  <Check className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sélectionnez un utilisateur
              </h3>
              <p className="text-gray-500">
                Choisissez un utilisateur dans la liste pour configurer ses permissions
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Résumé des rôles par défaut */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Permissions par Rôle (Défaut)</h3>
          <p className="text-sm text-gray-500">
            Permissions standard attribuées automatiquement selon le rôle
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(roleLabels).map(([role, label]) => (
              <div key={role} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-medium text-gray-900">{label}</h4>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  {role === 'ADMIN' && (
                    <div>
                      <div className="font-medium text-green-600">✓ Accès complet</div>
                      <div>Toutes les fonctionnalités</div>
                    </div>
                  )}
                  {role === 'GENERAL_DIRECTOR' && (
                    <div>
                      <div className="font-medium text-blue-600">✓ Validation finale</div>
                      <div>Approbation devis, rapports complets</div>
                    </div>
                  )}
                  {role === 'SERVICE_MANAGER' && (
                    <div>
                      <div className="font-medium text-purple-600">✓ Gestion service</div>
                      <div>Son service + validation devis</div>
                    </div>
                  )}
                  {role === 'EMPLOYEE' && (
                    <div>
                      <div className="font-medium text-yellow-600">✓ Opérations courantes</div>
                      <div>Création devis, gestion clients</div>
                    </div>
                  )}
                  {role === 'ACCOUNTANT' && (
                    <div>
                      <div className="font-medium text-indigo-600">✓ Gestion financière</div>
                      <div>Factures, paiements, rapports</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};