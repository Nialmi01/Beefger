import {
  Category,
  Product,
  Order,
  OrderStatus,
  CartItem,
  Ingredient,
  Recipe,
  CashRegister,
  CashMovement,
  DeliveryZone,
  Customer,
  InventoryMovement,
  BusinessSettings,
  UserRole,
} from './types';
import { supabase } from './supabase';

// Initial Categories
export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'c1',
    name: 'Hamburguesas',
    slug: 'hamburguesas',
    description: '150g de carne de res seleccionada a la parrilla, pan brioche artesanal e ingredientes generosos.',
    icon_url: '/icons/categories/hamburguesa.svg',
    display_order: 1,
    is_active: true,
  },
  {
    id: 'c2',
    name: 'Perros Calientes',
    slug: 'perros-calientes',
    description: 'Salchicha premium de 100g, pan suave de 22cm y combinaciones cargadas.',
    icon_url: '/icons/categories/perro-caliente.svg',
    display_order: 2,
    is_active: true,
  },
  {
    id: 'c3',
    name: 'Pizzas 30cm',
    slug: 'pizzas',
    description: 'Pizzas artesanales de 30 cm a la piedra con combinaciones exclusivas de la casa.',
    icon_url: '/icons/categories/pizza.svg',
    display_order: 3,
    is_active: true,
  },
  {
    id: 'c4',
    name: 'Papas & Acompañantes',
    slug: 'complementos',
    description: 'Papas rústicas doradas y crujientes con sal marina y especias.',
    icon_url: '/icons/categories/papas.svg',
    display_order: 4,
    is_active: true,
  },
];

// Initial Delivery Zones
export const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'dz1',
    name: 'Zona 1: San Fernando / Miraflores',
    delivery_fee: 4000,
    min_order_amount: 20000,
    estimated_time_minutes: 25,
    is_active: true,
  },
  {
    id: 'dz2',
    name: 'Zona 2: Granada / El Peñón / Centenario',
    delivery_fee: 5000,
    min_order_amount: 20000,
    estimated_time_minutes: 30,
    is_active: true,
  },
  {
    id: 'dz3',
    name: 'Zona 3: Tequendama / Limonar',
    delivery_fee: 6000,
    min_order_amount: 25000,
    estimated_time_minutes: 35,
    is_active: true,
  },
  {
    id: 'dz4',
    name: 'Zona 4: Ciudad Jardín / Pance',
    delivery_fee: 8500,
    min_order_amount: 35000,
    estimated_time_minutes: 45,
    is_active: true,
  },
];

// The Official Gourmet Creations + Heritage Collection
export const INITIAL_PRODUCTS: Product[] = [
  // 🍔 HAMBURGUESAS (Línea Gourmet de Autor + Clásicas de la Casa)
  {
    id: 'p-bourbon',
    category_id: 'c1',
    name: 'Bourbon Smokehouse',
    slug: 'bourbon-smokehouse',
    description: 'Nuestra carne artesanal de 150g se encuentra con una mermelada de tocineta al whiskey bourbon que redefine el sabor. Coronada con un nido de cebolla crispy para ese crunch perfecto en cada bocado, en pan brioche sellado.',
    short_description: 'Carne 150g, mermelada de tocineta al bourbon, cebolla crispy y queso fundido.',
    price: 22000,
    preparation_time_minutes: 15,
    is_available: true,
    is_gourmet: true,
    image_url: '/images/products/gourmet/bourbon-smokehouse.jpg',
    allergens: ['Gluten', 'Lácteos'],
    badge: '💎 LÍNEA GOURMET',
    display_order: 1,
    modifier_groups: [
      {
        id: 'mg-b1',
        name: 'Término de la Carne',
        min_selection: 1,
        max_selection: 1,
        is_required: true,
        options: [
          { id: 'mo-b1', modifier_group_id: 'mg-b1', name: 'Término Medio (Jugosa)', price_adjustment: 0, is_default: false, is_available: true, display_order: 1 },
          { id: 'mo-b2', modifier_group_id: 'mg-b1', name: 'Tres Cuartos (Recomendado)', price_adjustment: 0, is_default: true, is_available: true, display_order: 2 },
          { id: 'mo-b3', modifier_group_id: 'mg-b1', name: 'Bien Asada', price_adjustment: 0, is_default: false, is_available: true, display_order: 3 },
        ],
      },
      {
        id: 'mg-b2',
        name: 'Adiciones Especiales',
        min_selection: 0,
        max_selection: 3,
        is_required: false,
        options: [
          { id: 'mo-b4', modifier_group_id: 'mg-b2', name: 'Extra Mermelada Tocineta Bourbon', price_adjustment: 3500, is_default: false, is_available: true, display_order: 1 },
          { id: 'mo-b5', modifier_group_id: 'mg-b2', name: 'Extra Cebolla Crispy', price_adjustment: 2000, is_default: false, is_available: true, display_order: 2 },
          { id: 'mo-b6', modifier_group_id: 'mg-b2', name: 'Doble Queso Cheddar Fundido', price_adjustment: 2500, is_default: false, is_available: true, display_order: 3 },
        ],
      },
    ],
  },
  {
    id: 'p-umami',
    category_id: 'c1',
    name: 'Umami Truffle Master',
    slug: 'umami-truffle-master',
    description: 'Sofisticación pura en formato hamburguesa. Alioli de ajo confitado, generosa porción de champiñones salteados y pimienta negra recién molida sobre queso fundido en pan brioche.',
    short_description: 'Carne 150g, alioli ajo confitado, champiñones salteados trufados y queso fundido.',
    price: 20000,
    preparation_time_minutes: 15,
    is_available: true,
    is_gourmet: true,
    image_url: '/images/products/gourmet/umami-truffle-master.jpg',
    allergens: ['Gluten', 'Lácteos'],
    badge: '💎 LÍNEA GOURMET',
    display_order: 2,
    modifier_groups: [
      {
        id: 'mg-u1',
        name: 'Término de la Carne',
        min_selection: 1,
        max_selection: 1,
        is_required: true,
        options: [
          { id: 'mo-u1', modifier_group_id: 'mg-u1', name: 'Término Medio', price_adjustment: 0, is_default: false, is_available: true, display_order: 1 },
          { id: 'mo-u2', modifier_group_id: 'mg-u1', name: 'Tres Cuartos (Recomendado)', price_adjustment: 0, is_default: true, is_available: true, display_order: 2 },
          { id: 'mo-u3', modifier_group_id: 'mg-u1', name: 'Bien Asada', price_adjustment: 0, is_default: false, is_available: true, display_order: 3 },
        ],
      },
      {
        id: 'mg-u2',
        name: 'Adiciones Especiales',
        min_selection: 0,
        max_selection: 2,
        is_required: false,
        options: [
          { id: 'mo-u4', modifier_group_id: 'mg-u2', name: 'Extra Champiñones Salteados', price_adjustment: 3500, is_default: false, is_available: true, display_order: 1 },
          { id: 'mo-u5', modifier_group_id: 'mg-u2', name: 'Doble Alioli de Ajo Confitado', price_adjustment: 2000, is_default: false, is_available: true, display_order: 2 },
        ],
      },
    ],
  },
  {
    id: 'p-vulcano',
    category_id: 'c1',
    name: 'Tropical Vulcano',
    slug: 'tropical-vulcano',
    description: '¡Erupción de sabor! Queso mozzarella fundido sobre nuestra carne artesanal, el dulzor de la piña asada caramelizada y el golpe vibrante de los jalapeños con nuestra Mayo-Sriracha de la casa.',
    short_description: 'Carne artesanal, mozzarella, piña caramelizada, jalapeños y mayo-sriracha.',
    price: 18000,
    preparation_time_minutes: 12,
    is_available: true,
    is_gourmet: true,
    image_url: '/images/products/gourmet/tropical-vulcano.jpg',
    allergens: ['Gluten', 'Lácteos'],
    badge: '💎 LÍNEA GOURMET',
    display_order: 3,
    modifier_groups: [
      {
        id: 'mg-v1',
        name: 'Término de la Carne',
        min_selection: 1,
        max_selection: 1,
        is_required: true,
        options: [
          { id: 'mo-v1', modifier_group_id: 'mg-v1', name: 'Término Medio', price_adjustment: 0, is_default: false, is_available: true, display_order: 1 },
          { id: 'mo-v2', modifier_group_id: 'mg-v1', name: 'Tres Cuartos', price_adjustment: 0, is_default: true, is_available: true, display_order: 2 },
          { id: 'mo-v3', modifier_group_id: 'mg-v1', name: 'Bien Cocida', price_adjustment: 0, is_default: false, is_available: true, display_order: 3 },
        ],
      },
      {
        id: 'mg-v2',
        name: 'Nivel de Picante & Adiciones',
        min_selection: 0,
        max_selection: 3,
        is_required: false,
        options: [
          { id: 'mo-v4', modifier_group_id: 'mg-v2', name: 'Extra Jalapeños', price_adjustment: 1500, is_default: false, is_available: true, display_order: 1 },
          { id: 'mo-v5', modifier_group_id: 'mg-v2', name: 'Extra Piña Asada', price_adjustment: 2000, is_default: false, is_available: true, display_order: 2 },
          { id: 'mo-v6', modifier_group_id: 'mg-v2', name: 'Tocineta Crocante', price_adjustment: 2500, is_default: false, is_available: true, display_order: 3 },
        ],
      },
    ],
  },
  {
    id: 'p-legendaria',
    category_id: 'c1',
    name: 'La Legendaria',
    slug: 'la-legendaria',
    description: 'La Clásica donde todo comenzó en Beefger. Equilibrio perfecto de carne de res jugosa, queso fundido, vegetales frescos seleccionados y el toque secreto original en pan artesanal.',
    short_description: 'Carne jugosa, vegetales frescos, queso derretido y salsa secreta de la casa.',
    price: 16000,
    preparation_time_minutes: 12,
    is_available: true,
    is_gourmet: true,
    image_url: '/images/products/gourmet/la-legendaria.jpg',
    allergens: ['Gluten', 'Lácteos'],
    badge: '💎 LÍNEA GOURMET',
    display_order: 4,
    modifier_groups: [
      {
        id: 'mg-l1',
        name: 'Término de la Carne',
        min_selection: 1,
        max_selection: 1,
        is_required: true,
        options: [
          { id: 'mo-l1', modifier_group_id: 'mg-l1', name: 'Término Medio', price_adjustment: 0, is_default: false, is_available: true, display_order: 1 },
          { id: 'mo-l2', modifier_group_id: 'mg-l1', name: 'Tres Cuartos (Recomendado)', price_adjustment: 0, is_default: true, is_available: true, display_order: 2 },
          { id: 'mo-l3', modifier_group_id: 'mg-l1', name: 'Bien Asada', price_adjustment: 0, is_default: false, is_available: true, display_order: 3 },
        ],
      },
      {
        id: 'mg-l2',
        name: 'Adiciones',
        min_selection: 0,
        max_selection: 2,
        is_required: false,
        options: [
          { id: 'mo-l4', modifier_group_id: 'mg-l2', name: 'Extra Tocineta', price_adjustment: 2500, is_default: false, is_available: true, display_order: 1 },
          { id: 'mo-l5', modifier_group_id: 'mg-l2', name: 'Doble Queso', price_adjustment: 2000, is_default: false, is_available: true, display_order: 2 },
        ],
      },
    ],
  },

  // 🌭 PERROS CALIENTES (Línea Gourmet de Autor + Clásicos de la Casa)
  {
    id: 'p-mexican-rebel',
    category_id: 'c2',
    name: 'Mexican Rebel',
    slug: 'mexican-rebel',
    description: 'Mezcla perfecta de rebeldía y fuego: salchicha premium ahumada, guacamole rústico casero, maíz tierno salteado y el toque crunchy de nachos triturados.',
    short_description: 'Salchicha premium, guacamole rústico, maíz salteado y nachos triturados.',
    price: 16000,
    preparation_time_minutes: 10,
    is_available: true,
    is_gourmet: true,
    image_url: '/images/products/gourmet/mexican-rebel.png',
    allergens: ['Gluten'],
    badge: '💎 LÍNEA GOURMET',
    display_order: 5,
    modifier_groups: [
      {
        id: 'mg-mr1',
        name: 'Adiciones & Toppings',
        min_selection: 0,
        max_selection: 3,
        is_required: false,
        options: [
          { id: 'mo-mr1', modifier_group_id: 'mg-mr1', name: 'Extra Guacamole Rústico', price_adjustment: 2500, is_default: false, is_available: true, display_order: 1 },
          { id: 'mo-mr2', modifier_group_id: 'mg-mr1', name: 'Extra Nachos Crujientes', price_adjustment: 1500, is_default: false, is_available: true, display_order: 2 },
          { id: 'mo-mr3', modifier_group_id: 'mg-mr1', name: 'Jalapeños en Rodajas', price_adjustment: 1500, is_default: false, is_available: true, display_order: 3 },
        ],
      },
    ],
  },
  {
    id: 'p-bbq-crunch',
    category_id: 'c2',
    name: 'BBQ Crunch',
    slug: 'bbq-crunch',
    description: 'El clásico americano nivel leyenda. Salchicha ahumada bañada en salsa BBQ artesanal secreta, ensalada coleslaw ultra fresca y cremosa, coronada con montaña de papitas cabello de ángel.',
    short_description: 'Salchicha ahumada, salsa BBQ de la casa, ensalada coleslaw y papitas crujientes.',
    price: 14000,
    preparation_time_minutes: 10,
    is_available: true,
    is_gourmet: true,
    image_url: '/images/products/gourmet/bbq-crunch.png',
    allergens: ['Gluten', 'Lácteos'],
    badge: '💎 LÍNEA GOURMET',
    display_order: 6,
    modifier_groups: [
      {
        id: 'mg-bb1',
        name: 'Adiciones',
        min_selection: 0,
        max_selection: 2,
        is_required: false,
        options: [
          { id: 'mo-bb1', modifier_group_id: 'mg-bb1', name: 'Extra Queso Fundido', price_adjustment: 2500, is_default: false, is_available: true, display_order: 1 },
          { id: 'mo-bb2', modifier_group_id: 'mg-bb1', name: 'Tocineta en Cubos', price_adjustment: 2500, is_default: false, is_available: true, display_order: 2 },
        ],
      },
    ],
  },

  // 🍔 RECETAS STREET FOOD
  {
    id: 'p1',
    category_id: 'c1',
    name: 'La Brutal',
    slug: 'la-brutal',
    description:
      'Hamburguesa insignia BEFFGER: Pan brioche dorado de 100g, carne jugosa de 150g, queso cheddar fundido de 25g, 2 tiras de tocineta crocante de 25g, cebolla caramelizada artesanal de 30g, pepinillos encurtidos de 15g y salsa ahumada de la casa de 25g.',
    short_description: 'Carne 150g, cheddar, doble tocineta, cebolla caramelizada, pepinillos y salsa ahumada.',
    price: 19900,
    preparation_time_minutes: 15,
    is_available: true,
    is_gourmet: false,
    image_url: '/images/products/hamburguesas/la-brutal.jpg',
    allergens: ['Gluten', 'Lácteos'],
    badge: '¡INSIGNIA!',
    display_order: 1,
    modifier_groups: [
      {
        id: 'mg1',
        name: 'Término de la Carne',
        min_selection: 1,
        max_selection: 1,
        is_required: true,
        options: [
          { id: 'mo1', modifier_group_id: 'mg1', name: 'Término Medio (Jugosa)', price_adjustment: 0, is_default: false, is_available: true, display_order: 1 },
          { id: 'mo2', modifier_group_id: 'mg1', name: 'Tres Cuartos (Recomendado)', price_adjustment: 0, is_default: true, is_available: true, display_order: 2 },
          { id: 'mo3', modifier_group_id: 'mg1', name: 'Bien Asada (Cocida)', price_adjustment: 0, is_default: false, is_available: true, display_order: 3 },
        ],
      },
      {
        id: 'mg2',
        name: 'Toppings y Extras',
        min_selection: 0,
        max_selection: 4,
        is_required: false,
        options: [
          { id: 'mo4', modifier_group_id: 'mg2', name: 'Extra Tocineta Crocante', price_adjustment: 4000, is_default: false, is_available: true, display_order: 1 },
          { id: 'mo5', modifier_group_id: 'mg2', name: 'Extra Cheddar Fundido', price_adjustment: 3500, is_default: false, is_available: true, display_order: 2 },
          { id: 'mo6', modifier_group_id: 'mg2', name: 'Carne Extra 150g', price_adjustment: 7500, is_default: false, is_available: true, display_order: 3 },
        ],
      },
    ],
  },
  {
    id: 'p2',
    category_id: 'c1',
    name: 'La Criolla',
    slug: 'la-criolla',
    description:
      'Inspiración tradicional colombiana: Pan brioche dorado, carne de res jugosa de 150g, mozzarella fundido de 30g, hogao casero espeso de 35g, tajadas de plátano maduro frito dorado de 50g, cebolla crocante de 10g y salsa de ajo y cilantro de 20g.',
    short_description: 'Carne 150g, mozzarella, hogao tradicional, plátano maduro caramelizado y salsa ajo-cilantro.',
    price: 17900,
    preparation_time_minutes: 15,
    is_available: true,
    is_gourmet: false,
    image_url: '/images/products/hamburguesas/la-criolla.jpg',
    allergens: ['Gluten', 'Lácteos'],
    badge: 'COLOMBIANA',
    display_order: 2,
    modifier_groups: [
      {
        id: 'mg1_2',
        name: 'Término de la Carne',
        min_selection: 1,
        max_selection: 1,
        is_required: true,
        options: [
          { id: 'mo1_2', modifier_group_id: 'mg1_2', name: 'Tres Cuartos (Recomendado)', price_adjustment: 0, is_default: true, is_available: true, display_order: 1 },
          { id: 'mo2_2', modifier_group_id: 'mg1_2', name: 'Bien Asada', price_adjustment: 0, is_default: false, is_available: true, display_order: 2 },
        ],
      },
    ],
  },
  {
    id: 'p3',
    category_id: 'c1',
    name: 'La Tropical',
    slug: 'la-tropical',
    description:
      'Contraste dulce, salado y picante: Pan brioche, carne de 150g, mozzarella de 30g, rodaja generosa de piña a la plancha de 50g, tocineta de 25g, cebolla morada de 15g y salsa de mango picante de 25g.',
    short_description: 'Carne 150g, mozzarella, piña asada, tocineta, cebolla morada y salsa de mango picante.',
    price: 18900,
    preparation_time_minutes: 15,
    is_available: true,
    is_gourmet: false,
    image_url: '/images/products/hamburguesas/la-tropical.jpg',
    allergens: ['Gluten', 'Lácteos'],
    badge: 'TROPICAL',
    display_order: 3,
  },
  {
    id: 'p4',
    category_id: 'c2',
    name: 'El Callejero',
    slug: 'el-callejero',
    description:
      'El icono de la noche: Pan de perro de 22 cm, salchicha premium dorada de 100g, mozzarella fundida de 25g, tocineta picada de 20g, maíz dulce de 20g, papitas crocantes ripiao de 15g, salsa de piña de 20g y salsa ahumada de 20g.',
    short_description: 'Pan 22cm, salchicha 100g, mozzarella, tocineta, maíz dulce, papitas ripiao y salsa de piña.',
    price: 15900,
    preparation_time_minutes: 12,
    is_available: true,
    is_gourmet: false,
    image_url: '/images/products/perros/el-callejero.jpg',
    allergens: ['Gluten', 'Lácteos'],
    badge: 'FAVORITO',
    display_order: 4,
  },
  {
    id: 'p5',
    category_id: 'c2',
    name: 'El Ranchero',
    slug: 'el-ranchero',
    description:
      'Parrillero y con carácter: Pan de perro artesanal, salchicha premium de 100g, rodajas de chorizo dorado de 30g, abundante salsa cheddar de 30g, cebolla morada de 15g, jalapeños de 10g y salsa de ajo y cilantro de 15g.',
    short_description: 'Salchicha 100g, chorizo parrillero, queso cheddar derretido, jalapeños y cebolla morada.',
    price: 16900,
    preparation_time_minutes: 12,
    is_available: true,
    is_gourmet: false,
    image_url: '/images/products/perros/el-ranchero.jpg',
    allergens: ['Gluten', 'Lácteos'],
    badge: 'PARRILLERO',
    display_order: 5,
  },
  {
    id: 'p6',
    category_id: 'c2',
    name: 'El Ahumado',
    slug: 'el-ahumado',
    description:
      'Toque dulce y ahumado: Pan de perro artesanal, salchicha premium de 100g, cheddar de 25g, tocineta de 20g, cebolla caramelizada de 30g, BBQ artesanal de panela de 25g y cebolla crocante de 10g.',
    short_description: 'Salchicha 100g, cheddar, tocineta, cebolla caramelizada, BBQ de panela y cebolla crispy.',
    price: 15900,
    preparation_time_minutes: 12,
    is_available: true,
    is_gourmet: false,
    image_url: '/images/products/perros/el-ahumado.jpg',
    allergens: ['Gluten', 'Lácteos'],
    badge: 'AHUMADO',
    display_order: 6,
  },
  {
    id: 'p7',
    category_id: 'c3',
    name: 'La Colombiana (30 cm)',
    slug: 'la-colombiana',
    description:
      'Pizza artesanal horneada a la piedra: Masa de 220g, salsa de tomate de 60g, mozzarella fundido de 130g, rodajas de chorizo parrillero de 50g, hogao de 35g, plátano maduro frito de 40g y cilantro fresco de 3g.',
    short_description: 'Masa piedra 30cm, mozzarella 130g, chorizo parrillero, hogao casero, plátano maduro y cilantro.',
    price: 26900,
    preparation_time_minutes: 20,
    is_available: true,
    is_gourmet: false,
    image_url: '/images/products/pizzas/la-colombiana.jpg',
    allergens: ['Gluten', 'Lácteos'],
    badge: 'ORIGINAL',
    display_order: 7,
  },
  {
    id: 'p8',
    category_id: 'c3',
    name: 'La BBQ Explosiva (30 cm)',
    slug: 'la-bbq-explosiva',
    description:
      'Ahumada y crocante: Masa de 220g, salsa de tomate de 35g, mozzarella de 130g, pollo jugoso desmechado de 80g, tocineta de 25g, cebolla caramelizada de 30g y espiral de salsa BBQ de 25g.',
    short_description: 'Masa piedra 30cm, mozzarella 130g, pollo desmechado, tocineta, cebolla caramelizada y BBQ.',
    price: 27900,
    preparation_time_minutes: 20,
    is_available: true,
    is_gourmet: false,
    image_url: '/images/products/pizzas/bbq-explosiva.jpg',
    allergens: ['Gluten', 'Lácteos'],
    badge: 'EXPLOSIVA',
    display_order: 8,
  },
  {
    id: 'p9',
    category_id: 'c3',
    name: 'La Tropical Picante (30 cm)',
    slug: 'la-tropical-picante',
    description:
      'Contraste caribeño: Masa de 220g, salsa de tomate de 60g, mozzarella de 130g, jamón de 60g, piña asada dorada de 60g, jalapeños de 10g e hilo de salsa de mango picante de 15g.',
    short_description: 'Masa piedra 30cm, mozzarella 130g, jamón, piña asada, jalapeños y salsa mango picante.',
    price: 26900,
    preparation_time_minutes: 20,
    is_available: true,
    is_gourmet: false,
    image_url: '/images/products/pizzas/tropical-picante.jpg',
    allergens: ['Gluten', 'Lácteos'],
    badge: 'FUSIÓN',
    display_order: 9,
  },
  {
    id: 'p10',
    category_id: 'c4',
    name: 'Papas Rústicas a la Francesa',
    slug: 'papas-rusticas',
    description:
      'Porción de papas rústicas cortadas en bastones, doradas y crujientes con sal marina y toque de hierbas.',
    short_description: 'Papas rústicas doradas y crujientes con sal marina.',
    price: 8900,
    preparation_time_minutes: 10,
    is_available: true,
    is_gourmet: false,
    image_url: '/images/products/complementos/papas-francesa.jpg',
    badge: 'CRUNCH',
    display_order: 10,
  },
];

// Initial Ingredients for Kardex & Technical sheets
export const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: 'i1', name: 'Carne de res seleccionada', sku: 'ING-CARN-01', unit: 'g', current_stock: 24500, minimum_stock: 5000, cost_per_unit: 28.0, supplier: 'Carnes del Valle', is_active: true },
  { id: 'i2', name: 'Pan brioche artesanal', sku: 'ING-PANB-01', unit: 'un', current_stock: 175, minimum_stock: 30, cost_per_unit: 1400.0, supplier: 'Panadería La Corona', is_active: true },
  { id: 'i3', name: 'Queso Cheddar lonchas', sku: 'ING-CHED-01', unit: 'g', current_stock: 7800, minimum_stock: 1500, cost_per_unit: 32.0, supplier: 'Lácteos El Trébol', is_active: true },
  { id: 'i4', name: 'Queso Mozzarella bloque', sku: 'ING-MOZZ-01', unit: 'g', current_stock: 17200, minimum_stock: 3000, cost_per_unit: 26.0, supplier: 'Lácteos El Trébol', is_active: true },
  { id: 'i5', name: 'Tocineta ahumada laminada', sku: 'ING-TOCI-01', unit: 'g', current_stock: 9200, minimum_stock: 2000, cost_per_unit: 35.0, supplier: 'Embutidos Don Raúl', is_active: true },
  { id: 'i6', name: 'Pan de perro 22cm', sku: 'ING-PANP-01', unit: 'un', current_stock: 115, minimum_stock: 25, cost_per_unit: 1100.0, supplier: 'Panadería La Corona', is_active: true },
  { id: 'i7', name: 'Salchicha parrillera 100g', sku: 'ING-SALC-01', unit: 'g', current_stock: 14600, minimum_stock: 3000, cost_per_unit: 22.0, supplier: 'Embutidos Don Raúl', is_active: true },
  { id: 'i8', name: 'Chorizo parrillero artesanal', sku: 'ING-CHOR-01', unit: 'g', current_stock: 7200, minimum_stock: 1500, cost_per_unit: 25.0, supplier: 'Embutidos Don Raúl', is_active: true },
  { id: 'i9', name: 'Masa de pizza 30cm (220g)', sku: 'ING-MASP-01', unit: 'g', current_stock: 14800, minimum_stock: 3000, cost_per_unit: 8.5, supplier: 'Producción Interna', is_active: true },
  { id: 'i10', name: 'Hogao casero colombiano', sku: 'ING-HOGA-01', unit: 'g', current_stock: 5800, minimum_stock: 1000, cost_per_unit: 12.0, supplier: 'Producción Interna', is_active: true },
  { id: 'i11', name: 'Plátano maduro en cubos', sku: 'ING-PLAT-01', unit: 'g', current_stock: 9600, minimum_stock: 2000, cost_per_unit: 6.5, supplier: 'Central de Abastos', is_active: true },
  { id: 'i12', name: 'Cebolla caramelizada', sku: 'ING-CEBC-01', unit: 'g', current_stock: 4800, minimum_stock: 1000, cost_per_unit: 14.0, supplier: 'Producción Interna', is_active: true },
  { id: 'i13', name: 'Pepinillos agridulces', sku: 'ING-PEPI-01', unit: 'g', current_stock: 3400, minimum_stock: 800, cost_per_unit: 20.0, supplier: 'Importaciones del Valle', is_active: true },
  { id: 'i14', name: 'Salsa Ahumada BEFFGER', sku: 'ING-SAHU-01', unit: 'g', current_stock: 7800, minimum_stock: 1500, cost_per_unit: 16.0, supplier: 'Producción Interna', is_active: true },
  { id: 'i15', name: 'Caja ecológica hamburguesa', sku: 'EMP-CAJH-01', unit: 'un', current_stock: 380, minimum_stock: 80, cost_per_unit: 750.0, supplier: 'Empaques del Pacífico', is_active: true },
];

// Initial Recipes / Technical cost sheets for products
export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec1',
    product_id: 'p1',
    product_name: 'La Brutal',
    yield_portions: 1,
    packaging_cost: 1100,
    labor_variable_cost: 1200,
    preparation_notes: 'Sellar carne 150g a 240°C por 3 min por lado. Tostar brioche con mantequilla.',
    items: [
      { id: 'ri1', recipe_id: 'rec1', ingredient_id: 'i1', ingredient_name: 'Carne de res seleccionada', quantity: 150, unit: 'g', unit_cost_snapshot: 28.0, total_cost: 4200 },
      { id: 'ri2', recipe_id: 'rec1', ingredient_id: 'i2', ingredient_name: 'Pan brioche artesanal', quantity: 1, unit: 'un', unit_cost_snapshot: 1400.0, total_cost: 1400 },
      { id: 'ri3', recipe_id: 'rec1', ingredient_id: 'i3', ingredient_name: 'Queso Cheddar lonchas', quantity: 25, unit: 'g', unit_cost_snapshot: 32.0, total_cost: 800 },
      { id: 'ri4', recipe_id: 'rec1', ingredient_id: 'i5', ingredient_name: 'Tocineta ahumada laminada', quantity: 25, unit: 'g', unit_cost_snapshot: 35.0, total_cost: 875 },
      { id: 'ri5', recipe_id: 'rec1', ingredient_id: 'i12', ingredient_name: 'Cebolla caramelizada', quantity: 30, unit: 'g', unit_cost_snapshot: 14.0, total_cost: 420 },
      { id: 'ri6', recipe_id: 'rec1', ingredient_id: 'i13', ingredient_name: 'Pepinillos agridulces', quantity: 15, unit: 'g', unit_cost_snapshot: 20.0, total_cost: 300 },
      { id: 'ri7', recipe_id: 'rec1', ingredient_id: 'i14', ingredient_name: 'Salsa Ahumada BEFFGER', quantity: 25, unit: 'g', unit_cost_snapshot: 16.0, total_cost: 400 },
    ],
    total_ingredient_cost: 8395,
    total_cost: 10695,
    sale_price: 19900,
    food_cost_percentage: 42.18,
    gross_margin_percentage: 57.82,
  },
  {
    id: 'rec2',
    product_id: 'p2',
    product_name: 'La Criolla',
    yield_portions: 1,
    packaging_cost: 1100,
    labor_variable_cost: 1200,
    preparation_notes: 'Carne 150g, mozzarella fundido, hogao tradicional y tajadas de plátano caramelizadas.',
    items: [
      { id: 'ri21', recipe_id: 'rec2', ingredient_id: 'i1', ingredient_name: 'Carne de res seleccionada', quantity: 150, unit: 'g', unit_cost_snapshot: 28.0, total_cost: 4200 },
      { id: 'ri22', recipe_id: 'rec2', ingredient_id: 'i2', ingredient_name: 'Pan brioche artesanal', quantity: 1, unit: 'un', unit_cost_snapshot: 1400.0, total_cost: 1400 },
      { id: 'ri23', recipe_id: 'rec2', ingredient_id: 'i4', ingredient_name: 'Queso Mozzarella', quantity: 30, unit: 'g', unit_cost_snapshot: 26.0, total_cost: 780 },
      { id: 'ri24', recipe_id: 'rec2', ingredient_id: 'i10', ingredient_name: 'Hogao casero', quantity: 35, unit: 'g', unit_cost_snapshot: 12.0, total_cost: 420 },
      { id: 'ri25', recipe_id: 'rec2', ingredient_id: 'i11', ingredient_name: 'Plátano maduro', quantity: 50, unit: 'g', unit_cost_snapshot: 6.5, total_cost: 325 },
    ],
    total_ingredient_cost: 7125,
    total_cost: 9425,
    sale_price: 17900,
    food_cost_percentage: 39.8,
    gross_margin_percentage: 60.2,
  },
];

// Initial Orders (Production ready: clean queue for live orders)
export const INITIAL_ORDERS: Order[] = [];

// Initial Cash Register (Production ready: waiting for shift opening with real base)
export const INITIAL_CASH_REGISTER: CashRegister = {
  id: 'cr1',
  name: 'Caja Principal 01',
  status: 'closed',
  opened_at: new Date().toISOString(),
  opened_by_name: '',
  initial_cash: 0,
  counted_cash: 0,
  expected_cash: 0,
  cash_difference: 0,
  notes: 'Caja lista para apertura de turno con base real.',
};

// Initial Cash Movements (Production ready: clean ledger)
export const INITIAL_CASH_MOVEMENTS: CashMovement[] = [];

// Initial Customers CRM (Production ready: empty list for real clients)
export const INITIAL_CUSTOMERS: Customer[] = [];

// Initial Settings
export const INITIAL_SETTINGS: BusinessSettings = {
  restaurant_name: 'BEFFGER',
  slogan: 'LA CALLE TIENE SABOR',
  phone: '+57 315 888 9900',
  address: 'Cra. 34 # 4-56, Parque del Perro',
  city: 'Cali, Colombia',
  tax_rate: 0.08,
  is_open: true,
  currency: 'COP',
  timezone: 'America/Bogota',
  wompi_public_key: 'pub_test_BEFFGER_SANDBOX',
  wompi_sandbox_mode: true,
  delivery_enabled: true,
  pickup_enabled: true,
  dine_in_enabled: true,
};

// ============================================================================
// REACTIVE IN-MEMORY & CLIENT-SIDE STORE
// ============================================================================

class BeffgerStore {
  private categories: Category[] = INITIAL_CATEGORIES;
  private products: Product[] = INITIAL_PRODUCTS;
  private orders: Order[] = INITIAL_ORDERS;
  private ingredients: Ingredient[] = INITIAL_INGREDIENTS;
  private recipes: Recipe[] = INITIAL_RECIPES;
  private cashRegister: CashRegister = INITIAL_CASH_REGISTER;
  private cashMovements: CashMovement[] = INITIAL_CASH_MOVEMENTS;
  private deliveryZones: DeliveryZone[] = INITIAL_DELIVERY_ZONES;
  private customers: Customer[] = INITIAL_CUSTOMERS;
  private settings: BusinessSettings = INITIAL_SETTINGS;
  private orderSeq: number = 1001;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.orderSeq = 1001;
    if (typeof window !== 'undefined') {
      try {
        const savedOrders = localStorage.getItem('beffger_orders');
        if (savedOrders) {
          const parsed = JSON.parse(savedOrders);
          const hasDemo = Array.isArray(parsed) && parsed.some((o: any) => o.id === 'ord-1001' || o.id === 'ord-1002' || o.customer_name === 'Andrés Gómez');
          if (hasDemo) {
            localStorage.removeItem('beffger_orders');
            this.orders = [];
          } else {
            this.orders = parsed;
          }
        } else {
          this.orders = [];
        }

        const savedCustomers = localStorage.getItem('beffger_customers');
        if (savedCustomers) {
          const parsedCust = JSON.parse(savedCustomers);
          const hasDemoCust = Array.isArray(parsedCust) && parsedCust.some((c: any) => c.id === 'cust1' || c.full_name === 'Andrés Gómez');
          if (hasDemoCust) {
            localStorage.removeItem('beffger_customers');
            this.customers = [];
          } else {
            this.customers = parsedCust;
          }
        } else {
          this.customers = [];
        }

        const savedCashRegister = localStorage.getItem('beffger_cash_register');
        if (savedCashRegister) {
          const parsedCash = JSON.parse(savedCashRegister);
          if (parsedCash.opened_by_name === 'Valentina Cajera') {
            localStorage.removeItem('beffger_cash_register');
            localStorage.removeItem('beffger_cash_movements');
            this.cashRegister = INITIAL_CASH_REGISTER;
            this.cashMovements = [];
          } else {
            this.cashRegister = parsedCash;
            const savedMovements = localStorage.getItem('beffger_cash_movements');
            if (savedMovements) this.cashMovements = JSON.parse(savedMovements);
          }
        }

        const savedProducts = localStorage.getItem('beffger_products');
        if (savedProducts) this.products = JSON.parse(savedProducts);
      } catch (e) {
        this.orders = [];
        this.customers = [];
        this.cashMovements = [];
      }
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('beffger_orders', JSON.stringify(this.orders));
        localStorage.setItem('beffger_products', JSON.stringify(this.products));
      } catch (e) {}
    }
    this.listeners.forEach((l) => l());
  }

  // --- Products & Categories ---
  public getCategories(): Category[] {
    return this.categories;
  }

  public getProducts(): Product[] {
    return this.products;
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.products.find((p) => p.slug === slug);
  }

  public updateProductPrice(productId: string, newPrice: number): boolean {
    const p = this.products.find((item) => item.id === productId);
    if (!p) return false;
    p.price = newPrice;
    this.notify();
    return true;
  }

  public toggleProductAvailability(productId: string): boolean {
    const p = this.products.find((item) => item.id === productId);
    if (!p) return false;
    p.is_available = !p.is_available;
    this.notify();
    return true;
  }

  // --- Orders ---
  public getOrders(): Order[] {
    return [...this.orders].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  public getOrderByNumber(orderNumber: string): Order | undefined {
    return this.orders.find((o) => o.order_number.toUpperCase() === orderNumber.toUpperCase());
  }

  public getOrderById(orderId: string): Order | undefined {
    return this.orders.find((o) => o.id === orderId);
  }

  public createOrder(params: {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    order_type: Order['order_type'];
    delivery_zone_id?: string;
    delivery_address?: string;
    delivery_instructions?: string;
    payment_method: Order['payment_method'];
    items: CartItem[];
    tip?: number;
    kitchen_notes?: string;
  }): Order {
    const orderNumber = `BF-${this.orderSeq++}`;
    const zone = this.deliveryZones.find((z) => z.id === params.delivery_zone_id);
    const deliveryFee = params.order_type === 'domicilio' ? (zone ? zone.delivery_fee : 4000) : 0;
    
    // Server-side calculation from product snapshots to prevent tampering
    const orderItems = params.items.map((cartItem, idx) => {
      // Find actual price
      const actualProd = this.products.find((p) => p.id === cartItem.product.id) || cartItem.product;
      const modTotal = cartItem.modifiers.reduce((s, m) => s + m.price_adjustment, 0);
      const unitPrice = actualProd.price + modTotal;
      return {
        id: `oi-${Date.now()}-${idx}`,
        order_id: `ord-${Date.now()}`,
        product_id: actualProd.id,
        product_name_snapshot: actualProd.name,
        product_price_snapshot: actualProd.price,
        product_image_snapshot: actualProd.image_url,
        quantity: cartItem.quantity,
        unit_price: unitPrice,
        total_price: unitPrice * cartItem.quantity,
        notes: cartItem.notes,
        modifiers: cartItem.modifiers,
      };
    });

    const subtotal = orderItems.reduce((acc, i) => acc + i.total_price, 0);
    const tip = params.tip || 0;
    const total = subtotal + deliveryFee + tip;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      customer_name: params.customer_name,
      customer_phone: params.customer_phone,
      customer_email: params.customer_email,
      order_type: params.order_type,
      status: 'nuevo',
      delivery_zone_id: params.delivery_zone_id,
      delivery_address: params.delivery_address,
      delivery_instructions: params.delivery_instructions,
      delivery_fee: deliveryFee,
      subtotal,
      discount: 0,
      tip,
      total,
      payment_method: params.payment_method,
      payment_status: params.payment_method === 'efectivo' ? 'pendiente' : 'aprobado',
      kitchen_notes: params.kitchen_notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: orderItems,
      status_history: [
        {
          id: `sh-${Date.now()}`,
          order_id: `ord-${Date.now()}`,
          new_status: 'nuevo',
          notes: 'Orden generada y registrada en el sistema',
          created_at: new Date().toISOString(),
        },
      ],
    };

    this.orders.unshift(newOrder);

    // Sync to Supabase in background
    if (typeof window !== 'undefined') {
      try {
        supabase
          .from('orders')
          .insert({
            id: newOrder.id,
            order_number: newOrder.order_number,
            customer_name: newOrder.customer_name,
            customer_phone: newOrder.customer_phone,
            delivery_address: newOrder.delivery_address || 'Mostrador / Local',
            order_type: newOrder.order_type,
            payment_method: newOrder.payment_method,
            subtotal: newOrder.subtotal,
            delivery_fee: newOrder.delivery_fee,
            tip: newOrder.tip,
            total: newOrder.total,
            status: newOrder.status,
            notes: newOrder.kitchen_notes || '',
            created_at: newOrder.created_at,
            updated_at: newOrder.updated_at,
          })
          .then(({ error }) => {
            if (error) console.warn('Supabase sync order warning:', error);
          });

        if (newOrder.items && newOrder.items.length > 0) {
          const dbItems = newOrder.items.map((it) => ({
            id: it.id,
            order_id: newOrder.id,
            product_id: it.product_id,
            product_name: it.product_name_snapshot,
            product_price: it.product_price_snapshot,
            quantity: it.quantity,
            selected_modifiers: it.modifiers || [],
            notes: it.notes || '',
            total_price: it.total_price,
            created_at: newOrder.created_at,
          }));
          supabase.from('order_items').insert(dbItems).then(({ error }) => {
            if (error) console.warn('Supabase sync items warning:', error);
          });
        }
      } catch (e) {
        console.warn('Supabase background insert error:', e);
      }
    }

    // Update customer stats
    this.recordCustomerOrder(params.customer_name, params.customer_phone, total);

    // Consume inventory based on recipe
    this.consumeInventoryForOrder(newOrder);

    this.notify();
    return newOrder;
  }

  public updateOrderStatus(orderId: string, newStatus: OrderStatus, notes?: string, changedBy?: string): boolean {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return false;
    const prev = order.status;
    order.status = newStatus;
    order.updated_at = new Date().toISOString();

    if (typeof window !== 'undefined') {
      try {
        supabase
          .from('orders')
          .update({
            status: newStatus,
            updated_at: order.updated_at,
          })
          .eq('id', orderId)
          .then(({ error }) => {
            if (error) console.warn('Supabase status update warning:', error);
          });
      } catch (e) {}
    }

    if (!order.status_history) order.status_history = [];
    order.status_history.push({
      id: `sh-${Date.now()}`,
      order_id: order.id,
      previous_status: prev,
      new_status: newStatus,
      notes: notes || `Cambio de estado a ${newStatus}`,
      changed_by: changedBy,
      created_at: new Date().toISOString(),
    });

    this.notify();
    return true;
  }

  // --- Inventory & Kardex ---
  public getIngredients(): Ingredient[] {
    return this.ingredients;
  }

  public consumeInventoryForOrder(order: Order) {
    order.items.forEach((item) => {
      // Deduct ingredients according to recipes
      if (item.product_name_snapshot.includes('La Brutal')) {
        this.deductStock('i1', 150 * item.quantity, `Consumo orden ${order.order_number}`);
        this.deductStock('i2', 1 * item.quantity, `Consumo orden ${order.order_number}`);
        this.deductStock('i3', 25 * item.quantity, `Consumo orden ${order.order_number}`);
        this.deductStock('i5', 25 * item.quantity, `Consumo orden ${order.order_number}`);
        this.deductStock('i15', 1 * item.quantity, `Empaque orden ${order.order_number}`);
      } else if (item.product_name_snapshot.includes('El Callejero')) {
        this.deductStock('i6', 1 * item.quantity, `Consumo orden ${order.order_number}`);
        this.deductStock('i7', 100 * item.quantity, `Consumo orden ${order.order_number}`);
      } else if (item.product_name_snapshot.includes('Colombiana')) {
        this.deductStock('i9', 220 * item.quantity, `Consumo orden ${order.order_number}`);
        this.deductStock('i4', 130 * item.quantity, `Consumo orden ${order.order_number}`);
      }
    });
  }

  public deductStock(ingredientId: string, qty: number, reason: string) {
    const ing = this.ingredients.find((i) => i.id === ingredientId);
    if (ing) {
      ing.current_stock = Math.max(0, ing.current_stock - qty);
    }
  }

  public addStock(ingredientId: string, qty: number, reason: string) {
    const ing = this.ingredients.find((i) => i.id === ingredientId);
    if (ing) {
      ing.current_stock += qty;
      this.notify();
    }
  }

  // --- Recipes ---
  public getRecipes(): Recipe[] {
    return this.recipes;
  }

  // --- Cash Register ---
  public getCashRegister(): CashRegister {
    return this.cashRegister;
  }

  public getCashMovements(): CashMovement[] {
    return this.cashMovements;
  }

  public openCashRegister(initialAmount: number, openedBy: string, notes?: string): void {
    this.cashRegister = {
      ...this.cashRegister,
      status: 'open',
      opened_at: new Date().toISOString(),
      opened_by_name: openedBy,
      initial_cash: initialAmount,
      expected_cash: initialAmount,
      counted_cash: initialAmount,
      cash_difference: 0,
      notes: notes || 'Apertura de turno',
    };
    this.cashMovements.unshift({
      id: `cm-${Date.now()}`,
      cash_register_id: this.cashRegister.id,
      type: 'ingreso',
      amount: initialAmount,
      description: 'Apertura de turno / Base inicial',
      performed_by_name: openedBy,
      created_at: new Date().toISOString(),
    });
    this.notify();
  }

  public recordCashMovement(type: 'ingreso' | 'egreso', amount: number, description: string, user: string): void {
    const change = type === 'ingreso' ? amount : -amount;
    this.cashRegister.expected_cash += change;
    this.cashMovements.unshift({
      id: `cm-${Date.now()}`,
      cash_register_id: this.cashRegister.id,
      type,
      amount,
      description,
      performed_by_name: user,
      created_at: new Date().toISOString(),
    });
    this.notify();
  }

  public closeCashRegister(countedCash: number, closedBy: string, notes?: string): void {
    this.cashRegister = {
      ...this.cashRegister,
      status: 'closed',
      closed_at: new Date().toISOString(),
      closed_by_name: closedBy,
      counted_cash: countedCash,
      cash_difference: countedCash - this.cashRegister.expected_cash,
      notes: notes || 'Cierre de caja y arqueo final',
    };
    this.notify();
  }

  // --- Customers CRM ---
  public getCustomers(): Customer[] {
    return this.customers;
  }

  public recordCustomerOrder(name: string, phone: string, amount: number) {
    let cust = this.customers.find((c) => c.phone === phone);
    if (cust) {
      cust.total_spent += amount;
      cust.orders_count += 1;
      cust.loyalty_points += Math.floor(amount / 1000);
      cust.last_order_at = new Date().toISOString();
    } else {
      this.customers.push({
        id: `cust-${Date.now()}`,
        full_name: name,
        phone,
        total_spent: amount,
        orders_count: 1,
        loyalty_points: Math.floor(amount / 1000),
        created_at: new Date().toISOString(),
        last_order_at: new Date().toISOString(),
      });
    }
  }

  // --- Settings ---
  public getSettings(): BusinessSettings {
    return this.settings;
  }

  public getDeliveryZones(): DeliveryZone[] {
    return this.deliveryZones;
  }
}

// Global Singleton Store Instance
export const store = new BeffgerStore();
