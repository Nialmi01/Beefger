'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { BusinessSettings } from '@/lib/types';
import { Phone, MapPin, Clock, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  const [settings, setSettings] = useState<BusinessSettings>(store.getSettings());

  useEffect(() => {
    setSettings(store.getSettings());
    return store.subscribe(() => {
      setSettings(store.getSettings());
    });
  }, []);

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
                <span>{settings.phone || '+57 300 000 0000'}<br /><span className="text-xs text-white/50">WhatsApp & Llamadas</span></span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F47A22] shrink-0 mt-1" />
                <span>{settings.address || 'Sede Principal'}<br /><span className="text-xs text-white/50">{settings.city || 'Despachos a Domicilio'}</span></span>
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

          {/* Service Hours & Customer Trust Box */}
          <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
            <h3 className="font-heading text-base tracking-wider text-[#FFC247] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F47A22]" /> Horarios & Cobertura
            </h3>
            <div className="space-y-2 text-xs text-white/80">
              <p className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-white/60">Lunes a Domingo:</span>
                <span className="font-bold text-white">12:00 PM - 11:00 PM</span>
              </p>
              <p className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-white/60">Domicilios:</span>
                <span className="font-bold text-[#10b981]">Despachos en 30-45 min</span>
              </p>
              <p className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-white/60">Pagos Seguros:</span>
                <span className="font-bold text-white">Wompi, Nequi & Efectivo</span>
              </p>
              <div className="pt-2">
                <Link
                  href="/descargar-app"
                  className="inline-flex items-center gap-1.5 text-xs text-[#FFC247] hover:text-white transition-colors font-bold"
                >
                  <span>📱 Descargar App para Clientes →</span>
                </Link>
              </div>
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
