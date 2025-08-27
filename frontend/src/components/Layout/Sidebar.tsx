import React, { useState } from 'react';
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
  MessageSquare,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { NavigationItem } from '../../types';

// Define category items separately with a different structure
const categoryItems = [
  {
    name: 'Service Commercial',
    icon: Target,
    permission: 'prospects.read',
    children: [
      {
        name: 'Prospection',
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
    name: 'Service Comptabilité',
    icon: DollarSign,
    permission: 'invoices.read',
    children: [
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
        name: 'Dépenses',
        href: '/expenses',
        icon: DollarSign,
        permission: 'expenses.read',
      },
      {
        name: 'Rapports',
        href: '/reports',
        icon: BarChart3,
        permission: 'reports.financial',
      },
    ],
  },
  {
    name: 'Ressources Humaines',
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
    name: 'Progiteck',
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
    ],
  },
  {
    name: 'Administration',
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
    name: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    permission: 'messages.read',
  },
  {
    name: 'Produits',
    href: '/products',
    icon: Package,
    permission: 'products.read',
  },
  {
    name: 'Matériel',
    href: '/services/materiel',
    icon: Package,
    permission: 'materiels.read',
  },
];

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { hasPermission } = useAuth();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Service Commercial': true,
    'Service Comptabilité': true,
    'Ressources Humaines': true,
    'Progiteck': true,
    'Administration': true,
  });

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const filterNavigationItems = (items: NavigationItem[]): NavigationItem[] => {
    return items.filter(item => {
      if (item.permission && !hasPermission(item.permission)) {
        return false;
      }
      return true;
    });
  };

  const filterCategoryItems = (items: any[]) => {
    return items.filter(item => {
      if (item.permission && !hasPermission(item.permission)) {
        return false;
      }

      if (item.children) {
        item.children = item.children.filter((child: any) => 
          !child.permission || hasPermission(child.permission)
        );
        return item.children.length > 0;
      }

      return true;
    });
  };

  const visibleItems = filterNavigationItems(navigationItems);
  const visibleCategories = filterCategoryItems(categoryItems);

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 dark:bg-gray-950 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-center h-16 bg-gray-800 dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          <img 
            src="/parrabellum.jpg" 
            alt="Parabellum Groups" 
            className="w-8 h-8 rounded-full"
          />
          <h1 className="text-white text-xl font-bold">Parabellum Groups</h1>
        </div>
      </div>
      
      {/* Navigation avec défilement */}
      <nav className="flex-1 scrollbar-custom overflow-y-auto">
        <div className="px-4 space-y-2 py-4">
          {visibleItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href!}
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
          ))}
          
          {visibleCategories.map((category) => (
            <div key={category.name}>
              <button
                onClick={() => toggleCategory(category.name)}
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md transition-colors text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-600 hover:text-white"
              >
                <div className="flex items-center">
                  <category.icon className="mr-3 h-5 w-5" />
                  {category.name}
                </div>
                {expandedCategories[category.name] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              
              {expandedCategories[category.name] && category.children && (
                <div className="ml-4 mt-2 space-y-1">
                  {category.children.map((child: any) => (
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