-- ============================================================================
-- BEFFGER DIGITAL RESTAURANT ECOSYSTEM — SEED DATA
-- Official Seed Script: supabase/seed.sql
-- ============================================================================

-- 1. BUSINESS SETTINGS
INSERT INTO business_settings (
    id, restaurant_name, slogan, phone, address, city, tax_rate, is_open, currency, timezone, wompi_sandbox_mode
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'BEFFGER',
    'LA CALLE TIENE SABOR',
    '+57 300 000 0000',
    'Sede Principal (Dirección por configurar)',
    'Ciudad por configurar',
    0.08,
    TRUE,
    'COP',
    'America/Bogota',
    TRUE
) ON CONFLICT (id) DO NOTHING;

-- 2. USERS / PROFILES
INSERT INTO profiles (id, email, full_name, role, phone) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@beffger.com', 'Super Administrador BEFFGER', 'admin', '+573000000000')
ON CONFLICT (id) DO NOTHING;

-- 3. CATEGORIES
INSERT INTO categories (id, name, slug, description, icon_url, display_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'Hamburguesas Gourmet', 'hamburguesas-gourmet', '150g de carne de res seleccionada, pan brioche artesanal e ingredientes generosos.', '/icons/categories/hamburguesa.svg', 1),
('c2000000-0000-0000-0000-000000000002', 'Perros Gourmet', 'perros-gourmet', 'Salchicha premium de 100g, pan suave de 22cm y toppings urbanos cargados.', '/icons/categories/perro-caliente.svg', 2),
('c3000000-0000-0000-0000-000000000003', 'Pizzas Gourmet', 'pizzas-gourmet', 'Pizzas artesanales de 30 cm horneadas a la piedra con combinaciones exclusivas.', '/icons/categories/pizza.svg', 3),
('c4000000-0000-0000-0000-000000000004', 'Complementos', 'complementos', 'Papas rústicas doradas, aros crocantes y salsas especiales.', '/icons/categories/papas.svg', 4),
('c5000000-0000-0000-0000-000000000005', 'Bebidas', 'bebidas', 'Refrescos fríos, limonadas naturales y cervezas artesanales.', '/icons/categories/bebidas.svg', 5)
ON CONFLICT (id) DO NOTHING;

-- 4. KITCHEN STATIONS
INSERT INTO kitchen_stations (id, name, slug) VALUES
('ks100000-0000-0000-0000-000000000001', 'Estación Hamburguesas', 'hamburguesas'),
('ks200000-0000-0000-0000-000000000002', 'Estación Perros', 'perros'),
('ks300000-0000-0000-0000-000000000003', 'Estación Pizzas', 'pizzas'),
('ks400000-0000-0000-0000-000000000004', 'Estación Complementos', 'complementos')
ON CONFLICT (id) DO NOTHING;

-- 5. DELIVERY ZONES
INSERT INTO delivery_zones (id, name, delivery_fee, min_order_amount, estimated_time_minutes) VALUES
('dz100000-0000-0000-0000-000000000001', 'Zona 1: Cobertura Cercana (1 - 3 km)', 4000.00, 20000.00, 25),
('dz200000-0000-0000-0000-000000000002', 'Zona 2: Cobertura Media (3 - 6 km)', 5500.00, 25000.00, 35),
('dz300000-0000-0000-0000-000000000003', 'Zona 3: Cobertura Extendida (6 - 10 km)', 8000.00, 35000.00, 45)
ON CONFLICT (id) DO NOTHING;

-- 6. PRODUCTS (The 9 Gourmet Specialties + Complementos)
INSERT INTO products (
    id, category_id, name, slug, description, short_description, price, preparation_time_minutes, is_available, is_gourmet, image_url, allergens, badge, display_order
) VALUES
-- Hamburguesas
(
    'p1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'La Brutal',
    'la-brutal',
    'Hamburguesa insignia BEFFGER: Pan brioche dorado de 100g, carne jugosa de 150g, queso cheddar fundido de 25g, 2 tiras de tocineta crocante de 25g, cebolla caramelizada artesanal de 30g, pepinillos encurtidos de 15g y salsa ahumada de la casa de 25g.',
    'Carne 150g, cheddar, doble tocineta, cebolla caramelizada, pepinillos y salsa ahumada.',
    19900.00,
    15,
    TRUE,
    TRUE,
    '/images/products/hamburguesas/la-brutal.jpg',
    ARRAY['Gluten', 'Lácteos'],
    '¡INSIGNIA!',
    1
),
(
    'p1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000001',
    'La Criolla',
    'la-criolla',
    'Inspiración colombiana urbana: Pan brioche, carne de 150g, queso mozzarella fundido de 30g, hogao tradicional espeso de 35g, tajadas de plátano maduro frito dorado de 50g, cebolla crocante de 10g y salsa de ajo y cilantro de 20g.',
    'Carne 150g, mozzarella, hogao tradicional, plátano maduro caramelizado y salsa ajo-cilantro.',
    17900.00,
    15,
    TRUE,
    TRUE,
    '/images/products/hamburguesas/la-criolla.jpg',
    ARRAY['Gluten', 'Lácteos'],
    'FAVORITA',
    2
),
(
    'p1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000001',
    'La Tropical',
    'la-tropical',
    'Contraste dulce, salado y picante: Pan brioche, carne de res de 150g, mozzarella fundida de 30g, rodaja generosa de piña a la plancha de 50g, tocineta crocante de 25g, cebolla morada fresca de 15g y salsa de mango picante de 25g.',
    'Carne 150g, mozzarella, piña asada, tocineta, cebolla morada y salsa de mango picante.',
    18900.00,
    15,
    TRUE,
    TRUE,
    '/images/products/hamburguesas/la-tropical.jpg',
    ARRAY['Gluten', 'Lácteos'],
    'TROPICAL HEAT',
    3
),

-- Perros Calientes
(
    'p2000000-0000-0000-0000-000000000001',
    'c2000000-0000-0000-0000-000000000002',
    'El Callejero',
    'el-callejero',
    'El rey de la calle: Pan artesanal de 22 cm, salchicha premium dorada de 100g, mozzarella fundida envolvente de 25g, tocineta picada de 20g, maíz dulce tierno de 20g, papitas crocantes ripiao de 15g, salsa de piña de 20g y salsa ahumada de 20g.',
    'Pan 22cm, salchicha 100g, mozzarella, tocineta, maíz dulce, papitas ripiao y salsa de piña.',
    15900.00,
    12,
    TRUE,
    TRUE,
    '/images/products/perros/el-callejero.jpg',
    ARRAY['Gluten', 'Lácteos'],
    'CALLEJERO PURO',
    4
),
(
    'p2000000-0000-0000-0000-000000000002',
    'c2000000-0000-0000-0000-000000000002',
    'El Ranchero',
    'el-ranchero',
    'Perfil parrillero e intenso: Pan de perro, salchicha premium de 100g, chorizo artesanal dorado de 30g, salsa de queso cheddar derretido de 30g, cebolla morada de 15g, rodajas de jalapeño de 10g y salsa de ajo y cilantro de 15g.',
    'Salchicha 100g, chorizo parrillero, queso cheddar derretido, jalapeños y cebolla morada.',
    16900.00,
    12,
    TRUE,
    TRUE,
    '/images/products/perros/el-ranchero.jpg',
    ARRAY['Gluten', 'Lácteos'],
    'PICANTE SUAVE',
    5
),
(
    'p2000000-0000-0000-0000-000000000003',
    'c2000000-0000-0000-0000-000000000002',
    'El Ahumado',
    'el-ahumado',
    'Dulzura y humo parrillero: Pan de perro, salchicha premium de 100g, queso cheddar fundido de 25g, tocineta de 20g, cebolla caramelizada de 30g, BBQ artesanal con panela de 25g y lluvia de cebolla crocante de 10g.',
    'Salchicha 100g, cheddar, tocineta, cebolla caramelizada, salsa BBQ de panela y cebolla crispy.',
    15900.00,
    12,
    TRUE,
    TRUE,
    '/images/products/perros/el-ahumado.jpg',
    ARRAY['Gluten', 'Lácteos'],
    'AHUMADO BBQ',
    6
),

-- Pizzas Gourmet 30cm
(
    'p3000000-0000-0000-0000-000000000001',
    'c3000000-0000-0000-0000-000000000003',
    'La Colombiana (30 cm)',
    'la-colombiana',
    'Pizza artesanal horneada a la piedra: Masa de 220g, salsa de tomate de 60g, mozzarella fundido de 130g, rodajas de chorizo parrillero de 50g, hogao tradicional de 35g, cubitos de plátano maduro frito de 40g y toque de cilantro fresco de 3g.',
    'Masa piedra 30cm, mozzarella 130g, chorizo parrillero, hogao casero, plátano maduro y cilantro.',
    26900.00,
    20,
    TRUE,
    TRUE,
    '/images/products/pizzas/la-colombiana.jpg',
    ARRAY['Gluten', 'Lácteos'],
    'EDICIÓN PATRIA',
    7
),
(
    'p3000000-0000-0000-0000-000000000002',
    'c3000000-0000-0000-0000-000000000003',
    'La BBQ Explosiva (30 cm)',
    'la-bbq-explosiva',
    'Combinación ahumada potente: Masa de 220g, salsa de tomate de 35g, mozzarella de 130g, pollo jugoso desmechado de 80g, tocineta crocante de 25g, cebolla caramelizada de 30g y espiral de salsa BBQ de 25g.',
    'Masa piedra 30cm, mozzarella 130g, pollo desmechado, tocineta, cebolla caramelizada y BBQ.',
    27900.00,
    20,
    TRUE,
    TRUE,
    '/images/products/pizzas/bbq-explosiva.jpg',
    ARRAY['Gluten', 'Lácteos'],
    'EXPLOSIVA',
    8
),
(
    'p3000000-0000-0000-0000-000000000003',
    'c3000000-0000-0000-0000-000000000003',
    'La Tropical Picante (30 cm)',
    'la-tropical-picante',
    'Evolución gourmet de la hawaiana: Masa de 220g, salsa de tomate de 60g, mozzarella de 130g, jamón selecto de 60g, piña asada dorada de 60g, rodajas de jalapeños verdes de 10g e hilo de salsa de mango picante de 15g.',
    'Masa piedra 30cm, mozzarella 130g, jamón artesanal, piña asada, jalapeños y salsa mango picante.',
    26900.00,
    20,
    TRUE,
    TRUE,
    '/images/products/pizzas/tropical-picante.jpg',
    ARRAY['Gluten', 'Lácteos'],
    'FUSIÓN TROPICAL',
    9
),

-- Complementos
(
    'p4000000-0000-0000-0000-000000000001',
    'c4000000-0000-0000-0000-000000000004',
    'Papas Rústicas a la Francesa',
    'papas-rusticas',
    'Porción de 200g de papas rústicas cortadas en bastones, fritas al punto perfecto de crocancia, sazonadas con sal marina y toque de hierbas.',
    'Papas rústicas doradas y crujientes con sal marina.',
    8900.00,
    10,
    TRUE,
    FALSE,
    '/images/products/complementos/papas-francesa.jpg',
    ARRAY[]::TEXT[],
    'CRUJIENTES',
    10
),
(
    'p4000000-0000-0000-0000-000000000002',
    'c4000000-0000-0000-0000-000000000004',
    'Papas Criollas Rústicas',
    'papas-criollas',
    'Porción generosa de papas criollas andinas doradas a la perfección, crocantes por fuera y suaves por dentro, sazonadas con sal marina y finas hierbas.',
    'Papas criollas andinas doradas y crocantes con sal marina y finas hierbas.',
    9900.00,
    10,
    TRUE,
    FALSE,
    '/images/products/complementos/papas-criollas.jpg',
    ARRAY[]::TEXT[],
    'TÍPICO',
    11
),
(
    'p4000000-0000-0000-0000-000000000003',
    'c4000000-0000-0000-0000-000000000004',
    'Patacones o Tostones Crocantes',
    'patacones-tostones',
    'Plátano verde seleccionado dos veces frito hasta lograr una crocancia insuperable. Acompañados de hogao casero tradicional o salsa de la casa.',
    'Patacones de plátano verde crujientes con dip de hogao tradicional.',
    8900.00,
    12,
    TRUE,
    FALSE,
    '/images/products/complementos/patacones-tostones.jpg',
    ARRAY[]::TEXT[],
    'CRUNCH',
    12
),
(
    'p4000000-0000-0000-0000-000000000004',
    'c4000000-0000-0000-0000-000000000004',
    'Aros de Cebolla Crocantes',
    'aros-cebolla',
    'Aros de cebolla fresca cortados gruesos con rebozado artesanal dorado y extra crujiente, servidos con salsa BBQ de panela BEFFGER.',
    'Aros de cebolla rebozados y dorados con salsa BBQ de panela.',
    10900.00,
    10,
    TRUE,
    FALSE,
    '/images/products/complementos/aros-cebolla.jpg',
    ARRAY['Gluten'],
    'POPULAR',
    13
),
(
    'p4000000-0000-0000-0000-000000000005',
    'c4000000-0000-0000-0000-000000000004',
    'Yuca Frita Dorada',
    'yuca-frita',
    'Bastones gruesos de yuca seleccionada, crujientes y dorados en su exterior con corazón tierno y suave, espolvoreados con sal marina y dip de ajo y cilantro.',
    'Bastones de yuca crujientes con centro tierno y salsa de ajo y cilantro.',
    8900.00,
    12,
    TRUE,
    FALSE,
    '/images/products/complementos/yuca-frita.jpg',
    ARRAY[]::TEXT[],
    'CASERO',
    14
)
ON CONFLICT (id) DO NOTHING;

-- 7. MODIFIER GROUPS
INSERT INTO modifier_groups (id, name, description, min_selection, max_selection, is_required) VALUES
('mg100000-0000-0000-0000-000000000001', 'Término de la Carne', 'Selecciona el punto de cocción preferido para la carne de res.', 1, 1, TRUE),
('mg200000-0000-0000-0000-000000000002', 'Toppings y Extras', 'Agrega ingredientes adicionales a tu preparación.', 0, 4, FALSE),
('mg300000-0000-0000-0000-000000000003', 'Salsas Adicionales', 'Porciones extra de salsas emblemáticas de la casa.', 0, 3, FALSE),
('mg400000-0000-0000-0000-000000000004', 'Combo Acompañamiento', 'Convierte tu producto en combo con papas y bebida.', 0, 1, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Modifier Options
INSERT INTO modifier_options (id, modifier_group_id, name, price_adjustment, is_default, display_order) VALUES
-- Término de la carne
('mo110000-0000-0000-0000-000000000001', 'mg100000-0000-0000-0000-000000000001', 'Término Medio (Jugosa y tierna)', 0.00, FALSE, 1),
('mo120000-0000-0000-0000-000000000002', 'mg100000-0000-0000-0000-000000000001', 'Tres Cuartos (Recomendado del Chef)', 0.00, TRUE, 2),
('mo130000-0000-0000-0000-000000000003', 'mg100000-0000-0000-0000-000000000001', 'Bien Asada (Completamente cocida)', 0.00, FALSE, 3),

-- Extras
('mo210000-0000-0000-0000-000000000001', 'mg200000-0000-0000-0000-000000000002', 'Extra Tocineta Crocante (25g)', 4000.00, FALSE, 1),
('mo220000-0000-0000-0000-000000000002', 'mg200000-0000-0000-0000-000000000002', 'Extra Queso Cheddar Fundido', 3500.00, FALSE, 2),
('mo230000-0000-0000-0000-000000000003', 'mg200000-0000-0000-0000-000000000002', 'Extra Plátano Maduro Caramelizado', 2500.00, FALSE, 3),
('mo240000-0000-0000-0000-000000000004', 'mg200000-0000-0000-0000-000000000002', 'Carne Adicional 150g', 7500.00, FALSE, 4),

-- Salsas
('mo310000-0000-0000-0000-000000000001', 'mg300000-0000-0000-0000-000000000003', 'Dip Salsa Ahumada Casa', 2000.00, FALSE, 1),
('mo320000-0000-0000-0000-000000000002', 'mg300000-0000-0000-0000-000000000002', 'Dip Salsa Ajo y Cilantro', 2000.00, FALSE, 2),
('mo330000-0000-0000-0000-000000000003', 'mg300000-0000-0000-0000-000000000003', 'Dip Salsa Mango Picante', 2000.00, FALSE, 3),

-- Combos
('mo410000-0000-0000-0000-000000000001', 'mg400000-0000-0000-0000-000000000004', 'Hacer Combo (Papas Rústicas + Gaseosa 400ml)', 7900.00, FALSE, 1)
ON CONFLICT (id) DO NOTHING;

-- Relate products to modifier groups
INSERT INTO product_modifier_groups (product_id, modifier_group_id, display_order)
SELECT p.id, mg.id, 1
FROM products p, modifier_groups mg
WHERE p.category_id = 'c1000000-0000-0000-0000-000000000001' AND mg.name IN ('Término de la Carne', 'Toppings y Extras', 'Salsas Adicionales', 'Combo Acompañamiento')
ON CONFLICT DO NOTHING;

INSERT INTO product_modifier_groups (product_id, modifier_group_id, display_order)
SELECT p.id, mg.id, 1
FROM products p, modifier_groups mg
WHERE p.category_id = 'c2000000-0000-0000-0000-000000000002' AND mg.name IN ('Toppings y Extras', 'Salsas Adicionales', 'Combo Acompañamiento')
ON CONFLICT DO NOTHING;

INSERT INTO product_modifier_groups (product_id, modifier_group_id, display_order)
SELECT p.id, mg.id, 1
FROM products p, modifier_groups mg
WHERE p.category_id = 'c3000000-0000-0000-0000-000000000003' AND mg.name IN ('Toppings y Extras', 'Salsas Adicionales')
ON CONFLICT DO NOTHING;

-- 8. INGREDIENTS & STOCK
INSERT INTO ingredients (id, name, sku, unit, current_stock, minimum_stock, cost_per_unit, supplier) VALUES
('i0100000-0000-0000-0000-000000000001', 'Carne de res molida seleccionada', 'ING-CARN-01', 'g', 25000.00, 5000.00, 28.0000, 'Carnes del Valle'),
('i0200000-0000-0000-0000-000000000002', 'Pan brioche artesanal con ajonjolí', 'ING-PANB-01', 'un', 180.00, 30.00, 1400.0000, 'Panadería La Corona'),
('i0300000-0000-0000-0000-000000000003', 'Queso Cheddar lonchas', 'ING-CHED-01', 'g', 8000.00, 1500.00, 32.0000, 'Lácteos El Trébol'),
('i0400000-0000-0000-0000-000000000004', 'Queso Mozzarella bloque', 'ING-MOZZ-01', 'g', 18000.00, 3000.00, 26.0000, 'Lácteos El Trébol'),
('i0500000-0000-0000-0000-000000000005', 'Tocineta ahumada laminada', 'ING-TOCI-01', 'g', 9500.00, 2000.00, 35.0000, 'Embutidos Don Raúl'),
('i0600000-0000-0000-0000-000000000006', 'Pan de perro artesanal 22cm', 'ING-PANP-01', 'un', 120.00, 25.00, 1100.0000, 'Panadería La Corona'),
('i0700000-0000-0000-0000-000000000007', 'Salchicha parrillera premium 100g', 'ING-SALC-01', 'g', 15000.00, 3000.00, 22.0000, 'Embutidos Don Raúl'),
('i0800000-0000-0000-0000-000000000008', 'Chorizo parrillero artesanal', 'ING-CHOR-01', 'g', 7500.00, 1500.00, 25.0000, 'Embutidos Don Raúl'),
('i0900000-0000-0000-0000-000000000009', 'Pollo pechuga desmechada', 'ING-POLL-01', 'g', 10000.00, 2000.00, 18.0000, 'Avícola Santa Rita'),
('i1000000-0000-0000-0000-000000000010', 'Jamón seleccionado ahumado', 'ING-JAMN-01', 'g', 8000.00, 1500.00, 24.0000, 'Embutidos Don Raúl'),
('i1100000-0000-0000-0000-000000000011', 'Masa para pizza 30cm (220g)', 'ING-MASP-01', 'g', 15000.00, 3000.00, 8.5000, 'Producción Interna'),
('i1200000-0000-0000-0000-000000000012', 'Salsa de tomate pizzera base', 'ING-STOM-01', 'g', 12000.00, 2500.00, 9.0000, 'Salsas El Sabor'),
('i1300000-0000-0000-0000-000000000013', 'Hogao casero colombiano', 'ING-HOGA-01', 'g', 6000.00, 1000.00, 12.0000, 'Producción Interna'),
('i1400000-0000-0000-0000-000000000014', 'Plátano maduro en cubos', 'ING-PLAT-01', 'g', 10000.00, 2000.00, 6.5000, 'Central de Abastos'),
('i1500000-0000-0000-0000-000000000015', 'Piña oro miel en almíbar ligero', 'ING-PINA-01', 'g', 8500.00, 1500.00, 8.0000, 'Central de Abastos'),
('i1600000-0000-0000-0000-000000000016', 'Cebolla caramelizada', 'ING-CEBC-01', 'g', 5000.00, 1000.00, 14.0000, 'Producción Interna'),
('i1700000-0000-0000-0000-000000000017', 'Pepinillos agridulces', 'ING-PEPI-01', 'g', 3500.00, 800.00, 20.0000, 'Importaciones Gourmet'),
('i1800000-0000-0000-0000-000000000018', 'Jalapeños encurtidos rodajas', 'ING-JALA-01', 'g', 4000.00, 1000.00, 18.0000, 'Importaciones Gourmet'),
('i1900000-0000-0000-0000-000000000019', 'Maíz dulce grano', 'ING-MAIZ-01', 'g', 6000.00, 1200.00, 11.0000, 'Distribuidora del Sur'),
('i2000000-0000-0000-0000-000000000020', 'Papitas fosforito ripiao', 'ING-PAPF-01', 'g', 5000.00, 1000.00, 15.0000, 'Snacks del Valle'),
('i2100000-0000-0000-0000-000000000021', 'Salsa Ahumada BEFFGER', 'ING-SAHU-01', 'g', 8000.00, 1500.00, 16.0000, 'Producción Interna'),
('i2200000-0000-0000-0000-000000000022', 'Salsa Ajo y Cilantro', 'ING-SAJO-01', 'g', 7500.00, 1500.00, 15.0000, 'Producción Interna'),
('i2300000-0000-0000-0000-000000000023', 'Salsa Mango Picante', 'ING-SMAN-01', 'g', 6000.00, 1200.00, 17.0000, 'Producción Interna'),
('i2400000-0000-0000-0000-000000000024', 'Salsa BBQ con Panela', 'ING-SBBQ-01', 'g', 7000.00, 1400.00, 14.0000, 'Producción Interna'),
('i2500000-0000-0000-0000-000000000025', 'Papas bastón congeladas', 'ING-PAPA-01', 'g', 30000.00, 6000.00, 9.5000, 'Distribuidora del Sur'),
('i2600000-0000-0000-0000-000000000026', 'Caja ecológica hamburguesa', 'EMP-CAJH-01', 'un', 400.00, 80.00, 750.0000, 'Empaques del Pacífico'),
('i2700000-0000-0000-0000-000000000027', 'Caja térmica pizza 30cm', 'EMP-CAJP-01', 'un', 250.00, 50.00, 1200.0000, 'Empaques del Pacífico'),
('i2800000-0000-0000-0000-000000000028', 'Bolsa y servilletas delivery', 'EMP-BOLS-01', 'un', 600.00, 100.00, 350.0000, 'Empaques del Pacífico')
ON CONFLICT (id) DO NOTHING;

-- 9. RECIPES & TECHNICAL SHEETS (La Brutal escandallo)
INSERT INTO recipes (id, product_id, yield_portions, packaging_cost, labor_variable_cost, preparation_notes) VALUES
('r1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 1, 1100.00, 1200.00, 'Tostar el pan brioche 45s con mantequilla clarificada. Sellar carne 150g a 240°C por 3 min por lado. Fundir cheddar en salamandra.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO recipe_items (recipe_id, ingredient_id, quantity, unit, unit_cost_snapshot) VALUES
('r1000000-0000-0000-0000-000000000001', 'i0100000-0000-0000-0000-000000000001', 150.00, 'g', 28.0000), -- Carne 150g = $4.200
('r1000000-0000-0000-0000-000000000001', 'i0200000-0000-0000-0000-000000000002', 1.00, 'un', 1400.0000),  -- Pan brioche = $1.400
('r1000000-0000-0000-0000-000000000001', 'i0300000-0000-0000-0000-000000000003', 25.00, 'g', 32.0000),   -- Cheddar 25g = $800
('r1000000-0000-0000-0000-000000000001', 'i0500000-0000-0000-0000-000000000005', 25.00, 'g', 35.0000),   -- Tocineta 25g = $875
('r1000000-0000-0000-0000-000000000001', 'i1600000-0000-0000-0000-000000000016', 30.00, 'g', 14.0000),   -- Cebolla caram. 30g = $420
('r1000000-0000-0000-0000-000000000001', 'i1700000-0000-0000-0000-000000000017', 15.00, 'g', 20.0000),   -- Pepinillos 15g = $300
('r1000000-0000-0000-0000-000000000001', 'i2100000-0000-0000-0000-000000000021', 25.00, 'g', 16.0000),   -- Salsa Ahumada 25g = $400
('r1000000-0000-0000-0000-000000000001', 'i2600000-0000-0000-0000-000000000026', 1.00, 'un', 750.0000)   -- Empaque caja = $750
ON CONFLICT DO NOTHING;

-- 10. ACTIVE CASH REGISTER
INSERT INTO cash_registers (
    id, name, status, opened_at, initial_cash, expected_cash, opened_by, notes
) VALUES (
    'cr100000-0000-0000-0000-000000000001',
    'Caja Principal 01',
    'open',
    NOW() - INTERVAL '4 hours',
    200000.00,
    354700.00,
    '33333333-3333-3333-3333-333333333333',
    'Turno de almuerzo y tarde abierto con base de $200.000 COP'
) ON CONFLICT (id) DO NOTHING;

-- 11. SAMPLE ORDERS (Covering Kanban stages for real testing)
INSERT INTO orders (
    id, order_number, customer_name, customer_phone, customer_email, order_type, status,
    delivery_zone_id, delivery_address, delivery_instructions, delivery_fee,
    subtotal, discount, tip, total, payment_method, payment_status, created_at
) VALUES
(
    'o1000000-0000-0000-0000-000000000001',
    'BF-1001',
    'Andrés Gómez',
    '3184567890',
    'andres.gomez@gmail.com',
    'domicilio',
    'nuevo',
    'dz100000-0000-0000-0000-000000000001',
    'Calle 5 # 38-20, Apto 402',
    'Portería blanca, timbre 402',
    4000.00,
    39800.00,
    0.00,
    2000.00,
    45800.00,
    'efectivo',
    'pendiente',
    NOW() - INTERVAL '5 minutes'
),
(
    'o2000000-0000-0000-0000-000000000002',
    'BF-1002',
    'Mariana López',
    '3159988776',
    'mariana.lopez@hotmail.com',
    'domicilio',
    'en_preparacion',
    'dz200000-0000-0000-0000-000000000002',
    'Av. 9N # 14-25, Casa 3',
    'Conjunto Los Álamos, dejar en recepción',
    5000.00,
    26900.00,
    0.00,
    1500.00,
    33400.00,
    'wompi',
    'aprobado',
    NOW() - INTERVAL '18 minutes'
),
(
    'o3000000-0000-0000-0000-000000000003',
    'BF-1003',
    'Sebastián Caicedo',
    '3123456781',
    'sebas.c@gmail.com',
    'domicilio',
    'listo',
    'dz100000-0000-0000-0000-000000000001',
    'Cra. 32 # 6-12',
    'Tocar el timbre con fuerza',
    4000.00,
    33800.00,
    0.00,
    0.00,
    37800.00,
    'nequi',
    'aprobado',
    NOW() - INTERVAL '32 minutes'
),
(
    'o4000000-0000-0000-0000-000000000004',
    'BF-1004',
    'Felipe Riascos',
    '3176543210',
    'felipe.r@gmail.com',
    'mesa',
    'entregado',
    NULL,
    'Mesa 4',
    'Consumo en local',
    0.00,
    27900.00,
    0.00,
    2500.00,
    30400.00,
    'efectivo',
    'aprobado',
    NOW() - INTERVAL '65 minutes'
)
ON CONFLICT (id) DO NOTHING;

-- Order Items Snapshots
INSERT INTO order_items (
    id, order_id, product_id, product_name_snapshot, product_price_snapshot, product_image_snapshot, quantity, unit_price, total_price, notes
) VALUES
(
    'oi100000-0000-0000-0000-000000000001',
    'o1000000-0000-0000-0000-000000000001',
    'p1000000-0000-0000-0000-000000000001',
    'La Brutal',
    19900.00,
    '/images/products/hamburguesas/la-brutal.jpg',
    2,
    19900.00,
    39800.00,
    'Una término medio y una 3/4 bien cargada de salsa'
),
(
    'oi200000-0000-0000-0000-000000000001',
    'o2000000-0000-0000-0000-000000000002',
    'p3000000-0000-0000-0000-000000000001',
    'La Colombiana (30 cm)',
    26900.00,
    '/images/products/pizzas/la-colombiana.jpg',
    1,
    26900.00,
    26900.00,
    'Masa bien doradita por favor'
),
(
    'oi300000-0000-0000-0000-000000000001',
    'o3000000-0000-0000-0000-000000000003',
    'p2000000-0000-0000-0000-000000000002',
    'El Ranchero',
    16900.00,
    '/images/products/perros/el-ranchero.jpg',
    2,
    16900.00,
    33800.00,
    'Jalapeños extra picantes'
)
ON CONFLICT (id) DO NOTHING;

-- Order Status History
INSERT INTO order_status_history (order_id, previous_status, new_status, notes) VALUES
('o1000000-0000-0000-0000-000000000001', NULL, 'nuevo', 'Pedido ingresado desde marketplace online'),
('o2000000-0000-0000-0000-000000000002', 'nuevo', 'confirmado', 'Pago confirmado por pasarela Wompi'),
('o2000000-0000-0000-0000-000000000002', 'confirmado', 'en_preparacion', 'Comanda tomada en Estación Pizzas'),
('o3000000-0000-0000-0000-000000000003', 'en_preparacion', 'listo', 'Preparación finalizada y empacada')
ON CONFLICT DO NOTHING;
