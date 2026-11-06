'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { login, STAFF_CREDENTIALS, hasPermission, getDefaultRouteForRole } from '@/lib/auth';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, User, KeyRound } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFillCredentials = (staffEmail: string, staffPass: string) => {
    setEmail(staffEmail);
    setPassword(staffPass);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    // Simulate short network auth validation
    await new Promise((r) => setTimeout(r, 400));

    const result = login(email, password);

    if (result.success && result.user) {
      // Direct destination: if target is invalid for role or general /admin, route to role's home panel
      let dest = redirectTarget;
      if (
        !redirectTarget ||
        redirectTarget === '/admin' ||
        redirectTarget === '/admin/login' ||
        !hasPermission(result.user.role, redirectTarget)
      ) {
        dest = getDefaultRouteForRole(result.user.role);
      }
      router.push(dest);
    } else {
      setIsLoading(false);
      setErrorMsg(result.error || 'Credenciales inválidas. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-[#222B2B] text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#FFF2DF] text-[#222B2B] p-8 rounded-3xl shadow-2xl border border-[#dec0b1] space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-3">
          <Link href="/">
            <img
              src="/brand/beffger-logo.png"
              alt="BEFFGER - La Calle Tiene Sabor"
              className="h-20 w-auto mx-auto object-contain hover:scale-105 transition-transform"
            />
          </Link>
          <div className="space-y-1">
            <span className="font-heading text-xs text-[#F47A22] font-bold uppercase tracking-widest block">
              CONTROL DE ACCESO SEGURO
            </span>
            <h1 className="font-heading text-3xl uppercase tracking-wider text-[#222B2B]">
              Iniciar Turno Operativo
            </h1>
          </div>
          <p className="text-xs text-[#574237]">
            Ingresa con tu correo institucional y contraseña de colaborador.
          </p>
        </div>

        {/* Quick Role Fill Pills */}
        <div className="bg-white/70 p-3.5 rounded-2xl border border-[#dec0b1] space-y-2">
          <span className="text-[10px] font-bold text-[#8b7265] uppercase flex items-center justify-between">
            <span>Perfiles de Colaboradores:</span>
            <span className="text-[#F47A22]">Seleccionar rol</span>
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            {STAFF_CREDENTIALS.map((cred) => (
              <button
                key={cred.user.id}
                type="button"
                onClick={() => handleFillCredentials(cred.user.email, cred.pass)}
                className={`p-2 rounded-xl text-left border transition-all flex flex-col ${
                  email === cred.user.email
                    ? 'bg-[#F47A22] text-white border-[#F47A22] shadow'
                    : 'bg-white hover:bg-orange-50 border-[#dec0b1] text-[#222B2B]'
                }`}
              >
                <span className="font-bold flex items-center justify-between">
                  <span>{cred.user.role}</span>
                  <KeyRound className="w-3 h-3 opacity-70" />
                </span>
                <span className={`text-[10px] truncate ${email === cred.user.email ? 'text-white/80' : 'text-[#8b7265]'}`}>
                  {cred.user.email}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-[#ba1a1a]">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#ba1a1a]" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Standard Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#222B2B] uppercase mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8b7265] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ej: admin@beffger.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#dec0b1] text-xs font-medium focus:ring-2 focus:ring-[#F47A22] outline-none bg-white"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-[#222B2B] uppercase">
                Contraseña de Acceso
              </label>
              <span className="text-[10px] text-[#8b7265]">Superadmin: admin@beffger.com</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8b7265] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#dec0b1] text-xs font-medium focus:ring-2 focus:ring-[#F47A22] outline-none bg-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full py-4 rounded-full bg-[#F47A22] hover:bg-[#d96616] text-white font-bold text-sm uppercase tracking-wider shadow-[0_10px_20px_rgba(244,122,34,0.35)] flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                VERIFICANDO...
              </span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>INGRESAR AL PANEL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-[#dec0b1] text-center">
          <Link
            href="/"
            className="text-xs text-[#8b7265] hover:text-[#222B2B] transition-colors font-medium"
          >
            ← Volver a la Tienda de Clientes
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#222B2B] text-white flex items-center justify-center p-4">
          <div className="w-10 h-10 border-4 border-[#F47A22] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
