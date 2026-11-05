import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Clock, Instagram, Facebook, UtensilsCrossed } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#222B2B] text-white pt-16 pb-12 border-t-4 border-[#F47A22]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="space-y-4">
            <img
              src="/brand/beffger-logo-horizontal.png"
              alt="BEFFGER - La Calle Tiene Sabor"
              className="h-12 w-auto object-contain"
            />
            <p className="text-sm text-[#EDE1CE]/80 leading-relaxed">
              Street food gourmet colombiano auténtico. Recetas artesanales con ingredientes generosos, carnes 100% de res y salsas exclusivas de la casa.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F47A22] transition-colors flex items-center justify-center text-white"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F47A22] transition-colors flex items-center justify-center text-white"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Contact Col */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg tracking-wider text-[#FFC247]">Pide a Domicilio</h3>
            <ul className="space-y-3 text-sm text-[#EDE1CE]/90">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#F47A22] shrink-0 mt-1" />
                <span>+57 315 888 9900<br /><span className="text-xs text-white/50">WhatsApp & Llamadas</span></span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F47A22] shrink-0 mt-1" />
                <span>Cra. 34 # 4-56, Parque del Perro<br /><span className="text-xs text-white/50">Cali, Valle del Cauca</span></span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#F47A22] shrink-0 mt-1" />
                <span>Lun - Dom: 12:00 PM - 11:30 PM<br /><span className="text-xs text-[#10b981]">Cocina Abierta</span></span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg tracking-wider text-[#FFC247]">Nuestras Creaciones</h3>
            <ul className="space-y-2 text-sm text-[#EDE1CE]/80">
              <li>
                <Link href="/menu#hamburguesas-gourmet" className="hover:text-[#F47A22] transition-colors">
                  Hamburguesas Gourmet (La Brutal, La Criolla, La Tropical)
                </Link>
              </li>
              <li>
                <Link href="/menu#perros-gourmet" className="hover:text-[#F47A22] transition-colors">
                  Perros Calientes Gourmet (El Callejero, El Ranchero, El Ahumado)
                </Link>
              </li>
              <li>
                <Link href="/menu#pizzas-gourmet" className="hover:text-[#F47A22] transition-colors">
                  Pizzas de 30 cm a la Piedra (La Colombiana, BBQ Explosiva)
                </Link>
              </li>
              <li>
                <Link href="/pedidos" className="hover:text-[#F47A22] transition-colors font-bold text-white">
                  Rastrear mi pedido en tiempo real →
                </Link>
              </li>
            </ul>
          </div>

          {/* Operations & Staff Quick Links */}
          <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
            <h3 className="font-heading text-base tracking-wider text-[#FFC247] flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-[#F47A22]" /> Acceso Operativo
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link href="/admin" className="p-2 rounded bg-black/40 hover:bg-[#F47A22] transition-colors text-center font-bold">
                Dashboard
              </Link>
              <Link href="/admin/pedidos" className="p-2 rounded bg-black/40 hover:bg-[#F47A22] transition-colors text-center font-bold">
                Kanban
              </Link>
              <Link href="/admin/cocina" className="p-2 rounded bg-black/40 hover:bg-[#F47A22] transition-colors text-center font-bold text-[#FFC247]">
                Cocina KDS
              </Link>
              <Link href="/admin/caja" className="p-2 rounded bg-black/40 hover:bg-[#F47A22] transition-colors text-center font-bold">
                Caja POS
              </Link>
              <Link href="/admin/inventario" className="p-2 rounded bg-black/40 hover:bg-[#F47A22] transition-colors text-center font-bold">
                Kardex
              </Link>
              <Link href="/rider/pedidos" className="p-2 rounded bg-black/40 hover:bg-[#F47A22] transition-colors text-center font-bold text-[#10b981]">
                App Riders
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>© {new Date().getFullYear()} BEFFGER. Todos los derechos reservados. Street Food Gourmet.</p>
          <p className="flex items-center gap-2">
            <span>Powered by Next.js & Supabase</span>
            <span>•</span>
            <span className="text-[#F47A22] font-bold">LA CALLE TIENE SABOR</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
