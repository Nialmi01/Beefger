'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { Order } from '@/lib/types';
import {
  Bike,
  MapPin,
  Phone,
  CheckCircle2,
  Navigation,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Coins,
} from 'lucide-react';

export default function RiderAppPage() {
  const [orders, setOrders] = useState<Order[]>(store.getOrders());
  const [activeTab, setActiveTab] = useState<'activas' | 'liquidadas'>('activas');

  useEffect(() => {
    return store.subscribe(() => {
      setOrders(store.getOrders());
    });
  }, []);

  const activeDeliveries = orders.filter(
    (o) => o.order_type === 'domicilio' && (o.status === 'listo' || o.status === 'en_domicilio')
  );

  const completedDeliveries = orders.filter(
    (o) => o.order_type === 'domicilio' && o.status === 'entregado'
  );

  const handleTakeOrder = (orderId: string) => {
    store.updateOrderStatus(orderId, 'en_domicilio', 'Tomado por Brayan Domiciliario');
  };

  const handleCompleteDelivery = (orderId: string) => {
    store.updateOrderStatus(orderId, 'entregado', 'Entregado en puerta por Brayan Domiciliario');
  };

  const totalEarnings = completedDeliveries.length * 4000; // $4.000 fee per run

  return (
    <div className="min-h-screen bg-[#222B2B] text-white flex flex-col max-w-md mx-auto shadow-2xl border-x border-[#363023]">
      {/* Top Rider Header */}
      <header className="p-4 bg-[#141A1A] border-b border-white/10 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#F47A22] text-white flex items-center justify-center font-bold">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading text-lg leading-tight uppercase text-white m-0">
              BEFFGER RIDER
            </h1>
            <span className="text-[10px] text-[#10b981] font-bold">
              ● En Turno: Brayan D.
            </span>
          </div>
        </div>

        <Link
          href="/admin"
          className="text-xs text-[#FFC247] hover:underline font-bold"
        >
          Panel Admin →
        </Link>
      </header>

      {/* Tabs */}
      <div className="grid grid-cols-2 bg-black/40 p-2 gap-2 border-b border-white/10">
        <button
          onClick={() => setActiveTab('activas')}
          className={`py-2 rounded-xl text-xs font-bold uppercase transition-all ${
            activeTab === 'activas'
              ? 'bg-[#F47A22] text-white shadow'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          Carreras Activas ({activeDeliveries.length})
        </button>
        <button
          onClick={() => setActiveTab('liquidadas')}
          className={`py-2 rounded-xl text-xs font-bold uppercase transition-all ${
            activeTab === 'liquidadas'
              ? 'bg-[#F47A22] text-white shadow'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          Liquidación ({completedDeliveries.length})
        </button>
      </div>

      <main className="flex-1 p-4 space-y-4 overflow-y-auto">
        {activeTab === 'activas' ? (
          activeDeliveries.length === 0 ? (
            <div className="text-center py-20 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-[#10b981] mx-auto opacity-70" />
              <h3 className="font-heading text-2xl text-white">No tienes carreras pendientes</h3>
              <p className="text-xs text-white/60">
                Las órdenes listas en cocina aparecerán aquí automáticamente.
              </p>
            </div>
          ) : (
            activeDeliveries.map((order) => {
              const inTransit = order.status === 'en_domicilio';

              return (
                <div
                  key={order.id}
                  className="bg-[#2D3838] p-4 rounded-2xl border border-white/10 space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-sm text-white bg-[#F47A22] px-2.5 py-0.5 rounded">
                      {order.order_number}
                    </span>
                    <span className="font-heading text-base font-bold text-[#FFC247]">
                      ${order.total.toLocaleString('es-CO')} COP
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-white/90">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#F47A22] shrink-0 mt-0.5" />
                      <span className="font-bold">{order.delivery_address}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#10b981] shrink-0" />
                      <a href={`tel:${order.customer_phone}`} className="underline font-bold text-[#FFC247]">
                        {order.customer_name} ({order.customer_phone})
                      </a>
                    </div>

                    <div className="p-2 rounded-xl bg-black/30 border border-white/5 text-[11px] text-white/70">
                      <strong>Cobro:</strong> {order.payment_method === 'efectivo' ? 'COBRAR EN EFECTIVO' : 'PAGADO DIGITALMENTE'}
                    </div>
                  </div>

                  <div className="pt-2">
                    {!inTransit ? (
                      <button
                        onClick={() => handleTakeOrder(order.id)}
                        className="w-full py-3 rounded-xl bg-[#F47A22] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Iniciar Ruta de Entrega</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCompleteDelivery(order.id)}
                        className="w-full py-3 rounded-xl bg-[#10b981] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirmar Entrega al Cliente</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )
        ) : (
          /* Shift Earnings & Settlement */
          <div className="space-y-4">
            <div className="bg-[#141A1A] p-5 rounded-2xl border border-white/10 space-y-2 text-center">
              <span className="text-xs text-[#FFC247] uppercase font-bold tracking-wider">
                Ganancias del Turno
              </span>
              <h2 className="font-heading text-4xl text-white">
                ${totalEarnings.toLocaleString('es-CO')} COP
              </h2>
              <span className="text-xs text-[#10b981] font-bold block">
                {completedDeliveries.length} entregas realizadas
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-white/60 uppercase block">
                Historial de Entregas:
              </span>
              {completedDeliveries.map((cd) => (
                <div key={cd.id} className="p-3 rounded-xl bg-[#2D3838] border border-white/10 flex justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{cd.order_number}</span>
                    <span className="text-[10px] text-white/60">{cd.delivery_address}</span>
                  </div>
                  <span className="font-bold text-[#10b981]">+$4.000 COP</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
