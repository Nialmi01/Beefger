'use client';

import React, { useState, useEffect } from 'react';
import { store } from '@/lib/store';
import { Order, DeliveryZone } from '@/lib/types';
import {
  Bike,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  UserCheck,
  Navigation,
  Send,
  AlertCircle,
} from 'lucide-react';

const RIDERS = [
  { id: 'r1', name: 'Brayan Domiciliario BEFFGER', phone: '3150000005', activeOrders: 1, status: 'Disponible' },
  { id: 'r2', name: 'Mateo Repartidor Express', phone: '3160000008', activeOrders: 0, status: 'Disponible' },
];

export default function DeliveryDispatchPage() {
  const [orders, setOrders] = useState<Order[]>(store.getOrders());
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(store.getDeliveryZones());
  const [selectedRiderByOrder, setSelectedRiderByOrder] = useState<Record<string, string>>({});

  useEffect(() => {
    return store.subscribe(() => {
      setOrders(store.getOrders());
      setDeliveryZones(store.getDeliveryZones());
    });
  }, []);

  const dispatchQueue = orders.filter(
    (o) => o.order_type === 'domicilio' && (o.status === 'listo' || o.status === 'en_domicilio')
  );

  const handleDispatchOrder = (orderId: string) => {
    const riderId = selectedRiderByOrder[orderId] || RIDERS[0].id;
    const rider = RIDERS.find((r) => r.id === riderId) || RIDERS[0];

    store.updateOrderStatus(orderId, 'en_domicilio', `Asignado a ${rider.name}`);
  };

  const handleMarkDelivered = (orderId: string) => {
    store.updateOrderStatus(orderId, 'entregado', `Entrega completada exitosamente por domiciliario`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-heading text-xs text-[#F47A22] uppercase font-bold tracking-wider">
            LOGÍSTICA & DESPACHO
          </span>
          <h1 className="font-heading text-3xl text-[#222B2B] uppercase mt-0.5">
            Control de Despachos & Domicilios
          </h1>
          <p className="text-xs text-[#574237]">
            Asigna pedidos listos a domiciliarios y realiza el seguimiento de entregas en Cali.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#10b981] bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
            2 Domiciliarios en Turno
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Active Dispatch Queue (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#dec0b1] pb-3">
            <h3 className="font-heading text-xl text-[#222B2B] uppercase">
              Cola de Despacho ({dispatchQueue.length})
            </h3>
            <span className="text-xs text-[#574237]">Listos en cocina o en camino</span>
          </div>

          {dispatchQueue.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-[#10b981] mx-auto opacity-70" />
              <h4 className="font-heading text-2xl text-[#222B2B]">
                No hay pedidos pendientes de despacho
              </h4>
              <p className="text-xs text-[#574237]">
                Cuando cocina marque una orden como &quot;LISTA&quot;, aparecerá aquí inmediatamente.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {dispatchQueue.map((order) => {
                const isInTransit = order.status === 'en_domicilio';

                return (
                  <div
                    key={order.id}
                    className={`p-4 rounded-2xl border-2 transition-all space-y-3 ${
                      isInTransit
                        ? 'border-purple-300 bg-purple-50/30'
                        : 'border-[#F47A22] bg-[#FFF2DF]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-sm text-white bg-[#222B2B] px-2.5 py-0.5 rounded">
                          {order.order_number}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          isInTransit ? 'bg-purple-600 text-white' : 'bg-[#F47A22] text-white'
                        }`}>
                          {isInTransit ? 'En Ruta' : 'Listo para Despacho'}
                        </span>
                      </div>

                      <span className="font-heading text-lg font-bold text-[#222B2B]">
                        ${order.total.toLocaleString('es-CO')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-bold text-[#222B2B] block">{order.customer_name}</span>
                        <span className="text-[#574237] flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#F47A22]" /> {order.customer_phone}
                        </span>
                      </div>

                      <div>
                        <span className="font-bold text-[#222B2B] block flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#F47A22]" /> Dirección
                        </span>
                        <span className="text-[#574237] line-clamp-1">{order.delivery_address}</span>
                      </div>
                    </div>

                    {/* Rider Assign & Dispatch CTA */}
                    <div className="pt-2 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                      {!isInTransit ? (
                        <>
                          <div className="w-full sm:w-auto flex items-center gap-2 text-xs">
                            <span className="font-bold text-[#8b7265]">Asignar a:</span>
                            <select
                              value={selectedRiderByOrder[order.id] || RIDERS[0].id}
                              onChange={(e) =>
                                setSelectedRiderByOrder({
                                  ...selectedRiderByOrder,
                                  [order.id]: e.target.value,
                                })
                              }
                              className="p-1.5 rounded-lg border border-[#dec0b1] bg-white font-medium text-xs"
                            >
                              {RIDERS.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <button
                            onClick={() => handleDispatchOrder(order.id)}
                            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#F47A22] hover:bg-[#d96616] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Despachar Pedido</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-xs text-purple-700 font-bold flex items-center gap-1">
                            <Navigation className="w-4 h-4" /> Domiciliario en tránsito
                          </span>
                          <button
                            onClick={() => handleMarkDelivered(order.id)}
                            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirmar Entrega</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Delivery Zones & Riders (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Riders */}
          <div className="bg-white p-5 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-3">
            <h3 className="font-heading text-lg text-[#222B2B] uppercase border-b border-[#dec0b1] pb-2">
              Flota de Repartidores
            </h3>
            <div className="space-y-2">
              {RIDERS.map((rider) => (
                <div key={rider.id} className="p-3 rounded-2xl bg-[#FFF2DF]/50 border border-[#dec0b1] text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#222B2B]">
                    <span>{rider.name}</span>
                    <span className="text-[#10b981] text-[10px] uppercase font-bold">{rider.status}</span>
                  </div>
                  <span className="text-[11px] text-[#8b7265] block">{rider.phone}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Zones */}
          <div className="bg-white p-5 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-3">
            <h3 className="font-heading text-lg text-[#222B2B] uppercase border-b border-[#dec0b1] pb-2">
              Zonas de Entrega & Tarifas
            </h3>
            <div className="space-y-2 text-xs">
              {deliveryZones.map((z) => (
                <div key={z.id} className="p-2.5 rounded-xl border border-[#dec0b1] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#222B2B] block">{z.name}</span>
                    <span className="text-[10px] text-[#8b7265]">{z.estimated_time_minutes} min est.</span>
                  </div>
                  <span className="font-heading text-sm text-[#F47A22] font-bold">
                    ${z.delivery_fee.toLocaleString('es-CO')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
