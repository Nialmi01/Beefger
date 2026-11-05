'use client';

import React, { useState, useEffect } from 'react';
import { store } from '@/lib/store';
import { Recipe, Product } from '@/lib/types';
import {
  FileSpreadsheet,
  PieChart,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  Printer,
  ChevronDown,
} from 'lucide-react';

export default function RecipeCostingPage() {
  const [recipes, setRecipes] = useState<Recipe[]>(store.getRecipes());
  const [products, setProducts] = useState<Product[]>(store.getProducts());
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(
    store.getRecipes()[0]?.id || ''
  );

  useEffect(() => {
    return store.subscribe(() => {
      setRecipes(store.getRecipes());
      setProducts(store.getProducts());
    });
  }, []);

  const currentRecipe = recipes.find((r) => r.id === selectedRecipeId) || recipes[0];
  const currentProduct = products.find((p) => p.id === currentRecipe?.product_id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-heading text-xs text-[#F47A22] uppercase font-bold tracking-wider">
            INGENIERÍA DE MENÚ & ESCANDALLOS
          </span>
          <h1 className="font-heading text-3xl text-[#222B2B] uppercase mt-0.5">
            Fichas Técnicas & Costeo de Recetas
          </h1>
          <p className="text-xs text-[#574237]">
            Cálculo automatizado de costo de materias primas, empaques, food cost % y margen de contribución.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#dec0b1] hover:bg-[#FFF2DF] text-xs font-bold uppercase transition-colors"
        >
          <Printer className="w-4 h-4 text-[#F47A22]" />
          <span>Exportar Ficha Técnica</span>
        </button>
      </div>

      {/* Recipe Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {recipes.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRecipeId(r.id)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase transition-all whitespace-nowrap ${
              currentRecipe?.id === r.id
                ? 'bg-[#222B2B] text-white shadow-md'
                : 'bg-white text-[#222B2B] border border-[#dec0b1] hover:bg-[#F47A22] hover:text-white'
            }`}
          >
            {r.product_name}
          </button>
        ))}
      </div>

      {currentRecipe && (
        <div className="space-y-6">
          {/* Costing Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#dec0b1] shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-[#8b7265] uppercase">Precio de Venta</span>
              <h3 className="font-heading text-2xl text-[#222B2B]">
                ${currentRecipe.sale_price.toLocaleString('es-CO')} COP
              </h3>
              <span className="text-[10px] text-[#10b981] font-bold">Impoconsumo incluido</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#dec0b1] shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-[#8b7265] uppercase">Costo Variable Total</span>
              <h3 className="font-heading text-2xl text-[#E94D3C]">
                ${currentRecipe.total_cost.toLocaleString('es-CO')} COP
              </h3>
              <span className="text-[10px] text-[#574237]">
                Ingredientes + Empaque térmico
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#dec0b1] shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-[#8b7265] uppercase">Food Cost (%)</span>
              <h3 className="font-heading text-2xl text-[#F47A22]">
                {currentRecipe.food_cost_percentage}%
              </h3>
              <span className="text-[10px] text-[#10b981] font-bold">
                Rango estándar objetivo (&lt; 45%)
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#dec0b1] shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-[#8b7265] uppercase">Margen Bruto (%)</span>
              <h3 className="font-heading text-2xl text-[#10b981]">
                {currentRecipe.gross_margin_percentage}%
              </h3>
              <span className="text-[10px] text-[#574237]">
                ${(currentRecipe.sale_price - currentRecipe.total_cost).toLocaleString('es-CO')} margen
              </span>
            </div>
          </div>

          {/* Detailed Ingredients Breakdown Table */}
          <div className="bg-white rounded-3xl border border-[#dec0b1] shadow-beffger-card overflow-hidden">
            <div className="p-5 border-b border-[#dec0b1] flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xl text-[#222B2B] uppercase">
                  Desglose de Ingredientes & Gramajes — {currentRecipe.product_name}
                </h3>
                <p className="text-xs text-[#574237]">
                  Rendimiento: {currentRecipe.yield_portions} porción individual
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#222B2B] text-white uppercase text-[10px] tracking-wider font-heading">
                  <tr>
                    <th className="p-4">Ingrediente</th>
                    <th className="p-4">Cantidad / Gramaje</th>
                    <th className="p-4">Unidad</th>
                    <th className="p-4">Costo Unitario ($ COP)</th>
                    <th className="p-4 text-right">Costo por Porción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dec0b1]/60">
                  {currentRecipe.items.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FFF2DF]/30">
                      <td className="p-4 font-bold text-[#222B2B]">{item.ingredient_name}</td>
                      <td className="p-4 font-mono font-bold text-sm text-[#F47A22]">
                        {item.quantity}
                      </td>
                      <td className="p-4 text-[#8b7265] uppercase font-bold">{item.unit}</td>
                      <td className="p-4 font-mono text-[#574237]">
                        ${item.unit_cost_snapshot.toLocaleString('es-CO')}
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-sm text-[#222B2B]">
                        ${item.total_cost.toLocaleString('es-CO')} COP
                      </td>
                    </tr>
                  ))}
                  {/* Packaging cost row */}
                  <tr className="bg-[#FFF2DF]/50 font-bold">
                    <td className="p-4">Empaque caja ecológica & servilletas</td>
                    <td className="p-4 font-mono">1</td>
                    <td className="p-4 uppercase">UN</td>
                    <td className="p-4 font-mono">${currentRecipe.packaging_cost.toLocaleString('es-CO')}</td>
                    <td className="p-4 text-right font-mono text-sm text-[#222B2B]">
                      ${currentRecipe.packaging_cost.toLocaleString('es-CO')} COP
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Preparation Notes */}
            {currentRecipe.preparation_notes && (
              <div className="p-4 bg-[#FFF2DF]/30 border-t border-[#dec0b1] text-xs">
                <span className="font-bold text-[#222B2B] uppercase block mb-1">
                  Instrucciones Técnicas de Elaboración:
                </span>
                <p className="text-[#574237] leading-relaxed">
                  {currentRecipe.preparation_notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
