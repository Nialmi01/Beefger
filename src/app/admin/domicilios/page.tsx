'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/navigation';
import { store } from '@/lib/store';
import { Order, DeliveryZone, BusinessSettings } from '@/lib/types';
import { getStaffUsers, StaffUser } from '@/lib/auth';
import {
  Bike,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  UserCheck,
  Navigation,
  Send,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Building2,
  Save,
  X,
} from 'lucide-react';

export default function DeliveryDispatchPage() {
  const [orders, setOrders] = useState<Order[]>(store.getOrders());
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(store.getDeliveryZones());
  const [settings, setSettings] = useState<BusinessSettings>(store.getSettings());
  const [riders, setRiders] = useState<StaffUser[]>([]);
  const [selectedRiderByOrder, setSelectedRiderByOrder] = useState<Record<string, string>>({});

  // Zone Modal State
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [zoneName, setZoneName] = useState('');
  const [zoneFee, setZoneFee] = useState<number>(5000);
  const [zoneTime, setZoneTime] = useState<number>(30);
  const [zoneMinOrder, setZoneMinOrder] = useState<number>(20000);

  // Settings Edit State
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [cityInput, setCityInput] = useState(store.getSettings().city);
  const [addressInput, setAddressInput] = useState(store.getSettings().address);

  const reloadData = () => {
    setOrders(store.getOrders());
    setDeliveryZones(store.getDeliveryZones());
    setSettings(store.getSettings());
    const staffDomiciliarios = getStaffUsers().filter(
      (u) => u.role === 'Domiciliario' && u.isActive
    );
    setRiders(staffDomiciliarios);
  };

  useEffect(() => {
    reloadData();

    const unsubStore = store.subscribe(() => {
      setOrders(store.getOrders());
      setDeliveryZones(store.getDeliveryZones());
      setSettings(store.getSettings());
    });

    const handleStaffChange = () => {
      const staffDomiciliarios = getStaffUsers().filter(
        (u) => u.role === 'Domiciliario' && u.isActive
      );
      setRiders(staffDomiciliarios);
    };

    window.addEventListener('beffger_staff_change', handleStaffChange);

    return () => {
      unsubStore();
      window.removeEventListener('beffger_staff_change', handleStaffChange);
    };
  }, []);

  const dispatchQueue = orders.filter(
    (o) => o.order_type === 'domicilio' && (o.status === 'listo' || o.status === 'en_domicilio')
  );

  const handleDispatchOrder = (orderId: string) => {
    const defaultRider = riders[0]?.name || 'Domiciliario de turno';
    const riderId = selectedRiderByOrder[orderId];
    const rider = riders.find((r) => r.id === riderId);
    const riderName = rider ? rider.name : defaultRider;

    store.updateOrderStatus(orderId, 'en_domicilio', `Asignado a ${riderName}`);
  };

  const handleMarkDelivered = (orderId: string) => {
    store.updateOrderStatus(orderId, 'entregado', `Entrega completada exitosamente`);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings({
      city: cityInput.trim() || 'Ciudad por configurar',
      address: addressInput.trim() || 'Dirección por configurar',
    });
    setIsEditingSettings(false);
  };

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneName.trim()) return;

    store.addDeliveryZone({
      name: zoneName.trim(),
      delivery_fee: Number(zoneFee) || 0,
      estimated_time_minutes: Number(zoneTime) || 30,
      min_order_amount: Number(zoneMinOrder) || 0,
      is_active: true,
    });

    setZoneName('');
    setZoneFee(5000);
    setZoneTime(30);
    setZoneMinOrder(20000);
    setIsZoneModalOpen(false);
  };

  const handleDeleteZone = (id: string, name: string) => {
    if (confirm(`¿Eliminar la zona "${name}"?`)) {
      store.deleteDeliveryZone(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-heading text-xs text-[#F47A22] uppercase font-bold tracking-wider">
            LOGÍSTICA & DESPACHO
          </span>
          <h1 className="font-heading text-3xl text-[#222B2B] uppercase mt-0.5">
            Control de Despachos & Domicilios
          </h1>
          <p className="text-xs text-[#574237]">
            Asigna pedidos listos a domiciliarios registrados y gestiona zonas según la ciudad operativa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Bike className="w-3.5 h-3.5 text-blue-600" />
            {riders.length} Domiciliarios Registrados
          </span>
        </div>
      </div>

      {/* Operating Hub & City Configuration Banner */}
      <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-beffger-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F47A22]/10 text-[#F47A22] flex items-center justify-center shrink-0 mt-0.5">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#8b7265] uppercase tracking-wider block">
              Sede y Ciudad de Operación
            </span>
            {!isEditingSettings ? (
              <div className="space-y-0.5">
                <h4 className="font-heading text-xl text-[#222B2B]">
                  {settings.city || 'Ciudad por configurar'}
                </h4>
                <p className="text-xs text-[#574237] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#F47A22]" />
                  <span>{settings.address || 'Dirección de la sede no establecida'}</span>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveSettings} className="space-y-2 pt-1">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    placeholder="Ciudad (ej: Bogotá, Medellín, Bucaramanga...)"
                    className="p-2 border border-[#dec0b1] rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-[#F47A22]"
                    required
                  />
                  <input
                    type="text"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    placeholder="Dirección sede (ej: Calle 10 # 5-20)"
                    className="p-2 border border-[#dec0b1] rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-[#F47A22]"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold rounded-lg flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Guardar Sede</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingSettings(false)}
                    className="px-3 py-1.5 border border-stone-300 text-stone-600 text-xs font-bold rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {!isEditingSettings && (
          <button
            onClick={() => {
              setCityInput(settings.city);
              setAddressInput(settings.address);
              setIsEditingSettings(true);
            }}
            className="px-4 py-2 border border-[#dec0b1] hover:bg-[#FFF2DF] rounded-xl text-xs font-bold text-[#222B2B] flex items-center gap-1.5 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#F47A22]" />
            <span>Configurar Ciudad / Sede</span>
          </button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Active Dispatch Queue (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#dec0b1] pb-3">
            <h3 className="font-heading text-xl text-[#222B2B] uppercase">
              Cola de Despacho ({dispatchQueue.length})
            </h3>
            <span className="text-xs text-[#574237]">Listos en cocina o en camino</span>
          </div>

          {dispatchQueue.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-[#10b981] mx-auto opacity-70" />
              <h4 className="font-heading text-2xl text-[#222B2B]">
                No hay pedidos pendientes de despacho
              </h4>
              <p className="text-xs text-[#574237]">
                Cuando cocina marque una orden de domicilio como &quot;LISTA&quot;, aparecerá aquí automáticamente.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {dispatchQueue.map((order) => {
                const isInTransit = order.status === 'en_domicilio';

                return (
                  <div
                    key={order.id}
                    className={`p-4 rounded-2xl border-2 transition-all space-y-3 ${
                      isInTransit
                        ? 'border-purple-300 bg-purple-50/30'
                        : 'border-[#F47A22] bg-[#FFF2DF]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-sm text-white bg-[#222B2B] px-2.5 py-0.5 rounded">
                          {order.order_number}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            isInTransit ? 'bg-purple-600 text-white' : 'bg-[#F47A22] text-white'
                          }`}
                        >
                          {isInTransit ? 'En Ruta' : 'Listo para Despacho'}
                        </span>
                      </div>

                      <span className="font-heading text-lg font-bold text-[#222B2B]">
                        ${order.total.toLocaleString('es-CO')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-bold text-[#222B2B] block">{order.customer_name}</span>
                        <span className="text-[#574237] flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#F47A22]" /> {order.customer_phone}
                        </span>
                      </div>

                      <div>
                        <span className="font-bold text-[#222B2B] block flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#F47A22]" /> Dirección de Entrega
                        </span>
                        <span className="text-[#574237] line-clamp-1">{order.delivery_address}</span>
                      </div>
                    </div>

                    {/* Rider Assign & Dispatch CTA */}
                    <div className="pt-2 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                      {!isInTransit ? (
                        <>
                          <div className="w-full sm:w-auto flex items-center gap-2 text-xs">
                            <span className="font-bold text-[#8b7265]">Asignar a:</span>
                            {riders.length > 0 ? (
                              <select
                                value={selectedRiderByOrder[order.id] || riders[0].id}
                                onChange={(e) =>
                                  setSelectedRiderByOrder({
                                    ...selectedRiderByOrder,
                                    [order.id]: e.target.value,
                                  })
                                }
                                className="p-1.5 rounded-lg border border-[#dec0b1] bg-white font-medium text-xs"
                              >
                                {riders.map((r) => (
                                  <option key={r.id} value={r.id}>
                                    {r.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-xs text-amber-700 italic">
                                Sin domiciliarios en turno
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => handleDispatchOrder(order.id)}
                            disabled={riders.length === 0}
                            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#F47A22] hover:bg-[#d96616] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Despachar Pedido</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-xs text-purple-700 font-bold flex items-center gap-1">
                            <Navigation className="w-4 h-4" /> Domiciliario en tránsito
                          </span>
                          <button
                            onClick={() => handleMarkDelivered(order.id)}
                            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirmar Entrega</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Delivery Zones & Riders (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Registered Delivery Fleet Card */}
          <div className="bg-white p-5 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-3">
            <div className="flex items-center justify-between border-b border-[#dec0b1] pb-2">
              <h3 className="font-heading text-lg text-[#222B2B] uppercase">
                Flota de Repartidores ({riders.length})
              </h3>
              <a
                href="/admin/usuarios"
                className="text-[11px] font-bold text-[#F47A22] hover:underline"
              >
                + Registrar
              </a>
            </div>

            {riders.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[#FFF2DF]/40 border border-[#dec0b1] text-center space-y-2 text-xs">
                <Bike className="w-8 h-8 text-[#8b7265] mx-auto opacity-60" />
                <p className="font-bold text-[#222B2B]">No hay domiciliarios registrados</p>
                <p className="text-[11px] text-[#574237]">
                  Crea colaboradores con el rol &quot;Domiciliario&quot; en la sección de Usuarios para asignarlos a los pedidos.
                </p>
                <a
                  href="/admin/usuarios"
                  className="inline-block mt-1 px-3 py-1.5 bg-[#F47A22] text-white font-bold rounded-lg text-xs"
                >
                  Ir a Crear Colaborador →
                </a>
              </div>
            ) : (
              <div className="space-y-2">
                {riders.map((rider) => (
                  <div
                    key={rider.id}
                    className="p-3 rounded-2xl bg-[#FFF2DF]/50 border border-[#dec0b1] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-[#222B2B]">
                      <span>{rider.name}</span>
                      <span className="text-[#10b981] text-[10px] uppercase font-bold">DISPONIBLE</span>
                    </div>
                    <span className="text-[11px] text-[#8b7265] block">{rider.phone || rider.email}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery Zones & Fees Card */}
          <div className="bg-white p-5 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-3">
            <div className="flex items-center justify-between border-b border-[#dec0b1] pb-2">
              <div>
                <h3 className="font-heading text-lg text-[#222B2B] uppercase">
                  Zonas de Entrega & Tarifas
                </h3>
                <span className="text-[11px] text-[#8b7265] block">
                  Tarifas para {settings.city || 'la ciudad de operación'}
                </span>
              </div>
              <button
                onClick={() => setIsZoneModalOpen(true)}
                className="p-1.5 bg-[#F47A22] text-white rounded-lg hover:bg-[#d96616] transition-colors"
                title="Agregar Zona"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {deliveryZones.map((z) => (
                <div
                  key={z.id}
                  className="p-3 rounded-xl border border-[#dec0b1] flex items-center justify-between hover:bg-[#FFF2DF]/20 transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#222B2B] block">{z.name}</span>
                    <span className="text-[10px] text-[#8b7265]">
                      {z.estimated_time_minutes} min est. • Mínimo ${z.min_order_amount.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-sm text-[#F47A22] font-bold">
                      ${z.delivery_fee.toLocaleString('es-CO')}
                    </span>
                    <button
                      onClick={() => handleDeleteZone(z.id, z.name)}
                      className="text-stone-400 hover:text-red-600 transition-colors"
                      title="Eliminar zona"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CREATE ZONE MODAL */}
      {isZoneModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-[#dec0b1] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#dec0b1] pb-2">
              <h3 className="font-heading text-xl text-[#222B2B] uppercase">
                Agregar Zona de Entrega
              </h3>
              <button
                onClick={() => setIsZoneModalOpen(false)}
                className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddZone} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#222B2B] uppercase mb-1">
                  Nombre de la Zona / Sector
                </label>
                <input
                  type="text"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  placeholder="ej: Zona Norte / Cobertura 1-3 km"
                  required
                  className="w-full p-2.5 rounded-xl border border-[#dec0b1] outline-none focus:ring-2 focus:ring-[#F47A22]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#222B2B] uppercase mb-1">
                    Tarifa Domicilio ($ COP)
                  </label>
                  <input
                    type="number"
                    value={zoneFee}
                    onChange={(e) => setZoneFee(Number(e.target.value))}
                    min={0}
                    step={500}
                    required
                    className="w-full p-2.5 rounded-xl border border-[#dec0b1] outline-none focus:ring-2 focus:ring-[#F47A22]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#222B2B] uppercase mb-1">
                    Tiempo Est. (Minutos)
                  </label>
                  <input
                    type="number"
                    value={zoneTime}
                    onChange={(e) => setZoneTime(Number(e.target.value))}
                    min={5}
                    max={120}
                    required
                    className="w-full p-2.5 rounded-xl border border-[#dec0b1] outline-none focus:ring-2 focus:ring-[#F47A22]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#222B2B] uppercase mb-1">
                  Valor Mínimo de Pedido ($ COP)
                </label>
                <input
                  type="number"
                  value={zoneMinOrder}
                  onChange={(e) => setZoneMinOrder(Number(e.target.value))}
                  min={0}
                  step={1000}
                  required
                  className="w-full p-2.5 rounded-xl border border-[#dec0b1] outline-none focus:ring-2 focus:ring-[#F47A22]"
                />
              </div>

              <div className="pt-2 border-t border-[#dec0b1] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsZoneModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl font-bold text-[#574237]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#F47A22] hover:bg-[#d96616] text-white font-bold rounded-xl uppercase tracking-wider"
                >
                  Guardar Zona
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
