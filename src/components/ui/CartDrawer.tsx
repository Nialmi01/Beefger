'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, subtotal, itemCount } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-[#222B2B]/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF2DF] text-[#222B2B] flex flex-col shadow-2xl border-l border-[#dec0b1]">
          {/* Header */}
          <div className="p-5 bg-[#222B2B] text-white flex items-center justify-between border-b border-[#363023]">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-[#F47A22]" />
              <div>
                <h2 className="font-heading text-xl tracking-wider m-0 leading-tight">Tu Carrito</h2>
                <p className="text-xs text-[#EDE1CE]/70">
                  {itemCount} {itemCount === 1 ? 'producto seleccionado' : 'productos seleccionados'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#dec0b1]/30 flex items-center justify-center text-[#9a4600]">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-heading text-2xl text-[#222B2B]">Tu carrito está vacío</h3>
                <p className="text-sm text-[#574237] max-w-xs mx-auto">
                  Explora las 9 creaciones Gourmet de BEFFGER y añade tu favorita con todos sus ingredientes.
                </p>
                <Link
                  href="/menu"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F47A22] text-white font-bold text-sm tracking-wide shadow-md hover:bg-[#d96616]"
                >
                  Explorar Menú
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-3.5 shadow-sm border border-[#dec0b1]/60 flex gap-3.5 items-start"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-18 h-18 w-20 h-20 rounded-lg object-cover shrink-0 border border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-heading text-lg text-[#222B2B] leading-tight truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#ba1a1a] hover:text-red-700 p-1"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Modifiers selected */}
                    {item.modifiers.length > 0 && (
                      <div className="text-xs text-[#574237] mt-1 space-y-0.5">
                        {item.modifiers.map((m, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span>• {m.option_name}</span>
                            {m.price_adjustment > 0 && (
                              <span className="font-semibold">+${m.price_adjustment.toLocaleString('es-CO')}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {item.notes && (
                      <p className="text-xs italic text-[#574237]/80 mt-1">Obs: {item.notes}</p>
                    )}

                    {/* Quantity Stepper & Price */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                      <div className="flex items-center border border-[#dec0b1] rounded-full bg-[#FFF2DF]/50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#222B2B] hover:bg-[#dec0b1]/50 rounded-full transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#222B2B] hover:bg-[#dec0b1]/50 rounded-full transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-bold text-sm text-[#F47A22]">
                        ${item.total_price.toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Checkout Action */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-[#dec0b1] space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-[#574237]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#222B2B]">
                    ${subtotal.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#574237]">
                  <span>Domicilio (calculado en checkout)</span>
                  <span className="text-[#10b981] font-semibold">Desde $4.000 COP</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="w-full py-3.5 px-6 rounded-full bg-[#F47A22] hover:bg-[#d96616] text-white font-bold text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(244,122,34,0.4)] transition-all active:scale-95"
              >
                <span>CONTINUAR AL CHECKOUT</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
