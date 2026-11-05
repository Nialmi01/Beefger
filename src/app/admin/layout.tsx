'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getCurrentUser, hasPermission, getDefaultRouteForRole, StaffUser } from '@/lib/auth';
import { ShieldAlert, ChefHat, Banknote } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<StaffUser | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // If on login route, render standalone without sidebar or protection
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setIsChecking(false);
      return;
    }

    const verifySession = () => {
      const activeUser = getCurrentUser();
      if (!activeUser) {
        setUser(null);
        setIsChecking(false);
        router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      } else {
        setUser(activeUser);
        setIsChecking(false);
      }
    };

    verifySession();

    const handleAuthChange = () => {
      verifySession();
    };

    window.addEventListener('beffger_auth_change', handleAuthChange);
    return () => {
      window.removeEventListener('beffger_auth_change', handleAuthChange);
    };
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#222B2B] text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#F47A22] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="font-heading text-xl uppercase tracking-wider text-[#FFF2DF]">
          Verificando Credenciales de Acceso...
        </h2>
        <p className="text-xs text-[#8b7265] mt-1">Ecosistema Digital Restaurante BEFFGER</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via router.replace
  }

  // Automatic redirect if a non-admin lands on general /admin route
  if (pathname === '/admin' && user.role !== 'Administrador' && user.role !== 'Gerente') {
    const target = getDefaultRouteForRole(user.role);
    if (typeof window !== 'undefined') {
      router.replace(target);
    }
    return (
      <div className="min-h-screen bg-[#222B2B] text-white flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-[#F47A22] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-[#FFF2DF]">Redirigiendo a tu panel asignado ({user.role})...</p>
      </div>
    );
  }

  // Check RBAC permission for route
  const permitted = hasPermission(user.role, pathname);

  if (!permitted) {
    return (
      <div className="flex min-h-screen bg-[#FFF2DF]">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <div className="flex-1 p-6 lg:p-8 flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#dec0b1] shadow-beffger-card text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-100 text-[#ba1a1a] flex items-center justify-center mx-auto">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="font-heading text-2xl text-[#222B2B] uppercase">
                Acceso Restringido por Rol
              </h2>
              <p className="text-xs text-[#574237] leading-relaxed">
                Tu perfil actual es <strong className="text-[#F47A22] uppercase">{user.role}</strong>. Este módulo requiere privilegios administrativos superiores.
              </p>

              <div className="pt-2 flex flex-col gap-2">
                {user.role === 'Cocina' && (
                  <Link
                    href="/admin/cocina"
                    className="w-full py-3 rounded-full bg-[#F47A22] text-white font-bold text-xs uppercase flex items-center justify-center gap-2 shadow"
                  >
                    <ChefHat className="w-4 h-4" />
                    <span>Ir a Pantalla KDS Cocina</span>
                  </Link>
                )}
                {user.role === 'Cajero' && (
                  <Link
                    href="/admin/caja"
                    className="w-full py-3 rounded-full bg-[#10b981] text-white font-bold text-xs uppercase flex items-center justify-center gap-2 shadow"
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Ir a Caja Mostrador POS</span>
                  </Link>
                )}
                <Link
                  href="/admin"
                  className="w-full py-2.5 rounded-full border border-[#dec0b1] text-xs font-bold text-[#574237] uppercase hover:bg-gray-50"
                >
                  Volver al Resumen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FFF2DF]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
