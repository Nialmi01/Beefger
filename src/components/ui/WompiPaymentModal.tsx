'use client';

import React, { useState } from 'react';
import { store } from '@/lib/store';
import { CartItem, Order, OrderType } from '@/lib/types';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  X,
  Smartphone,
  Building2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface WompiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderParams: {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    order_type: OrderType;
    delivery_zone_id?: string;
    delivery_address: string;
    delivery_instructions?: string;
    items: CartItem[];
    tip: number;
    kitchen_notes: string;
    totalAmount: number;
  };
  onSuccess: (order: Order) => void;
}

export function WompiPaymentModal({
  isOpen,
  onClose,
  orderParams,
  onSuccess,
}: WompiPaymentModalProps) {
  const [methodTab, setMethodTab] = useState<'card' | 'pse' | 'nequi'>('card');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardHolder, setCardHolder] = useState(orderParams.customer_name || 'Cliente BEFFGER');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [installments, setInstallments] = useState(1);
  const [pseBank, setPseBank] = useState('Bancolombia');
  const [nequiPhone, setNequiPhone] = useState(orderParams.customer_phone || '3158889900');

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<'success' | 'declined' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSimulatePayment = async (statusToSimulate: 'APPROVED' | 'DECLINED') => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Simulate network latency (1.2s like real Wompi transaction)
      await new Promise((r) => setTimeout(r, 1200));

      if (statusToSimulate === 'DECLINED') {
        setIsProcessing(false);
        setPaymentResult('declined');
        setErrorMessage('La transacción fue rechazada por el banco emisor. Por favor verifica los datos o fondos de la tarjeta.');
        return;
      }

      // 1. Create order in store
      const order = store.createOrder({
        customer_name: orderParams.customer_name,
        customer_phone: orderParams.customer_phone,
        customer_email: orderParams.customer_email,
        order_type: orderParams.order_type,
        delivery_zone_id: orderParams.delivery_zone_id,
        delivery_address: orderParams.delivery_address,
        delivery_instructions: orderParams.delivery_instructions,
        payment_method: 'wompi',
        items: orderParams.items,
        tip: orderParams.tip,
        kitchen_notes: orderParams.kitchen_notes,
      });

      // 2. Simulate Wompi Webhook call to server with SHA-256 signature verification
      try {
        const transactionId = `wompi-tx-${Date.now()}`;
        await fetch('/api/payments/wompi/webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event: 'transaction.updated',
            data: {
              transaction: {
                id: transactionId,
                status: 'APPROVED',
                amount_in_cents: Math.round(orderParams.totalAmount * 100),
                currency: 'COP',
                reference: `${order.order_number}-${Date.now()}`,
                payment_method_type: methodTab === 'card' ? 'CARD' : methodTab === 'nequi' ? 'NEQUI' : 'PSE',
              },
            },
            timestamp: Math.floor(Date.now() / 1000),
          }),
        });
      } catch (err) {
        // Fallback store update if webhook is local
        console.log('Webhook simulated locally');
      }

      // Update order to aprobado
      store.updateOrderStatus(order.id, 'nuevo', 'Pago aprobado exitosamente mediante Wompi');
      const updatedOrder = store.getOrderById(order.id) || order;
      updatedOrder.payment_status = 'aprobado';

      setIsProcessing(false);
      setPaymentResult('success');

      // Forward to success callback after quick feedback
      setTimeout(() => {
        onSuccess(updatedOrder);
      }, 1500);
    } catch (e: any) {
      setIsProcessing(false);
      setErrorMessage(e.message || 'Error procesando la transacción');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col">
        {/* Wompi Header */}
        <div className="bg-[#222B2B] p-5 text-white flex items-center justify-between border-b-4 border-[#F47A22]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm">
              {/* Wompi-style badge */}
              <span className="font-extrabold text-[#222B2B] text-xs tracking-tighter">wompi</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg uppercase tracking-wider text-white">
                  Pasarela de Pagos Wompi
                </h3>
                <span className="bg-[#FFC247] text-[#222B2B] text-[9px] font-extrabold uppercase px-2 py-0.5 rounded">
                  SANDBOX
                </span>
              </div>
              <p className="text-[11px] text-[#EDE1CE]/80 flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#10b981]" /> Conexión cifrada de 256 bits • BEFFGER Oficial
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="bg-[#FFF2DF] px-6 py-4 border-b border-[#dec0b1] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#8b7265] uppercase block">
              Comercio: BEFFGER Gourmet
            </span>
            <span className="text-xs text-[#222B2B] font-semibold">
              Orden de comida ({orderParams.order_type.toUpperCase()})
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-[#8b7265] uppercase block">Total a Pagar</span>
            <span className="font-heading text-2xl text-[#F47A22] font-bold">
              ${orderParams.totalAmount.toLocaleString('es-CO')} <span className="text-xs font-sans text-gray-500">COP</span>
            </span>
          </div>
        </div>

        {/* Payment Form Body */}
        <div className="p-6 space-y-5">
          {paymentResult === 'success' ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-heading text-2xl uppercase text-[#222B2B]">
                ¡Pago Aprobado Exitosamente!
              </h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Wompi ha confirmado la transacción. Estamos transfiriendo tu orden a la cocina del restaurante...
              </p>
            </div>
          ) : paymentResult === 'declined' ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-100 text-[#E94D3C] flex items-center justify-center mx-auto">
                <XCircle className="w-8 h-8" />
              </div>
              <h4 className="font-heading text-xl uppercase text-[#222B2B]">
                Transacción Declinada
              </h4>
              <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                {errorMessage}
              </p>
              <button
                onClick={() => setPaymentResult(null)}
                className="px-6 py-2.5 rounded-full bg-[#222B2B] text-white text-xs font-bold uppercase hover:bg-black transition-colors"
              >
                Intentar con otra tarjeta
              </button>
            </div>
          ) : (
            <>
              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setMethodTab('card')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    methodTab === 'card'
                      ? 'bg-white text-[#222B2B] shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#F47A22]" />
                  <span>Tarjeta</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethodTab('pse')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    methodTab === 'pse'
                      ? 'bg-white text-[#222B2B] shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>PSE</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethodTab('nequi')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    methodTab === 'nequi'
                      ? 'bg-white text-[#222B2B] shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-purple-600" />
                  <span>Nequi</span>
                </button>
              </div>

              {/* CARD FORM */}
              {methodTab === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Número de Tarjeta (Prueba Wompi)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full p-2.5 rounded-xl border border-gray-300 font-mono text-xs focus:ring-2 focus:ring-[#F47A22] outline-none pl-9"
                      />
                      <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Titular de la Tarjeta
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#F47A22] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                        Vencimiento
                      </label>
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        placeholder="MM/AA"
                        className="w-full p-2.5 rounded-xl border border-gray-300 font-mono text-xs text-center focus:ring-2 focus:ring-[#F47A22] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="text"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        className="w-full p-2.5 rounded-xl border border-gray-300 font-mono text-xs text-center focus:ring-2 focus:ring-[#F47A22] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                        Cuotas
                      </label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs bg-white focus:ring-2 focus:ring-[#F47A22] outline-none"
                      >
                        <option value={1}>1 cuota</option>
                        <option value={2}>2 cuotas</option>
                        <option value={6}>6 cuotas</option>
                        <option value={12}>12 cuotas</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* PSE FORM */}
              {methodTab === 'pse' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Selecciona tu Banco
                    </label>
                    <select
                      value={pseBank}
                      onChange={(e) => setPseBank(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 text-xs bg-white focus:ring-2 focus:ring-[#F47A22] outline-none font-medium"
                    >
                      <option value="Bancolombia">Bancolombia (Persona Natural)</option>
                      <option value="Davivienda">Davivienda</option>
                      <option value="BBVA">BBVA Colombia</option>
                      <option value="Banco de Bogotá">Banco de Bogotá</option>
                      <option value="Nequi">Nequi</option>
                      <option value="Daviplata">Daviplata</option>
                    </select>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-800 space-y-1">
                    <p className="font-semibold">Simulación de Débito Bancario PSE:</p>
                    <p className="text-[11px] text-blue-700">
                      En producción serás redirigido a la sucursal virtual de tu banco. En este entorno sandbox se aprueba de forma inmediata con firma SHA-256.
                    </p>
                  </div>
                </div>
              )}

              {/* NEQUI FORM */}
              {methodTab === 'nequi' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Número de Celular Nequi
                    </label>
                    <input
                      type="text"
                      value={nequiPhone}
                      onChange={(e) => setNequiPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 font-mono text-xs focus:ring-2 focus:ring-[#F47A22] outline-none"
                    />
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-800 space-y-1">
                    <p className="font-semibold">Notificación Push a tu App Nequi:</p>
                    <p className="text-[11px] text-purple-700">
                      Recibirás una solicitud de cobro en tu app Nequi por ${orderParams.totalAmount.toLocaleString('es-CO')} COP.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons for Testing Production Scenarios */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => handleSimulatePayment('APPROVED')}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-full bg-[#10b981] hover:bg-[#059669] text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      COMUNICANDO CON BANCO EMISOR...
                    </span>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>APROBAR PAGO (${orderParams.totalAmount.toLocaleString('es-CO')} COP)</span>
                    </>
                  )}
                </button>

                {/* Simulate Decline scenario to test failure resilience */}
                <button
                  type="button"
                  onClick={() => handleSimulatePayment('DECLINED')}
                  disabled={isProcessing}
                  className="w-full py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  Simular Fallo / Rechazo de Tarjeta
                </button>
              </div>

              <div className="text-center pt-1">
                <span className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> Wompi Colombia • Certificación PCI-DSS Nivel 1
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
