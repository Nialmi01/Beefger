'use client';

import React from 'react';
import Link from 'next/link';
import {
  Smartphone,
  Download,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  UserCheck,
  ArrowRight,
  Flame,
  Clock,
  Sparkles
} from 'lucide-react';

export default function DescargarAppClientesPage() {
  return (
    <div className="min-h-screen bg-[#FFF2DF] pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#222B2B]/60 mb-6">
          <Link href="/" className="hover:text-[#F47A22] transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-[#222B2B] font-bold">App Móvil para Clientes</span>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#222B2B]/10 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F47A22]/10 text-[#F47A22] text-xs font-bold uppercase tracking-wider mb-5">
                  <Smartphone className="w-4 h-4" />
                  App Oficial de Clientes BEFFGER (v1.0 Nativa)
                </div>

                <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#222B2B] tracking-tight leading-tight mb-4">
                  EL SABOR DE LA CALLE <span className="text-[#F47A22]">EN TUS MANOS</span>
                </h1>

                <p className="text-base text-[#222B2B]/80 leading-relaxed mb-6">
                  Pide tus hamburguesas de 150g, perros calientes cargados y pizzas artesanales con la máxima comodidad. Registra tu perfil para guardar tus datos en el CRM y hacer pedidos en un solo toque.
                </p>

                {/* Features list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#222B2B]">
                    <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                    <span>Catálogo de 16 recetas de autor</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#222B2B]">
                    <UserCheck className="w-4 h-4 text-[#10b981] shrink-0" />
                    <span>Registro en CRM y datos guardados</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#222B2B]">
                    <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                    <span>Personalización de carnes y salsas</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#222B2B]">
                    <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                    <span>Rastreador en vivo en 5 etapas</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#222B2B]">
                    <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                    <span>Pago Wompi, Efectivo o Datáfono</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#222B2B]">
                    <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                    <span>Conexión directa con la cocina</span>
                  </div>
                </div>
              </div>

              {/* Download CTA */}
              <div className="pt-6 border-t border-[#222B2B]/10 space-y-3">
                <a
                  href="/downloads/beffger-cliente.apk"
                  download="beffger-cliente.apk"
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#F47A22] hover:bg-[#d96515] text-white font-bold text-base sm:text-lg shadow-lg shadow-[#F47A22]/25 transition-all transform active:scale-[0.99]"
                >
                  <Download className="w-6 h-6 animate-bounce" />
                  <span>Descargar App Clientes (APK - 24.5 MB)</span>
                </a>

                <div className="flex items-center justify-center gap-2 text-xs text-[#222B2B]/60">
                  <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                  <span>Aplicación oficial y segura para Android 7.0 o superior (Package: com.beffger.app.cliente)</span>
                </div>
              </div>
            </div>

            {/* Right QR Section (5 cols) */}
            <div className="lg:col-span-5 bg-[#222B2B] p-8 sm:p-12 flex flex-col items-center justify-center text-center text-white relative">
              <div className="absolute top-4 right-4">
                <span className="w-3 h-3 rounded-full bg-[#10b981] inline-block animate-ping"></span>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                <QrCode className="w-8 h-8 text-[#FFC247]" />
              </div>

              <h2 className="font-heading text-2xl font-bold text-[#FFF2DF] mb-2 tracking-wide">
                ESCANEA CON TU CELULAR
              </h2>
              <p className="text-xs text-[#EDE1CE]/80 max-w-xs mb-6">
                Abre la cámara de tu teléfono móvil Android para descargar el instalador directamente sin cables.
              </p>

              {/* QR Code */}
              <div className="bg-[#FFF2DF] p-4 rounded-2xl shadow-2xl mb-4 border-4 border-[#F47A22]">
                <img
                  src="/images/qr-cliente.png"
                  alt="QR Descarga BEFFGER Clientes"
                  className="w-48 h-48 object-contain"
                />
              </div>

              <span className="text-xs font-mono text-[#FFC247] bg-white/10 px-3 py-1 rounded-full">
                Archivo: beffger-cliente.apk
              </span>
            </div>

          </div>
        </div>

        {/* Step by Step Installation Guide */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 sm:p-8 border border-[#222B2B]/10 mb-8">
          <h3 className="font-heading text-lg sm:text-xl font-bold text-[#222B2B] mb-5 flex items-center gap-2">
            <span>📋</span> Instrucciones Fáciles de Instalación
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-[#FFF2DF]/60 border border-[#222B2B]/5">
              <span className="w-8 h-8 rounded-full bg-[#F47A22] text-white font-bold flex items-center justify-center text-sm mb-3">1</span>
              <h4 className="font-bold text-[#222B2B] text-sm mb-1">Descarga el archivo</h4>
              <p className="text-xs text-[#222B2B]/70 leading-relaxed">
                Toca el botón naranja de descarga o escanea el código QR desde tu teléfono Android.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FFF2DF]/60 border border-[#222B2B]/5">
              <span className="w-8 h-8 rounded-full bg-[#F47A22] text-white font-bold flex items-center justify-center text-sm mb-3">2</span>
              <h4 className="font-bold text-[#222B2B] text-sm mb-1">Abre el instalador</h4>
              <p className="text-xs text-[#222B2B]/70 leading-relaxed">
                Toca la notificación de descarga finalizada o búscalo en tu carpeta de <i>Descargas</i> con el nombre <b>beffger-cliente.apk</b>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FFF2DF]/60 border border-[#222B2B]/5">
              <span className="w-8 h-8 rounded-full bg-[#F47A22] text-white font-bold flex items-center justify-center text-sm mb-3">3</span>
              <h4 className="font-bold text-[#222B2B] text-sm mb-1">Permitir e Instalar</h4>
              <p className="text-xs text-[#222B2B]/70 leading-relaxed">
                Si Android te muestra una advertencia de seguridad, pulsa <b>"Ajustes &gt; Permitir desde esta fuente"</b> y presiona <b>"Instalar"</b>.
              </p>
            </div>
          </div>
        </div>

        {/* Staff / Operational Apps Notice (Exclusive to Admin) */}
        <div className="bg-[#222B2B] text-white rounded-2xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#FFC247]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading text-lg font-bold text-white mb-1">
                ¿ERES PARTE DEL EQUIPO OPERATIVO DE BEFFGER?
              </h4>
              <p className="text-xs sm:text-sm text-[#EDE1CE]/80 leading-relaxed max-w-2xl">
                Por políticas de seguridad, las aplicaciones móviles operativas para <b>Domiciliarios</b>, <b>Cocina KDS</b>, <b>Meseros POS</b> y <b>Administrador</b> se descargan y gestionan exclusivamente desde el Portal Administrativo con tus credenciales asignadas.
              </p>
            </div>
          </div>

          <Link
            href="/admin/login"
            className="px-6 py-3 rounded-xl bg-[#FFC247] hover:bg-[#e6ad3b] text-[#222B2B] font-bold text-xs sm:text-sm uppercase tracking-wider shrink-0 transition-all flex items-center gap-2"
          >
            <span>Acceso Administrativo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
