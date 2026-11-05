'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { Product, Category, CartItem, OrderType, PaymentMethod } from '@/lib/types';
import {
  Calculator,
  Plus,
  Minus,
  Trash2,
  Printer,
  CheckCircle2,
  Coins,
  Banknote,
  CreditCard,
  Smartphone,
  ChefHat,
  Search,
} from 'lucide-react';

export default function PosCashierPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Ticket State
  const [ticketItems, setTicketItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('Cliente Mostrador');
  const [customerPhone, setCustomerPhone] = useState('3150000000');
  const [orderType, setOrderType] = useState<OrderType>('mesa');
  const [tableNumber, setTableNumber] = useState('Mesa 1');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [receivedCash, setReceivedCash] = useState<string>('');
  const [lastCreatedOrder, setLastCreatedOrder] = useState<any | null>(null);

  useEffect(() => {
    setCategories(store.getCategories());
    setProducts(store.getProducts());

    return store.subscribe(() => {
      setCategories(store.getCategories());
      setProducts(store.getProducts());
    });
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category_id === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addItemToTicket = (product: Product) => {
    setTicketItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1, total_price: i.unit_price * (i.quantity + 1) }
            : i
        );
      }
      return [
        ...prev,
        {
          id: `pos-${product.id}-${Date.now()}`,
          product,
          quantity: 1,
          unit_price: product.price,
          total_price: product.price,
          modifiers: [],
        },
      ];
    });
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      setTicketItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setTicketItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty, total_price: i.unit_price * qty } : i))
    );
  };

  const ticketSubtotal = ticketItems.reduce((s, i) => s + i.total_price, 0);
  const ticketTotal = ticketSubtotal;
  const cashNum = parseFloat(receivedCash) || 0;
  const changeDue = Math.max(0, cashNum - ticketTotal);

  const handleChargeAndSendToKitchen = () => {
    if (ticketItems.length === 0) return;

    const newOrder = store.createOrder({
      customer_name: `${customerName} (${tableNumber})`,
      customer_phone: customerPhone,
      order_type: orderType,
      delivery_address: orderType === 'mesa' ? tableNumber : 'Mostrador para llevar',
      payment_method: paymentMethod,
      items: ticketItems,
      tip: 0,
      kitchen_notes: `Orden creada en POS por Cajero - ${tableNumber}`,
    });

    // If paid in cash, record in cash movements
    if (paymentMethod === 'efectivo') {
      store.recordCashMovement('ingreso', ticketTotal, `Venta en caja ${newOrder.order_number}`, 'Cajero');
    }

    setLastCreatedOrder(newOrder);
    setTicketItems([]);
    setReceivedCash('');
  };

  return (
    <div className="space-y-6">
      {/* Top POS Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#dec0b1] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-heading text-xs text-[#F47A22] uppercase font-bold tracking-wider">
            TERMINAL DE COBRO & COMANDAS
          </span>
          <h1 className="font-heading text-3xl text-[#222B2B] uppercase mt-0.5">
            Punto de Venta POS BEFFGER
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/caja/arqueo"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF2DF] hover:bg-[#dec0b1]/50 text-[#222B2B] font-bold text-xs uppercase border border-[#dec0b1] transition-colors"
          >
            <Coins className="w-4 h-4 text-[#F47A22]" />
            <span>Arqueo y Cierre de Caja</span>
          </Link>
        </div>
      </div>

      {/* POS Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Fast Touch Menu (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-4">
          {/* Search & Categories Tabs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8b7265] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFF2DF]/40 border border-[#dec0b1] text-xs outline-none focus:ring-1 focus:ring-[#F47A22]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-2 rounded-xl font-bold text-xs uppercase whitespace-nowrap transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[#222B2B] text-white'
                    : 'bg-[#FFF2DF] text-[#222B2B] border border-[#dec0b1]'
                }`}
              >
                Todos
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-2 rounded-xl font-bold text-xs uppercase whitespace-nowrap transition-all ${
                    selectedCategory === c.id
                      ? 'bg-[#F47A22] text-white'
                      : 'bg-[#FFF2DF] text-[#222B2B] border border-[#dec0b1]'
                  }`}
                >
                  {c.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Touch Grid of Products */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[550px] overflow-y-auto pr-1">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => addItemToTicket(product)}
                className="p-2.5 rounded-2xl bg-[#FFF2DF]/30 hover:bg-[#F47A22]/10 border border-[#dec0b1] hover:border-[#F47A22] text-left transition-all active:scale-95 flex flex-col justify-between h-40 group"
              >
                <img
                  src={product.image_url}
                  alt=""
                  className="w-full h-20 rounded-xl object-cover border"
                />
                <div className="mt-1">
                  <span className="font-heading text-sm text-[#222B2B] leading-tight block truncate uppercase">
                    {product.name}
                  </span>
                  <span className="font-bold text-xs text-[#F47A22]">
                    ${product.price.toLocaleString('es-CO')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Active Ticket & Payment (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#dec0b1] pb-3">
            <div>
              <h3 className="font-heading text-xl text-[#222B2B] uppercase">
                Comanda Actual
              </h3>
              <span className="text-xs text-[#574237]">Punto de venta y despacho</span>
            </div>

            {ticketItems.length > 0 && (
              <button
                onClick={() => setTicketItems([])}
                className="text-xs text-[#ba1a1a] hover:underline font-bold"
              >
                Limpiar ticket
              </button>
            )}
          </div>

          {/* Service Settings (Table / To-Go) */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-[#8b7265] uppercase mb-1">
                Servicio
              </label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as OrderType)}
                className="w-full p-2 rounded-xl border border-[#dec0b1] bg-white font-medium"
              >
                <option value="mesa">Consumo en Mesa</option>
                <option value="retiro">Para Llevar (Takeout)</option>
                <option value="domicilio">Domicilio Telefónico</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#8b7265] uppercase mb-1">
                Mesa / Identificador
              </label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Mesa 1..."
                className="w-full p-2 rounded-xl border border-[#dec0b1] font-medium text-xs"
              />
            </div>
          </div>

          {/* Ticket Items Container */}
          <div className="space-y-2 min-h-[180px] max-h-[240px] overflow-y-auto pr-1">
            {ticketItems.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#8b7265] italic">
                Toca los productos de la izquierda para agregarlos a la comanda.
              </div>
            ) : (
              ticketItems.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-[#FFF2DF]/50 border border-[#dec0b1] flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-[#222B2B] block truncate">
                      {item.product.name}
                    </span>
                    <span className="text-[10px] text-[#8b7265]">
                      ${item.unit_price.toLocaleString('es-CO')} c/u
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-md bg-white border flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-xs">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-md bg-white border flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-bold text-xs text-[#F47A22] w-16 text-right">
                    ${item.total_price.toLocaleString('es-CO')}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="pt-2 border-t border-[#dec0b1] space-y-2">
            <span className="text-[10px] font-bold text-[#8b7265] uppercase block">
              Forma de Pago
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('efectivo')}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold border flex items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'efectivo'
                    ? 'bg-[#10b981] text-white border-[#10b981]'
                    : 'bg-white border-[#dec0b1] text-[#222B2B]'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>Efectivo</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('wompi')}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold border flex items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'wompi'
                    ? 'bg-[#F47A22] text-white border-[#F47A22]'
                    : 'bg-white border-[#dec0b1] text-[#222B2B]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Datáfono</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('nequi')}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold border flex items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'nequi'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white border-[#dec0b1] text-[#222B2B]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Nequi</span>
              </button>
            </div>

            {paymentMethod === 'efectivo' && ticketTotal > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7265] uppercase">
                    Efectivo Recibido
                  </label>
                  <input
                    type="number"
                    value={receivedCash}
                    onChange={(e) => setReceivedCash(e.target.value)}
                    placeholder={`$${ticketTotal.toLocaleString('es-CO')}`}
                    className="w-full p-2 rounded-xl border border-[#dec0b1] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7265] uppercase">
                    Cambio / Vueltas
                  </label>
                  <div className="p-2 rounded-xl bg-gray-100 font-bold text-[#10b981]">
                    ${changeDue.toLocaleString('es-CO')} COP
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Total & Kitchen Dispatch Action */}
          <div className="pt-3 border-t border-[#dec0b1] space-y-3">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Comanda</span>
              <span className="font-heading text-2xl text-[#F47A22]">
                ${ticketTotal.toLocaleString('es-CO')} COP
              </span>
            </div>

            <button
              onClick={handleChargeAndSendToKitchen}
              disabled={ticketItems.length === 0}
              className="w-full py-4 rounded-full bg-[#10b981] hover:bg-[#059669] text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 transition-all active:scale-95"
            >
              <ChefHat className="w-5 h-5" />
              <span>COBRAR Y MANDAR A COCINA KDS</span>
            </button>
          </div>

          {/* Last Order Receipt Snapshot Alert */}
          {lastCreatedOrder && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-[#10b981] font-bold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Comanda #{lastCreatedOrder.order_number} Creada
                </span>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1 text-[#222B2B] hover:underline"
                >
                  <Printer className="w-3.5 h-3.5" /> Imprimir Ticket
                </button>
              </div>
              <p className="text-[11px] text-gray-600">
                La comanda ya aparece en tiempo real en la pantalla KDS de la cocina.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
