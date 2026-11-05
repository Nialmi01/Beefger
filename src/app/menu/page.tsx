'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { ProductModal } from '@/components/ui/ProductModal';
import { store } from '@/lib/store';
import { Product, Category } from '@/lib/types';
import { useCart } from '@/lib/cart';
import { Search, Clock, Plus, Flame } from 'lucide-react';

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category_id === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF2DF]">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="bg-[#222B2B] text-white p-8 sm:p-12 rounded-3xl shadow-xl border border-white/10 mb-8 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#F47A22]/20 blur-3xl" />
            <div className="relative z-10 max-w-2xl">
              <span className="font-heading text-xs tracking-widest text-[#FFC247] uppercase bg-white/10 px-3 py-1 rounded-full">
                CARTA COMPLETA
              </span>
              <h1 className="font-heading text-4xl sm:text-6xl text-white uppercase tracking-tight mt-3">
                MENÚ <span className="text-[#F47A22]">BEFFGER GOURMET</span>
              </h1>
              <p className="text-sm sm:text-base text-[#EDE1CE]/80 mt-2 leading-relaxed">
                Nuestras nueve recetas emblemáticas de hamburguesas, perros calientes y pizzas de 30 cm a la piedra. Selecciona cualquier producto para personalizar el término de la carne, salsas y extras.
              </p>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 pb-6 border-b border-[#dec0b1]">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#8b7265] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por ingrediente o nombre..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#dec0b1] text-xs text-[#222B2B] placeholder:text-[#8b7265] focus:outline-none focus:ring-2 focus:ring-[#F47A22]"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full font-bold text-xs uppercase transition-all whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-[#222B2B] text-white shadow'
                    : 'bg-white text-[#222B2B] border border-[#dec0b1] hover:border-[#F47A22]'
                }`}
              >
                Todos ({products.length})
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-4 py-2 rounded-full font-bold text-xs uppercase transition-all whitespace-nowrap ${
                    selectedCategory === c.id
                      ? 'bg-[#F47A22] text-white shadow'
                      : 'bg-white text-[#222B2B] border border-[#dec0b1] hover:border-[#F47A22]'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#dec0b1] p-8">
              <Flame className="w-12 h-12 text-[#F47A22] mx-auto mb-3" />
              <h3 className="font-heading text-2xl text-[#222B2B]">
                No encontramos productos con &quot;{searchQuery}&quot;
              </h3>
              <p className="text-xs text-[#574237] mt-1">
                Intenta buscar por carne, queso, tocineta, brioche o pizzas.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-4 px-5 py-2 rounded-full bg-[#F47A22] text-white text-xs font-bold uppercase"
              >
                Limpiar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-beffger-card hover:shadow-beffger-hover border border-[#dec0b1]/80 transition-all duration-300 flex flex-col group"
                >
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
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-[#FFC247] text-[#222B2B] font-heading text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow">
                        {product.badge}
                      </span>
                    )}
                    <div className="absolute bottom-3 right-3 bg-[#222B2B]/90 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border border-white/10">
                      <Clock className="w-3.5 h-3.5 text-[#F47A22]" />
                      <span>{product.preparation_time_minutes} min</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => setSelectedProduct(product)}
                        className="font-heading text-2xl text-[#222B2B] hover:text-[#F47A22] transition-colors leading-tight cursor-pointer uppercase tracking-wide"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#574237] mt-2 leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-[#dec0b1]/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#8b7265] uppercase font-bold block">
                          Precio
                        </span>
                        <span className="font-heading text-2xl text-[#222B2B] font-bold">
                          ${product.price.toLocaleString('es-CO')}{' '}
                          <span className="text-xs font-normal text-[#8b7265]">COP</span>
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#F47A22] hover:bg-[#d96616] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>PERSONALIZAR</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Sticky Cart Bar on Mobile */}
      {itemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-[#F47A22] text-white p-4 rounded-2xl shadow-xl flex items-center justify-between border-2 border-white/20 active:scale-95"
          >
            <span className="font-heading text-base uppercase">
              Ver Carrito ({itemCount})
            </span>
            <span className="font-heading text-lg font-bold">
              ${subtotal.toLocaleString('es-CO')} COP →
            </span>
          </button>
        </div>
      )}

      <CartDrawer />
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <Footer />
    </div>
  );
}
