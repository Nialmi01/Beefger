'use client';

import React, { useState, useEffect } from 'react';
import { store } from '@/lib/store';
import { Order, OrderStatus } from '@/lib/types';
import {
  ChefHat,
  Clock,
  CheckCircle,
  AlertTriangle,
  Play,
  Flame,
  Volume2,
  Utensils,
  Maximize2,
  RefreshCw,
} from 'lucide-react';

const STATIONS = [
  { id: 'all', label: 'Toda la Cocina (Consolidado)' },
  { id: 'hamburguesas', label: 'Estación Hamburguesas' },
  { id: 'perros', label: 'Estación Perros' },
  { id: 'pizzas', label: 'Estación Pizzas 30cm' },
  { id: 'complementos', label: 'Estación Papas' },
];

export default function KitchenKdsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeStation, setActiveStation] = useState<string>('all');
  const [currentTime, setCurrentTime] = useState<string>('');
  const prevCountRef = React.useRef<number>(0);

  const playKitchenChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const now = audioCtx.currentTime;

      // Two-tone bell chime: 880Hz (A5) -> 1320Hz (E6)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.4, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1320, now + 0.2);
      gain2.gain.setValueAtTime(0.4, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.2);
      osc2.stop(now + 1.0);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  useEffect(() => {
    const initialOrders = store.getOrders();
    setOrders(initialOrders);
    prevCountRef.current = initialOrders.filter(
      (o) => o.status === 'nuevo' || o.status === 'confirmado' || o.status === 'en_preparacion'
    ).length;

    const unsub = store.subscribe(() => {
      const current = store.getOrders();
      const activeCount = current.filter(
        (o) => o.status === 'nuevo' || o.status === 'confirmado' || o.status === 'en_preparacion'
      ).length;

      if (activeCount > prevCountRef.current && prevCountRef.current > 0) {
        playKitchenChime();
      }
      prevCountRef.current = activeCount;
      setOrders(current);
    });

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      unsub();
      clearInterval(timer);
    };
  }, []);

  // Filter only active kitchen orders
  const kitchenOrders = orders.filter(
    (o) => o.status === 'nuevo' || o.status === 'confirmado' || o.status === 'en_preparacion'
  );

  const filteredOrders = kitchenOrders.filter((order) => {
    if (activeStation === 'all') return true;
    if (activeStation === 'hamburguesas') {
      return order.items.some((i) => i.product_name_snapshot.toLowerCase().includes('brutal') || i.product_name_snapshot.toLowerCase().includes('criolla') || i.product_name_snapshot.toLowerCase().includes('tropical'));
    }
    if (activeStation === 'perros') {
      return order.items.some((i) => i.product_name_snapshot.toLowerCase().includes('callejero') || i.product_name_snapshot.toLowerCase().includes('ranchero') || i.product_name_snapshot.toLowerCase().includes('ahumado'));
    }
    if (activeStation === 'pizzas') {
      return order.items.some((i) => i.product_name_snapshot.toLowerCase().includes('pizza') || i.product_name_snapshot.toLowerCase().includes('colombiana') || i.product_name_snapshot.toLowerCase().includes('bbq'));
    }
    if (activeStation === 'complementos') {
      return order.items.some((i) => i.product_name_snapshot.toLowerCase().includes('papas'));
    }
    return true;
  });

  const handleStartPrep = (orderId: string) => {
    store.updateOrderStatus(orderId, 'en_preparacion', 'Iniciada preparación en parrilla KDS');
  };

  const handleMarkReady = (orderId: string) => {
    store.updateOrderStatus(orderId, 'listo', 'Comanda finalizada y empacada para despacho');
  };

  return (
    <div className="-m-6 lg:-m-8 min-h-screen bg-[#1A2020] text-white p-6 flex flex-col font-mono select-none">
      {/* KDS Header Bar */}
      <div className="bg-[#222B2B] p-4 rounded-2xl border border-white/10 shadow-xl flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F47A22] text-white flex items-center justify-center">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl uppercase tracking-wider text-white m-0">
              KDS — PANTALLA DE COCINA BEFFGER
            </h1>
            <span className="text-xs text-[#FFC247]">
              {kitchenOrders.length} comandas en cola activa • {currentTime}
            </span>
          </div>
        </div>

        {/* Stations Tabs & Chime Trigger */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={playKitchenChime}
            className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all bg-[#FFC247] text-[#222B2B] hover:bg-[#e6ad3b] flex items-center gap-1.5 shrink-0 shadow"
            title="Probar campana de comanda"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Timbre Cocina</span>
          </button>
          {STATIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStation(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap ${
                activeStation === s.id
                  ? 'bg-[#F47A22] text-white shadow-md'
                  : 'bg-white/10 text-[#EDE1CE] hover:bg-white/20'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* KDS Grid of Active Tickets */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-start">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full text-center py-24 space-y-3">
            <CheckCircle className="w-16 h-16 text-[#10b981] mx-auto opacity-70" />
            <h2 className="font-heading text-3xl text-white uppercase">
              ¡Cocina al día! No hay comandas pendientes
            </h2>
            <p className="text-xs text-[#EDE1CE]/60">
              Las nuevas órdenes ingresadas desde la web o POS sonarán automáticamente aquí.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const elapsedMin = Math.round(
              (Date.now() - new Date(order.created_at).getTime()) / (60 * 1000)
            );
            const isLate = elapsedMin >= 20;
            const isMedium = elapsedMin >= 10 && elapsedMin < 20;

            const timerColor = isLate
              ? 'bg-[#E94D3C] text-white animate-pulse'
              : isMedium
              ? 'bg-[#FFC247] text-[#222B2B]'
              : 'bg-[#10b981] text-white';

            return (
              <div
                key={order.id}
                className={`bg-[#222B2B] rounded-2xl border-2 overflow-hidden shadow-2xl flex flex-col transition-all ${
                  order.status === 'en_preparacion'
                    ? 'border-[#F47A22]'
                    : isLate
                    ? 'border-[#E94D3C]'
                    : 'border-white/20'
                }`}
              >
                {/* Ticket Header */}
                <div className="p-3.5 bg-black/40 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-extrabold text-white bg-[#F47A22] px-2.5 py-0.5 rounded">
                      {order.order_number}
                    </span>
                    <span className="text-[11px] font-bold uppercase text-[#FFC247]">
                      {order.order_type}
                    </span>
                  </div>

                  {/* Elapsed Timer Pill */}
                  <div className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold flex items-center gap-1 ${timerColor}`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{elapsedMin}m</span>
                  </div>
                </div>

                {/* Ticket Details & Items */}
                <div className="p-4 flex-1 space-y-4">
                  <div className="text-xs text-white/80 pb-2 border-b border-white/10 flex justify-between">
                    <span>Cliente: <strong>{order.customer_name}</strong></span>
                    <span>{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {/* Food Items */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-start justify-between font-bold text-sm text-white">
                          <span className="text-[#FFC247] text-base">{item.quantity}x</span>
                          <span className="flex-1 ml-2 uppercase tracking-wide leading-tight">
                            {item.product_name_snapshot}
                          </span>
                        </div>

                        {/* Modifiers / Cooking doneness */}
                        {item.modifiers && item.modifiers.length > 0 && (
                          <div className="mt-1 pl-6 space-y-0.5 text-xs text-[#F47A22] font-semibold">
                            {item.modifiers.map((m, idx) => (
                              <div key={idx}>• {m.option_name}</div>
                            ))}
                          </div>
                        )}

                        {item.notes && (
                          <div className="mt-1.5 pl-6 text-xs text-[#E94D3C] font-bold italic">
                            ⚠️ NOTA: {item.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {order.kitchen_notes && (
                    <div className="p-2.5 rounded-xl bg-[#E94D3C]/20 border border-[#E94D3C]/40 text-xs text-white font-bold">
                      🔥 INSTRUCCIÓN DE COMANDA: {order.kitchen_notes}
                    </div>
                  )}
                </div>

                {/* Action Controls for Cooks */}
                <div className="p-3 bg-black/40 border-t border-white/10 grid grid-cols-2 gap-2">
                  {order.status !== 'en_preparacion' ? (
                    <button
                      onClick={() => handleStartPrep(order.id)}
                      className="col-span-2 py-3 rounded-xl bg-[#F47A22] hover:bg-[#d96616] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>INICIAR PREPARACIÓN</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleMarkReady(order.id)}
                        className="col-span-2 py-3 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>MARCAR COMANDA LISTA ✓</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
