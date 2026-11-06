import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'BEFFGER — La Calle Tiene Sabor | Street Food de Autor',
  description:
    'Hamburguesas monumentales de 150g, perros calientes cargados y pizzas artesanales horneadas a la piedra. Pide en línea a domicilio o para llevar.',
  keywords: [
    'BEFFGER',
    'Hamburguesas',
    'Perros Calientes',
    'Pizzas Artesanales',
    'Street Food',
    'La Brutal',
    'Comida rápida artesanal',
  ],
  authors: [{ name: 'BEFFGER Restaurant' }],
  icons: {
    icon: '/brand/favicon.svg',
    shortcut: '/brand/favicon.svg',
    apple: '/brand/app-icon.png',
  },
  openGraph: {
    title: 'BEFFGER — La Calle Tiene Sabor',
    description: 'Hamburguesas monumentales, perros cargados y pizzas artesanales con recetas únicas.',
    url: 'https://beffger.com',
    siteName: 'BEFFGER',
    images: [
      {
        url: '/images/products/hamburguesas/la-brutal.jpg',
        width: 1200,
        height: 1200,
        alt: 'La Brutal Burger BEFFGER',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#222B2B',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/brand/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-[#FFF2DF] text-[#222B2B] antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
