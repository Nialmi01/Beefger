'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { store } from '@/lib/store';
import { Search, Flame, ArrowRight, Clock, Bike } from 'lucide-react';

export default function PedidosIndexPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const clean = query.trim().toUpperCase();
    if (!clean) {
      setError('Ingresa el número de tu comanda o tu teléfono.');
      return;
    }

    // Try finding by number
    const byNumber = store.getOrderByNumber(clean.startsWith('BF-') ? clean : `BF-${clean}`);
    if (byNumber) {
      router.push(`/pedidos/${byNumber.order_number}`);
      return;
    }

    // Try finding by phone
    const orders = store.getOrders();
    const byPhone = orders.find((o) => o.customer_phone.includes(clean));
    if (byPhone) {
      router.push(`/pedidos/${byPhone.order_number}`);
      return;
    }

    setError(`No encontramos ningún pedido activo con "${query}". Verifica el número.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF2DF]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#dec0b1] shadow-beffger-card text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F47A22]/10 text-[#F47A22] flex items-center justify-center border border-[#F47A22]/20">
              <Bike className="w-8 h-8" />
            </div>

            <div>
              <span className="font-heading text-xs text-[#F47A22] tracking-wider uppercase font-bold">
                SEGUIMIENTO EN VIVO
              </span>
              <h1 className="font-heading text-4xl text-[#222B2B] uppercase mt-1">
                Rastrea tu Pedido
              </h1>
              <p className="text-xs sm:text-sm text-[#574237] mt-1.5 leading-relaxed">
                Ingresa el número de pedido (ej: <span className="font-bold text-[#222B2B]">BF-1001</span>) o el celular con el que realizaste la compra para ver el estado de preparación y despacho en tiempo real.
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 text-[#8b7265] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Número de orden (BF-1001) o celular..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-full border-2 border-[#dec0b1] text-sm focus:border-[#F47A22] outline-none text-[#222B2B] font-medium"
                />
              </div>

              {error && (
                <p className="text-xs font-semibold text-[#ba1a1a] bg-red-50 p-3 rounded-xl border border-red-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#F47A22] hover:bg-[#d96616] text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <span>CONSULTAR ESTADO EN VIVO</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
