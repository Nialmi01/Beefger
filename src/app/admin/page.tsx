'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { Order, Product } from '@/lib/types';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  TrendingUp,
  ChefHat,
  Bike,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Flame,
  Award,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setOrders(store.getOrders());
    setProducts(store.getProducts());

    return store.subscribe(() => {
      setOrders(store.getOrders());
      setProducts(store.getProducts());
    });
  }, []);

  // Compute Live Metrics from real orders
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'nuevo' || o.status === 'confirmado').length;
  const inKitchen = orders.filter((o) => o.status === 'en_preparacion').length;
  const readyOrders = orders.filter((o) => o.status === 'listo' || o.status === 'en_domicilio').length;
  const delivered = orders.filter((o) => o.status === 'entregado').length;
  const avgTicket = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  // Method Breakdown
  const cashSales = orders.filter((o) => o.payment_method === 'efectivo').reduce((s, o) => s + o.total, 0);
  const digitalSales = totalSales - cashSales;

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="bg-[#222B2B] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-heading text-xs text-[#FFC247] uppercase tracking-widest font-bold">
            PANEL GERENCIAL EN VIVO
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl text-white uppercase mt-1">
            Resumen Operativo BEFFGER
          </h1>
          <p className="text-xs sm:text-sm text-[#EDE1CE]/80 mt-1">
            Métricas consolidadas de ventas, comensales en cocina y pedidos a domicilio en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/cocina"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F47A22] hover:bg-[#d96616] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            <ChefHat className="w-4 h-4" />
            <span>PANTALLA COCINA KDS</span>
          </Link>
          <Link
            href="/admin/caja"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/10"
          >
            <span>TERMINAL POS</span>
          </Link>
        </div>
      </div>

      {/* 4 Core KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-beffger-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8b7265] uppercase">Ventas del Turno</span>
            <div className="w-8 h-8 rounded-xl bg-[#F47A22]/10 text-[#F47A22] flex items-center justify-center font-bold">
              $
            </div>
          </div>
          <div>
            <h3 className="font-heading text-3xl text-[#222B2B]">
              ${totalSales.toLocaleString('es-CO')}
            </h3>
            <span className="text-[11px] text-[#10b981] font-bold">
              COP facturados hoy
            </span>
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-beffger-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8b7265] uppercase">Comandas Totales</span>
            <div className="w-8 h-8 rounded-xl bg-[#222B2B]/10 text-[#222B2B] flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-heading text-3xl text-[#222B2B]">
              {totalOrders}
            </h3>
            <span className="text-[11px] text-[#574237]">
              {delivered} entregados con éxito
            </span>
          </div>
        </div>

        {/* KPI 3: In Preparation */}
        <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-beffger-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8b7265] uppercase">En Cocina Activa</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFC247]/20 text-[#c99315] flex items-center justify-center font-bold">
              <ChefHat className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-heading text-3xl text-[#F47A22]">
              {inKitchen + pendingOrders}
            </h3>
            <span className="text-[11px] text-[#574237]">
              {pendingOrders} por iniciar • {inKitchen} en parrilla
            </span>
          </div>
        </div>

        {/* KPI 4: Average Ticket */}
        <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-beffger-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8b7265] uppercase">Ticket Promedio</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-heading text-3xl text-[#222B2B]">
              ${avgTicket.toLocaleString('es-CO')}
            </h3>
            <span className="text-[11px] text-[#574237]">
              Promedio por orden
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Kanban Preview & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Active Orders List (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-5">
          <div className="flex items-center justify-between border-b border-[#dec0b1] pb-3">
            <div>
              <h3 className="font-heading text-2xl text-[#222B2B] uppercase">
                Comandas en Tiempo Real
              </h3>
              <p className="text-xs text-[#574237]">Últimos pedidos registrados en el sistema</p>
            </div>
            <Link
              href="/admin/pedidos"
              className="text-xs font-bold text-[#F47A22] hover:text-[#d96616] flex items-center gap-1 uppercase"
            >
              <span>Ver Kanban</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <ShoppingBag className="w-10 h-10 text-[#8b7265] mx-auto opacity-50" />
                <h4 className="font-heading text-lg text-[#222B2B]">No hay comandas activas</h4>
                <p className="text-xs text-[#574237]">
                  Los pedidos realizados por clientes en la tienda o creados en caja aparecerán aquí en vivo.
                </p>
              </div>
            ) : (
              orders.slice(0, 5).map((o) => (
                <div
                  key={o.id}
                  className="p-4 rounded-2xl border border-[#dec0b1]/70 bg-[#FFF2DF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#F47A22] transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold bg-[#222B2B] text-white px-2.5 py-0.5 rounded">
                        {o.order_number}
                      </span>
                      <span className="font-bold text-xs text-[#222B2B]">{o.customer_name}</span>
                      <span className="text-[10px] text-gray-400">
                        • {new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-xs text-[#574237] mt-1.5">
                      {o.items.map((i) => `${i.quantity}x ${i.product_name_snapshot}`).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        o.status === 'nuevo'
                          ? 'bg-blue-100 text-blue-800'
                          : o.status === 'en_preparacion'
                          ? 'bg-amber-100 text-amber-800'
                          : o.status === 'listo'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {o.status.replace('_', ' ')}
                    </span>
                    <span className="font-heading text-lg text-[#222B2B] font-bold">
                      ${o.total.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Gourmet Products & Channels (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top Selling Products */}
          <div className="bg-white p-6 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-4">
            <h3 className="font-heading text-xl text-[#222B2B] uppercase border-b border-[#dec0b1] pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#FFC247]" />
              <span>Creaciones Más Vendidas</span>
            </h3>

            <div className="space-y-3">
              {products.slice(0, 4).map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-[#FFF2DF]/50">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#222B2B] text-white flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <img
                      src={p.image_url}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover border"
                    />
                    <div>
                      <span className="font-bold text-[#222B2B] block">{p.name}</span>
                      <span className="text-[10px] text-[#8b7265]">${p.price.toLocaleString('es-CO')} COP</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#10b981] bg-emerald-50 px-2 py-1 rounded">
                    Popular
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-3">
            <h3 className="font-heading text-xl text-[#222B2B] uppercase border-b border-[#dec0b1] pb-2">
              Distribución de Pagos
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#574237]">Efectivo contra entrega</span>
                <span className="font-bold text-[#222B2B]">${cashSales.toLocaleString('es-CO')} COP</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-[#10b981] h-2 rounded-full transition-all"
                  style={{ width: `${totalSales > 0 ? (cashSales / totalSales) * 100 : 0}%` }}
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[#574237]">Digital (Wompi / Nequi)</span>
                <span className="font-bold text-[#222B2B]">${digitalSales.toLocaleString('es-CO')} COP</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-[#F47A22] h-2 rounded-full transition-all"
                  style={{ width: `${totalSales > 0 ? (digitalSales / totalSales) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
