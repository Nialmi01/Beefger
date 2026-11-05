'use client';

import React, { useState } from 'react';
import { Product, SelectedModifier } from '@/lib/types';
import { useCart } from '@/lib/cart';
import { X, Clock, AlertCircle, Plus, Minus, Check } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifier[]>([]);
  const [notes, setNotes] = useState('');

  if (!product) return null;

  // Initialize defaults if any modifier group exists
  const handleToggleModifier = (groupName: string, optionName: string, price: number, isSingleChoice: boolean) => {
    setSelectedModifiers((prev) => {
      if (isSingleChoice) {
        const filtered = prev.filter((m) => m.group_name !== groupName);
        return [...filtered, { group_name: groupName, option_name: optionName, price_adjustment: price }];
      } else {
        const exists = prev.some((m) => m.group_name === groupName && m.option_name === optionName);
        if (exists) {
          return prev.filter((m) => !(m.group_name === groupName && m.option_name === optionName));
        } else {
          return [...prev, { group_name: groupName, option_name: optionName, price_adjustment: price }];
        }
      }
    });
  };

  const modTotal = selectedModifiers.reduce((acc, m) => acc + m.price_adjustment, 0);
  const unitPrice = product.price + modTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedModifiers, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#222B2B]/75 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FFF2DF] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[#dec0b1] z-10 flex flex-col max-h-[92vh]">
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#222B2B]/80 hover:bg-[#222B2B] text-white flex items-center justify-center shadow-lg transition-transform active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          {/* Product Hero Image */}
          <div className="relative aspect-video w-full bg-[#222B2B] overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#222B2B]/90 via-transparent to-transparent" />
            
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#FFC247] text-[#222B2B] font-heading text-xs font-extrabold uppercase px-3 py-1 rounded-full shadow-lg">
                {product.badge}
              </span>
            )}

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="font-heading text-3xl sm:text-4xl leading-tight m-0 uppercase tracking-wide">
                {product.name}
              </h2>
              <div className="flex items-center gap-4 text-xs sm:text-sm text-[#EDE1CE]/90 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-[#F47A22]" /> {product.preparation_time_minutes} min
                </span>
                <span>•</span>
                <span className="text-[#FFC247] font-bold text-base">
                  ${product.price.toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h4 className="font-heading text-sm text-[#9a4600] tracking-wider uppercase mb-1">
                Ingredientes & Receta
              </h4>
              <p className="text-sm text-[#222B2B] leading-relaxed">
                {product.description}
              </p>
              {product.allergens && product.allergens.length > 0 && (
                <div className="mt-3 flex items-center gap-2 text-xs text-[#574237] bg-white/60 p-2.5 rounded-lg border border-[#dec0b1]/60">
                  <AlertCircle className="w-4 h-4 text-[#E94D3C] shrink-0" />
                  <span>Contiene alérgenos: {product.allergens.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Dynamic Modifier Groups */}
            {product.modifier_groups && product.modifier_groups.length > 0 && (
              <div className="space-y-5 pt-2 border-t border-[#dec0b1]/60">
                {product.modifier_groups.map((group) => {
                  const isSingle = group.max_selection === 1;
                  return (
                    <div key={group.id} className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-heading text-base text-[#222B2B] tracking-wide">
                          {group.name}
                        </h4>
                        <span className="text-xs font-medium text-[#574237] bg-white px-2 py-0.5 rounded-full border border-[#dec0b1]">
                          {isSingle ? 'Elige 1 opción' : `Hasta ${group.max_selection} opciones`}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {group.options.map((option) => {
                          const isSelected = selectedModifiers.some(
                            (m) => m.group_name === group.name && m.option_name === option.name
                          );

                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() =>
                                handleToggleModifier(
                                  group.name,
                                  option.name,
                                  option.price_adjustment,
                                  isSingle
                                )
                              }
                              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                                isSelected
                                  ? 'bg-[#222B2B] text-white border-[#222B2B] shadow-md'
                                  : 'bg-white text-[#222B2B] border-[#dec0b1]/70 hover:border-[#F47A22]'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-4 h-4 rounded-${
                                    isSingle ? 'full' : 'md'
                                  } border flex items-center justify-center ${
                                    isSelected
                                      ? 'bg-[#F47A22] border-[#F47A22] text-white'
                                      : 'border-[#8b7265] bg-white'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span className="text-xs font-semibold leading-snug">
                                  {option.name}
                                </span>
                              </div>
                              {option.price_adjustment > 0 && (
                                <span
                                  className={`text-xs font-bold shrink-0 ml-2 ${
                                    isSelected ? 'text-[#FFC247]' : 'text-[#F47A22]'
                                  }`}
                                >
                                  +${option.price_adjustment.toLocaleString('es-CO')}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Special Instructions */}
            <div className="pt-2 border-t border-[#dec0b1]/60">
              <label className="block font-heading text-sm text-[#222B2B] tracking-wide mb-1.5">
                Indicaciones especiales para cocina
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: sin cebolla, salsa aparte, servilletas adicionales..."
                rows={2}
                className="w-full p-3 rounded-xl bg-white border border-[#dec0b1] text-xs text-[#222B2B] placeholder:text-[#574237]/50 focus:outline-none focus:ring-2 focus:ring-[#F47A22]"
              />
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Bar */}
        <div className="p-4 bg-white border-t border-[#dec0b1] flex items-center justify-between gap-4">
          {/* Stepper */}
          <div className="flex items-center border-2 border-[#222B2B] rounded-full bg-[#FFF2DF] px-2 py-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#222B2B] hover:bg-black/10 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#222B2B] hover:bg-black/10 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3.5 px-6 rounded-full bg-[#F47A22] hover:bg-[#d96616] text-white font-bold text-sm sm:text-base uppercase tracking-wider shadow-[0_8px_20px_rgba(244,122,34,0.4)] transition-all active:scale-95 flex items-center justify-between"
          >
            <span>AGREGAR AL PEDIDO</span>
            <span className="text-[#FFF2DF] font-extrabold">
              ${totalPrice.toLocaleString('es-CO')} COP
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
