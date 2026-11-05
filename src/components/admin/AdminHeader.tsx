'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { getCurrentUser, StaffUser } from '@/lib/auth';
import { Bell, Plus, Volume2, Store, Search, UserCheck, ChefHat, Bike } from 'lucide-react';

export function AdminHeader() {
  const [settings, setSettings] = useState(store.getSettings());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [user, setUser] = useState<StaffUser | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    const onAuth = () => setUser(getCurrentUser());
    window.addEventListener('beffger_auth_change', onAuth);

    const unsub = store.subscribe(() => {
      setSettings(store.getSettings());
    });

    return () => {
      window.removeEventListener('beffger_auth_change', onAuth);
      unsub();
    };
  }, []);

  const toggleRestaurantOpen = () => {
    settings.is_open = !settings.is_open;
    setSettings({ ...settings });
  };

  return (
    <header className="h-16 bg-[#222B2B] text-white px-6 flex items-center justify-between border-b border-[#363023] shrink-0 sticky top-0 z-30 shadow-md">
      {/* Search / Title */}
      <div className="flex items-center gap-4">
        <div className="relative w-64 hidden sm:block">
          <Search className="w-4 h-4 text-[#8b7265] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar comanda, cliente, SKU..."
            className="w-full pl-9 pr-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs text-white placeholder:text-[#8b7265] focus:outline-none focus:ring-1 focus:ring-[#F47A22]"
          />
        </div>
      </div>

      {/* Quick Controls */}
      <div className="flex items-center gap-3">
        {/* Restaurant Open Toggle */}
        <button
          onClick={toggleRestaurantOpen}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            settings.is_open
              ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
              : 'bg-red-500/20 text-red-400 border border-red-500/40'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${settings.is_open ? 'bg-[#10b981] animate-ping' : 'bg-red-500'}`} />
          <span>{settings.is_open ? 'RESTAURANTE ABIERTO' : 'RESTAURANTE CERRADO'}</span>
        </button>

        {/* Kitchen Audio toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
            soundEnabled
              ? 'bg-[#FFC247]/20 border-[#FFC247]/40 text-[#FFC247]'
              : 'bg-white/5 border-white/10 text-white/40'
          }`}
          title={soundEnabled ? 'Alertas sonoras activadas' : 'Alertas sonoras silenciadas'}
        >
          <Volume2 className="w-4 h-4" />
        </button>

        {/* Role-specific Quick Action */}
        {user?.role === 'Cocina' ? (
          <Link
            href="/admin/cocina"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFC247] hover:bg-[#e6ad3b] text-[#222B2B] text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95"
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>COCINA KDS</span>
          </Link>
        ) : user?.role === 'Domiciliario' ? (
          <Link
            href="/rider/pedidos"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95"
          >
            <Bike className="w-3.5 h-3.5" />
            <span>MIS ENTREGAS</span>
          </Link>
        ) : (
          <Link
            href="/admin/caja"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F47A22] hover:bg-[#d96616] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>NUEVA VENTA</span>
          </Link>
        )}

        {/* Current User Pill */}
        {user && (
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-7 h-7 rounded-full bg-[#FFC247] text-[#222B2B] flex items-center justify-center font-bold text-xs">
              {user.avatarInitials}
            </div>
            <div className="text-left text-[11px] leading-tight">
              <span className="font-bold text-white block">{user.name.split(' ')[0]}</span>
              <span className="text-[#FFC247] text-[9px] uppercase font-bold tracking-wider">{user.role}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
