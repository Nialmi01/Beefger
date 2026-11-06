'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Shield,
  UserCheck,
  Lock,
  Plus,
  Key,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Gerente' | 'Cajero' | 'Cocina' | 'Domiciliario';
  isActive: boolean;
  lastLogin: string;
}

const INITIAL_STAFF: StaffUser[] = [
  { id: 'u-superadmin', name: 'Super Administrador BEFFGER', email: 'admin@beffger.com', role: 'Administrador', isActive: true, lastLogin: 'En línea' },
  { id: 'u-gerente', name: 'Carlos Gerente Operativo', email: 'gerente@beffger.com', role: 'Gerente', isActive: true, lastLogin: 'Inactivo' },
  { id: 'u-cajero', name: 'Valentina Cajera Principal', email: 'cajero@beffger.com', role: 'Cajero', isActive: true, lastLogin: 'Inactivo' },
  { id: 'u-cocina', name: 'Chef Andrés Parrillero', email: 'cocina@beffger.com', role: 'Cocina', isActive: true, lastLogin: 'Inactivo' },
  { id: 'u-rider', name: 'Brayan Domiciliario BEFFGER', email: 'rider@beffger.com', role: 'Domiciliario', isActive: true, lastLogin: 'Inactivo' },
];

export default function UsersRolesPage() {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffUser[]>(INITIAL_STAFF);

  const toggleUserActive = (id: string) => {
    setStaff((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-heading text-xs text-[#F47A22] uppercase font-bold tracking-wider">
            SEGURIDAD & CONTROL DE ACCESO
          </span>
          <h1 className="font-heading text-3xl text-[#222B2B] uppercase mt-0.5">
            Roles & Permisos del Personal
          </h1>
          <p className="text-xs text-[#574237]">
            Administración de perfiles autorizados con políticas RLS de Supabase.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#10b981] bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            5 Perfiles Configurados
          </span>
        </div>
      </div>

      {/* Roles Permission Matrix Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-4">
        <h3 className="font-heading text-xl text-[#222B2B] uppercase border-b border-[#dec0b1] pb-3">
          Matriz de Permisos por Rol
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#FFF2DF]/60 border border-[#dec0b1] space-y-2">
            <span className="font-bold text-[#F47A22] block uppercase text-sm">Administrador</span>
            <ul className="space-y-1 text-[#574237] text-[11px]">
              <li>✓ Acceso total al sistema</li>
              <li>✓ Edición de recetas y precios</li>
              <li>✓ Finanzas y auditoría</li>
              <li>✓ Gestión de usuarios</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF2DF]/60 border border-[#dec0b1] space-y-2">
            <span className="font-bold text-[#222B2B] block uppercase text-sm">Gerente</span>
            <ul className="space-y-1 text-[#574237] text-[11px]">
              <li>✓ Operaciones y pedidos</li>
              <li>✓ Kardex e inventario</li>
              <li>✓ Reportes de ventas</li>
              <li>✗ No edita contraseñas admin</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF2DF]/60 border border-[#dec0b1] space-y-2">
            <span className="font-bold text-[#10b981] block uppercase text-sm">Cajero</span>
            <ul className="space-y-1 text-[#574237] text-[11px]">
              <li>✓ Terminal POS presencial</li>
              <li>✓ Arqueo y cierre de turno</li>
              <li>✓ Consulta de clientes CRM</li>
              <li>✗ Sin acceso a costos/recetas</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF2DF]/60 border border-[#dec0b1] space-y-2">
            <span className="font-bold text-[#c99315] block uppercase text-sm">Cocina</span>
            <ul className="space-y-1 text-[#574237] text-[11px]">
              <li>✓ Pantalla KDS en tiempo real</li>
              <li>✓ Cambio de estados en parrilla</li>
              <li>✓ Ver especificaciones y notas</li>
              <li>✗ Sin acceso a caja ni dinero</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF2DF]/60 border border-[#dec0b1] space-y-2">
            <span className="font-bold text-purple-600 block uppercase text-sm">Domiciliario</span>
            <ul className="space-y-1 text-[#574237] text-[11px]">
              <li>✓ App móvil para repartidores</li>
              <li>✓ Pedidos asignados y rutas</li>
              <li>✓ Check de entrega cliente</li>
              <li>✗ Solo ve órdenes propias</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Staff Users Table */}
      <div className="bg-white rounded-3xl border border-[#dec0b1] shadow-beffger-card overflow-hidden">
        <div className="p-5 border-b border-[#dec0b1]">
          <h3 className="font-heading text-xl text-[#222B2B] uppercase">
            Usuarios con Acceso Autorizado
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#222B2B] text-white uppercase text-[10px] tracking-wider font-heading">
              <tr>
                <th className="p-4">Colaborador</th>
                <th className="p-4">Correo</th>
                <th className="p-4">Rol Asignado</th>
                <th className="p-4">Último Ingreso</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dec0b1]/60">
              {staff.map((u) => (
                <tr key={u.id} className="hover:bg-[#FFF2DF]/30">
                  <td className="p-4 font-bold text-[#222B2B]">{u.name}</td>
                  <td className="p-4 text-[#574237] font-mono">{u.email}</td>
                  <td className="p-4">
                    <span className="bg-[#FFF2DF] text-[#222B2B] font-bold px-2.5 py-1 rounded-lg border border-[#dec0b1] uppercase text-[11px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-[#8b7265]">{u.lastLogin}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {u.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserActive(u.id)}
                      className="px-2.5 py-1 rounded-lg border border-[#dec0b1] hover:bg-gray-100 text-[11px] font-bold"
                    >
                      {u.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
