'use client';

import React, { useState, useEffect } from 'react';
import { store } from '@/lib/store';
import { Order } from '@/lib/types';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
  Printer,
  Calendar,
  Percent,
  ArrowUpRight,
} from 'lucide-react';

export default function FinancialReportsPage() {
  const [orders, setOrders] = useState<Order[]>(store.getOrders());

  useEffect(() => {
    return store.subscribe(() => {
      setOrders(store.getOrders());
    });
  }, []);

  const totalGrossSales = orders.reduce((s, o) => s + o.total, 0);
  const estimatedFoodCost = Math.round(totalGrossSales * 0.41); // Average 41% across gourmet menu
  const estimatedGrossProfit = totalGrossSales - estimatedFoodCost;
  const grossMarginPercentage = totalGrossSales > 0 ? ((estimatedGrossProfit / totalGrossSales) * 100).toFixed(1) : '0';

  // Categories breakdown
  const burgerSales = Math.round(totalGrossSales * 0.48);
  const pizzaSales = Math.round(totalGrossSales * 0.32);
  const hotdogSales = Math.round(totalGrossSales * 0.15);
  const sidesSales = totalGrossSales - burgerSales - pizzaSales - hotdogSales;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-heading text-xs text-[#F47A22] uppercase font-bold tracking-wider">
            ANÁLISIS FINANCIERO & RENTABILIDAD
          </span>
          <h1 className="font-heading text-3xl text-[#222B2B] uppercase mt-0.5">
            Reportes de Ventas & Food Cost
          </h1>
          <p className="text-xs text-[#574237]">
            Rendimiento económico, margen de contribución y utilidad bruta del restaurante.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#dec0b1] hover:bg-[#FFF2DF] text-xs font-bold uppercase transition-colors"
        >
          <Printer className="w-4 h-4 text-[#F47A22]" />
          <span>Imprimir Informe</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-[#8b7265] uppercase">Ventas Brutas</span>
          <h3 className="font-heading text-2xl text-[#222B2B]">
            ${totalGrossSales.toLocaleString('es-CO')} COP
          </h3>
          <span className="text-[11px] text-[#10b981] font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Ingresos operativos totales
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-[#8b7265] uppercase">Costo Insumos (COGS)</span>
          <h3 className="font-heading text-2xl text-[#E94D3C]">
            ${estimatedFoodCost.toLocaleString('es-CO')} COP
          </h3>
          <span className="text-[11px] text-[#574237]">
            Promedio 41% Food Cost
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-[#8b7265] uppercase">Utilidad Bruta</span>
          <h3 className="font-heading text-2xl text-[#10b981]">
            ${estimatedGrossProfit.toLocaleString('es-CO')} COP
          </h3>
          <span className="text-[11px] text-[#574237]">
            Margen antes de costos fijos
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-[#8b7265] uppercase">Margen Porcentual</span>
          <h3 className="font-heading text-2xl text-[#F47A22]">
            {grossMarginPercentage}%
          </h3>
          <span className="text-[11px] text-[#10b981] font-bold">
            Dentro de meta de rentabilidad
          </span>
        </div>
      </div>

      {/* Category Sales Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="bg-white p-6 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-4">
          <h3 className="font-heading text-xl text-[#222B2B] uppercase border-b border-[#dec0b1] pb-3">
            Ventas por Línea Gastronómica
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Hamburguesas Gourmet (La Brutal, Criolla, Tropical)</span>
                <span className="text-[#F47A22]">${burgerSales.toLocaleString('es-CO')} COP (48%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-[#F47A22] h-2.5 rounded-full" style={{ width: '48%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Pizzas Artesanales 30cm (Colombiana, BBQ, Tropical)</span>
                <span className="text-[#222B2B]">${pizzaSales.toLocaleString('es-CO')} COP (32%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-[#222B2B] h-2.5 rounded-full" style={{ width: '32%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Perros Calientes Gourmet (Callejero, Ranchero, Ahumado)</span>
                <span className="text-[#c99315]">${hotdogSales.toLocaleString('es-CO')} COP (15%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-[#FFC247] h-2.5 rounded-full" style={{ width: '15%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Complementos & Bebidas</span>
                <span className="text-[#10b981]">${sidesSales.toLocaleString('es-CO')} COP (5%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-[#10b981] h-2.5 rounded-full" style={{ width: '5%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Operational Channels */}
        <div className="bg-white p-6 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-4">
          <h3 className="font-heading text-xl text-[#222B2B] uppercase border-b border-[#dec0b1] pb-3">
            Canales de Servicio
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#FFF2DF]/60 border border-[#dec0b1] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#222B2B] block">Domicilios Propios (Web)</span>
                <span className="text-[11px] text-[#8b7265]">Entregas puerta a puerta en Cali</span>
              </div>
              <span className="font-heading text-lg font-bold text-[#F47A22]">
                72%
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF2DF]/60 border border-[#dec0b1] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#222B2B] block">Consumo en Mesa (Parque del Perro)</span>
                <span className="text-[11px] text-[#8b7265]">Atención en establecimiento</span>
              </div>
              <span className="font-heading text-lg font-bold text-[#222B2B]">
                20%
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF2DF]/60 border border-[#dec0b1] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#222B2B] block">Para Llevar (Takeout)</span>
                <span className="text-[11px] text-[#8b7265]">Retiro por cliente</span>
              </div>
              <span className="font-heading text-lg font-bold text-[#10b981]">
                8%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
