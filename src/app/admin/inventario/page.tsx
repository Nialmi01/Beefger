'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { Ingredient } from '@/lib/types';
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Minus,
  Search,
  ScrollText,
  TrendingDown,
} from 'lucide-react';

export default function AdminInventoryPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [search, setSearch] = useState('');
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [adjustQty, setAdjustQty] = useState<string>('');
  const [adjustReason, setAdjustReason] = useState<string>('Compra / Reposición');

  useEffect(() => {
    setIngredients(store.getIngredients());
    return store.subscribe(() => {
      setIngredients(store.getIngredients());
    });
  }, []);

  const handleStockAdjustment = (ingId: string, isAddition: boolean) => {
    const qty = parseFloat(adjustQty);
    if (!isNaN(qty) && qty > 0) {
      if (isAddition) {
        store.addStock(ingId, qty, adjustReason);
      } else {
        store.deductStock(ingId, qty, adjustReason);
      }
      setIngredients([...store.getIngredients()]);
    }
    setAdjustingId(null);
    setAdjustQty('');
  };

  const filtered = ingredients.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = ingredients.filter((i) => i.current_stock <= i.minimum_stock).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-heading text-xs text-[#F47A22] uppercase font-bold tracking-wider">
            ALMACÉN DE MATERIAS PRIMAS
          </span>
          <h1 className="font-heading text-3xl text-[#222B2B] uppercase mt-0.5">
            Inventario & Existencias
          </h1>
          <p className="text-xs text-[#574237]">
            Control de carne, panes, salchichas, quesos, salsas y empaques de BEFFGER.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/inventario/kardex"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#222B2B] hover:bg-[#F47A22] text-white text-xs font-bold uppercase transition-colors"
          >
            <ScrollText className="w-4 h-4" />
            <span>Ver Kardex Valorizado</span>
          </Link>
        </div>
      </div>

      {/* Low stock alert badge if any */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Atención: {lowStockCount} materias primas se encuentran por debajo del stock mínimo recomendado.</span>
          </div>
          <span className="text-[10px] uppercase font-extrabold bg-amber-200 px-2.5 py-1 rounded-full">
            Alerta de Reposición
          </span>
        </div>
      )}

      {/* Search Input */}
      <div className="bg-white p-3 rounded-2xl border border-[#dec0b1] shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-[#8b7265] ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar insumo por SKU o nombre (ej: carne, mozzarella, tocineta)..."
          className="w-full text-xs text-[#222B2B] placeholder:text-[#8b7265] outline-none"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-[#dec0b1] shadow-beffger-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#222B2B] text-white uppercase text-[10px] tracking-wider font-heading">
              <tr>
                <th className="p-4">SKU / Insumo</th>
                <th className="p-4">Proveedor</th>
                <th className="p-4">Stock Actual</th>
                <th className="p-4">Mínimo</th>
                <th className="p-4">Costo Unitario ($ COP)</th>
                <th className="p-4">Semáforo</th>
                <th className="p-4 text-right">Ajuste de Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dec0b1]/60">
              {filtered.map((ing) => {
                const isLow = ing.current_stock <= ing.minimum_stock;
                const isAdjusting = adjustingId === ing.id;

                return (
                  <tr key={ing.id} className="hover:bg-[#FFF2DF]/30 transition-colors">
                    <td className="p-4">
                      <span className="font-mono text-[10px] text-[#8b7265] block font-bold">
                        {ing.sku}
                      </span>
                      <span className="font-bold text-sm text-[#222B2B]">
                        {ing.name}
                      </span>
                    </td>

                    <td className="p-4 text-[#574237] font-medium">
                      {ing.supplier || 'Producción Interna'}
                    </td>

                    <td className="p-4">
                      <span className="font-mono text-base font-extrabold text-[#222B2B]">
                        {ing.current_stock.toLocaleString('es-CO')}
                      </span>{' '}
                      <span className="text-[10px] text-[#8b7265] uppercase">{ing.unit}</span>
                    </td>

                    <td className="p-4 text-[#8b7265] font-mono">
                      {ing.minimum_stock.toLocaleString('es-CO')} {ing.unit}
                    </td>

                    <td className="p-4 font-bold text-[#574237]">
                      ${ing.cost_per_unit.toLocaleString('es-CO')} / {ing.unit}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          isLow
                            ? 'bg-red-100 text-[#ba1a1a] animate-pulse'
                            : 'bg-emerald-100 text-[#10b981]'
                        }`}
                      >
                        {isLow ? 'CRÍTICO' : 'ÓPTIMO'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      {isAdjusting ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <input
                            type="number"
                            value={adjustQty}
                            onChange={(e) => setAdjustQty(e.target.value)}
                            placeholder={`Cant (${ing.unit})`}
                            className="w-20 p-1.5 rounded-lg border-2 border-[#F47A22] text-xs font-bold"
                            autoFocus
                          />
                          <button
                            onClick={() => handleStockAdjustment(ing.id, true)}
                            className="p-1 rounded bg-[#10b981] text-white"
                            title="Sumar stock"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleStockAdjustment(ing.id, false)}
                            className="p-1 rounded bg-[#E94D3C] text-white"
                            title="Restar stock (merma)"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setAdjustingId(null)}
                            className="p-1 rounded bg-gray-200 text-gray-700"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAdjustingId(ing.id);
                            setAdjustQty('');
                          }}
                          className="px-3 py-1.5 rounded-lg border border-[#dec0b1] hover:bg-[#F47A22] hover:text-white hover:border-[#F47A22] text-xs font-bold transition-colors"
                        >
                          Ajustar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
