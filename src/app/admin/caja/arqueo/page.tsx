'use client';

import React, { useState, useEffect } from 'react';
import { store } from '@/lib/store';
import { CashRegister, CashMovement } from '@/lib/types';
import {
  Coins,
  DollarSign,
  PlusCircle,
  MinusCircle,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle2,
  Printer,
  History,
} from 'lucide-react';

export default function ArqueoCajaPage() {
  const [cashRegister, setCashRegister] = useState<CashRegister>(store.getCashRegister());
  const [movements, setMovements] = useState<CashMovement[]>(store.getCashMovements());

  // Count fields for Colombian pesos currency denominations
  const [b100k, setB100k] = useState<number>(0);
  const [b50k, setB50k] = useState<number>(0);
  const [b20k, setB20k] = useState<number>(0);
  const [b10k, setB10k] = useState<number>(0);
  const [b5k, setB5k] = useState<number>(0);
  const [b2k, setB2k] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);

  // New Movement Modal / Form
  const [movementType, setMovementType] = useState<'ingreso' | 'egreso'>('egreso');
  const [movementAmount, setMovementAmount] = useState<string>('');
  const [movementDesc, setMovementDesc] = useState<string>('');
  const [auditMessage, setAuditMessage] = useState<string>('');

  useEffect(() => {
    return store.subscribe(() => {
      setCashRegister(store.getCashRegister());
      setMovements(store.getCashMovements());
    });
  }, []);

  const totalCounted =
    b100k * 100000 +
    b50k * 50000 +
    b20k * 20000 +
    b10k * 10000 +
    b5k * 5000 +
    b2k * 2000 +
    coins;

  const difference = totalCounted - cashRegister.expected_cash;

  const handleRecordMovement = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(movementAmount) || 0;
    if (amt <= 0 || !movementDesc.trim()) return;

    store.recordCashMovement(movementType, amt, movementDesc, 'Valentina Cajera');
    setMovementAmount('');
    setMovementDesc('');
    setAuditMessage('Movimiento registrado correctamente en el kardex de caja.');
  };

  const handleCloseShift = () => {
    if (confirm('¿Confirmas el arqueo ciego y cierre definitivo del turno de caja?')) {
      store.closeCashRegister(totalCounted, 'Valentina Cajera', `Arqueo final. Diferencia: $${difference}`);
      setAuditMessage('Turno cerrado exitosamente. Comprobante de cierre generado.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-heading text-xs text-[#F47A22] uppercase font-bold tracking-wider">
            CONTROL DE EFECTIVO & AUDITORÍA
          </span>
          <h1 className="font-heading text-3xl text-[#222B2B] uppercase mt-0.5">
            Arqueo y Cierre de Caja
          </h1>
          <p className="text-xs text-[#574237]">
            {cashRegister.name} • Estado: <strong className="uppercase text-[#10b981]">{cashRegister.status}</strong>
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#dec0b1] hover:bg-[#FFF2DF] text-xs font-bold uppercase transition-colors"
        >
          <Printer className="w-4 h-4 text-[#F47A22]" />
          <span>Imprimir Arqueo</span>
        </button>
      </div>

      {auditMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#10b981] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{auditMessage}</span>
        </div>
      )}

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm space-y-2">
          <span className="text-xs font-bold text-[#8b7265] uppercase">Base de Apertura</span>
          <h3 className="font-heading text-2xl text-[#222B2B]">
            ${cashRegister.initial_cash.toLocaleString('es-CO')} COP
          </h3>
          <span className="text-[11px] text-[#574237]">
            Abierta por: {cashRegister.opened_by_name}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm space-y-2">
          <span className="text-xs font-bold text-[#8b7265] uppercase">Efectivo Esperado</span>
          <h3 className="font-heading text-2xl text-[#10b981]">
            ${cashRegister.expected_cash.toLocaleString('es-CO')} COP
          </h3>
          <span className="text-[11px] text-[#574237]">
            Base + Ventas en efectivo - Egresos
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#dec0b1] shadow-sm space-y-2">
          <span className="text-xs font-bold text-[#8b7265] uppercase">Total Contado Físico</span>
          <h3 className="font-heading text-2xl text-[#F47A22]">
            ${totalCounted.toLocaleString('es-CO')} COP
          </h3>
          <span className={`text-[11px] font-bold ${difference >= 0 ? 'text-[#10b981]' : 'text-[#ba1a1a]'}`}>
            Diferencia: {difference >= 0 ? `+$${difference.toLocaleString('es-CO')}` : `-$${Math.abs(difference).toLocaleString('es-CO')}`} COP
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Blind Cash Count Calculator (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-4">
          <h3 className="font-heading text-xl text-[#222B2B] uppercase border-b border-[#dec0b1] pb-3">
            Conteo Ciego de Billetes y Monedas
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#FFF2DF]/50 border border-[#dec0b1]">
              <span className="font-bold text-[#222B2B] block">$100.000</span>
              <input
                type="number"
                min="0"
                value={b100k || ''}
                onChange={(e) => setB100k(parseInt(e.target.value) || 0)}
                placeholder="Cantidad..."
                className="w-full mt-1 p-2 rounded-lg border bg-white font-bold"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#FFF2DF]/50 border border-[#dec0b1]">
              <span className="font-bold text-[#222B2B] block">$50.000</span>
              <input
                type="number"
                min="0"
                value={b50k || ''}
                onChange={(e) => setB50k(parseInt(e.target.value) || 0)}
                placeholder="Cantidad..."
                className="w-full mt-1 p-2 rounded-lg border bg-white font-bold"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#FFF2DF]/50 border border-[#dec0b1]">
              <span className="font-bold text-[#222B2B] block">$20.000</span>
              <input
                type="number"
                min="0"
                value={b20k || ''}
                onChange={(e) => setB20k(parseInt(e.target.value) || 0)}
                placeholder="Cantidad..."
                className="w-full mt-1 p-2 rounded-lg border bg-white font-bold"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#FFF2DF]/50 border border-[#dec0b1]">
              <span className="font-bold text-[#222B2B] block">$10.000</span>
              <input
                type="number"
                min="0"
                value={b10k || ''}
                onChange={(e) => setB10k(parseInt(e.target.value) || 0)}
                placeholder="Cantidad..."
                className="w-full mt-1 p-2 rounded-lg border bg-white font-bold"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#FFF2DF]/50 border border-[#dec0b1]">
              <span className="font-bold text-[#222B2B] block">$5.000</span>
              <input
                type="number"
                min="0"
                value={b5k || ''}
                onChange={(e) => setB5k(parseInt(e.target.value) || 0)}
                placeholder="Cantidad..."
                className="w-full mt-1 p-2 rounded-lg border bg-white font-bold"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#FFF2DF]/50 border border-[#dec0b1]">
              <span className="font-bold text-[#222B2B] block">$2.000</span>
              <input
                type="number"
                min="0"
                value={b2k || ''}
                onChange={(e) => setB2k(parseInt(e.target.value) || 0)}
                placeholder="Cantidad..."
                className="w-full mt-1 p-2 rounded-lg border bg-white font-bold"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#FFF2DF]/50 border border-[#dec0b1] text-xs">
            <span className="font-bold text-[#222B2B] block">Monedas Sueltas ($ COP Total)</span>
            <input
              type="number"
              min="0"
              value={coins || ''}
              onChange={(e) => setCoins(parseFloat(e.target.value) || 0)}
              placeholder="Total en monedas..."
              className="w-full mt-1 p-2 rounded-lg border bg-white font-bold"
            />
          </div>

          <div className="pt-3 border-t border-[#dec0b1] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#8b7265] block">Total Contado:</span>
              <span className="font-heading text-2xl text-[#222B2B] font-bold">
                ${totalCounted.toLocaleString('es-CO')} COP
              </span>
            </div>

            <button
              onClick={handleCloseShift}
              className="px-6 py-3 rounded-full bg-[#E94D3C] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Cerrar Turno & Arqueo</span>
            </button>
          </div>
        </div>

        {/* Movements History & New Movement (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Cash In/Out Form */}
          <form onSubmit={handleRecordMovement} className="bg-white p-5 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-3">
            <h3 className="font-heading text-lg text-[#222B2B] uppercase border-b border-[#dec0b1] pb-2">
              Registrar Movimiento de Caja
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMovementType('egreso')}
                className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 ${
                  movementType === 'egreso'
                    ? 'bg-[#E94D3C] text-white border-[#E94D3C]'
                    : 'bg-white border-[#dec0b1]'
                }`}
              >
                <MinusCircle className="w-3.5 h-3.5" />
                <span>Egreso / Gasto</span>
              </button>
              <button
                type="button"
                onClick={() => setMovementType('ingreso')}
                className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 ${
                  movementType === 'ingreso'
                    ? 'bg-[#10b981] text-white border-[#10b981]'
                    : 'bg-white border-[#dec0b1]'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Ingreso Extra</span>
              </button>
            </div>

            <div className="text-xs">
              <label className="block text-[10px] font-bold text-[#8b7265] uppercase mb-1">
                Monto en Pesos ($ COP)
              </label>
              <input
                type="number"
                value={movementAmount}
                onChange={(e) => setMovementAmount(e.target.value)}
                placeholder="Ej: 15000"
                className="w-full p-2.5 rounded-xl border border-[#dec0b1] font-bold"
                required
              />
            </div>

            <div className="text-xs">
              <label className="block text-[10px] font-bold text-[#8b7265] uppercase mb-1">
                Motivo / Justificación
              </label>
              <input
                type="text"
                value={movementDesc}
                onChange={(e) => setMovementDesc(e.target.value)}
                placeholder="Ej: Compra de cilantro, cambio monedas..."
                className="w-full p-2.5 rounded-xl border border-[#dec0b1]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#222B2B] hover:bg-[#F47A22] text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Guardar Movimiento
            </button>
          </form>

          {/* Movements Kardex Table */}
          <div className="bg-white p-5 rounded-3xl border border-[#dec0b1] shadow-beffger-card space-y-3">
            <h3 className="font-heading text-lg text-[#222B2B] uppercase border-b border-[#dec0b1] pb-2 flex items-center gap-2">
              <History className="w-4 h-4 text-[#F47A22]" />
              <span>Movimientos del Turno ({movements.length})</span>
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
              {movements.map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 rounded-xl bg-[#FFF2DF]/40 border border-[#dec0b1] flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-[#222B2B] block">{m.description}</span>
                    <span className="text-[10px] text-[#8b7265]">
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {m.performed_by_name}
                    </span>
                  </div>
                  <span className={`font-bold text-xs ${
                    m.type === 'ingreso' || m.type === 'venta_efectivo'
                      ? 'text-[#10b981]'
                      : 'text-[#E94D3C]'
                  }`}>
                    {m.type === 'egreso' ? '-' : '+'}${m.amount.toLocaleString('es-CO')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
