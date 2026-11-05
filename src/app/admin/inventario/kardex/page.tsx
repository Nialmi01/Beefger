'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ScrollText,
  Boxes,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
} from 'lucide-react';

interface MockKardexRow {
  id: string;
  sku: string;
  name: string;
  type: 'consumo' | 'compra' | 'merma' | 'ajuste';
  quantity: number;
  unit: string;
  previous_stock: number;
  new_stock: number;
  reference: string;
  user: string;
  date: string;
}

const SAMPLE_KARDEX: MockKardexRow[] = [
  { id: 'k1', sku: 'ING-CARN-01', name: 'Carne de res seleccionada', type: 'consumo', quantity: -300, unit: 'g', previous_stock: 24800, new_stock: 24500, reference: 'Orden #BF-1001 (2x La Brutal)', user: 'Sistema Automático', date: 'Hace 4 min' },
  { id: 'k2', sku: 'ING-PANB-01', name: 'Pan brioche artesanal', type: 'consumo', quantity: -2, unit: 'un', previous_stock: 177, new_stock: 175, reference: 'Orden #BF-1001', user: 'Sistema Automático', date: 'Hace 4 min' },
  { id: 'k3', sku: 'EMP-CAJH-01', name: 'Caja ecológica hamburguesa', type: 'consumo', quantity: -2, unit: 'un', previous_stock: 382, new_stock: 380, reference: 'Orden #BF-1001', user: 'Sistema Automático', date: 'Hace 4 min' },
  { id: 'k4', sku: 'ING-MASP-01', name: 'Masa para pizza 30cm (220g)', type: 'consumo', quantity: -220, unit: 'g', previous_stock: 15020, new_stock: 14800, reference: 'Orden #BF-1002 (La Colombiana)', user: 'Sistema Automático', date: 'Hace 16 min' },
  { id: 'k5', sku: 'ING-MOZZ-01', name: 'Queso Mozzarella bloque', type: 'consumo', quantity: -130, unit: 'g', previous_stock: 17330, new_stock: 17200, reference: 'Orden #BF-1002', user: 'Sistema Automático', date: 'Hace 16 min' },
  { id: 'k6', sku: 'ING-CHED-01', name: 'Queso Cheddar lonchas', type: 'compra', quantity: 5000, unit: 'g', previous_stock: 2800, new_stock: 7800, reference: 'Factura Compra FC-8841 Lácteos El Trébol', user: 'Carlos Gerente', date: 'Hoy 10:15 AM' },
  { id: 'k7', sku: 'ING-PLAT-01', name: 'Plátano maduro en cubos', type: 'merma', quantity: -200, unit: 'g', previous_stock: 9800, new_stock: 9600, reference: 'Merma por maduración excesiva', user: 'Chef Andrés', date: 'Hoy 09:30 AM' },
];

export default function KardexAlmacenPage() {
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = SAMPLE_KARDEX.filter((row) => {
    const matchesType = filterType === 'all' || row.type === filterType;
    const matchesSearch = row.name.toLowerCase().includes(search.toLowerCase()) || row.reference.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-heading text-xs text-[#F47A22] uppercase font-bold tracking-wider">
            TRAZABILIDAD VALORIZADA DE INVENTARIOS
          </span>
          <h1 className="font-heading text-3xl text-[#222B2B] uppercase mt-0.5">
            Kardex de Materias Primas
          </h1>
          <p className="text-xs text-[#574237]">
            Registro cronológico inmutable de consumos por receta, compras, mermas y ajustes de almacén.
          </p>
        </div>

        <Link
          href="/admin/inventario"
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#dec0b1] hover:bg-[#FFF2DF] text-xs font-bold uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#F47A22]" />
          <span>Volver a Almacén</span>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3 rounded-2xl border border-[#dec0b1] shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8b7265] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por insumo, orden #BF o factura..."
            className="w-full pl-9 pr-3 py-1.5 text-xs text-[#222B2B] outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'consumo', 'compra', 'merma', 'ajuste'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors whitespace-nowrap ${
                filterType === t
                  ? 'bg-[#222B2B] text-white'
                  : 'bg-[#FFF2DF] text-[#222B2B] hover:bg-[#dec0b1]'
              }`}
            >
              {t === 'all' ? 'Todos los Tipos' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Kardex Movements Table */}
      <div className="bg-white rounded-3xl border border-[#dec0b1] shadow-beffger-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#222B2B] text-white uppercase text-[10px] tracking-wider font-heading">
              <tr>
                <th className="p-4">Fecha / Hora</th>
                <th className="p-4">Insumo</th>
                <th className="p-4">Tipo Movimiento</th>
                <th className="p-4">Cantidad</th>
                <th className="p-4">Stock Previo</th>
                <th className="p-4">Stock Final</th>
                <th className="p-4">Referencia / Motivo</th>
                <th className="p-4">Responsable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dec0b1]/60">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-[#FFF2DF]/30 transition-colors">
                  <td className="p-4 font-mono text-[#8b7265]">{row.date}</td>
                  <td className="p-4">
                    <span className="font-bold text-[#222B2B] block">{row.name}</span>
                    <span className="text-[10px] text-[#8b7265] font-mono">{row.sku}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      row.type === 'compra'
                        ? 'bg-emerald-100 text-emerald-800'
                        : row.type === 'consumo'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold">
                    <span className={row.quantity > 0 ? 'text-[#10b981]' : 'text-[#ba1a1a]'}>
                      {row.quantity > 0 ? `+${row.quantity}` : row.quantity} {row.unit}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-[#8b7265]">{row.previous_stock} {row.unit}</td>
                  <td className="p-4 font-mono font-extrabold text-[#222B2B]">{row.new_stock} {row.unit}</td>
                  <td className="p-4 text-[#574237] max-w-xs truncate">{row.reference}</td>
                  <td className="p-4 text-[#8b7265]">{row.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
