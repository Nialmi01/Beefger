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

// Initial Delivery Zones (Customizable according to city and operating hub)
export const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'dz1',
    name: 'Zona 1: Cobertura Cercana (1 - 3 km)',
    delivery_fee: 4000,
    min_order_amount: 20000,
    estimated_time_minutes: 25,
    is_active: true,
  },
  {
    id: 'dz2',
    name: 'Zona 2: Cobertura Media (3 - 6 km)',
    delivery_fee: 5500,
    min_order_amount: 25000,
    estimated_time_minutes: 35,
    is_active: true,
  },
  {
    id: 'dz3',
    name: 'Zona 3: Cobertura Extendida (6 - 10 km)',
    delivery_fee: 8000,
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
      {
        id: 'mg-adicionales-p1',
        name: 'Acompañamiento o Adicional',
        min_selection: 0,
        max_selection: 2,
        is_required: false,
        options: [
          { id: 'mo-ad-1', modifier_group_id: 'mg-adicionales-p1', name: 'Papas Criollas Rústicas', price_adjustment: 8900, is_default: false, is_available: true, display_order: 1 },
          { id: 'mo-ad-2', modifier_group_id: 'mg-adicionales-p1', name: 'Patacones o Tostones', price_adjustment: 7900, is_default: false, is_available: true, display_order: 2 },
          { id: 'mo-ad-3', modifier_group_id: 'mg-adicionales-p1', name: 'Aros de Cebolla Crocantes', price_adjustment: 9900, is_default: false, is_available: true, display_order: 3 },
          { id: 'mo-ad-4', modifier_group_id: 'mg-adicionales-p1', name: 'Yuca Frita Dorada', price_adjustment: 7900, is_default: false, is_available: true, display_order: 4 },
          { id: 'mo-ad-5', modifier_group_id: 'mg-adicionales-p1', name: 'Papas Rústicas Francesas', price_adjustment: 7900, is_default: false, is_available: true, display_order: 5 },
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
      {
        id: 'mg-adicionales-p2',
        name: 'Acompañamiento o Adicional',
        min_selection: 0,
        max_selection: 2,
        is_required: false,
        options: [
          { id: 'mo-ad-21', modifier_group_id: 'mg-adicionales-p2', name: 'Papas Criollas Rústicas', price_adjustment: 8900, is_default: false, is_available: true, display_order: 1 },
          { id: 'mo-ad-22', modifier_group_id: 'mg-adicionales-p2', name: 'Patacones o Tostones', price_adjustment: 7900, is_default: false, is_available: true, display_order: 2 },
          { id: 'mo-ad-23', modifier_group_id: 'mg-adicionales-p2', name: 'Aros de Cebolla Crocantes', price_adjustment: 9900, is_default: false, is_available: true, display_order: 3 },
          { id: 'mo-ad-24', modifier_group_id: 'mg-adicionales-p2', name: 'Yuca Frita Dorada', price_adjustment: 7900, is_default: false, is_available: true, display_order: 4 },
          { id: 'mo-ad-25', modifier_group_id: 'mg-adicionales-p2', name: 'Papas Rústicas Francesas', price_adjustment: 7900, is_default: false, is_available: true, display_order: 5 },
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
    modifier_groups: [
      {
        id: 'mg1_3',
        name: 'Término de la Carne',
        min_selection: 1,
        max_selection: 1,
        is_required: true,
        options: [
          { id: 'mo1_3', modifier_group_id: 'mg1_3', name: 'Tres Cuartos (Recomendado)', price_adjustment: 0, is_default: true, is_available: true, display_order: 1 },
          { id: 'mo2_3', modifier_group_id: 'mg1_3', name: 'Bien Asada', price_adjustment: 0, is_default: false, is_available: true, display_order: 2 },
        ],
      },
      {
        id: 'mg-adicionales-p3',
        name: 'Acompañamiento o Adicional',
        min_selection: 0,
        max_selection: 2,
        is_required: false,
        options: [
          { id: 'mo-ad-31', modifier_group_id: 'mg-adicionales-p3', name: 'Papas Criollas Rústicas', price_adjustment: 8900, is_default: false, is_available: true, display_order: 1 },
          { id: 'mo-ad-32', modifier_group_id: 'mg-adicionales-p3', name: 'Patacones o Tostones', price_adjustment: 7900, is_default: false, is_available: true, display_order: 2 },
          { id: 'mo-ad-33', modifier_group_id: 'mg-adicionales-p3', name: 'Aros de Cebolla Crocantes', price_adjustment: 9900, is_default: false, is_available: true, display_order: 3 },
          { id: 'mo-ad-34', modifier_group_id: 'mg-adicionales-p3', name: 'Yuca Frita Dorada', price_adjustment: 7900, is_default: false, is_available: true, display_order: 4 },
          { id: 'mo-ad-35', modifier_group_id: 'mg-adicionales-p3', name: 'Papas Rústicas Francesas', price_adjustment: 7900, is_default: false, is_available: true, display_order: 5 },
        ],
      },
    ],
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
  {
    id: 'p11',
    category_id: 'c4',
    name: 'Papas Criollas Rústicas',
    slug: 'papas-criollas',
    description:
      'Porción generosa de papas criollas andinas doradas a la perfección, crocantes por fuera y suaves por dentro, sazonadas con sal marina y finas hierbas.',
    short_description: 'Papas criollas andinas doradas y crocantes con sal marina y finas hierbas.',
    price: 9900,
    preparation_time_minutes: 10,
    is_available: true,
    is_gourmet: false,
    image_url: '/images/products/complementos/papas-criollas.jpg',
    badge: 'TÍPICO',
    display_order: 11,
  },
  {
    id: 'p12',
    category_id: 'c4',
    name: 'Patacones o Tostones Crocantes',
    slug: 'patacones-tostones',
    description:
      'Plátano verde seleccionado dos veces frito hasta lograr una crocancia insuperable. Acompañados de hogao casero tradicional o salsa de la casa.',
    short_description: 'Patacones de plátano verde crujientes con dip de hogao tradicional.',
    price: 8900,
    preparation_time_minutes: 12,
    is_available: true,
    is_gourmet: false,
    image_url: '/images/products/complementos/patacones-tostones.jpg',
    badge: 'CRUNCH',
    display_order: 12,
  },
  {
    id: 'p13',
    category_id: 'c4',
    name: 'Aros de Cebolla Crocantes',
    slug: 'aros-cebolla',
    description:
      'Aros de cebolla fresca cortados gruesos con rebozado artesanal dorado y extra crujiente, servidos con salsa BBQ de panela BEFFGER.',
    short_description: 'Aros de cebolla rebozados y dorados con salsa BBQ de panela.',
    price: 10900,
    preparation_time_minutes: 10,
    is_available: true,
    is_gourmet: false,
    image_url: '/images/products/complementos/aros-cebolla.jpg',
    badge: 'POPULAR',
    display_order: 13,
  },
  {
    id: 'p14',
    category_id: 'c4',
    name: 'Yuca Frita Dorada',
    slug: 'yuca-frita',
    description:
      'Bastones gruesos de yuca seleccionada, crujientes y dorados en su exterior con corazón tierno y suave, espolvoreados con sal marina y dip de ajo y cilantro.',
    short_description: 'Bastones de yuca crujientes con centro tierno y salsa de ajo y cilantro.',
    price: 8900,
    preparation_time_minutes: 12,
    is_available: true,
    is_gourmet: false,
    image_url: '/images/products/complementos/yuca-frita.jpg',
    badge: 'CASERO',
    display_order: 14,
  },
];

// Initial Ingredients for Kardex & Technical sheets
export const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: 'i1', name: 'Carne de res seleccionada', sku: 'ING-CARN-01', unit: 'g', current_stock: 24500, minimum_stock: 5000, cost_per_unit: 28.0, supplier: 'Carnes Premium', is_active: true },
  { id: 'i2', name: 'Pan brioche artesanal', sku: 'ING-PANB-01', unit: 'un', current_stock: 175, minimum_stock: 30, cost_per_unit: 1400.0, supplier: 'Panadería Artesanal', is_active: true },
  { id: 'i3', name: 'Queso Cheddar lonchas', sku: 'ING-CHED-01', unit: 'g', current_stock: 7800, minimum_stock: 1500, cost_per_unit: 32.0, supplier: 'Lácteos del País', is_active: true },
  { id: 'i4', name: 'Queso Mozzarella bloque', sku: 'ING-MOZZ-01', unit: 'g', current_stock: 17200, minimum_stock: 3000, cost_per_unit: 26.0, supplier: 'Lácteos del País', is_active: true },
  { id: 'i5', name: 'Tocineta ahumada laminada', sku: 'ING-TOCI-01', unit: 'g', current_stock: 9200, minimum_stock: 2000, cost_per_unit: 35.0, supplier: 'Embutidos Artesanales', is_active: true },
  { id: 'i6', name: 'Pan de perro 22cm', sku: 'ING-PANP-01', unit: 'un', current_stock: 115, minimum_stock: 25, cost_per_unit: 1100.0, supplier: 'Panadería Artesanal', is_active: true },
  { id: 'i7', name: 'Salchicha parrillera 100g', sku: 'ING-SALC-01', unit: 'g', current_stock: 14600, minimum_stock: 3000, cost_per_unit: 22.0, supplier: 'Embutidos Artesanales', is_active: true },
  { id: 'i8', name: 'Chorizo parrillero artesanal', sku: 'ING-CHOR-01', unit: 'g', current_stock: 7200, minimum_stock: 1500, cost_per_unit: 25.0, supplier: 'Embutidos Artesanales', is_active: true },
  { id: 'i9', name: 'Masa de pizza 30cm (220g)', sku: 'ING-MASP-01', unit: 'g', current_stock: 14800, minimum_stock: 3000, cost_per_unit: 8.5, supplier: 'Producción Interna', is_active: true },
  { id: 'i10', name: 'Hogao casero colombiano', sku: 'ING-HOGA-01', unit: 'g', current_stock: 5800, minimum_stock: 1000, cost_per_unit: 12.0, supplier: 'Producción Interna', is_active: true },
  { id: 'i11', name: 'Plátano maduro en cubos', sku: 'ING-PLAT-01', unit: 'g', current_stock: 9600, minimum_stock: 2000, cost_per_unit: 6.5, supplier: 'Central Mayorista', is_active: true },
  { id: 'i12', name: 'Cebolla caramelizada', sku: 'ING-CEBC-01', unit: 'g', current_stock: 4800, minimum_stock: 1000, cost_per_unit: 14.0, supplier: 'Producción Interna', is_active: true },
  { id: 'i13', name: 'Pepinillos agridulces', sku: 'ING-PEPI-01', unit: 'g', current_stock: 3400, minimum_stock: 800, cost_per_unit: 20.0, supplier: 'Distribuciones Gourmet', is_active: true },
  { id: 'i14', name: 'Salsa Ahumada BEFFGER', sku: 'ING-SAHU-01', unit: 'g', current_stock: 7800, minimum_stock: 1500, cost_per_unit: 16.0, supplier: 'Producción Interna', is_active: true },
  { id: 'i15', name: 'Caja ecológica hamburguesa', sku: 'EMP-CAJH-01', unit: 'un', current_stock: 380, minimum_stock: 80, cost_per_unit: 750.0, supplier: 'Empaques Eco', is_active: true },
  { id: 'i16', name: 'Piña oro miel asada', sku: 'ING-PINA-01', unit: 'g', current_stock: 8400, minimum_stock: 1500, cost_per_unit: 8.0, supplier: 'Central Mayorista', is_active: true },
  { id: 'i17', name: 'Salsa de mango picante', sku: 'ING-SMNG-01', unit: 'g', current_stock: 6200, minimum_stock: 1200, cost_per_unit: 15.0, supplier: 'Producción Interna', is_active: true },
  { id: 'i18', name: 'Maíz dulce tierno', sku: 'ING-MAIZ-01', unit: 'g', current_stock: 5400, minimum_stock: 1000, cost_per_unit: 10.0, supplier: 'Distribuciones Gourmet', is_active: true },
  { id: 'i19', name: 'Papitas ripiao crocantes', sku: 'ING-PRIP-01', unit: 'g', current_stock: 6800, minimum_stock: 1200, cost_per_unit: 12.0, supplier: 'Snacks & Papas', is_active: true },
  { id: 'i20', name: 'Salsa de piña caramelizada', sku: 'ING-SPIN-01', unit: 'g', current_stock: 7100, minimum_stock: 1200, cost_per_unit: 11.0, supplier: 'Producción Interna', is_active: true },
  { id: 'i21', name: 'Jalapeños encurtidos rodajas', sku: 'ING-JALA-01', unit: 'g', current_stock: 3200, minimum_stock: 600, cost_per_unit: 18.0, supplier: 'Distribuciones Gourmet', is_active: true },
  { id: 'i22', name: 'Salsa de ajo y cilantro', sku: 'ING-SAJO-01', unit: 'g', current_stock: 5600, minimum_stock: 1000, cost_per_unit: 13.0, supplier: 'Producción Interna', is_active: true },
  { id: 'i23', name: 'Salsa BBQ de panela', sku: 'ING-SBBQ-01', unit: 'g', current_stock: 6500, minimum_stock: 1200, cost_per_unit: 14.0, supplier: 'Producción Interna', is_active: true },
  { id: 'i24', name: 'Cebolla crispy crocante', sku: 'ING-CCRI-01', unit: 'g', current_stock: 4200, minimum_stock: 800, cost_per_unit: 22.0, supplier: 'Distribuciones Gourmet', is_active: true },
  { id: 'i25', name: 'Portaperro térmico kraft', sku: 'EMP-PPER-01', unit: 'un', current_stock: 420, minimum_stock: 80, cost_per_unit: 550.0, supplier: 'Empaques Eco', is_active: true },
  { id: 'i26', name: 'Salsa pomodoro base pizza', sku: 'ING-POMO-01', unit: 'g', current_stock: 12500, minimum_stock: 2500, cost_per_unit: 9.0, supplier: 'Producción Interna', is_active: true },
  { id: 'i27', name: 'Pollo desmechado marinado', sku: 'ING-POLL-01', unit: 'g', current_stock: 8900, minimum_stock: 1800, cost_per_unit: 20.0, supplier: 'Carnes Premium', is_active: true },
  { id: 'i28', name: 'Jamón artesanal estándar', sku: 'ING-JAMO-01', unit: 'g', current_stock: 7400, minimum_stock: 1500, cost_per_unit: 18.0, supplier: 'Embutidos Artesanales', is_active: true },
  { id: 'i29', name: 'Caja pizza microcorrugada 30cm', sku: 'EMP-CPIZ-01', unit: 'un', current_stock: 260, minimum_stock: 50, cost_per_unit: 1450.0, supplier: 'Empaques Eco', is_active: true },
  { id: 'i30', name: 'Papa rústica bastón', sku: 'ING-PAPA-01', unit: 'g', current_stock: 28000, minimum_stock: 5000, cost_per_unit: 7.0, supplier: 'Central Mayorista', is_active: true },
  { id: 'i31', name: 'Aceite vegetal para fritura', sku: 'ING-ACEI-01', unit: 'g', current_stock: 18000, minimum_stock: 4000, cost_per_unit: 9.5, supplier: 'Distribuciones Gourmet', is_active: true },
  { id: 'i32', name: 'Cono kraft antigrasa papas', sku: 'EMP-CPAP-01', unit: 'un', current_stock: 350, minimum_stock: 70, cost_per_unit: 450.0, supplier: 'Empaques Eco', is_active: true },
  { id: 'i33', name: 'Papa criolla seleccionada', sku: 'ING-PCRI-01', unit: 'g', current_stock: 15000, minimum_stock: 3000, cost_per_unit: 8.0, supplier: 'Central Mayorista', is_active: true },
  { id: 'i34', name: 'Plátano verde para patacón', sku: 'ING-PVER-01', unit: 'g', current_stock: 18000, minimum_stock: 3000, cost_per_unit: 6.0, supplier: 'Central Mayorista', is_active: true },
  { id: 'i35', name: 'Cebolla blanca para aros', sku: 'ING-CEBA-01', unit: 'g', current_stock: 12000, minimum_stock: 2500, cost_per_unit: 5.5, supplier: 'Central Mayorista', is_active: true },
  { id: 'i36', name: 'Mezcla panko rebozado', sku: 'ING-REBO-01', unit: 'g', current_stock: 9000, minimum_stock: 2000, cost_per_unit: 11.0, supplier: 'Distribuciones Gourmet', is_active: true },
  { id: 'i37', name: 'Yuca fresca seleccionada', sku: 'ING-YUCA-01', unit: 'g', current_stock: 20000, minimum_stock: 4000, cost_per_unit: 7.5, supplier: 'Central Mayorista', is_active: true },
];

// Initial Recipes / Technical cost sheets for ALL 10 products
export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec1',
    product_id: 'p1',
    product_name: 'La Brutal',
    yield_portions: 1,
    packaging_cost: 1100,
    labor_variable_cost: 1200,
    preparation_notes: 'Sellar carne 150g a 240°C por 3 min por lado. Tostar brioche con mantequilla, agregar tocineta crocante y cebolla caramelizada.',
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
    preparation_notes: 'Carne 150g, mozzarella fundido, hogao casero tradicional y tajadas de plátano caramelizadas.',
    items: [
      { id: 'ri21', recipe_id: 'rec2', ingredient_id: 'i1', ingredient_name: 'Carne de res seleccionada', quantity: 150, unit: 'g', unit_cost_snapshot: 28.0, total_cost: 4200 },
      { id: 'ri22', recipe_id: 'rec2', ingredient_id: 'i2', ingredient_name: 'Pan brioche artesanal', quantity: 1, unit: 'un', unit_cost_snapshot: 1400.0, total_cost: 1400 },
      { id: 'ri23', recipe_id: 'rec2', ingredient_id: 'i4', ingredient_name: 'Queso Mozzarella bloque', quantity: 30, unit: 'g', unit_cost_snapshot: 26.0, total_cost: 780 },
      { id: 'ri24', recipe_id: 'rec2', ingredient_id: 'i10', ingredient_name: 'Hogao casero colombiano', quantity: 35, unit: 'g', unit_cost_snapshot: 12.0, total_cost: 420 },
      { id: 'ri25', recipe_id: 'rec2', ingredient_id: 'i11', ingredient_name: 'Plátano maduro en cubos', quantity: 50, unit: 'g', unit_cost_snapshot: 6.5, total_cost: 325 },
    ],
    total_ingredient_cost: 7125,
    total_cost: 9425,
    sale_price: 17900,
    food_cost_percentage: 39.80,
    gross_margin_percentage: 60.20,
  },
  {
    id: 'rec3',
    product_id: 'p3',
    product_name: 'La Tropical',
    yield_portions: 1,
    packaging_cost: 1100,
    labor_variable_cost: 1200,
    preparation_notes: 'Contraste dulce y salado. Piña oro miel a la plancha, carne 150g, mozzarella fundido, tocineta y salsa de mango picante.',
    items: [
      { id: 'ri31', recipe_id: 'rec3', ingredient_id: 'i1', ingredient_name: 'Carne de res seleccionada', quantity: 150, unit: 'g', unit_cost_snapshot: 28.0, total_cost: 4200 },
      { id: 'ri32', recipe_id: 'rec3', ingredient_id: 'i2', ingredient_name: 'Pan brioche artesanal', quantity: 1, unit: 'un', unit_cost_snapshot: 1400.0, total_cost: 1400 },
      { id: 'ri33', recipe_id: 'rec3', ingredient_id: 'i4', ingredient_name: 'Queso Mozzarella bloque', quantity: 30, unit: 'g', unit_cost_snapshot: 26.0, total_cost: 780 },
      { id: 'ri34', recipe_id: 'rec3', ingredient_id: 'i16', ingredient_name: 'Piña oro miel asada', quantity: 50, unit: 'g', unit_cost_snapshot: 8.0, total_cost: 400 },
      { id: 'ri35', recipe_id: 'rec3', ingredient_id: 'i5', ingredient_name: 'Tocineta ahumada laminada', quantity: 25, unit: 'g', unit_cost_snapshot: 35.0, total_cost: 875 },
      { id: 'ri36', recipe_id: 'rec3', ingredient_id: 'i12', ingredient_name: 'Cebolla caramelizada', quantity: 15, unit: 'g', unit_cost_snapshot: 14.0, total_cost: 210 },
      { id: 'ri37', recipe_id: 'rec3', ingredient_id: 'i17', ingredient_name: 'Salsa de mango picante', quantity: 25, unit: 'g', unit_cost_snapshot: 15.0, total_cost: 375 },
    ],
    total_ingredient_cost: 8240,
    total_cost: 10540,
    sale_price: 18900,
    food_cost_percentage: 43.60,
    gross_margin_percentage: 56.40,
  },
  {
    id: 'rec4',
    product_id: 'p4',
    product_name: 'El Callejero',
    yield_portions: 1,
    packaging_cost: 550,
    labor_variable_cost: 900,
    preparation_notes: 'Salchicha parrillera dorada, pan vaporizado, mozzarella gratinada, maíz dulce, papitas ripiao crocantes y salsas de autor.',
    items: [
      { id: 'ri41', recipe_id: 'rec4', ingredient_id: 'i6', ingredient_name: 'Pan de perro 22cm', quantity: 1, unit: 'un', unit_cost_snapshot: 1100.0, total_cost: 1100 },
      { id: 'ri42', recipe_id: 'rec4', ingredient_id: 'i7', ingredient_name: 'Salchicha parrillera 100g', quantity: 100, unit: 'g', unit_cost_snapshot: 22.0, total_cost: 2200 },
      { id: 'ri43', recipe_id: 'rec4', ingredient_id: 'i4', ingredient_name: 'Queso Mozzarella bloque', quantity: 25, unit: 'g', unit_cost_snapshot: 26.0, total_cost: 650 },
      { id: 'ri44', recipe_id: 'rec4', ingredient_id: 'i5', ingredient_name: 'Tocineta ahumada laminada', quantity: 20, unit: 'g', unit_cost_snapshot: 35.0, total_cost: 700 },
      { id: 'ri45', recipe_id: 'rec4', ingredient_id: 'i18', ingredient_name: 'Maíz dulce tierno', quantity: 20, unit: 'g', unit_cost_snapshot: 10.0, total_cost: 200 },
      { id: 'ri46', recipe_id: 'rec4', ingredient_id: 'i19', ingredient_name: 'Papitas ripiao crocantes', quantity: 15, unit: 'g', unit_cost_snapshot: 12.0, total_cost: 180 },
      { id: 'ri47', recipe_id: 'rec4', ingredient_id: 'i20', ingredient_name: 'Salsa de piña caramelizada', quantity: 20, unit: 'g', unit_cost_snapshot: 11.0, total_cost: 220 },
      { id: 'ri48', recipe_id: 'rec4', ingredient_id: 'i14', ingredient_name: 'Salsa Ahumada BEFFGER', quantity: 20, unit: 'g', unit_cost_snapshot: 16.0, total_cost: 320 },
    ],
    total_ingredient_cost: 5570,
    total_cost: 7020,
    sale_price: 15900,
    food_cost_percentage: 35.03,
    gross_margin_percentage: 64.97,
  },
  {
    id: 'rec5',
    product_id: 'p5',
    product_name: 'El Ranchero',
    yield_portions: 1,
    packaging_cost: 550,
    labor_variable_cost: 900,
    preparation_notes: 'Parrillero tradicional. Salchicha 100g, chorizo parrillero dorado en rodajas, cheddar fundido, jalapeños y salsa ajo cilantro.',
    items: [
      { id: 'ri51', recipe_id: 'rec5', ingredient_id: 'i6', ingredient_name: 'Pan de perro 22cm', quantity: 1, unit: 'un', unit_cost_snapshot: 1100.0, total_cost: 1100 },
      { id: 'ri52', recipe_id: 'rec5', ingredient_id: 'i7', ingredient_name: 'Salchicha parrillera 100g', quantity: 100, unit: 'g', unit_cost_snapshot: 22.0, total_cost: 2200 },
      { id: 'ri53', recipe_id: 'rec5', ingredient_id: 'i8', ingredient_name: 'Chorizo parrillero artesanal', quantity: 30, unit: 'g', unit_cost_snapshot: 25.0, total_cost: 750 },
      { id: 'ri54', recipe_id: 'rec5', ingredient_id: 'i3', ingredient_name: 'Queso Cheddar lonchas', quantity: 30, unit: 'g', unit_cost_snapshot: 32.0, total_cost: 960 },
      { id: 'ri55', recipe_id: 'rec5', ingredient_id: 'i12', ingredient_name: 'Cebolla caramelizada', quantity: 15, unit: 'g', unit_cost_snapshot: 14.0, total_cost: 210 },
      { id: 'ri56', recipe_id: 'rec5', ingredient_id: 'i21', ingredient_name: 'Jalapeños encurtidos rodajas', quantity: 10, unit: 'g', unit_cost_snapshot: 18.0, total_cost: 180 },
      { id: 'ri57', recipe_id: 'rec5', ingredient_id: 'i22', ingredient_name: 'Salsa de ajo y cilantro', quantity: 15, unit: 'g', unit_cost_snapshot: 13.0, total_cost: 195 },
    ],
    total_ingredient_cost: 5595,
    total_cost: 7045,
    sale_price: 16900,
    food_cost_percentage: 33.10,
    gross_margin_percentage: 66.90,
  },
  {
    id: 'rec6',
    product_id: 'p6',
    product_name: 'El Ahumado',
    yield_portions: 1,
    packaging_cost: 550,
    labor_variable_cost: 900,
    preparation_notes: 'Toque ahumado profundo. Salchicha 100g, cheddar, tocineta ahumada, cebolla caramelizada, BBQ artesanal de panela y cebolla crispy.',
    items: [
      { id: 'ri61', recipe_id: 'rec6', ingredient_id: 'i6', ingredient_name: 'Pan de perro 22cm', quantity: 1, unit: 'un', unit_cost_snapshot: 1100.0, total_cost: 1100 },
      { id: 'ri62', recipe_id: 'rec6', ingredient_id: 'i7', ingredient_name: 'Salchicha parrillera 100g', quantity: 100, unit: 'g', unit_cost_snapshot: 22.0, total_cost: 2200 },
      { id: 'ri63', recipe_id: 'rec6', ingredient_id: 'i3', ingredient_name: 'Queso Cheddar lonchas', quantity: 25, unit: 'g', unit_cost_snapshot: 32.0, total_cost: 800 },
      { id: 'ri64', recipe_id: 'rec6', ingredient_id: 'i5', ingredient_name: 'Tocineta ahumada laminada', quantity: 20, unit: 'g', unit_cost_snapshot: 35.0, total_cost: 700 },
      { id: 'ri65', recipe_id: 'rec6', ingredient_id: 'i12', ingredient_name: 'Cebolla caramelizada', quantity: 30, unit: 'g', unit_cost_snapshot: 14.0, total_cost: 420 },
      { id: 'ri66', recipe_id: 'rec6', ingredient_id: 'i23', ingredient_name: 'Salsa BBQ de panela', quantity: 25, unit: 'g', unit_cost_snapshot: 14.0, total_cost: 350 },
      { id: 'ri67', recipe_id: 'rec6', ingredient_id: 'i24', ingredient_name: 'Cebolla crispy crocante', quantity: 10, unit: 'g', unit_cost_snapshot: 22.0, total_cost: 220 },
    ],
    total_ingredient_cost: 5790,
    total_cost: 7240,
    sale_price: 15900,
    food_cost_percentage: 36.41,
    gross_margin_percentage: 63.59,
  },
  {
    id: 'rec7',
    product_id: 'p7',
    product_name: 'La Colombiana (30 cm)',
    yield_portions: 1,
    packaging_cost: 1450,
    labor_variable_cost: 1500,
    preparation_notes: 'Pizza horneada a la piedra a 320°C por 7 min. Base pomodoro, mozzarella abundante, chorizo parrillero, hogao casero y plátano maduro.',
    items: [
      { id: 'ri71', recipe_id: 'rec7', ingredient_id: 'i9', ingredient_name: 'Masa de pizza 30cm (220g)', quantity: 220, unit: 'g', unit_cost_snapshot: 8.5, total_cost: 1870 },
      { id: 'ri72', recipe_id: 'rec7', ingredient_id: 'i26', ingredient_name: 'Salsa pomodoro base pizza', quantity: 60, unit: 'g', unit_cost_snapshot: 9.0, total_cost: 540 },
      { id: 'ri73', recipe_id: 'rec7', ingredient_id: 'i4', ingredient_name: 'Queso Mozzarella bloque', quantity: 130, unit: 'g', unit_cost_snapshot: 26.0, total_cost: 3380 },
      { id: 'ri74', recipe_id: 'rec7', ingredient_id: 'i8', ingredient_name: 'Chorizo parrillero artesanal', quantity: 50, unit: 'g', unit_cost_snapshot: 25.0, total_cost: 1250 },
      { id: 'ri75', recipe_id: 'rec7', ingredient_id: 'i10', ingredient_name: 'Hogao casero colombiano', quantity: 35, unit: 'g', unit_cost_snapshot: 12.0, total_cost: 420 },
      { id: 'ri76', recipe_id: 'rec7', ingredient_id: 'i11', ingredient_name: 'Plátano maduro en cubos', quantity: 40, unit: 'g', unit_cost_snapshot: 6.5, total_cost: 260 },
    ],
    total_ingredient_cost: 7720,
    total_cost: 10670,
    sale_price: 26900,
    food_cost_percentage: 28.69,
    gross_margin_percentage: 60.34,
  },
  {
    id: 'rec8',
    product_id: 'p8',
    product_name: 'La BBQ Explosiva (30 cm)',
    yield_portions: 1,
    packaging_cost: 1450,
    labor_variable_cost: 1500,
    preparation_notes: 'Masa piedra 30cm, pomodoro suave, mozzarella 130g, pechuga desmechada jugosa, tocineta ahumada, cebolla caramelizada y BBQ artesanal.',
    items: [
      { id: 'ri81', recipe_id: 'rec8', ingredient_id: 'i9', ingredient_name: 'Masa de pizza 30cm (220g)', quantity: 220, unit: 'g', unit_cost_snapshot: 8.5, total_cost: 1870 },
      { id: 'ri82', recipe_id: 'rec8', ingredient_id: 'i26', ingredient_name: 'Salsa pomodoro base pizza', quantity: 35, unit: 'g', unit_cost_snapshot: 9.0, total_cost: 315 },
      { id: 'ri83', recipe_id: 'rec8', ingredient_id: 'i4', ingredient_name: 'Queso Mozzarella bloque', quantity: 130, unit: 'g', unit_cost_snapshot: 26.0, total_cost: 3380 },
      { id: 'ri84', recipe_id: 'rec8', ingredient_id: 'i27', ingredient_name: 'Pollo desmechado marinado', quantity: 80, unit: 'g', unit_cost_snapshot: 20.0, total_cost: 1600 },
      { id: 'ri85', recipe_id: 'rec8', ingredient_id: 'i5', ingredient_name: 'Tocineta ahumada laminada', quantity: 25, unit: 'g', unit_cost_snapshot: 35.0, total_cost: 875 },
      { id: 'ri86', recipe_id: 'rec8', ingredient_id: 'i12', ingredient_name: 'Cebolla caramelizada', quantity: 30, unit: 'g', unit_cost_snapshot: 14.0, total_cost: 420 },
      { id: 'ri87', recipe_id: 'rec8', ingredient_id: 'i23', ingredient_name: 'Salsa BBQ de panela', quantity: 25, unit: 'g', unit_cost_snapshot: 14.0, total_cost: 350 },
    ],
    total_ingredient_cost: 8810,
    total_cost: 11760,
    sale_price: 27900,
    food_cost_percentage: 31.57,
    gross_margin_percentage: 57.85,
  },
  {
    id: 'rec9',
    product_id: 'p9',
    product_name: 'La Tropical Picante (30 cm)',
    yield_portions: 1,
    packaging_cost: 1450,
    labor_variable_cost: 1500,
    preparation_notes: 'Fusión caribeña gourmet. Masa piedra, pomodoro, mozzarella, jamón artesanal, piña asada, jalapeños encurtidos y salsa de mango picante.',
    items: [
      { id: 'ri91', recipe_id: 'rec9', ingredient_id: 'i9', ingredient_name: 'Masa de pizza 30cm (220g)', quantity: 220, unit: 'g', unit_cost_snapshot: 8.5, total_cost: 1870 },
      { id: 'ri92', recipe_id: 'rec9', ingredient_id: 'i26', ingredient_name: 'Salsa pomodoro base pizza', quantity: 60, unit: 'g', unit_cost_snapshot: 9.0, total_cost: 540 },
      { id: 'ri93', recipe_id: 'rec9', ingredient_id: 'i4', ingredient_name: 'Queso Mozzarella bloque', quantity: 130, unit: 'g', unit_cost_snapshot: 26.0, total_cost: 3380 },
      { id: 'ri94', recipe_id: 'rec9', ingredient_id: 'i28', ingredient_name: 'Jamón artesanal estándar', quantity: 60, unit: 'g', unit_cost_snapshot: 18.0, total_cost: 1080 },
      { id: 'ri95', recipe_id: 'rec9', ingredient_id: 'i16', ingredient_name: 'Piña oro miel asada', quantity: 60, unit: 'g', unit_cost_snapshot: 8.0, total_cost: 480 },
      { id: 'ri96', recipe_id: 'rec9', ingredient_id: 'i21', ingredient_name: 'Jalapeños encurtidos rodajas', quantity: 10, unit: 'g', unit_cost_snapshot: 18.0, total_cost: 180 },
      { id: 'ri97', recipe_id: 'rec9', ingredient_id: 'i17', ingredient_name: 'Salsa de mango picante', quantity: 15, unit: 'g', unit_cost_snapshot: 15.0, total_cost: 225 },
    ],
    total_ingredient_cost: 7755,
    total_cost: 10705,
    sale_price: 26900,
    food_cost_percentage: 28.82,
    gross_margin_percentage: 60.21,
  },
  {
    id: 'rec10',
    product_id: 'p10',
    product_name: 'Papas Rústicas a la Francesa',
    yield_portions: 1,
    packaging_cost: 450,
    labor_variable_cost: 500,
    preparation_notes: 'Fritura doble en aceite vegetal a 180°C hasta obtener dorado y crocancia exterior. Escurrir, sazonar con sal marina y servir con Salsa Ahumada.',
    items: [
      { id: 'ri101', recipe_id: 'rec10', ingredient_id: 'i30', ingredient_name: 'Papa rústica bastón', quantity: 200, unit: 'g', unit_cost_snapshot: 7.0, total_cost: 1400 },
      { id: 'ri102', recipe_id: 'rec10', ingredient_id: 'i31', ingredient_name: 'Aceite vegetal para fritura', quantity: 30, unit: 'g', unit_cost_snapshot: 9.5, total_cost: 285 },
      { id: 'ri103', recipe_id: 'rec10', ingredient_id: 'i14', ingredient_name: 'Salsa Ahumada BEFFGER', quantity: 30, unit: 'g', unit_cost_snapshot: 16.0, total_cost: 480 },
      { id: 'ri104', recipe_id: 'rec10', ingredient_id: 'i10', ingredient_name: 'Hogao casero colombiano', quantity: 5, unit: 'g', unit_cost_snapshot: 12.0, total_cost: 60 },
    ],
    total_ingredient_cost: 2225,
    total_cost: 3175,
    sale_price: 8900,
    food_cost_percentage: 25.00,
    gross_margin_percentage: 64.33,
  },
  {
    id: 'rec11',
    product_id: 'p11',
    product_name: 'Papas Criollas Rústicas',
    yield_portions: 1,
    packaging_cost: 450,
    labor_variable_cost: 600,
    preparation_notes: 'Vaporizado breve y fritura en aceite a 190°C hasta que la piel quede crujiente y el centro tierno. Sazonar con sal marina y servir con salsa de la casa.',
    items: [
      { id: 'ri111', recipe_id: 'rec11', ingredient_id: 'i33', ingredient_name: 'Papa criolla seleccionada', quantity: 220, unit: 'g', unit_cost_snapshot: 8.0, total_cost: 1760 },
      { id: 'ri112', recipe_id: 'rec11', ingredient_id: 'i31', ingredient_name: 'Aceite vegetal para fritura', quantity: 30, unit: 'g', unit_cost_snapshot: 9.5, total_cost: 285 },
      { id: 'ri113', recipe_id: 'rec11', ingredient_id: 'i14', ingredient_name: 'Salsa Ahumada BEFFGER', quantity: 30, unit: 'g', unit_cost_snapshot: 16.0, total_cost: 480 },
      { id: 'ri114', recipe_id: 'rec11', ingredient_id: 'i10', ingredient_name: 'Hogao casero colombiano', quantity: 5, unit: 'g', unit_cost_snapshot: 12.0, total_cost: 60 },
    ],
    total_ingredient_cost: 2585,
    total_cost: 3635,
    sale_price: 9900,
    food_cost_percentage: 26.11,
    gross_margin_percentage: 63.28,
  },
  {
    id: 'rec12',
    product_id: 'p12',
    product_name: 'Patacones o Tostones Crocantes',
    yield_portions: 1,
    packaging_cost: 450,
    labor_variable_cost: 600,
    preparation_notes: 'Doble fritura de plátano verde con prensado rústico. Textura extra crujiente con dip generoso de hogao casero tradicional.',
    items: [
      { id: 'ri121', recipe_id: 'rec12', ingredient_id: 'i34', ingredient_name: 'Plátano verde para patacón', quantity: 200, unit: 'g', unit_cost_snapshot: 6.0, total_cost: 1200 },
      { id: 'ri122', recipe_id: 'rec12', ingredient_id: 'i31', ingredient_name: 'Aceite vegetal para fritura', quantity: 35, unit: 'g', unit_cost_snapshot: 9.5, total_cost: 332 },
      { id: 'ri123', recipe_id: 'rec12', ingredient_id: 'i10', ingredient_name: 'Hogao casero colombiano', quantity: 40, unit: 'g', unit_cost_snapshot: 12.0, total_cost: 480 },
    ],
    total_ingredient_cost: 2012,
    total_cost: 3062,
    sale_price: 8900,
    food_cost_percentage: 22.61,
    gross_margin_percentage: 65.60,
  },
  {
    id: 'rec13',
    product_id: 'p13',
    product_name: 'Aros de Cebolla Crocantes',
    yield_portions: 1,
    packaging_cost: 450,
    labor_variable_cost: 600,
    preparation_notes: 'Aros de cebolla gruesos con rebozado en panko crujiente. Fritura dorada a 180°C y acompañados de salsa BBQ de panela.',
    items: [
      { id: 'ri131', recipe_id: 'rec13', ingredient_id: 'i35', ingredient_name: 'Cebolla blanca para aros', quantity: 160, unit: 'g', unit_cost_snapshot: 5.5, total_cost: 880 },
      { id: 'ri132', recipe_id: 'rec13', ingredient_id: 'i36', ingredient_name: 'Mezcla panko rebozado', quantity: 60, unit: 'g', unit_cost_snapshot: 11.0, total_cost: 660 },
      { id: 'ri133', recipe_id: 'rec13', ingredient_id: 'i31', ingredient_name: 'Aceite vegetal para fritura', quantity: 30, unit: 'g', unit_cost_snapshot: 9.5, total_cost: 285 },
      { id: 'ri134', recipe_id: 'rec13', ingredient_id: 'i23', ingredient_name: 'Salsa BBQ de panela', quantity: 30, unit: 'g', unit_cost_snapshot: 14.0, total_cost: 420 },
    ],
    total_ingredient_cost: 2245,
    total_cost: 3295,
    sale_price: 10900,
    food_cost_percentage: 20.60,
    gross_margin_percentage: 69.77,
  },
  {
    id: 'rec14',
    product_id: 'p14',
    product_name: 'Yuca Frita Dorada',
    yield_portions: 1,
    packaging_cost: 450,
    labor_variable_cost: 600,
    preparation_notes: 'Yuca hervida con sal y cortada en bastones rústicos. Frita hasta obtener corteza dorada y centro blanco tierno. Servida con salsa de ajo y cilantro.',
    items: [
      { id: 'ri141', recipe_id: 'rec14', ingredient_id: 'i37', ingredient_name: 'Yuca fresca seleccionada', quantity: 220, unit: 'g', unit_cost_snapshot: 7.5, total_cost: 1650 },
      { id: 'ri142', recipe_id: 'rec14', ingredient_id: 'i31', ingredient_name: 'Aceite vegetal para fritura', quantity: 30, unit: 'g', unit_cost_snapshot: 9.5, total_cost: 285 },
      { id: 'ri143', recipe_id: 'rec14', ingredient_id: 'i22', ingredient_name: 'Salsa de ajo y cilantro', quantity: 30, unit: 'g', unit_cost_snapshot: 13.0, total_cost: 390 },
    ],
    total_ingredient_cost: 2325,
    total_cost: 3375,
    sale_price: 8900,
    food_cost_percentage: 26.12,
    gross_margin_percentage: 62.08,
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

// Initial Settings (Production ready: customizable address & city)
export const INITIAL_SETTINGS: BusinessSettings = {
  restaurant_name: 'BEFFGER',
  slogan: 'LA CALLE TIENE SABOR',
  phone: '+57 300 000 0000',
  address: 'Sede Principal (Dirección por configurar)',
  city: 'Ciudad por configurar',
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
        if (savedProducts) {
          try {
            const parsedProd = JSON.parse(savedProducts);
            if (Array.isArray(parsedProd) && parsedProd.some((p: any) => p.id === 'p11')) {
              this.products = parsedProd;
            } else {
              this.products = INITIAL_PRODUCTS;
              localStorage.setItem('beffger_products', JSON.stringify(INITIAL_PRODUCTS));
            }
          } catch (e) {
            this.products = INITIAL_PRODUCTS;
          }
        }

        const savedSettings = localStorage.getItem('beffger_settings');
        if (savedSettings) {
          const parsedSet = JSON.parse(savedSettings);
          if (parsedSet.city?.includes('Cali') || parsedSet.address?.includes('Parque del Perro')) {
            localStorage.removeItem('beffger_settings');
            this.settings = INITIAL_SETTINGS;
          } else {
            this.settings = { ...INITIAL_SETTINGS, ...parsedSet };
          }
        }

        const savedZones = localStorage.getItem('beffger_delivery_zones');
        if (savedZones) {
          const parsedZones = JSON.parse(savedZones);
          if (Array.isArray(parsedZones) && parsedZones.some((z: any) => z.name?.includes('San Fernando') || z.name?.includes('Granada'))) {
            localStorage.removeItem('beffger_delivery_zones');
            this.deliveryZones = INITIAL_DELIVERY_ZONES;
          } else {
            this.deliveryZones = parsedZones;
          }
        }
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

  public updateSettings(partial: Partial<BusinessSettings>): void {
    this.settings = { ...this.settings, ...partial };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('beffger_settings', JSON.stringify(this.settings));
      } catch (e) {}
    }
    this.notify();
  }

  // --- Delivery Zones Management ---
  public getDeliveryZones(): DeliveryZone[] {
    return this.deliveryZones;
  }

  public addDeliveryZone(zone: Omit<DeliveryZone, 'id'>): DeliveryZone {
    const newZone: DeliveryZone = {
      ...zone,
      id: `dz-${Date.now().toString(36)}`,
    };
    this.deliveryZones.push(newZone);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('beffger_delivery_zones', JSON.stringify(this.deliveryZones));
      } catch (e) {}
    }
    this.notify();
    return newZone;
  }

  public updateDeliveryZone(id: string, partial: Partial<DeliveryZone>): void {
    this.deliveryZones = this.deliveryZones.map((z) => (z.id === id ? { ...z, ...partial } : z));
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('beffger_delivery_zones', JSON.stringify(this.deliveryZones));
      } catch (e) {}
    }
    this.notify();
  }

  public deleteDeliveryZone(id: string): void {
    this.deliveryZones = this.deliveryZones.filter((z) => z.id !== id);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('beffger_delivery_zones', JSON.stringify(this.deliveryZones));
      } catch (e) {}
    }
    this.notify();
  }
}

// Global Singleton Store Instance
export const store = new BeffgerStore();
