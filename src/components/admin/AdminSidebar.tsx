'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, logout, hasPermission, getDefaultRouteForRole, StaffUser } from '@/lib/auth';
import {
  LayoutDashboard,
  Kanban,
  ChefHat,
  Calculator,
  Coins,
  Utensils,
  Boxes,
  ScrollText,
  FileSpreadsheet,
  Bike,
  Users,
  BarChart3,
  Shield,
  Settings,
  LogOut,
  Store,
  Smartphone,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pedidos', label: 'Tablero Kanban', icon: Kanban },
  { href: '/admin/cocina', label: 'Cocina KDS', icon: ChefHat, badge: 'VIVO' },
  { href: '/admin/caja', label: 'Punto de Venta POS', icon: Calculator },
  { href: '/admin/caja/arqueo', label: 'Arqueo de Caja', icon: Coins },
  { href: '/admin/productos', label: 'Productos & Menú', icon: Utensils },
  { href: '/admin/inventario', label: 'Inventario & Stock', icon: Boxes },
  { href: '/admin/inventario/kardex', label: 'Kardex Almacén', icon: ScrollText },
  { href: '/admin/recetas', label: 'Costeo & Recetas', icon: FileSpreadsheet },
  { href: '/admin/domicilios', label: 'Despachos & Riders', icon: Bike },
  { href: '/admin/clientes', label: 'Clientes CRM', icon: Users },
  { href: '/admin/reportes', label: 'Reportes & Finanzas', icon: BarChart3 },
  { href: '/admin/usuarios', label: 'Roles & Permisos', icon: Shield },
  { href: '/admin/descargas', label: 'Apps Móviles Personal', icon: Smartphone, badge: 'APK' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<StaffUser | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    const onAuth = () => setUser(getCurrentUser());
    window.addEventListener('beffger_auth_change', onAuth);
    return () => window.removeEventListener('beffger_auth_change', onAuth);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const defaultHome = user ? getDefaultRouteForRole(user.role) : '/admin';

  // Role-based filtered panels: Admin sees all, each role sees ONLY their designated panels
  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!user) return false;
    return hasPermission(user.role, item.href);
  });

  const sectionTitle =
    user?.role === 'Administrador' || user?.role === 'Gerente'
      ? 'Panel Completo de Control'
      : user?.role === 'Cajero'
      ? 'Módulos de Caja & Ventas'
      : user?.role === 'Cocina'
      ? 'Módulos de Cocina & KDS'
      : user?.role === 'Domiciliario'
      ? 'Módulos de Entrega & Despacho'
      : 'Paneles Operativos';

  return (
    <aside className="w-64 bg-[#222B2B] text-white flex flex-col shrink-0 border-r border-[#363023] min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <Link href={defaultHome} className="flex items-center gap-2">
          <img
            src="/brand/beffger-logo-horizontal.png"
            alt="BEFFGER"
            className="h-9 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-none">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FFC247]">
          {sectionTitle}
        </div>

        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all ${
                isActive
                  ? 'bg-[#F47A22] text-white shadow-md'
                  : 'text-[#EDE1CE]/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#F47A22]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#10b981] text-white text-[9px] font-extrabold animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile & Public Store link */}
      <div className="p-3 border-t border-white/10 space-y-2 bg-black/20">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#FFC247] hover:bg-white/10 transition-colors"
        >
          <Store className="w-4 h-4" />
          <span>Ver Tienda Online ↗</span>
        </Link>

        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#F47A22] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user?.avatarInitials || 'BF'}
            </div>
            <div className="min-w-0">
              <span className="font-bold text-white block truncate text-[11px]">
                {user?.name || 'Colaborador'}
              </span>
              <span className="text-[10px] text-[#10b981] font-semibold block truncate">
                ● {user?.role || 'En Turno'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/60 hover:text-[#E94D3C] p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Cerrar Sesión"
            type="button"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
