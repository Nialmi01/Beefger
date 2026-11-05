# GUÍA DE DESPLIEGUE EN PRODUCCIÓN — BEFFGER
## Arquitectura Next.js + Supabase + Wompi en Vercel

Esta guía detalla los pasos para desplegar el ecosistema digital completo de **BEFFGER** en producción.

---

## 1. REQUISITOS PREVIOS

- Cuenta en [Vercel](https://vercel.com).
- Proyecto creado en [Supabase](https://supabase.com).
- Cuenta comercial o sandbox en [Wompi Colombia](https://wompi.co).
- Dominio personalizado apuntando a los servidores de DNS de Vercel.

---

## 2. CONFIGURACIÓN DE BASE DE DATOS SUPABASE

1. Accede a tu proyecto en el panel de Supabase.
2. Ve al editor SQL (`SQL Editor`).
3. Ejecuta en orden los dos scripts disponibles en el repositorio:
   - `supabase/migrations/20261104000001_beffger_schema.sql`: Crea las tablas, enums, índices, secuencias y políticas de seguridad RLS.
   - `supabase/seed.sql`: Inserta los productos Gourmet, recetas, insumos, zonas de entrega y usuarios de demostración.
4. En `Project Settings > API`, copia la `URL` del proyecto y las claves:
   - `anon public key`
   - `service_role secret key`
5. En `Database > Replication`, habilita Supabase Realtime para las tablas `orders`, `kitchen_order_items` y `cash_movements`.

---

## 3. VARIABLES DE ENTORNO EN VERCEL

En la configuración del proyecto en Vercel (`Settings > Environment Variables`), añade las siguientes variables:

| Variable | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Público | URL del proyecto Supabase | `https://xyzcompany.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Público | Clave anónima pública de Supabase | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Secreto | Clave con privilegios de servicio | `eyJhbGciOi...` |
| `WOMPI_PUBLIC_KEY` | Público | Clave pública de comercio Wompi | `pub_test_xxxxxx` o `pub_prod_xxxxxx` |
| `WOMPI_PRIVATE_KEY` | Secreto | Clave privada de Wompi | `prv_test_xxxxxx` o `prv_prod_xxxxxx` |
| `WOMPI_INTEGRITY_SECRET` | Secreto | Secreto para calcular la firma SHA-256 | `test_integrity_xxxxxx` |
| `WOMPI_EVENTS_SECRET` | Secreto | Secreto para validar webhooks | `test_events_xxxxxx` |
| `NEXT_PUBLIC_SITE_URL` | Público | Dominio canónico de la aplicación | `https://beffger.com` |

---

## 4. INTEGRACIÓN DE PASARELA WOMPI (COLOMBIA)

1. En el panel de control de Wompi, configura la **URL de Redirección**:
   - `https://beffger.com/pedidos`
2. Configura la **URL de Eventos (Webhook)**:
   - `https://beffger.com/api/payments/wompi/webhook`
3. Verifica que la firma de integridad esté habilitada en el checkout para garantizar que los montos no puedan ser alterados en el navegador del cliente.

---

## 5. COMANDO DE CONSTRUCCIÓN Y DESPLIEGUE

El proyecto está preparado para el estándar de Vercel:
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Node.js Version:** 18.x o superior (Recomendado 20.x+)
