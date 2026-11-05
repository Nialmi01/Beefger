'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { ShoppingBag, Menu as MenuIcon, User } from 'lucide-react';

export function Navbar() {
  const { itemCount, setIsOpen } = useCart();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#222B2B] shadow-[0_4px_20px_rgba(0,0,0,0.25)] border-b border-[#363023]">
      <div className="h-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo & Live Status */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/brand/beffger-logo-horizontal.png"
              alt="BEFFGER - La Calle Tiene Sabor"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <div className="hidden xl:flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></span>
            <span className="font-heading text-xs tracking-wider uppercase text-[#FFF2DF]">
              Abierto ahora • 30-45 min
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link
            href="/"
            className="text-white hover:text-[#F47A22] transition-colors font-bold text-sm tracking-wide"
          >
            Inicio
          </Link>
          <Link
            href="/menu"
            className="text-[#EDE1CE] hover:text-[#F47A22] transition-colors font-medium text-sm tracking-wide"
          >
            Nuestro Menú
          </Link>
          <Link
            href="/pedidos"
            className="text-[#EDE1CE] hover:text-[#F47A22] transition-colors font-medium text-sm tracking-wide"
          >
            Rastrear Pedido
          </Link>
          <Link
            href="/descargar-app"
            className="text-[#FFF2DF] hover:text-[#F47A22] transition-colors font-medium text-sm tracking-wide flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-white/10"
          >
            <span>📱</span> App Móvil
          </Link>
          <Link
            href="/admin"
            className="text-[#FFC247] hover:text-white transition-colors font-bold text-xs tracking-wider uppercase px-2.5 py-1 rounded bg-[#FFC247]/10 border border-[#FFC247]/30"
          >
            Panel Restaurante
          </Link>
        </nav>

        {/* Right CTA / Cart Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 border border-white/10"
            type="button"
            aria-label="Abrir carrito de compras"
          >
            <ShoppingBag className="w-5 h-5 text-[#F47A22]" />
            <span className="text-sm font-bold hidden sm:inline">Carrito</span>
            {itemCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#F47A22] text-white text-xs font-bold shadow-md">
                {itemCount}
              </span>
            )}
          </button>

          <Link
            href="/menu"
            className="hidden sm:flex items-center justify-center px-5 py-2.5 rounded-full bg-[#F47A22] hover:bg-[#d96616] text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_4px_14px_rgba(244,122,34,0.4)] active:scale-95"
          >
            ORDENAR AHORA
          </Link>

          <Link
            href="/admin/login"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F47A22] text-white transition-all flex items-center justify-center"
            title="Acceso Personal / Colaboradores"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
