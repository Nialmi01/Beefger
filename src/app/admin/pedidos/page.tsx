'use client';

import React, { useState, useEffect } from 'react';
import { store } from '@/lib/store';
import { Order, OrderStatus } from '@/lib/types';
import {
  Clock,
  ChefHat,
  PackageCheck,
  Bike,
  CheckCircle2,
  XCircle,
  Phone,
  MapPin,
  ArrowRight,
  Filter,
} from 'lucide-react';

const KANBAN_COLUMNS: { status: OrderStatus; label: string; color: string; badgeColor: string }[] = [
  { status: 'nuevo', label: 'Nuevos', color: 'border-blue-400 bg-blue-50/40', badgeColor: 'bg-blue-600' },
  { status: 'confirmado', label: 'Confirmados', color: 'border-indigo-400 bg-indigo-50/40', badgeColor: 'bg-indigo-600' },
  { status: 'en_preparacion', label: 'En Cocina', color: 'border-[#F47A22] bg-[#F47A22]/5', badgeColor: 'bg-[#F47A22]' },
  { status: 'listo', label: 'Listos / Empacados', color: 'border-[#FFC247] bg-[#FFC247]/10', badgeColor: 'bg-[#c99315]' },
  { status: 'en_domicilio', label: 'En Domicilio', color: 'border-purple-400 bg-purple-50/40', badgeColor: 'bg-purple-600' },
  { status: 'entregado', label: 'Entregados', color: 'border-emerald-400 bg-emerald-50/40', badgeColor: 'bg-emerald-600' },
];

export default function KanbanPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(store.getOrders());
    return store.subscribe(() => {
      setOrders(store.getOrders());
    });
  }, []);

  const handleAdvanceStatus = (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus = 'nuevo';
    if (currentStatus === 'nuevo') nextStatus = 'confirmado';
    else if (currentStatus === 'confirmado') nextStatus = 'en_preparacion';
    else if (currentStatus === 'en_preparacion') nextStatus = 'listo';
    else if (currentStatus === 'listo') nextStatus = 'en_domicilio';
    else if (currentStatus === 'en_domicilio') nextStatus = 'entregado';

    store.updateOrderStatus(orderId, nextStatus, `Avanzado desde Kanban`);
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm('¿Estás seguro de cancelar esta orden?')) {
      store.updateOrderStatus(orderId, 'cancelado', 'Cancelado manualmente por el administrador');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm">
        <div>
          <span className="font-heading text-xs text-[#F47A22] uppercase font-bold tracking-wider">
            GESTIÓN OPERATIVA EN TIEMPO REAL
          </span>
          <h1 className="font-heading text-3xl text-[#222B2B] uppercase mt-0.5">
            Tablero Kanban de Comandas
          </h1>
          <p className="text-xs text-[#574237]">
            Arrastra o avanza comandas a través del flujo de producción y despacho.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#222B2B] bg-[#FFF2DF] px-3 py-1.5 rounded-full border border-[#dec0b1]">
            Total Activas: {orders.filter((o) => o.status !== 'entregado' && o.status !== 'cancelado').length}
          </span>
        </div>
      </div>

      {/* Kanban Board Horizontal Scrolling Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((col) => {
          const columnOrders = orders.filter((o) => o.status === col.status);

          return (
            <div
              key={col.status}
              className={`rounded-2xl border ${col.color} p-3 flex flex-col max-h-[82vh] shadow-sm`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#dec0b1]/60">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.badgeColor}`} />
                  <h3 className="font-heading text-sm text-[#222B2B] uppercase tracking-wide">
                    {col.label}
                  </h3>
                </div>
                <span className="w-5 h-5 rounded-full bg-white text-[#222B2B] font-bold text-[11px] flex items-center justify-center border shadow-sm">
                  {columnOrders.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                {columnOrders.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#8b7265] italic">
                    Sin pedidos
                  </div>
                ) : (
                  columnOrders.map((order) => {
                    const elapsedMin = Math.round(
                      (Date.now() - new Date(order.created_at).getTime()) / (60 * 1000)
                    );

                    return (
                      <div
                        key={order.id}
                        className="bg-white p-3.5 rounded-xl border border-[#dec0b1] shadow-sm space-y-3 text-xs hover:shadow-md transition-shadow"
                      >
                        {/* Header: Number & Elapsed */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-extrabold text-[#222B2B] bg-[#FFF2DF] px-2 py-0.5 rounded border border-[#dec0b1]">
                            {order.order_number}
                          </span>
                          <span className={`text-[10px] font-bold flex items-center gap-1 ${
                            elapsedMin > 25 ? 'text-[#ba1a1a]' : 'text-[#8b7265]'
                          }`}>
                            <Clock className="w-3 h-3" />
                            {elapsedMin}m
                          </span>
                        </div>

                        {/* Customer & Type */}
                        <div>
                          <span className="font-bold text-[#222B2B] block leading-tight">
                            {order.customer_name}
                          </span>
                          <span className="text-[10px] text-[#8b7265] flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-[#F47A22]" /> {order.customer_phone}
                          </span>
                        </div>

                        {/* Products list snapshot */}
                        <div className="space-y-1 bg-[#FFF2DF]/40 p-2 rounded-lg border border-[#dec0b1]/50">
                          {order.items.map((i) => (
                            <div key={i.id} className="text-[11px] text-[#222B2B] flex justify-between">
                              <span className="truncate">{i.quantity}x {i.product_name_snapshot}</span>
                            </div>
                          ))}
                          {order.kitchen_notes && (
                            <p className="text-[10px] italic text-[#8b7265]">
                              &quot;{order.kitchen_notes}&quot;
                            </p>
                          )}
                        </div>

                        {/* Price & Delivery */}
                        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                          <span className="font-heading text-sm font-bold text-[#F47A22]">
                            ${order.total.toLocaleString('es-CO')}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-[#8b7265]">
                            {order.order_type}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 pt-1">
                          {order.status !== 'entregado' && (
                            <button
                              onClick={() => handleAdvanceStatus(order.id, order.status)}
                              className="flex-1 py-1.5 rounded-lg bg-[#222B2B] hover:bg-[#F47A22] text-white font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                            >
                              <span>Avanzar</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            title="Cancelar orden"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
