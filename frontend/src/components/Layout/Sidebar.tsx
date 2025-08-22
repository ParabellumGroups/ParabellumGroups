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
  Calendar
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
    name: 'Rapports',
    href: '/reports',
    icon: BarChart3,
    permission: 'reports.financial',
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
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-center h-16 bg-gray-800">
        <h1 className="text-white text-xl font-bold">Parabellum</h1>
      </div>
      
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {visibleItems.map((item) => (
            <div key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
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