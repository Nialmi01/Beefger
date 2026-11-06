'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { ProductModal } from '@/components/ui/ProductModal';
import { store } from '@/lib/store';
import { Product, Category } from '@/lib/types';
import { useCart } from '@/lib/cart';
import {
  Flame,
  Star,
  ShieldCheck,
  Bike,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { itemCount, subtotal, setIsOpen } = useCart();

  useEffect(() => {
    setCategories(store.getCategories());
    setProducts(store.getProducts());

    return store.subscribe(() => {
      setProducts(store.getProducts());
      setCategories(store.getCategories());
    });
  }, []);

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category_id === selectedCategory);

  const heroBurger = products.find((p) => p.slug === 'la-brutal') || products[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF2DF]">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (STITCH INSPIRED HIGH IMPACT STREET GOURMET)             */}
        {/* ========================================================================= */}
        <section className="relative w-full bg-[#222B2B] text-white overflow-hidden pt-12 pb-20 lg:pb-28 shadow-xl border-b border-[#363023]">
          {/* Ambient Glows */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#F47A22]/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[550px] h-[550px] rounded-full bg-[#FFC247]/10 blur-3xl pointer-events-none" />

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Text Column (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* Street Overline Badge */}
                <div className="inline-flex items-center gap-2 self-start bg-[#F47A22]/20 border border-[#F47A22]/30 px-4 py-1.5 rounded-full backdrop-blur-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F47A22] animate-ping" />
                  <span className="font-heading text-xs uppercase tracking-widest text-[#FFC247]">
                    STREET FOOD COLOMBIANO AUTÉNTICO
                  </span>
                </div>

                {/* Main Heading */}
                <div>
                  <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-none m-0">
                    LA CALLE TIENE
                    <span className="block text-[#F47A22] mt-1">
                      SABOR <span className="text-[#FFC247]">MONUMENTAL</span>
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg text-[#EDE1CE]/90 max-w-xl mt-4 leading-relaxed font-normal">
                    Hamburguesas gigantes de 150g, perros cargados y pizzas artesanales de 30 cm con combinaciones callejeras que no pasan desapercibidas. Caliente, crocante y sin rodeos.
                  </p>
                </div>

                {/* Trust Proof Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                    <ShieldCheck className="w-6 h-6 text-[#F47A22] shrink-0" />
                    <span className="text-xs font-semibold text-white leading-tight">
                      100% Carne de Res Seleccionada
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                    <Bike className="w-6 h-6 text-[#FFC247] shrink-0" />
                    <span className="text-xs font-semibold text-white leading-tight">
                      Envíos Rápidos & Empaque Térmico
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                    <Sparkles className="w-6 h-6 text-[#F47A22] shrink-0" />
                    <span className="text-xs font-semibold text-white leading-tight">
                      Pide en Línea en 3 Pasos
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href="#menu-catalog"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#F47A22] hover:bg-[#d96616] text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_10px_25px_rgba(244,122,34,0.4)] hover:-translate-y-0.5 active:scale-95"
                  >
                    <span>ORDENA AHORA</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <Link
                    href="/pedidos"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 backdrop-blur-sm border border-white/10"
                  >
                    <span>RASTREAR PEDIDO</span>
                  </Link>
                </div>

                {/* Real-time rating */}
                <div className="flex items-center gap-3 pt-2 text-xs text-[#EDE1CE]/80">
                  <div className="flex text-[#FFC247]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-white text-sm">4.9 / 5</span>
                  <span>•</span>
                  <span>+12.000 pedidos entregados a satisfacción</span>
                </div>
              </div>

              {/* Hero Food Showcase (5 cols) */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="absolute w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] rounded-full bg-gradient-to-tr from-[#F47A22] via-[#FFC247] to-[#222B2B] opacity-70 blur-2xl animate-pulse" />
                <div className="relative w-full max-w-[420px] aspect-square rounded-full flex items-center justify-center p-4">
                  {/* Hero Burger Image */}
                  <img
                    src={heroBurger?.image_url || '/images/products/hamburguesas/la-brutal.jpg'}
                    alt="La Brutal - BEFFGER"
                    className="w-full h-full object-cover rounded-full shadow-[0_25px_50px_rgba(0,0,0,0.7)] transform hover:scale-105 transition-transform duration-500 z-10 border-4 border-[#F47A22]"
                  />

                  {/* Street Badge Overlay */}
                  <div className="absolute -top-2 -right-2 z-20 bg-[#FFC247] text-[#222B2B] px-4 py-1.5 rounded-full shadow-xl transform rotate-6 flex items-center gap-1.5 border border-[#222B2B]">
                    <Flame className="w-4 h-4 text-[#E94D3C] fill-current" />
                    <span className="font-heading text-xs font-extrabold uppercase tracking-wider">
                      ¡RECETA DE BARRIO!
                    </span>
                  </div>

                  {/* Floating Price Badge */}
                  <div className="absolute -bottom-4 -left-4 z-20 bg-[#222B2B] text-white p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md">
                    <div className="w-10 h-10 rounded-xl bg-[#F47A22] flex items-center justify-center text-white shrink-0">
                      <Flame className="w-5 h-5 fill-current" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wider text-[#FFC247] font-bold">
                        Insignia de la Casa
                      </span>
                      <span className="font-heading text-xl leading-none text-white mt-0.5">
                        LA BRUTAL $19.900
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. CATEGORY TABS STRIP                                                    */}
        {/* ========================================================================= */}
        <section id="menu-catalog" className="sticky top-20 z-40 bg-[#FFF2DF]/95 backdrop-blur-md py-4 border-b border-[#dec0b1] shadow-sm">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wide uppercase transition-all whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-[#222B2B] text-white shadow-md'
                    : 'bg-white text-[#222B2B] hover:bg-[#F47A22] hover:text-white border border-[#dec0b1]'
                }`}
              >
                <span>🔥 TODO EL MENÚ</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wide uppercase transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-[#F47A22] text-white shadow-md'
                      : 'bg-white text-[#222B2B] hover:bg-[#F47A22] hover:text-white border border-[#dec0b1]'
                  }`}
                >
                  <img src={cat.icon_url} alt="" className="w-5 h-5 object-contain" />
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. PRODUCT CATALOG GRID                                                   */}
        {/* ========================================================================= */}
        <section className="py-12 lg:py-16">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 pb-4 border-b border-[#dec0b1]">
              <div>
                <span className="font-heading text-sm text-[#F47A22] tracking-wider uppercase font-bold">
                  Nuestra Carta
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl text-[#222B2B] uppercase tracking-tight mt-1">
                  CARTA OFICIAL BEFFGER
                </h2>
                <p className="text-xs sm:text-sm text-[#574237] mt-1">
                  Creaciones urbanas monumentales preparadas al momento con ingredientes selectos y recetas de autor.
                </p>
              </div>

              <span className="text-xs font-bold text-[#9a4600] bg-white px-3 py-1.5 rounded-full border border-[#dec0b1] mt-3 sm:mt-0">
                {filteredProducts.length} creaciones disponibles
              </span>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-beffger-card hover:shadow-beffger-hover border border-[#dec0b1]/80 transition-all duration-300 flex flex-col group"
                >
                  {/* Food Image Container */}
                  <div
                    onClick={() => setSelectedProduct(product)}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[#222B2B] cursor-pointer"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-[#FFC247] text-[#222B2B] font-heading text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-md">
                        {product.badge}
                      </span>
                    )}

                    <div className="absolute bottom-3 right-3 bg-[#222B2B]/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border border-white/10">
                      <Clock className="w-3.5 h-3.5 text-[#F47A22]" />
                      <span>{product.preparation_time_minutes} min</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          onClick={() => setSelectedProduct(product)}
                          className="font-heading text-2xl text-[#222B2B] hover:text-[#F47A22] transition-colors leading-tight cursor-pointer uppercase tracking-wide"
                        >
                          {product.name}
                        </h3>
                      </div>

                      <p className="text-xs text-[#574237] mt-2 leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                    </div>

                    {/* Price & Add CTA */}
                    <div className="mt-5 pt-3.5 border-t border-[#dec0b1]/60 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-[#8b7265] uppercase font-bold block">
                          Precio
                        </span>
                        <span className="font-heading text-xl sm:text-2xl text-[#222B2B] font-bold whitespace-nowrap">
                          ${product.price.toLocaleString('es-CO')}{' '}
                          <span className="text-[10px] sm:text-xs font-normal text-[#8b7265]">COP</span>
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#F47A22] hover:bg-[#d96616] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 whitespace-nowrap shrink-0 group-hover:shadow-[0_6px_16px_rgba(244,122,34,0.4)]"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>PERSONALIZAR</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. PROMOTIONAL STREET BANNER                                              */}
        {/* ========================================================================= */}
        <section className="py-12 bg-[#222B2B] text-white relative overflow-hidden border-y-4 border-[#FFC247]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-gradient-to-r from-[#363023] to-[#222B2B] p-8 sm:p-12 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl">
                <span className="bg-[#E94D3C] text-white font-heading text-xs font-bold uppercase px-3 py-1 rounded-full">
                  🔥 PROMO DE BARRIO
                </span>
                <h3 className="font-heading text-3xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
                  ¿PIDIENDO PARA EL PARCHE?
                </h3>
                <p className="text-sm text-[#EDE1CE]/80 leading-relaxed">
                  Pide 2 Hamburguesas o 2 Pizzas Artesanales de 30cm y recibe gratis una porción de papas rústicas doradas con salsa de la casa.
                </p>
              </div>

              <a
                href="#menu-catalog"
                className="px-8 py-4 rounded-full bg-[#FFC247] hover:bg-[#e6ad3b] text-[#222B2B] font-heading text-lg font-extrabold uppercase tracking-wider transition-all shadow-xl shrink-0"
              >
                APROVECHAR COMBO
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. APP OFICIAL BEFFGER CLIENTES (PUBLIC DOWNLOAD)                         */}
        {/* ========================================================================= */}
        <section className="py-16 bg-[#FFF2DF]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#222B2B] rounded-3xl shadow-2xl overflow-hidden border-2 border-[#F47A22]/30 p-8 sm:p-12 text-white">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Text */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 bg-[#F47A22]/20 border border-[#F47A22]/40 px-3.5 py-1 rounded-full">
                    <span className="text-sm">📱</span>
                    <span className="font-heading text-xs uppercase tracking-widest text-[#FFC247]">
                      APP NATIVA ANDROID OFICIAL
                    </span>
                  </div>

                  <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase text-white leading-tight">
                    LLEVA EL SABOR DE LA CALLE <span className="text-[#F47A22]">EN TU CELULAR</span>
                  </h2>

                  <p className="text-sm sm:text-base text-[#EDE1CE]/80 leading-relaxed">
                    Descarga la App oficial de <b>BEFFGER Clientes</b> en tu teléfono Android. Registra tus datos en nuestro CRM para pedir en 1 toque, personaliza los términos de la carne y adiciones, paga en línea o en efectivo, y rastrea a tu domiciliario en tiempo real.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#EDE1CE]">
                      <span className="text-[#10b981]">✔</span>
                      <span>Catálogo de 16 recetas de autor</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#EDE1CE]">
                      <span className="text-[#10b981]">✔</span>
                      <span>Registro de cliente y CRM integrado</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#EDE1CE]">
                      <span className="text-[#10b981]">✔</span>
                      <span>Pagos con Wompi, Efectivo o Datáfono</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#EDE1CE]">
                      <span className="text-[#10b981]">✔</span>
                      <span>Rastreo de comanda en vivo en 5 etapas</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                    <a
                      href="/downloads/beffger-cliente.apk"
                      download="beffger-cliente.apk"
                      className="px-6 py-3.5 rounded-xl bg-[#F47A22] hover:bg-[#d96616] text-white font-bold text-sm uppercase tracking-wider text-center shadow-lg shadow-[#F47A22]/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span>📥</span>
                      <span>Descargar App Clientes (APK)</span>
                    </a>
                    <Link
                      href="/descargar-app"
                      className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFC247] font-bold text-sm text-center border border-white/15 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Ver Código QR & Guía →</span>
                    </Link>
                  </div>
                </div>

                {/* Right QR Box */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-xs font-mono text-[#FFC247] uppercase font-bold mb-3 tracking-wider">
                    Escanear con tu Celular
                  </span>
                  <div className="bg-[#FFF2DF] p-3 rounded-2xl shadow-xl border-2 border-[#F47A22] mb-3">
                    <img
                      src="/images/qr-cliente.png"
                      alt="QR Descarga App BEFFGER Clientes"
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                  <span className="text-[11px] text-[#EDE1CE]/70 font-mono">
                    beffger-cliente.apk (24.5 MB)
                  </span>
                  <span className="text-[10px] text-[#10b981] font-semibold mt-1">
                    ● Compatible con Android 7.0 o superior
                  </span>
                </div>

              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Sticky Cart Bar for Mobile Viewports */}
      {itemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-[#F47A22] text-white p-4 rounded-2xl shadow-[0_12px_28px_rgba(244,122,34,0.5)] flex items-center justify-between border-2 border-white/20 active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-white text-[#F47A22] flex items-center justify-center font-bold text-xs">
                {itemCount}
              </span>
              <span className="font-heading text-base uppercase tracking-wider">
                Ver tu pedido
              </span>
            </div>
            <span className="font-heading text-lg font-bold">
              ${subtotal.toLocaleString('es-CO')} COP →
            </span>
          </button>
        </div>
      )}

      {/* Slide-over Cart & Customization Modal */}
      <CartDrawer />
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <Footer />
    </div>
  );
}
