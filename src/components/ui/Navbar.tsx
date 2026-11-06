'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { ShoppingBag, Menu as MenuIcon, X, User } from 'lucide-react';

export function Navbar() {
  const { itemCount, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#222B2B] shadow-[0_4px_20px_rgba(0,0,0,0.25)] border-b border-[#363023]">
      <div className="h-16 sm:h-20 max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        {/* Mobile Menu Button + Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/brand/beffger-logo-horizontal.png"
              alt="BEFFGER - La Calle Tiene Sabor"
              className="h-8 sm:h-11 md:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          <div className="hidden xl:flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></span>
            <span className="font-heading text-xs tracking-wider uppercase text-[#FFF2DF]">
              Abierto ahora • 30-45 min
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
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
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 border border-white/10"
            type="button"
            aria-label="Abrir carrito de compras"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#F47A22]" />
            <span className="text-xs sm:text-sm font-bold hidden md:inline">Carrito</span>
            {itemCount > 0 && (
              <span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#F47A22] text-white text-[10px] sm:text-xs font-bold shadow-md">
                {itemCount}
              </span>
            )}
          </button>

          <Link
            href="/menu"
            className="hidden sm:flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#F47A22] hover:bg-[#d96616] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_4px_14px_rgba(244,122,34,0.4)] active:scale-95 whitespace-nowrap"
          >
            ORDENAR
          </Link>

          <Link
            href="/admin/login"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-[#F47A22] text-white transition-all flex items-center justify-center shrink-0"
            title="Acceso Personal / Colaboradores"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1c2222] border-t border-white/10 px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-white font-bold text-sm hover:bg-white/5"
          >
            🍔 Inicio
          </Link>
          <Link
            href="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-[#EDE1CE] font-medium text-sm hover:bg-white/5"
          >
            📋 Nuestro Menú Completo
          </Link>
          <Link
            href="/pedidos"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-[#EDE1CE] font-medium text-sm hover:bg-white/5"
          >
            🛵 Rastrear Pedido en Vivo
          </Link>
          <Link
            href="/descargar-app"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-[#FFC247] font-semibold text-sm hover:bg-white/5"
          >
            📱 Descargar App Móvil (Android APK)
          </Link>
          <div className="pt-2 border-t border-white/10">
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-white/70 font-medium text-xs hover:bg-white/5"
            >
              👑 Acceso Personal (Cocina, Rider, Mesero, Admin)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
