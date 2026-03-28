# Solicitud de Código: Página de Carta Digital para Restaurante de Comida Rápida Profesional

Actúa como un Desarrollador Web Senior especializado en React y diseño de UI/UX moderno. Tu objetivo es crear el código completo para una página web de una sola página (Single Page Application) que servirá como la carta digital profesional de un restaurante de comida rápida.

El diseño debe ser profesional, limpio, apto para dispositivos móviles (responsive design) y muy visual, optimizado para incentivar el apetito.

## Especificaciones del Proyecto

1.  **Tecnologías:**
    * React.js
    * Usa componentes funcionales y Hooks (`useState`, `useEffect`).
    * Utiliza una librería de estilos moderna como **Tailwind CSS** (preferido por su rapidez y profesionalismo) o Styled Components. Si usas Tailwind, asume que la configuración ya está hecha o proporciónala.

2.  **Estructura de la Página:**
    * **Header:** Debe contener el logo del restaurante centrado o a la izquierda.
    * **Sección de Héroe (Opcional pero recomendado):** Un banner visual atractivo con un eslogan del tipo "¡Las mejores hamburguesas y perros calientes de la ciudad!".
    * **Navegación de Categorías:** Botones o pestañas para filtrar rápidamente entre "Hamburguesas" y "Perros Calientes".
    * **Cuerpo (La Carta):**
        * Una cuadrícula (grid) de tarjetas (cards) de productos.
        * Cada tarjeta debe tener: Imagen del producto, Nombre, Descripción corta, Precio y un botón de "Añadir" (aunque no tenga funcionalidad de carrito real, es por estética profesional).
    * **Footer:** Información básica de contacto (dirección, teléfono, redes sociales ficticias).

3.  **Manejo de Datos e Imágenes:**
    * **IMPORTANTE:** Asume que existe una carpeta llamada `imagenes` en la raíz de tu proyecto o dentro de `src/assets`.
    * Usa marcadores de posición (`placeholders`) para las rutas de las imágenes en el código, por ejemplo: `src={'imagenes/nombre-imagen.jpg'}`.
    * **Logo:** La imagen del logo se llamará `logo.png` y estará en la carpeta `imagenes`.
    * He proporcionado los datos de los productos a continuación. Úsalos para crear un array de objetos JavaScript que sirva como fuente de datos para renderizar la carta.

4.  **Datos de Ejemplo (Reemplázalos por los tuyos reales):**

```javascript
const productos = [
  // CATEGORÍA: HAMBURGUESAS (Usa tus imágenes de referencia)
  {
    id: 1,
    categoria: 'hamburguesas',
    nombre: 'La Legendaria',
    descripcion: """¿Buscas el equilibrio perfecto? La Clásica Beefger es donde todo comenzó. Carne jugosa, vegetales frescos y ese toque secreto que solo nosotros tenemos. Simple, real y absolutamente deliciosa. ✨ /n📍 ¡Pídela hoy y descubre por qué somos Beefger!""",
    precio: '$16.000 Combo',
    imagen: 'imagenes/Legendaria.jpg' // Reemplaza con tu nombre de archivo real
  },
  {
    id: 2,
    categoria: 'hamburguesas',
    nombre: 'Tropical Vulcano',
    descripcion: """¡Prepárate para una erupción de sabor! 🌋 La Tropical Volcano es para los que se atreven a más. Imagina: Queso mozzarella fundido sobre nuestra carne artesanal, el dulzor de la piña asada caramelizada y el golpe vibrante de los jalapeños con nuestra Mayo-Sriracha. 🍍🔥🌶️ ¿Nivel de picante? Tú lo decides. Una mezcla de colores y texturas que solo encuentras aquí. ¡Atrévete a probar el volcán!""",
    precio: '$18.000',
    imagen: 'imagenes/Vulcano.jpg' // Reemplaza con tu nombre de archivo real
  },
  {
    id: 3,
    categoria: 'hamburguesas',
    nombre: 'Bourbon Smokehouse',
    descripcion: """¿Buscas la joya de la corona? 👑 Presentamos la Bourbon Smokehouse. Nuestra carne artesanal de 150g se encuentra con una mermelada de tocineta al whiskey que redefine lo que es el sabor. Coronada con un nido de cebolla crispy para ese "crunch" perfecto en cada bocado. Todo en un pan brioche sellado que abraza esta explosión de sabor. 🥓🥃✨ El secreto: El equilibrio entre el ahumado y el dulce del ron. ¡Pídela ya en Beefger!""",
    precio: '$22.000',
    imagen: 'imagenes/bourbon.jpg' // Reemplaza con tu nombre de archivo real
  },
  {
    id: 4,
    categoria: 'hamburguesas',
    nombre: 'Umami Truffle Master',
    descripcion: """Sofisticación pura en formato de hamburguesa. 💎 La Umami Truffle Master es nuestra apuesta para los paladares más exigentes. El alioli de ajo confitado prepara el camino para una generosa porción de champiñones salteados y pimienta negra recién molida sobre queso fundido. 🍄🧄Una experiencia terrosa, cremosa y absolutamente irresistible. Si amas lo gourmet, esta es tu Master en Beefger. 🎓🍔""",
    precio: '$20.000',
    imagen: 'imagenes/umami.jpg' // Reemplaza con tu nombre de archivo real
  },
  // CATEGORÍA: PERROS CALIENTES (Usarás las imágenes generadas)
  {
    id: 101,
    categoria: 'perros calientes',
    nombre: 'MEXICAN REBEL',
    descripcion: '¡Cuidado, que este viene con fuego! 🔥 Nuestro Mexican Rebel es la mezcla perfecta de rebeldía y sabor: salchicha premium, un guacamole rústico hecho en casa que te va a volar la cabeza, maíz tierno salteado y el toque crunchy de los nachos triturados. 🥑🌽 ¡Un viaje directo a México en cada bocado!',
    precio: '$16.000',
    imagen: 'imagenes/mexicanr.jpg' // Nombre sugerido para la imagen generada
  },
  {
    id: 102,
    categoria: 'perros calientes',
    nombre: 'BBQ CRUNCH',
    descripcion: 'El clásico americano, pero nivel leyenda. 🇺🇸💥 Salchicha ahumada bañada en nuestra salsa BBQ secreta, acompañada de una ensalada Coleslaw ultra fresca y cremosa, coronada con una montaña de papitas cabello de ángel. ¡Textura y sabor en un solo lugar! 🍟🥗',
    precio: '$14.000',
    imagen: 'imagenes/bbqcrunch.jpg' // Nombre sugerido para la imagen generada
  },
  // Añade aquí el resto de tus perros calientes...
];