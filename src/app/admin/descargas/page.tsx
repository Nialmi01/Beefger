'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  Bike,
  ChefHat,
  UtensilsCrossed,
  BarChart3,
  Lock,
  KeyRound,
  Users
} from 'lucide-react';

interface StaffAppInfo {
  id: string;
  role: string;
  appName: string;
  packageId: string;
  apkFile: string;
  qrFile: string;
  accessCode: string;
  defaultEmail: string;
  defaultPass: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge: string;
  badgeBg: string;
  description: string;
  features: string[];
}

const STAFF_APPS: StaffAppInfo[] = [
  {
    id: 'domiciliario',
    role: 'Domiciliarios & Repartidores',
    appName: 'BEFFGER Domiciliarios',
    packageId: 'com.beffger.app.rider',
    apkFile: 'beffger-domiciliario.apk',
    qrFile: '/images/qr-domiciliario.png',
    accessCode: 'DOMI-2026',
    defaultEmail: 'rider@beffger.com',
    defaultPass: 'rider123',
    icon: Bike,
    color: '#3B82F6',
    badge: 'Logística',
    badgeBg: 'bg-blue-500/10 text-blue-600',
    description: 'Gestión de despachos de pedidos listos, navegación GPS a direcciones de clientes, contacto directo vía WhatsApp y cuadre de caja de efectivo recolectado.',
    features: [
      'Bandeja de pedidos "LISTOS" para entrega inmediata',
      'Geolocalización y enlace a Google Maps en 1 toque',
      'Llamada y chat de WhatsApp con el cliente',
      'Cierre de turno y cobros en efectivo acumulados'
    ]
  },
  {
    id: 'cocina',
    role: 'Cocina & KDS (Kitchen Display)',
    appName: 'BEFFGER Cocina KDS',
    packageId: 'com.beffger.app.kds',
    apkFile: 'beffger-cocina.apk',
    qrFile: '/images/qr-cocina.png',
    accessCode: 'COCINA-2026',
    defaultEmail: 'cocina@beffger.com',
    defaultPass: 'cocina123',
    icon: ChefHat,
    color: '#EF4444',
    badge: 'Producción',
    badgeBg: 'bg-red-500/10 text-red-600',
    description: 'Sistema KDS para tablets y pantallas en cocina. Comandas en vivo filtradas por estación (Parrilla, Plancha, Horno, Freidora) con temporizador y alertas de personalización.',
    features: [
      'Visualización de comandas en vivo con temporizador',
      'Filtros por estación (Parrilla, Plancha, Horno, Papas)',
      'Alertas de términos de carne y toppings seleccionados',
      'Transición inmediata a "LISTO PARA ENTREGA"'
    ]
  },
  {
    id: 'mesero',
    role: 'Meseros & Salón POS',
    appName: 'BEFFGER Meseros POS',
    packageId: 'com.beffger.app.mesero',
    apkFile: 'beffger-mesero.apk',
    qrFile: '/images/qr-mesero.png',
    accessCode: 'MESERO-2026',
    defaultEmail: 'mesero@beffger.com',
    defaultPass: 'mesero123',
    icon: UtensilsCrossed,
    color: '#10B981',
    badge: 'Servicio en Mesa',
    badgeBg: 'bg-emerald-500/10 text-emerald-600',
    description: 'Punto de venta móvil para capitanes y meseros. Mapa interactivo de las 12 mesas del salón (Libre, Ocupada, Esperando cuenta), toma rápida de comandas y facturación.',
    features: [
      'Mapa interactivo de las 12 mesas en tiempo real',
      'Toma de comanda a pie de mesa enviada directo a cocina',
      'Modificadores de plato, bebidas y notas especiales',
      'Solicitud de cuenta y liberación automática de mesa'
    ]
  },
  {
    id: 'admin',
    role: 'Administrador & Gerencia',
    appName: 'BEFFGER Administrador',
    packageId: 'com.beffger.app.admin',
    apkFile: 'beffger-admin.apk',
    qrFile: '/images/qr-admin.png',
    accessCode: 'ADMIN-2026',
    defaultEmail: 'admin@beffger.com',
    defaultPass: 'AdminBeffger2026!',
    icon: BarChart3,
    color: '#8B5CF6',
    badge: 'Control Maestro',
    badgeBg: 'bg-purple-500/10 text-purple-600',
    description: 'Monitoreo de ingresos y tickets promedio en tiempo real, arqueo y cierre de caja diario desglosado (Wompi, efectivo, datáfono) e interruptor para pausar o activar recetas del menú.',
    features: [
      'KPIs de ingresos, ticket promedio y pedidos activos',
      'Arqueo de caja desglosado (Online, Efectivo, Datáfono)',
      'Interruptor para pausar o activar recetas del menú',
      'Auditoría y control global de todo el restaurante'
    ]
  }
];

export default function AdminDescargasPage() {
  const [selectedApp, setSelectedApp] = useState<StaffAppInfo>(STAFF_APPS[0]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC247]/15 text-[#FFC247] text-xs font-bold uppercase tracking-wider mb-2 border border-[#FFC247]/30">
            <Lock className="w-3.5 h-3.5" />
            Acceso Exclusivo de Administración
          </div>
          <h1 className="font-heading text-3xl font-black text-white">
            APPS MÓVILES DEL EQUIPO OPERATIVO
          </h1>
          <p className="text-sm text-gray-300 mt-1 max-w-2xl">
            Gestiona, descarga y comparte las 4 aplicaciones nativas de Android exclusivas para los colaboradores del restaurante. Cada app requiere usuario y contraseña asignados para iniciar turno.
          </p>
        </div>

        {/* Public App Reference Link */}
        <a
          href="http://192.168.40.3:8080/beffger-cliente.apk"
          download="beffger-cliente.apk"
          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 border border-white/10 transition-all shrink-0"
        >
          <Users className="w-4 h-4 text-[#F47A22]" />
          <span>Descargar App Clientes Pública (APK)</span>
        </a>
      </div>

      {/* Role Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STAFF_APPS.map((app) => {
          const Icon = app.icon;
          const isSelected = selectedApp.id === app.id;
          return (
            <button
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className={`p-4 rounded-2xl flex flex-col text-left transition-all duration-200 border-2 ${
                isSelected
                  ? 'bg-[#363023] border-[#FFC247] text-white shadow-xl scale-[1.02]'
                  : 'bg-[#222B2B] border-white/5 text-gray-300 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: isSelected ? app.color : 'rgba(255,255,255,0.08)' }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${app.badgeBg}`}>
                  {app.badge}
                </span>
              </div>
              <span className="font-bold text-sm text-white leading-tight mb-1">
                {app.appName}
              </span>
              <span className="text-[11px] font-mono text-[#FFC247]">
                Código: {app.accessCode}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected App Detailed Card */}
      <div className="bg-[#222B2B] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Details (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${selectedApp.badgeBg}`}>
                    {selectedApp.badge}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    ID: {selectedApp.packageId}
                  </span>
                </div>
                <h2 className="font-heading text-3xl font-black text-white">
                  {selectedApp.appName}
                </h2>
                <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                  {selectedApp.description}
                </p>
              </div>

              {/* Login Credentials Box */}
              <div className="bg-black/30 rounded-2xl p-4 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FFC247] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" />
                    Credenciales de Acceso para Iniciar Turno
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        'creds',
                        `App: ${selectedApp.appName}\nUsuario: ${selectedApp.defaultEmail}\nClave: ${selectedApp.defaultPass}\nDescarga: http://192.168.40.3:8080/${selectedApp.apkFile}`
                      )
                    }
                    className="text-[11px] font-bold text-[#FFC247] hover:text-white flex items-center gap-1 transition-colors"
                  >
                    {copiedKey === 'creds' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'creds' ? '¡Copiado!' : 'Copiar Ficha'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase text-gray-400 block mb-0.5">Usuario / Correo:</span>
                    <span className="text-white font-bold">{selectedApp.defaultEmail}</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase text-gray-400 block mb-0.5">Contraseña:</span>
                    <span className="text-white font-bold">{selectedApp.defaultPass}</span>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedApp.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                    <span className="text-emerald-400 mt-0.5">✔</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Download Action */}
            <div className="pt-6 border-t border-white/10 mt-6 space-y-3">
              <a
                href={`http://192.168.40.3:8080/${selectedApp.apkFile}`}
                download={selectedApp.apkFile}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#F47A22] hover:bg-[#d96616] text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-[#F47A22]/25 transition-all active:scale-[0.99]"
              >
                <Download className="w-5 h-5 animate-bounce" />
                <span>Descargar {selectedApp.apkFile} (APK 24.5 MB)</span>
              </a>

              <div className="flex items-center justify-between text-[11px] text-gray-400 px-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Compilación nativa con autenticación de rol requerida
                </span>
                <span className="font-mono">Versión 1.0 Debug • SDK 36</span>
              </div>
            </div>
          </div>

          {/* Right QR Section (5 cols) */}
          <div className="lg:col-span-5 bg-black/40 p-6 sm:p-8 flex flex-col items-center justify-center text-center border-t lg:border-t-0 lg:border-l border-white/10">
            <span className="text-xs font-mono text-[#FFC247] uppercase font-bold mb-2 tracking-wider flex items-center gap-1.5">
              <QrCode className="w-4 h-4" />
              Escanear para Instalar en Móvil
            </span>
            <p className="text-xs text-gray-400 max-w-xs mb-4">
              Apunta la cámara del celular del empleado a este código QR para comenzar la descarga directa.
            </p>

            <div className="bg-[#FFF2DF] p-3 rounded-2xl shadow-2xl border-4 border-[#F47A22] mb-3">
              <img
                src={selectedApp.qrFile}
                alt={`QR ${selectedApp.appName}`}
                className="w-44 h-44 object-contain"
              />
            </div>

            <span className="text-xs font-mono text-[#FFC247] bg-white/10 px-3 py-1 rounded-full mb-1">
              http://192.168.40.3:8080/{selectedApp.apkFile}
            </span>
            <span className="text-[10px] text-gray-400">
              Requiere conexión a la red WiFi local
            </span>
          </div>

        </div>
      </div>

      {/* Corporate Summary Table */}
      <div className="bg-[#222B2B] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-4">
        <h3 className="font-heading text-xl font-black text-white">
          Directorio Completo de Apps y Credenciales para el Personal
        </h3>
        <p className="text-xs text-gray-300">
          Usa esta tabla para crear usuarios o compartir los accesos con tu equipo de cocineros, repartidores y meseros.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-[#FFC247] uppercase font-mono text-[11px] border-b border-white/10">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Aplicación</th>
                <th className="py-3 px-4">Rol Asignado</th>
                <th className="py-3 px-4">Usuario Inicial</th>
                <th className="py-3 px-4">Contraseña</th>
                <th className="py-3 px-4">Archivo APK</th>
                <th className="py-3 px-4 rounded-r-xl text-center">Ficha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {STAFF_APPS.map((app) => (
                <tr key={app.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: app.color }}></span>
                    {app.appName}
                  </td>
                  <td className="py-3 px-4 text-gray-300">{app.role}</td>
                  <td className="py-3 px-4 font-mono text-gray-200">{app.defaultEmail}</td>
                  <td className="py-3 px-4 font-mono text-gray-400">{app.defaultPass}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#FFC247]">{app.apkFile}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-3 py-1 rounded-lg bg-white/10 hover:bg-[#F47A22] text-white font-bold text-xs transition-colors"
                    >
                      Ver QR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
