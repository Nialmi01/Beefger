'use client';

import React, { useState, useEffect } from 'react';
import { store } from '@/lib/store';
import { Product, Category } from '@/lib/types';
import {
  Utensils,
  Plus,
  Edit2,
  Check,
  X,
  Power,
  Flame,
  Search,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Product Form
  const [newName, setNewName] = useState('');
  const [newCatId, setNewCatId] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTime, setNewTime] = useState('15');
  const [newBadge, setNewBadge] = useState('ESPECIAL');
  const [newImage, setNewImage] = useState('/images/products/hamburguesas/la-brutal.jpg');

  useEffect(() => {
    setProducts(store.getProducts());
    setCategories(store.getCategories());
    if (store.getCategories().length > 0) setNewCatId(store.getCategories()[0].id);

    return store.subscribe(() => {
      setProducts(store.getProducts());
      setCategories(store.getCategories());
    });
  }, []);

  const handleSavePrice = (productId: string) => {
    const p = parseFloat(tempPrice);
    if (!isNaN(p) && p > 0) {
      store.updateProductPrice(productId, p);
    }
    setEditingPriceId(null);
  };

  const handleToggleAvailability = (productId: string) => {
    store.toggleProductAvailability(productId);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(newPrice);
    if (!newName.trim() || isNaN(p) || p <= 0) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      category_id: newCatId,
      name: newName,
      slug: newName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newDesc,
      price: p,
      preparation_time_minutes: parseInt(newTime) || 15,
      is_available: true,
      is_gourmet: true,
      image_url: newImage,
      badge: newBadge,
      display_order: products.length + 1,
    };

    store.getProducts().push(newProd);
    store.updateProductPrice(newProd.id, p); // Triggers notify
    setShowCreateModal(false);
    setNewName('');
    setNewDesc('');
    setNewPrice('');
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-heading text-xs text-[#F47A22] uppercase font-bold tracking-wider">
            GESTIÓN DE MENÚ & CATÁLOGO
          </span>
          <h1 className="font-heading text-3xl text-[#222B2B] uppercase mt-0.5">
            Productos & Recetas Gourmet
          </h1>
          <p className="text-xs text-[#574237]">
            {products.length} productos registrados • Modifica precios y disponibilidad en tiempo real.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F47A22] hover:bg-[#d96616] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#dec0b1] shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-[#8b7265] ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto por nombre o ingredientes..."
          className="w-full text-xs text-[#222B2B] placeholder:text-[#8b7265] outline-none"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#dec0b1] shadow-beffger-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#222B2B] text-white uppercase text-[10px] tracking-wider font-heading">
              <tr>
                <th className="p-4">Producto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Precio Oficial (COP)</th>
                <th className="p-4">Tiempo</th>
                <th className="p-4">Insignia</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dec0b1]/60">
              {filtered.map((prod) => {
                const isEditingThisPrice = editingPriceId === prod.id;
                const cat = categories.find((c) => c.id === prod.category_id);

                return (
                  <tr key={prod.id} className="hover:bg-[#FFF2DF]/30 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={prod.image_url}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover border"
                      />
                      <div>
                        <span className="font-heading text-sm text-[#222B2B] block uppercase leading-tight font-bold">
                          {prod.name}
                        </span>
                        <span className="text-[10px] text-[#8b7265] line-clamp-1 max-w-xs">
                          {prod.description}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-[#574237]">
                      {cat?.name || 'General'}
                    </td>

                    {/* Editable Price */}
                    <td className="p-4">
                      {isEditingThisPrice ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            className="w-24 p-1.5 rounded-lg border-2 border-[#F47A22] text-xs font-bold"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePrice(prod.id)}
                            className="p-1 rounded bg-[#10b981] text-white"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingPriceId(null)}
                            className="p-1 rounded bg-gray-200 text-gray-700"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group">
                          <span className="font-heading text-base font-bold text-[#222B2B]">
                            ${prod.price.toLocaleString('es-CO')}
                          </span>
                          <button
                            onClick={() => {
                              setEditingPriceId(prod.id);
                              setTempPrice(prod.price.toString());
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-100 text-[#F47A22] transition-opacity"
                            title="Editar precio de venta"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-[#574237] font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#F47A22]" />
                        {prod.preparation_time_minutes} min
                      </span>
                    </td>

                    <td className="p-4">
                      {prod.badge ? (
                        <span className="bg-[#FFC247] text-[#222B2B] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                          {prod.badge}
                        </span>
                      ) : (
                        <span className="text-gray-400">─</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          prod.is_available
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {prod.is_available ? 'Disponible' : 'Agotado'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleAvailability(prod.id)}
                        className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                          prod.is_available
                            ? 'bg-white text-[#ba1a1a] border-red-200 hover:bg-red-50'
                            : 'bg-white text-[#10b981] border-emerald-200 hover:bg-emerald-50'
                        }`}
                        title={prod.is_available ? 'Marcar como agotado' : 'Activar disponibilidad'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFF2DF] rounded-3xl p-6 w-full max-w-lg border border-[#dec0b1] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#dec0b1] pb-3">
              <h3 className="font-heading text-2xl text-[#222B2B] uppercase">
                Crear Nuevo Producto Gourmet
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-[#8b7265] uppercase mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: La Monumental Burger"
                  className="w-full p-2.5 rounded-xl border border-[#dec0b1] bg-white font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7265] uppercase mb-1">
                    Categoría *
                  </label>
                  <select
                    value={newCatId}
                    onChange={(e) => setNewCatId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#dec0b1] bg-white font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8b7265] uppercase mb-1">
                    Precio de Venta ($ COP) *
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="22000"
                    className="w-full p-2.5 rounded-xl border border-[#dec0b1] bg-white font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8b7265] uppercase mb-1">
                  Descripción & Ingredientes *
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Carne de res 150g, queso fundido, tocineta..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-[#dec0b1] bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7265] uppercase mb-1">
                    Tiempo Preparación (min)
                  </label>
                  <input
                    type="number"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#dec0b1] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7265] uppercase mb-1">
                    Etiqueta / Badge
                  </label>
                  <input
                    type="text"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    placeholder="NUEVA"
                    className="w-full p-2.5 rounded-xl border border-[#dec0b1] bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#dec0b1] text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#F47A22] text-white text-xs font-bold uppercase shadow-md"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
