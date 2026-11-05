'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { store } from '@/lib/store';
import { Order, OrderStatus } from '@/lib/types';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  PackageCheck,
  MapPin,
  Phone,
  ArrowLeft,
  Sparkles,
  CreditCard,
  Banknote,
} from 'lucide-react';

const STATUS_STEPS: { key: OrderStatus; label: string; icon: any; desc: string }[] = [
  { key: 'nuevo', label: 'Recibido', icon: Clock, desc: 'Comanda registrada en el sistema de BEFFGER' },
  { key: 'en_preparacion', label: 'En Cocina', icon: ChefHat, desc: 'Cocinando a la parrilla con ingredientes frescos' },
  { key: 'listo', label: 'Empacado', icon: PackageCheck, desc: 'Listo y empacado con empaque térmico' },
  { key: 'en_domicilio', label: 'En Ruta', icon: Bike, desc: 'Repartidor en camino a tu dirección' },
  { key: 'entregado', label: 'Entregado', icon: CheckCircle2, desc: '¡Buen provecho! La calle tiene sabor' },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = (params?.orderNumber as string) || '';

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = () => {
      const found = store.getOrderByNumber(orderNumber);
      if (found) setOrder(found);
    };

    fetchOrder();
    return store.subscribe(fetchOrder);
  }, [orderNumber]);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFF2DF]">
        <Navbar />
        <main className="flex-1 pt-32 pb-20 max-w-xl mx-auto px-4 text-center space-y-4">
          <h1 className="font-heading text-4xl text-[#222B2B]">Buscando comanda {orderNumber}...</h1>
          <p className="text-xs text-[#574237]">
            Si acabas de realizar el pedido, por favor espera un momento mientras se sincroniza en el sistema.
          </p>
          <Link
            href="/pedidos"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F47A22] text-white font-bold text-xs uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a buscar</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate current progress index
  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'nuevo':
      case 'confirmado':
        return 0;
      case 'en_preparacion':
        return 1;
      case 'listo':
        return 2;
      case 'en_domicilio':
        return 3;
      case 'entregado':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF2DF]">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-[#222B2B] text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="bg-[#F47A22] text-white font-mono text-sm font-extrabold px-3 py-1 rounded-lg">
                  {order.order_number}
                </span>
                <span className="text-xs text-[#10b981] font-bold flex items-center gap-1.5 bg-[#10b981]/10 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                  Actualizando en vivo
                </span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl uppercase tracking-tight text-white mt-2">
                ¡Gracias por tu pedido, {order.customer_name}!
              </h1>
              <p className="text-xs text-[#EDE1CE]/80 mt-1">
                Tiempo estimado de entrega: <strong className="text-[#FFC247]">30 - 45 minutos</strong>
              </p>
            </div>

            <Link
              href="/menu"
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase transition-colors shrink-0"
            >
              Pedir algo más
            </Link>
          </div>

          {/* Real-time Status Tracker Stepper */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-6">
            <h3 className="font-heading text-xl text-[#222B2B] uppercase tracking-wide">
              Estado de Preparación
            </h3>

            {/* Stepper Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
              {STATUS_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div
                    key={step.key}
                    className={`flex sm:flex-col items-center sm:items-center gap-3 p-3 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-[#F47A22]/10 border-[#F47A22] ring-2 ring-[#F47A22]/20'
                        : isPassed
                        ? 'bg-[#FFF2DF]/60 border-[#dec0b1]'
                        : 'bg-gray-50 border-gray-200 opacity-50'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? 'bg-[#F47A22] text-white shadow-lg animate-bounce'
                          : isPassed
                          ? 'bg-[#222B2B] text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="sm:text-center">
                      <span className="font-heading text-sm text-[#222B2B] block leading-tight">
                        {step.label}
                      </span>
                      <span className="text-[11px] text-[#574237] leading-tight block mt-0.5">
                        {step.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Two-Column Details Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Delivery & Customer Info (5 cols) */}
            <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-5">
              <h3 className="font-heading text-xl text-[#222B2B] uppercase border-b border-[#dec0b1] pb-3">
                Datos de Entrega
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#F47A22] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#222B2B] block">Dirección</span>
                    <span className="text-[#574237]">
                      {order.delivery_address || 'Retiro en punto de venta'}
                    </span>
                    {order.delivery_instructions && (
                      <p className="text-[11px] italic text-[#8b7265] mt-0.5">
                        &quot;{order.delivery_instructions}&quot;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#F47A22] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#222B2B] block">Contacto</span>
                    <span className="text-[#574237]">{order.customer_phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  {order.payment_method === 'efectivo' ? (
                    <Banknote className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                  ) : (
                    <CreditCard className="w-4 h-4 text-[#F47A22] shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold text-[#222B2B] block">Método de Pago</span>
                    <span className="text-[#574237] uppercase font-semibold">
                      {order.payment_method} ({order.payment_status})
                    </span>
                  </div>
                </div>
              </div>

              {/* Status History Audit */}
              {order.status_history && order.status_history.length > 0 && (
                <div className="pt-4 border-t border-[#dec0b1]">
                  <span className="text-[10px] font-bold text-[#8b7265] uppercase block mb-2">
                    Historial de eventos
                  </span>
                  <div className="space-y-1.5 text-[11px]">
                    {order.status_history.map((sh, i) => (
                      <div key={i} className="flex justify-between text-[#574237]">
                        <span>• {sh.notes || sh.new_status}</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(sh.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order Items Snapshot (7 cols) */}
            <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-5">
              <h3 className="font-heading text-xl text-[#222B2B] uppercase border-b border-[#dec0b1] pb-3">
                Productos en Preparación
              </h3>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 rounded-2xl bg-[#FFF2DF]/40 border border-[#dec0b1]/60">
                    <img
                      src={item.product_image_snapshot}
                      alt=""
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start font-bold text-sm text-[#222B2B]">
                        <h4 className="font-heading text-lg leading-tight truncate">
                          {item.quantity}x {item.product_name_snapshot}
                        </h4>
                        <span className="text-[#F47A22] shrink-0 ml-2">
                          ${item.total_price.toLocaleString('es-CO')}
                        </span>
                      </div>

                      {item.modifiers && item.modifiers.length > 0 && (
                        <div className="text-xs text-[#574237] mt-1 space-y-0.5">
                          {item.modifiers.map((m, idx) => (
                            <span key={idx} className="inline-block bg-white px-2 py-0.5 rounded border border-[#dec0b1] text-[10px] mr-1">
                              {m.option_name}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.notes && (
                        <p className="text-[11px] italic text-[#8b7265] mt-1">
                          Nota: {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="pt-4 border-t border-[#dec0b1] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#574237]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#222B2B]">
                    ${order.subtotal.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <div className="flex justify-between text-[#574237]">
                  <span>Tarifa Domicilio</span>
                  <span className="font-semibold text-[#222B2B]">
                    ${order.delivery_fee.toLocaleString('es-CO')} COP
                  </span>
                </div>
                {order.tip > 0 && (
                  <div className="flex justify-between text-[#574237]">
                    <span>Propina</span>
                    <span className="font-semibold text-[#222B2B]">
                      +${order.tip.toLocaleString('es-CO')} COP
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-[#222B2B] pt-2 border-t border-[#dec0b1]">
                  <span>Total</span>
                  <span className="text-[#F47A22] text-xl font-heading">
                    ${order.total.toLocaleString('es-CO')} COP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
