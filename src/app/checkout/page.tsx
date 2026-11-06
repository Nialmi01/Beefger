'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { WompiPaymentModal } from '@/components/ui/WompiPaymentModal';
import { useCart } from '@/lib/cart';
import { store } from '@/lib/store';
import { DeliveryZone, PaymentMethod, OrderType } from '@/lib/types';
import {
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  Bike,
  Store,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);

  // Step States
  const [step, setStep] = useState<number>(1);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const [orderType, setOrderType] = useState<OrderType>('domicilio');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [cashAmountForChange, setCashAmountForChange] = useState('');
  const [tip, setTip] = useState<number>(2000);
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isWompiModalOpen, setIsWompiModalOpen] = useState(false);

  useEffect(() => {
    const zones = store.getDeliveryZones();
    setDeliveryZones(zones);
    if (zones.length > 0) setSelectedZoneId(zones[0].id);
  }, []);

  const selectedZone = deliveryZones.find((z) => z.id === selectedZoneId);
  const deliveryFee = orderType === 'domicilio' ? (selectedZone?.delivery_fee || 4000) : 0;
  const grandTotal = subtotal + deliveryFee + tip;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFF2DF]">
        <Navbar />
        <main className="flex-1 pt-32 pb-20 max-w-xl mx-auto px-4 text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-white flex items-center justify-center text-[#F47A22] shadow-md border border-[#dec0b1]">
            <Store className="w-10 h-10" />
          </div>
          <h1 className="font-heading text-4xl text-[#222B2B]">Tu carrito está vacío</h1>
          <p className="text-sm text-[#574237]">
            Para realizar un pedido, primero debes agregar tus productos favoritos de BEFFGER Gourmet.
          </p>
          <button
            onClick={() => router.push('/menu')}
            className="px-8 py-3.5 rounded-full bg-[#F47A22] text-white font-bold text-sm tracking-wide shadow-md uppercase"
          >
            Ir al Menú
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const handleNextStep = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!customerName.trim()) {
        setErrorMsg('Por favor ingresa tu nombre completo.');
        return;
      }
      if (!customerPhone.trim() || customerPhone.length < 7) {
        setErrorMsg('Por favor ingresa un número de teléfono celular válido.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (orderType === 'domicilio' && (!address.trim() || !neighborhood.trim())) {
        setErrorMsg('Por favor ingresa la dirección y el barrio de entrega.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleSubmitOrder = async () => {
    setErrorMsg('');

    const fullDeliveryAddress =
      orderType === 'domicilio'
        ? `${address}, Barrio ${neighborhood}`
        : 'Retiro en establecimiento: Cra. 34 # 4-56 Parque del Perro';

    if (paymentMethod === 'wompi') {
      setIsWompiModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const newOrder = store.createOrder({
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        order_type: orderType,
        delivery_zone_id: orderType === 'domicilio' ? selectedZoneId : undefined,
        delivery_address: fullDeliveryAddress,
        delivery_instructions: deliveryInstructions,
        payment_method: paymentMethod,
        items,
        tip,
        kitchen_notes: kitchenNotes,
      });

      // Clear cart
      clearCart();

      // Redirect to live tracking screen
      router.push(`/pedidos/${newOrder.order_number}`);
    } catch (e: any) {
      setErrorMsg('Ocurrió un error al procesar el pedido. Por favor intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  const handleWompiSuccess = (createdOrder: any) => {
    clearCart();
    setIsWompiModalOpen(false);
    router.push(`/pedidos/${createdOrder.order_number}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF2DF]">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step Breadcrumbs */}
          <div className="mb-8 bg-white p-4 rounded-2xl border border-[#dec0b1] shadow-sm">
            <div className="flex items-center justify-between max-w-2xl mx-auto text-xs sm:text-sm font-bold uppercase tracking-wider">
              <button
                onClick={() => setStep(1)}
                className={`flex items-center gap-2 ${
                  step === 1 ? 'text-[#F47A22]' : 'text-[#8b7265]'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step >= 1 ? 'bg-[#F47A22] text-white' : 'bg-gray-200'
                }`}>1</span>
                <span>Datos</span>
              </button>
              <span className="text-gray-300">──</span>
              <button
                onClick={() => step > 2 && setStep(2)}
                className={`flex items-center gap-2 ${
                  step === 2 ? 'text-[#F47A22]' : 'text-[#8b7265]'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step >= 2 ? 'bg-[#F47A22] text-white' : 'bg-gray-200'
                }`}>2</span>
                <span>Entrega</span>
              </button>
              <span className="text-gray-300">──</span>
              <button
                onClick={() => step > 3 && setStep(3)}
                className={`flex items-center gap-2 ${
                  step === 3 ? 'text-[#F47A22]' : 'text-[#8b7265]'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step >= 3 ? 'bg-[#F47A22] text-white' : 'bg-gray-200'
                }`}>3</span>
                <span>Pago</span>
              </button>
              <span className="text-gray-300">──</span>
              <button
                onClick={() => step === 4 && setStep(4)}
                className={`flex items-center gap-2 ${
                  step === 4 ? 'text-[#F47A22]' : 'text-[#8b7265]'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === 4 ? 'bg-[#F47A22] text-white' : 'bg-gray-200'
                }`}>4</span>
                <span>Confirmación</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#dec0b1] shadow-beffger-card">
              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-[#ba1a1a] text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* STEP 1: CLIENT DATA */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <span className="font-heading text-xs text-[#F47A22] tracking-wider uppercase font-bold">
                      Paso 1 de 4
                    </span>
                    <h2 className="font-heading text-3xl text-[#222B2B] uppercase">
                      Tus Datos de Contacto
                    </h2>
                    <p className="text-xs text-[#574237] mt-1">
                      No requieres registrarte para comprar. Usaremos tu celular para notificarte el despacho.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#222B2B] uppercase mb-1">
                        Nombre Completo *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#8b7265] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Ej: Andrés Gómez"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#dec0b1] text-sm focus:ring-2 focus:ring-[#F47A22] outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#222B2B] uppercase mb-1">
                        Teléfono Celular *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#8b7265] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="Ej: 318 456 7890"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#dec0b1] text-sm focus:ring-2 focus:ring-[#F47A22] outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#222B2B] uppercase mb-1">
                        Correo Electrónico (Opcional)
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#8b7265] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="andres.gomez@gmail.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#dec0b1] text-sm focus:ring-2 focus:ring-[#F47A22] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="w-full py-4 rounded-full bg-[#F47A22] hover:bg-[#d96616] text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <span>CONTINUAR A ENTREGA</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: DELIVERY METHOD */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <span className="font-heading text-xs text-[#F47A22] tracking-wider uppercase font-bold">
                      Paso 2 de 4
                    </span>
                    <h2 className="font-heading text-3xl text-[#222B2B] uppercase">
                      Método de Entrega
                    </h2>
                  </div>

                  {/* Delivery vs Pickup Radio */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderType('domicilio')}
                      className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        orderType === 'domicilio'
                          ? 'border-[#F47A22] bg-[#F47A22]/5 shadow-sm ring-2 ring-[#F47A22]'
                          : 'border-[#dec0b1] bg-white'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#F47A22]/10 text-[#F47A22] flex items-center justify-center shrink-0">
                        <Bike className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading text-base leading-tight">A Domicilio</h4>
                        <span className="text-xs text-[#574237]">Entregado en tu puerta</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType('retiro')}
                      className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        orderType === 'retiro'
                          ? 'border-[#F47A22] bg-[#F47A22]/5 shadow-sm ring-2 ring-[#F47A22]'
                          : 'border-[#dec0b1] bg-white'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#222B2B]/10 text-[#222B2B] flex items-center justify-center shrink-0">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading text-base leading-tight">Recoger en Local</h4>
                        <span className="text-xs text-[#574237]">Parque del Perro (Cali)</span>
                      </div>
                    </button>
                  </div>

                  {orderType === 'domicilio' ? (
                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-[#222B2B] uppercase mb-1">
                          Zona de Cobertura en Cali *
                        </label>
                        <select
                          value={selectedZoneId}
                          onChange={(e) => setSelectedZoneId(e.target.value)}
                          className="w-full p-3 rounded-xl border border-[#dec0b1] text-sm focus:ring-2 focus:ring-[#F47A22] outline-none bg-white font-medium"
                        >
                          {deliveryZones.map((z) => (
                            <option key={z.id} value={z.id}>
                              {z.name} — ${z.delivery_fee.toLocaleString('es-CO')} COP ({z.estimated_time_minutes} min)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#222B2B] uppercase mb-1">
                            Barrio *
                          </label>
                          <input
                            type="text"
                            value={neighborhood}
                            onChange={(e) => setNeighborhood(e.target.value)}
                            placeholder="Ej: San Fernando"
                            className="w-full p-3 rounded-xl border border-[#dec0b1] text-sm focus:ring-2 focus:ring-[#F47A22] outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#222B2B] uppercase mb-1">
                            Dirección de Entrega *
                          </label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Ej: Calle 5 # 38-20 Apto 402"
                            className="w-full p-3 rounded-xl border border-[#dec0b1] text-sm focus:ring-2 focus:ring-[#F47A22] outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#222B2B] uppercase mb-1">
                          Indicaciones para el Domiciliario
                        </label>
                        <textarea
                          value={deliveryInstructions}
                          onChange={(e) => setDeliveryInstructions(e.target.value)}
                          placeholder="Ej: Dejar en portería, timbre no funciona, conjunto cerrado..."
                          rows={2}
                          className="w-full p-3 rounded-xl border border-[#dec0b1] text-xs focus:ring-2 focus:ring-[#F47A22] outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-[#FFF2DF] rounded-2xl border border-[#dec0b1] space-y-2">
                      <p className="text-sm font-semibold text-[#222B2B]">
                        📍 Punto de Retiro Oficial BEFFGER:
                      </p>
                      <p className="text-xs text-[#574237]">
                        Cra. 34 # 4-56, Parque del Perro, Cali.<br />
                        Tu pedido estará listo en aproximadamente 20-25 minutos. Te avisaremos cuando la comanda esté empacada.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 sm:gap-3 pt-2">
                    <button
                      onClick={() => setStep(1)}
                      className="px-4 sm:px-6 py-3 sm:py-3.5 rounded-full border border-[#dec0b1] text-[#574237] text-xs font-bold uppercase shrink-0"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 min-w-0 py-3 sm:py-3.5 px-3 sm:px-6 rounded-full bg-[#F47A22] hover:bg-[#d96616] text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 shadow-md whitespace-nowrap"
                    >
                      <span>CONTINUAR A PAGO</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT METHOD */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <span className="font-heading text-xs text-[#F47A22] tracking-wider uppercase font-bold">
                      Paso 3 de 4
                    </span>
                    <h2 className="font-heading text-3xl text-[#222B2B] uppercase">
                      Método de Pago
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {/* Efectivo */}
                    <label
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        paymentMethod === 'efectivo'
                          ? 'border-[#F47A22] bg-[#F47A22]/5 ring-2 ring-[#F47A22]'
                          : 'border-[#dec0b1] bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'efectivo'}
                          onChange={() => setPaymentMethod('efectivo')}
                          className="accent-[#F47A22] w-4 h-4"
                        />
                        <Banknote className="w-5 h-5 text-[#10b981]" />
                        <div>
                          <span className="font-bold text-sm text-[#222B2B] block">
                            Efectivo contra entrega
                          </span>
                          <span className="text-xs text-[#574237]">
                            Pagas al recibir tu orden (en domicilio o al retirar)
                          </span>
                        </div>
                      </div>
                    </label>

                    {/* Wompi Pasarela */}
                    <label
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        paymentMethod === 'wompi'
                          ? 'border-[#F47A22] bg-[#F47A22]/5 ring-2 ring-[#F47A22]'
                          : 'border-[#dec0b1] bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'wompi'}
                          onChange={() => setPaymentMethod('wompi')}
                          className="accent-[#F47A22] w-4 h-4"
                        />
                        <CreditCard className="w-5 h-5 text-[#F47A22]" />
                        <div>
                          <span className="font-bold text-sm text-[#222B2B] block">
                            Wompi (Tarjetas, PSE & Bancolombia)
                          </span>
                          <span className="text-xs text-[#574237]">
                            Pasarela segura con verificación de pago en servidor
                          </span>
                        </div>
                      </div>
                      <span className="bg-[#FFC247] text-[#222B2B] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                        TEST SANDBOX
                      </span>
                    </label>

                    {/* Nequi / Transferencia */}
                    <label
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        paymentMethod === 'nequi'
                          ? 'border-[#F47A22] bg-[#F47A22]/5 ring-2 ring-[#F47A22]'
                          : 'border-[#dec0b1] bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'nequi'}
                          onChange={() => setPaymentMethod('nequi')}
                          className="accent-[#F47A22] w-4 h-4"
                        />
                        <Smartphone className="w-5 h-5 text-purple-600" />
                        <div>
                          <span className="font-bold text-sm text-[#222B2B] block">
                            Nequi / Transferencia Directa
                          </span>
                          <span className="text-xs text-[#574237]">
                            Envía a la cuenta BEFFGER 315 888 9900
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Propina Voluntaria */}
                  <div className="pt-4 border-t border-[#dec0b1]">
                    <label className="block text-xs font-bold text-[#222B2B] uppercase mb-2">
                      Propina voluntaria para el equipo
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[0, 1000, 2000, 3000].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTip(t)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            tip === t
                              ? 'bg-[#222B2B] text-white border-[#222B2B]'
                              : 'bg-[#FFF2DF] text-[#222B2B] border-[#dec0b1]'
                          }`}
                        >
                          {t === 0 ? 'Sin propina' : `+$${t.toLocaleString('es-CO')}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 pt-2">
                    <button
                      onClick={() => setStep(2)}
                      className="px-4 sm:px-6 py-3 sm:py-3.5 rounded-full border border-[#dec0b1] text-[#574237] text-xs font-bold uppercase shrink-0"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 min-w-0 py-3 sm:py-3.5 px-3 sm:px-6 rounded-full bg-[#F47A22] hover:bg-[#d96616] text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 shadow-md whitespace-nowrap"
                    >
                      <span>REVISAR RESUMEN</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & CONFIRM */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <span className="font-heading text-xs text-[#F47A22] tracking-wider uppercase font-bold">
                      Paso 4 de 4
                    </span>
                    <h2 className="font-heading text-3xl text-[#222B2B] uppercase">
                      Confirmación de Orden
                    </h2>
                  </div>

                  <div className="bg-[#FFF2DF] p-5 rounded-2xl border border-[#dec0b1] space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#574237]">Cliente:</span>
                      <span className="font-bold text-[#222B2B]">{customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#574237]">Teléfono:</span>
                      <span className="font-bold text-[#222B2B]">{customerPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#574237]">Tipo de Entrega:</span>
                      <span className="font-bold text-[#222B2B] uppercase">
                        {orderType === 'domicilio' ? 'A Domicilio' : 'Retiro en Local'}
                      </span>
                    </div>
                    {orderType === 'domicilio' && (
                      <div className="flex justify-between">
                        <span className="text-[#574237]">Dirección:</span>
                        <span className="font-bold text-[#222B2B] text-right">
                          {address}, Barrio {neighborhood}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[#574237]">Método de Pago:</span>
                      <span className="font-bold text-[#F47A22] uppercase">
                        {paymentMethod}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#222B2B] uppercase mb-1">
                      Nota adicional para el restaurante
                    </label>
                    <textarea
                      value={kitchenNotes}
                      onChange={(e) => setKitchenNotes(e.target.value)}
                      placeholder="Alguna instrucción de empaque o salsas..."
                      rows={2}
                      className="w-full p-3 rounded-xl border border-[#dec0b1] text-xs focus:ring-2 focus:ring-[#F47A22] outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 pt-2">
                    <button
                      onClick={() => setStep(3)}
                      className="px-4 sm:px-6 py-3.5 sm:py-4 rounded-full border border-[#dec0b1] text-[#574237] text-xs font-bold uppercase shrink-0"
                      disabled={isSubmitting}
                    >
                      Atrás
                    </button>
                    <button
                      onClick={handleSubmitOrder}
                      disabled={isSubmitting}
                      className="flex-1 min-w-0 py-3.5 sm:py-4 px-3 sm:px-6 rounded-full bg-[#F47A22] hover:bg-[#d96616] text-white font-bold text-xs sm:text-base uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 shadow-[0_10px_25px_rgba(244,122,34,0.4)] transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap"
                    >
                      {isSubmitting ? (
                        <span>PROCESANDO...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                          <span className="hidden sm:inline">CONFIRMAR PEDIDO — ${grandTotal.toLocaleString('es-CO')} COP</span>
                          <span className="sm:hidden">PEDIR — ${grandTotal.toLocaleString('es-CO')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-6">
              <h3 className="font-heading text-2xl text-[#222B2B] border-b border-[#dec0b1] pb-3 uppercase">
                Resumen del Pedido
              </h3>

              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs">
                    <img
                      src={item.product.image_url}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover shrink-0 border"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between font-bold text-[#222B2B]">
                        <span className="truncate">{item.quantity}x {item.product.name}</span>
                        <span>${item.total_price.toLocaleString('es-CO')}</span>
                      </div>
                      {item.modifiers.length > 0 && (
                        <p className="text-[11px] text-[#574237] mt-0.5 truncate">
                          {item.modifiers.map((m) => m.option_name).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-2 pt-4 border-t border-[#dec0b1] text-xs">
                <div className="flex justify-between text-[#574237]">
                  <span>Subtotal productos</span>
                  <span className="font-semibold text-[#222B2B]">
                    ${subtotal.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <div className="flex justify-between text-[#574237]">
                  <span>Tarifa de entrega ({orderType})</span>
                  <span className="font-semibold text-[#222B2B]">
                    {deliveryFee > 0 ? `$${deliveryFee.toLocaleString('es-CO')} COP` : 'GRATIS'}
                  </span>
                </div>
                {tip > 0 && (
                  <div className="flex justify-between text-[#574237]">
                    <span>Propina voluntaria</span>
                    <span className="font-semibold text-[#222B2B]">
                      +${tip.toLocaleString('es-CO')} COP
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-[#222B2B] pt-2 border-t border-[#dec0b1]">
                  <span>Total a Pagar</span>
                  <span className="text-[#F47A22] text-xl font-heading">
                    ${grandTotal.toLocaleString('es-CO')} COP
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#FFF2DF] rounded-xl flex items-center gap-2.5 text-[11px] text-[#574237]">
                <ShieldCheck className="w-5 h-5 text-[#10b981] shrink-0" />
                <span>
                  Tus datos están protegidos. Precios finales con impoconsumo incluido.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Wompi Sandbox Interactive Payment Modal */}
      <WompiPaymentModal
        isOpen={isWompiModalOpen}
        onClose={() => setIsWompiModalOpen(false)}
        orderParams={{
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          order_type: orderType,
          delivery_zone_id: orderType === 'domicilio' ? selectedZoneId : undefined,
          delivery_address: orderType === 'domicilio'
            ? `${address}, Barrio ${neighborhood}`
            : 'Retiro en establecimiento: Cra. 34 # 4-56 Parque del Perro',
          delivery_instructions: deliveryInstructions,
          items,
          tip,
          kitchen_notes: kitchenNotes,
          totalAmount: grandTotal,
        }}
        onSuccess={handleWompiSuccess}
      />

      <Footer />
    </div>
  );
}
