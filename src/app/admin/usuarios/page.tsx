'use client';

import React, { useState, useEffect } from 'react';
import {
  StaffUser,
  StaffRole,
  getStaffUsers,
  createStaffUser,
  toggleStaffUserStatus,
  deleteStaffUser,
} from '@/lib/auth';
import {
  Shield,
  UserCheck,
  Lock,
  Plus,
  Key,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserPlus,
  Trash2,
  Phone,
  Mail,
  User,
  X,
} from 'lucide-react';

const AVAILABLE_ROLES: { role: StaffRole; description: string; color: string }[] = [
  { role: 'Administrador', description: 'Acceso total y configuración del negocio', color: 'bg-orange-100 text-[#F47A22] border-orange-200' },
  { role: 'Gerente', description: 'Operaciones, comandas, kardex y reportes', color: 'bg-stone-100 text-[#222B2B] border-stone-300' },
  { role: 'Cajero', description: 'Terminal POS presencial, arqueo y cobros', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { role: 'Cocina', description: 'Pantalla KDS en tiempo real y tiempos de cocción', color: 'bg-amber-100 text-amber-900 border-amber-200' },
  { role: 'Domiciliario', description: 'Despacho de pedidos, rutas y confirmación de entregas', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { role: 'Mesero', description: 'Toma de pedidos en mesa y atención presencial', color: 'bg-purple-100 text-purple-800 border-purple-200' },
];

export default function UsersRolesPage() {
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffRole>('Cajero');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reloadUsers = () => {
    setStaff(getStaffUsers());
  };

  useEffect(() => {
    reloadUsers();

    const handleAuthChange = () => reloadUsers();
    window.addEventListener('beffger_staff_change', handleAuthChange);
    return () => window.removeEventListener('beffger_staff_change', handleAuthChange);
  }, []);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackMsg(null);

    const result = createStaffUser({
      name,
      email,
      phone,
      role,
      pass: password,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setFeedbackMsg({ type: 'error', text: result.error || 'No se pudo crear el usuario.' });
      return;
    }

    setFeedbackMsg({
      type: 'success',
      text: `¡Colaborador ${result.user?.name} creado exitosamente con rol ${result.user?.role}!`,
    });

    // Reset Form & Close
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setRole('Cajero');
    setIsModalOpen(false);
    reloadUsers();
  };

  const handleToggleActive = (id: string) => {
    const res = toggleStaffUserStatus(id);
    if (!res.success) {
      setFeedbackMsg({ type: 'error', text: res.error || 'Error al modificar estado.' });
    } else {
      reloadUsers();
    }
  };

  const handleDeleteUser = (id: string, userName: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente a ${userName}?`)) {
      const res = deleteStaffUser(id);
      if (!res.success) {
        setFeedbackMsg({ type: 'error', text: res.error || 'Error al eliminar usuario.' });
      } else {
        setFeedbackMsg({ type: 'success', text: `Usuario ${userName} eliminado.` });
        reloadUsers();
      }
    }
  };

  const totalUsers = staff.length;
  const activeUsers = staff.filter((u) => u.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-heading text-xs text-[#F47A22] uppercase font-bold tracking-wider">
            SEGURIDAD & CONTROL DE ACCESO
          </span>
          <h1 className="font-heading text-3xl text-[#222B2B] uppercase mt-0.5">
            Gestión de Personal & Roles
          </h1>
          <p className="text-xs text-[#574237]">
            Crea y administra perfiles de colaboradores con permisos según su cargo operativo.
          </p>
        </div>

        <button
          onClick={() => {
            setFeedbackMsg(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F47A22] hover:bg-[#d96616] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Crear Colaborador</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-stone-400 hover:text-stone-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#dec0b1] shadow-sm">
          <span className="text-[10px] font-bold text-[#8b7265] uppercase">Total Personal</span>
          <h4 className="font-heading text-2xl text-[#222B2B] mt-1">{totalUsers}</h4>
          <span className="text-[11px] text-[#574237]">Perfiles configurados</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#dec0b1] shadow-sm">
          <span className="text-[10px] font-bold text-[#8b7265] uppercase">Activos</span>
          <h4 className="font-heading text-2xl text-[#10b981] mt-1">{activeUsers}</h4>
          <span className="text-[11px] text-[#10b981]">Con acceso habilitado</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#dec0b1] shadow-sm">
          <span className="text-[10px] font-bold text-[#8b7265] uppercase">Domiciliarios</span>
          <h4 className="font-heading text-2xl text-blue-600 mt-1">
            {staff.filter((u) => u.role === 'Domiciliario').length}
          </h4>
          <span className="text-[11px] text-[#574237]">Flota de reparto</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#dec0b1] shadow-sm">
          <span className="text-[10px] font-bold text-[#8b7265] uppercase">Cocina & POS</span>
          <h4 className="font-heading text-2xl text-amber-600 mt-1">
            {staff.filter((u) => u.role === 'Cocina' || u.role === 'Cajero' || u.role === 'Mesero').length}
          </h4>
          <span className="text-[11px] text-[#574237]">Operación salón/kds</span>
        </div>
      </div>

      {/* Roles Permission Matrix Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-4">
        <h3 className="font-heading text-xl text-[#222B2B] uppercase border-b border-[#dec0b1] pb-3 flex items-center justify-between">
          <span>Matriz de Permisos por Rol</span>
          <span className="text-xs text-[#8b7265] font-normal lowercase">Acceso restringido según rol institucional</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {AVAILABLE_ROLES.map((r) => (
            <div key={r.role} className="p-3.5 rounded-2xl bg-[#FFF2DF]/60 border border-[#dec0b1] space-y-1.5">
              <span className={`font-bold inline-block px-2 py-0.5 rounded text-xs border ${r.color}`}>
                {r.role}
              </span>
              <p className="text-[#574237] text-[11px] leading-relaxed">
                {r.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Users Table */}
      <div className="bg-white rounded-3xl border border-[#dec0b1] shadow-beffger-card overflow-hidden">
        <div className="p-5 border-b border-[#dec0b1] flex items-center justify-between">
          <h3 className="font-heading text-xl text-[#222B2B] uppercase">
            Usuarios con Acceso Autorizado ({staff.length})
          </h3>
          <span className="text-xs text-[#8b7265]">
            Solo usuarios activos pueden ingresar al panel o a las apps
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#222B2B] text-white uppercase text-[10px] tracking-wider font-heading">
              <tr>
                <th className="p-4">Colaborador</th>
                <th className="p-4">Correo Institucional</th>
                <th className="p-4">Teléfono</th>
                <th className="p-4">Rol Asignado</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dec0b1]/60">
              {staff.map((u) => {
                const isSuperAdmin = u.email.toLowerCase() === 'admin@beffger.com' || u.id === 'u-superadmin';

                return (
                  <tr key={u.id} className="hover:bg-[#FFF2DF]/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#222B2B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {u.avatarInitials || 'CB'}
                        </div>
                        <div>
                          <span className="font-bold text-[#222B2B] block">{u.name}</span>
                          {isSuperAdmin && (
                            <span className="text-[10px] font-bold text-[#F47A22] uppercase tracking-wider">
                              ★ Super Admin Principal
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#574237] font-mono text-[11px]">{u.email}</td>
                    <td className="p-4 text-[#574237] text-[11px]">{u.phone || '—'}</td>
                    <td className="p-4">
                      <span className="bg-[#FFF2DF] text-[#222B2B] font-bold px-2.5 py-1 rounded-lg border border-[#dec0b1] uppercase text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      {!isSuperAdmin ? (
                        <>
                          <button
                            onClick={() => handleToggleActive(u.id)}
                            className="px-2.5 py-1 rounded-lg border border-[#dec0b1] hover:bg-gray-100 text-[11px] font-bold text-[#222B2B] transition-colors"
                          >
                            {u.isActive ? 'Desactivar' : 'Activar'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors inline-flex items-center justify-center"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-[#8b7265] italic">Protegido</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-[#dec0b1] shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#dec0b1] pb-3">
              <div>
                <span className="font-heading text-xs text-[#F47A22] uppercase font-bold tracking-wider">
                  NUEVO ACCESO
                </span>
                <h3 className="font-heading text-2xl text-[#222B2B] uppercase">
                  Crear Colaborador
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#222B2B] uppercase mb-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8b7265] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ej: Santiago López"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#dec0b1] text-xs font-medium focus:ring-2 focus:ring-[#F47A22] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#222B2B] uppercase mb-1">
                  Correo Electrónico Institucional
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8b7265] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ej: santiago@beffger.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#dec0b1] text-xs font-medium focus:ring-2 focus:ring-[#F47A22] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#222B2B] uppercase mb-1">
                    Rol Asignado
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as StaffRole)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#dec0b1] text-xs font-bold focus:ring-2 focus:ring-[#F47A22] outline-none bg-white"
                  >
                    {AVAILABLE_ROLES.map((r) => (
                      <option key={r.role} value={r.role}>
                        {r.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#222B2B] uppercase mb-1">
                    Teléfono / Celular (Opcional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#8b7265] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="ej: 312 345 6789"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#dec0b1] text-xs font-medium focus:ring-2 focus:ring-[#F47A22] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#222B2B] uppercase mb-1">
                  Contraseña de Acceso (mínimo 6 caracteres)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8b7265] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#dec0b1] text-xs font-medium focus:ring-2 focus:ring-[#F47A22] outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#dec0b1] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-[#574237] hover:bg-stone-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name || !email || !password}
                  className="px-6 py-2.5 rounded-xl bg-[#F47A22] hover:bg-[#d96616] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : 'Crear Colaborador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
