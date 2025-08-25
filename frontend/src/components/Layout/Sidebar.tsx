import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Users,
  FileText,
  Receipt,
  CreditCard,
  Package,
  TrendingUp,
  Settings,
  Building2,
  UserCheck,
  DollarSign,
  BarChart3,
  Calendar,
  Wrench,
  Target,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { NavigationItem } from '../../types';

const navigationItems: NavigationItem[] = [
  {
    name: 'Tableau de bord',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Clients',
    href: '/customers',
    icon: Users,
    permission: 'customers.read',
  },
  {
    name: 'Devis',
    href: '/quotes',
    icon: FileText,
    permission: 'quotes.read',
  },
  {
    name: 'Factures',
    href: '/invoices',
    icon: Receipt,
    permission: 'invoices.read',
  },
  {
    name: 'Paiements',
    href: '/payments',
    icon: CreditCard,
    permission: 'payments.read',
  },
  {
    name: 'Produits',
    href: '/products',
    icon: Package,
    permission: 'products.read',
  },
  {
    name: 'Dépenses',
    href: '/expenses',
    icon: DollarSign,
    permission: 'expenses.read',
  },
  {
    name: 'Commercial',
    href: '/commercial',
    icon: Target,
    permission: 'prospects.read',
    children: [
      {
        name: 'Workflow Prospection',
        href: '/commercial/prospection',
        icon: Target,
        permission: 'prospects.read',
      },
      {
        name: 'Pipeline CRM',
        href: '/commercial/pipeline',
        icon: TrendingUp,
        permission: 'quotes.read',
      },
    ],
  },
  {
    name: 'Rapports',
    href: '/reports',
    icon: BarChart3,
    permission: 'reports.financial',
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    permission: 'messages.read',
  },
  {
    name: 'Ressources Humaines',
    href: '/hr',
    icon: UserCheck,
    permission: 'employees.read',
    children: [
      {
        name: 'Employés',
        href: '/hr/employees',
        icon: Users,
        permission: 'employees.read',
      },
      {
        name: 'Salaires',
        href: '/hr/salaries',
        icon: DollarSign,
        permission: 'salaries.read',
      },
      {
        name: 'Contrats',
        href: '/hr/contracts',
        icon: FileText,
        permission: 'contracts.read',
      },
      {
        name: 'Congés',
        href: '/hr/leaves',
        icon: Calendar,
        permission: 'leaves.read',
      },
      {
        name: 'Prêts',
        href: '/hr/loans',
        icon: DollarSign,
        permission: 'loans.read',
      },
    ],
  },
  {
    name: 'Services Techniques',
    href: '/services',
    icon: Wrench,
    permission: 'techniciens.read',
    children: [
      {
        name: 'Spécialités',
        href: '/services/specialites',
        icon: Wrench,
        permission: 'specialites.read',
      },
      {
        name: 'Techniciens',
        href: '/services/techniciens',
        icon: Users,
        permission: 'techniciens.read',
      },
      {
        name: 'Missions',
        href: '/services/missions',
        icon: FileText,
        permission: 'missions.read',
      },
      {
        name: 'Interventions',
        href: '/services/interventions',
        icon: Calendar,
        permission: 'interventions.read',
      },
      {
        name: 'Matériel',
        href: '/services/materiel',
        icon: Package,
        permission: 'materiels.read',
      },
    ],
  },
  {
    name: 'Administration',
    href: '/admin',
    icon: Settings,
    permission: 'admin.system_settings',
    children: [
      {
        name: 'Utilisateurs',
        href: '/admin/users',
        icon: UserCheck,
        permission: 'users.read',
      },
      {
        name: 'Services',
        href: '/admin/services',
        icon: Building2,
        permission: 'admin.system_settings',
      },
      {
        name: 'Permissions',
        href: '/admin/permissions',
        icon: UserCheck,
        permission: 'users.manage_permissions',
      },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { hasPermission } = useAuth();

  const filterNavigationItems = (items: NavigationItem[]): NavigationItem[] => {
    return items.filter(item => {
      // Si l'item a une permission requise, vérifier qu'on l'a
      if (item.permission && !hasPermission(item.permission)) {
        return false;
      }

      // Filtrer récursivement les enfants
      if (item.children) {
        item.children = filterNavigationItems(item.children);
        // Garder l'item parent s'il a au moins un enfant visible
        return item.children.length > 0;
      }

      return true;
    });
  };

  const visibleItems = filterNavigationItems(navigationItems);

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 dark:bg-gray-950 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-center h-16 bg-gray-800 dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          <img 
            src="/parrabellum.jpg" 
            alt="Parabellum Groups" 
            className="w-8 h-8 rounded-full"
          />
          <h1 className="text-white text-xl font-bold">Parabellum</h1>
        </div>
      </div>
      
      <nav className="mt-8 h-full overflow-y-auto scrollbar-hide pb-20">
        <div className="px-4 space-y-2">
          {visibleItems.map((item) => (
            <div key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-gray-800 dark:bg-gray-700 text-white'
                      : 'text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-600 hover:text-white'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
              
              {item.children && (
                <div className="ml-4 mt-2 space-y-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.name}
                      to={child.href}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-gray-800 dark:bg-gray-700 text-white'
                            : 'text-gray-400 dark:text-gray-500 hover:bg-gray-700 dark:hover:bg-gray-600 hover:text-white'
                        }`
                      }
                    >
                      <child.icon className="mr-3 h-4 w-4" />
                      {child.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};