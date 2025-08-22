import React from 'react';
import { Users, FileText, Receipt, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, change }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              {change && (
                <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  {change}
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { user, hasPermission } = useAuth();

  const stats = [
    {
      title: 'Clients actifs',
      value: '156',
      icon: Users,
      color: 'text-blue-600',
      change: '+12%',
      permission: 'customers.read'
    },
    {
      title: 'Devis en cours',
      value: '23',
      icon: FileText,
      color: 'text-yellow-600',
      change: '+5%',
      permission: 'quotes.read'
    },
    {
      title: 'Factures impayées',
      value: '8',
      icon: Receipt,
      color: 'text-red-600',
      change: '-2%',
      permission: 'invoices.read'
    },
    {
      title: 'CA du mois',
      value: '125M FCFA',
      icon: DollarSign,
      color: 'text-green-600',
      change: '+18%',
      permission: 'reports.financial'
    },
  ];

  const visibleStats = stats.filter(stat => !stat.permission || hasPermission(stat.permission));

  const recentActivities = [
    {
      id: 1,
      type: 'quote',
      message: 'Nouveau devis créé pour SIFCA Group',
      time: 'Il y a 2 heures',
      user: 'Yao Konan'
    },
    {
      id: 2,
      type: 'payment',
      message: 'Paiement reçu de Progitek Solutions',
      time: 'Il y a 4 heures',
      user: 'Mariam Cissé'
    },
    {
      id: 3,
      type: 'approval',
      message: 'Devis approuvé par le service commercial',
      time: 'Il y a 6 heures',
      user: 'Fatou Diabaté'
    },
  ];

  const pendingApprovals = [
    {
      id: 1,
      type: 'Devis',
      reference: 'DEV-2024-001',
      client: 'SIFCA Group',
      amount: '2.5M FCFA',
      status: 'En attente validation DG'
    },
    {
      id: 2,
      type: 'Devis',
      reference: 'DEV-2024-002',
      client: 'Progitek Solutions',
      amount: '1.8M FCFA',
      status: 'En attente validation service'
    },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête de bienvenue */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bonjour, {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-gray-600">
              Voici un aperçu de votre activité aujourd'hui
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Service</p>
            <p className="font-medium text-gray-900">{user?.service?.name}</p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visibleStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activités récentes */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Activités récentes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">
                      {activity.time} • {activity.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Approbations en attente */}
        {(hasPermission('quotes.approve_service') || hasPermission('quotes.approve_dg')) && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                Approbations en attente
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pendingApprovals.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.type} {item.reference}
                        </p>
                        <p className="text-sm text-gray-600">{item.client}</p>
                        <p className="text-sm font-medium text-green-600">{item.amount}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};