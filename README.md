# 🍔 BEFFGER - Plataforma Integral de Restaurante Digital & Apps Móviles

> **"La Calle Tiene Sabor"** — Sistema integral de e-commerce gastronómico, Kitchen Display System (KDS), Punto de Venta (POS) para meseros, despacho de domiciliarios y panel de administración financiera con arqueo de caja y CRM de clientes.

---

## 🌟 Características Principales

1. **Catálogo Gastronómico Completo (15 Creaciones de Autor):**
   - **Línea Gourmet Especial (Beefger Creations):** Bourbon Smokehouse, Umami Truffle Master, Tropical Vulcano, La Legendaria, Mexican Rebel, BBQ Crunch.
   - **Street Food Heritage:** La Brutal, La Criolla, La Tropical, El Callejero, El Ranchero, El Ahumado, Pizzas Artesanales 30cm (La Colombiana, BBQ Explosiva, Tropical Picante) y Papas Rústicas.

2. **Frontend & Backend (Next.js 14 App Router):**
   - E-commerce con checkout fluido, cálculo de domicilios, propinas y pasarela segura Wompi / Nequi / Bancolombia / Efectivo.
   - Tracking en tiempo real de órdenes con barra de progreso.
   - Módulo KDS (Cocina) con actualización instantánea de comandas.
   - Módulo Mesero POS con gestión de mesas en salón y terraza.
   - Panel de Administrador con métricas operativas, control de inventario/kardex, recetas y arqueo de caja diario.

3. **5 Aplicaciones Nativas Android (Jetpack Compose / Material Design 3):**
   - 📱 **App Clientes:** Menú interactivo, selector de adiciones/términos, carrito, registro de clientes en CRM y rastreo de envíos.
   - 🛵 **App Domiciliarios:** Despacho de pedidos, navegación GPS, confirmación de entregas y recaudo en efectivo.
   - 🍳 **App Cocina (KDS):** Monitor táctil de pedidos pendientes, preparación y alertas de comanda.
   - 👔 **App Meseros (POS):** Comandas por mesa, adiciones rápidas y cierre de cuenta.
   - 👑 **App Administrador:** Dashboard general, ventas del día, arqueo y descarga de versiones.

4. **Base de Datos en Supabase (PostgreSQL 17):**
   - Modelado relacional completo con tablas: `categories`, `products`, `customers`, `orders`, `order_items` y `restaurant_tables`.
   - Row Level Security (RLS) habilitado.

---

## 🚀 Despliegue en Producción (Vercel)

Esta aplicación está optimizada para desplegarse con un clic en **Vercel**:
- Framework Preset: **Next.js**
- Variables de entorno requeridas:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `WOMPI_PUBLIC_KEY`
  - `WOMPI_PRIVATE_KEY`

---

## 📂 Estructura del Repositorio

```text
├── legacy_version/         # Versión HTML/CSS/JS estática original de Beefger
├── src/                    # Código fuente Next.js 14 App Router
│   ├── app/                # Rutas y páginas (Clientes, Admin, KDS, Mesero, Rider, API)
│   ├── components/         # Componentes UI reutilizables
│   └── lib/                # Store gastronómico, cliente Supabase y tipos
├── public/                 # Assets estáticos, logos, banners y fotos de productos
│   └── downloads/          # APKs compiladas para Android
├── beffger_android/        # Proyecto completo Android Studio (Kotlin, Jetpack Compose)
│   ├── app/
│   │   ├── build.gradle.kts (Flavors: cliente, domiciliario, cocina, mesero, admin)
│   │   └── src/main/kotlin/com/beffger/app/
└── README.md
```

---

## 📲 Descarga de Aplicaciones Móviles

- **App Clientes:** Disponible públicamente en `/descargar-app` y en el home del portal.
- **Apps Operativas (Rider, Cocina, Mesero, Admin):** Disponibles exclusivamente para el personal autorizado desde el módulo de administración en `/admin/descargas`.
