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
  Info,
} from 'lucide-react';

export default function FinancialReportsPage() {
  const [orders, setOrders] = useState<Order[]>(store.getOrders());

  useEffect(() => {
    setOrders(store.getOrders());
    return store.subscribe(() => {
      setOrders(store.getOrders());
    });
  }, []);

  const totalOrders = orders.length;
  const totalGrossSales = orders.reduce((s, o) => s + (o.total || 0), 0);
  const estimatedFoodCost = Math.round(totalGrossSales * 0.38); // Margen promedio de food cost sobre ventas reales
  const estimatedGrossProfit = totalGrossSales - estimatedFoodCost;
  const grossMarginPercentage =
    totalGrossSales > 0 ? ((estimatedGrossProfit / totalGrossSales) * 100).toFixed(1) : '0';

  // Dynamic Category Sales from actual ordered items
  const allProducts = store.getProducts();
  let burgerSales = 0;
  let pizzaSales = 0;
  let hotdogSales = 0;
  let sidesSales = 0;

  orders.forEach((o) => {
    o.items?.forEach((item) => {
      const prod = allProducts.find((p) => p.id === item.product_id);
      const catId = prod?.category_id;
      const name = item.product_name_snapshot || '';
      const itemTotal = item.total_price || item.unit_price * item.quantity;

      if (
        catId === 'c1' ||
        name.includes('Brutal') ||
        name.includes('Criolla') ||
        (name.includes('Tropical') && !name.includes('Pizza'))
      ) {
        burgerSales += itemTotal;
      } else if (
        catId === 'c3' ||
        name.includes('Pizza') ||
        name.includes('Colombiana') ||
        name.includes('BBQ Explosiva') ||
        name.includes('Tropical Picante')
      ) {
        pizzaSales += itemTotal;
      } else if (
        catId === 'c2' ||
        name.includes('Callejero') ||
        name.includes('Ranchero') ||
        name.includes('Ahumado')
      ) {
        hotdogSales += itemTotal;
      } else {
        sidesSales += itemTotal;
      }
    });
  });

  const burgerPct = totalGrossSales > 0 ? Math.round((burgerSales / totalGrossSales) * 100) : 0;
  const pizzaPct = totalGrossSales > 0 ? Math.round((pizzaSales / totalGrossSales) * 100) : 0;
  const hotdogPct = totalGrossSales > 0 ? Math.round((hotdogSales / totalGrossSales) * 100) : 0;
  const sidesPct =
    totalGrossSales > 0
      ? Math.max(0, 100 - (burgerPct + pizzaPct + hotdogPct))
      : 0;

  // Dynamic Service Channels from actual orders
  const deliveryOrdersCount = orders.filter((o) => o.order_type === 'domicilio').length;
  const dineInOrdersCount = orders.filter((o) => o.order_type === 'mesa').length;
  const takeoutOrdersCount = orders.filter((o) => o.order_type === 'retiro').length;

  const deliveryPct = totalOrders > 0 ? Math.round((deliveryOrdersCount / totalOrders) * 100) : 0;
  const dineInPct = totalOrders > 0 ? Math.round((dineInOrdersCount / totalOrders) * 100) : 0;
  const takeoutPct = totalOrders > 0 ? Math.max(0, 100 - (deliveryPct + dineInPct)) : 0;

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
            Rendimiento económico, margen de contribución y utilidad bruta calculados a partir de comandas reales.
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
          <span className="text-[10px] font-bold text-[#8b7265] uppercase">Ventas Brutas Reales</span>
          <h3 className="font-heading text-2xl text-[#222B2B]">
            ${totalGrossSales.toLocaleString('es-CO')} COP
          </h3>
          <span className="text-[11px] text-[#10b981] font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> {totalOrders} comanda(s) procesadas
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-[#8b7265] uppercase">Costo Insumos (COGS Est.)</span>
          <h3 className="font-heading text-2xl text-[#E94D3C]">
            ${estimatedFoodCost.toLocaleString('es-CO')} COP
          </h3>
          <span className="text-[11px] text-[#574237]">
            Promedio ~38% Food Cost
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-[#8b7265] uppercase">Utilidad Bruta Operativa</span>
          <h3 className="font-heading text-2xl text-[#10b981]">
            ${estimatedGrossProfit.toLocaleString('es-CO')} COP
          </h3>
          <span className="text-[11px] text-[#574237]">
            Margen antes de gastos fijos
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-[#8b7265] uppercase">Margen Porcentual</span>
          <h3 className="font-heading text-2xl text-[#F47A22]">
            {grossMarginPercentage}%
          </h3>
          <span className="text-[11px] text-[#10b981] font-bold">
            Meta de rentabilidad
          </span>
        </div>
      </div>

      {totalOrders === 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2.5 text-xs">
          <Info className="w-4 h-4 shrink-0 text-amber-700" />
          <span>
            <strong>Sin ventas acumuladas en producción:</strong> Los gráficos y canales reflejan 0% hasta que ingresen órdenes reales por la tienda online o la caja POS.
          </span>
        </div>
      )}

      {/* Category Sales Distribution & Service Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Category breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#dec0b1] pb-3">
            <h3 className="font-heading text-xl text-[#222B2B] uppercase">
              Ventas por Línea Gastronómica
            </h3>
            <span className="text-[11px] font-bold text-[#8b7265]">Cálculo en Vivo</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Hamburguesas (La Brutal, Criolla, Tropical)</span>
                <span className="text-[#F47A22]">
                  ${burgerSales.toLocaleString('es-CO')} COP ({burgerPct}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-[#F47A22] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${burgerPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Pizzas Artesanales 30cm (Colombiana, BBQ, Tropical)</span>
                <span className="text-[#222B2B]">
                  ${pizzaSales.toLocaleString('es-CO')} COP ({pizzaPct}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-[#222B2B] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${pizzaPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Perros Calientes (Callejero, Ranchero, Ahumado)</span>
                <span className="text-[#c99315]">
                  ${hotdogSales.toLocaleString('es-CO')} COP ({hotdogPct}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-[#FFC247] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${hotdogPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Complementos & Bebidas (Papas Rústicas, etc.)</span>
                <span className="text-[#10b981]">
                  ${sidesSales.toLocaleString('es-CO')} COP ({sidesPct}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-[#10b981] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${sidesPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Operational Channels */}
        <div className="bg-white p-6 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#dec0b1] pb-3">
            <h3 className="font-heading text-xl text-[#222B2B] uppercase">
              Canales de Servicio
            </h3>
            <span className="text-[11px] font-bold text-[#8b7265]">Porcentaje de Comandas</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#FFF2DF]/60 border border-[#dec0b1] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#222B2B] block">Domicilios (Web & App)</span>
                <span className="text-[11px] text-[#8b7265]">
                  Entregas puerta a puerta • {deliveryOrdersCount} órdenes
                </span>
              </div>
              <span className="font-heading text-lg font-bold text-[#F47A22]">
                {deliveryPct}%
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF2DF]/60 border border-[#dec0b1] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#222B2B] block">Consumo en Mesa</span>
                <span className="text-[11px] text-[#8b7265]">
                  Servicio en establecimiento • {dineInOrdersCount} órdenes
                </span>
              </div>
              <span className="font-heading text-lg font-bold text-[#222B2B]">
                {dineInPct}%
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF2DF]/60 border border-[#dec0b1] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#222B2B] block">Para Llevar (Takeout)</span>
                <span className="text-[11px] text-[#8b7265]">
                  Retiro directo por cliente • {takeoutOrdersCount} órdenes
                </span>
              </div>
              <span className="font-heading text-lg font-bold text-[#10b981]">
                {takeoutPct}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
