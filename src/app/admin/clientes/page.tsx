'use client';

import React, { useState, useEffect } from 'react';
import { store } from '@/lib/store';
import { Customer } from '@/lib/types';
import {
  Users,
  Search,
  Phone,
  Mail,
  Award,
  ShoppingBag,
  TrendingUp,
  Star,
} from 'lucide-react';

export default function CustomersCrmPage() {
  const [customers, setCustomers] = useState<Customer[]>(store.getCustomers());
  const [search, setSearch] = useState('');

  useEffect(() => {
    return store.subscribe(() => {
      setCustomers(store.getCustomers());
    });
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-heading text-xs text-[#F47A22] uppercase font-bold tracking-wider">
            CRM & FIDELIZACIÓN
          </span>
          <h1 className="font-heading text-3xl text-[#222B2B] uppercase mt-0.5">
            Directorio de Clientes
          </h1>
          <p className="text-xs text-[#574237]">
            Historial de compras, puntos acumulados y contacto de clientes de BEFFGER.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#222B2B] bg-[#FFF2DF] px-3 py-1.5 rounded-full border border-[#dec0b1]">
            Total Clientes: {customers.length}
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-2xl border border-[#dec0b1] shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-[#8b7265] ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o número de celular..."
          className="w-full text-xs text-[#222B2B] placeholder:text-[#8b7265] outline-none"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-[#dec0b1] shadow-beffger-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#222B2B] text-white uppercase text-[10px] tracking-wider font-heading">
              <tr>
                <th className="p-4">Cliente</th>
                <th className="p-4">Contacto</th>
                <th className="p-4">Pedidos Realizados</th>
                <th className="p-4">Gasto Total Acumulado</th>
                <th className="p-4">Puntos Fidelidad</th>
                <th className="p-4">Última Compra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dec0b1]/60">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#FFF2DF]/30 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-sm text-[#222B2B] block">
                      {c.full_name}
                    </span>
                  </td>

                  <td className="p-4 space-y-0.5">
                    <span className="flex items-center gap-1.5 font-bold text-[#222B2B]">
                      <Phone className="w-3.5 h-3.5 text-[#F47A22]" /> {c.phone}
                    </span>
                    {c.email && (
                      <span className="flex items-center gap-1.5 text-[11px] text-[#8b7265]">
                        <Mail className="w-3 h-3" /> {c.email}
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <span className="font-mono font-bold text-sm text-[#222B2B]">
                      {c.orders_count}
                    </span>{' '}
                    <span className="text-[10px] text-[#8b7265]">órdenes</span>
                  </td>

                  <td className="p-4 font-heading text-base font-bold text-[#F47A22]">
                    ${c.total_spent.toLocaleString('es-CO')}{' '}
                    <span className="text-[10px] font-normal text-[#8b7265]">COP</span>
                  </td>

                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 bg-[#FFC247]/20 border border-[#FFC247]/50 text-[#c99315] font-extrabold px-2.5 py-0.5 rounded-full text-[11px]">
                      <Star className="w-3 h-3 fill-current" />
                      {c.loyalty_points} pts
                    </span>
                  </td>

                  <td className="p-4 text-[#8b7265]">
                    {c.last_order_at
                      ? new Date(c.last_order_at).toLocaleDateString('es-CO', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'N/A'}
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
