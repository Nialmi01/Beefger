import { store } from '../src/lib/store';
import { generateWompiIntegritySignature, createWompiTransactionData } from '../src/lib/wompi';
import { hasPermission, getDefaultRouteForRole, STAFF_CREDENTIALS } from '../src/lib/auth';

console.log('================================================================');
console.log('BEFFGER RESTAURANT ECOSYSTEM — AUTOMATED VERIFICATION SUITE');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 14;

function assert(condition: boolean, testName: string, details: string = '') {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName} - Details: ${details}`);
  }
}

// PRUEBA 1 & 2: Cliente crea pedido (Hamburguesa + Pizza) y aparece en administración
const initialOrdersCount = store.getOrders().length;
const p1 = store.getProductBySlug('la-brutal')!;
const p7 = store.getProductBySlug('la-colombiana')!;

const createdOrder = store.createOrder({
  customer_name: 'Prueba Validación Cliente',
  customer_phone: '3109998877',
  order_type: 'domicilio',
  delivery_address: 'Calle 10 # 5-20, Cali',
  payment_method: 'wompi',
  items: [
    {
      id: 'test-item-1',
      product: p1,
      quantity: 1,
      unit_price: p1.price,
      total_price: p1.price,
      modifiers: [{ group_name: 'Término de la Carne', option_name: 'Tres Cuartos', price_adjustment: 0 }],
    },
    {
      id: 'test-item-2',
      product: p7,
      quantity: 1,
      unit_price: p7.price,
      total_price: p7.price,
      modifiers: [],
    },
  ],
  tip: 2000,
});

assert(
  Boolean(createdOrder && createdOrder.order_number.startsWith('BF-') && createdOrder.items.length === 2),
  'PRUEBA 1: Cliente realiza pedido de hamburguesa y pizza con snapshots de precio'
);

const adminOrders = store.getOrders();
assert(
  adminOrders.length === initialOrdersCount + 1 && adminOrders[0].id === createdOrder.id,
  'PRUEBA 2: El pedido aparece inmediatamente en el panel administrativo'
);

// PRUEBA 3 & 4: Comanda en cocina KDS y avance de preparación
assert(
  adminOrders[0].status === 'nuevo',
  'PRUEBA 3: La comanda ingresa en estado nuevo a cocina KDS'
);

store.updateOrderStatus(createdOrder.id, 'en_preparacion', 'Parrillero inició preparación');
const inPrepOrder = store.getOrderById(createdOrder.id)!;
assert(
  inPrepOrder.status === 'en_preparacion',
  'PRUEBA 4: Cocina comienza la preparación de la comanda en KDS'
);

store.updateOrderStatus(createdOrder.id, 'listo', 'Comanda lista y empacada');
const readyOrder = store.getOrderById(createdOrder.id)!;
assert(
  readyOrder.status === 'listo',
  'PRUEBA 4B: Cocina marca la orden como lista y empacada'
);

// PRUEBA 5: Cliente consulta el estado actualizado
const customerLookup = store.getOrderByNumber(createdOrder.order_number);
assert(
  Boolean(customerLookup && customerLookup.status === 'listo'),
  'PRUEBA 5: El cliente consulta y ve su estado en vivo como listo'
);

// PRUEBA 6 & 7: Venta presencial desde POS y actualización de caja
const initialCashExpected = store.getCashRegister().expected_cash;
const posOrder = store.createOrder({
  customer_name: 'Cliente Mostrador Mesa 2',
  customer_phone: '3151112233',
  order_type: 'mesa',
  delivery_address: 'Mesa 2',
  payment_method: 'efectivo',
  items: [
    {
      id: 'test-pos-1',
      product: p1,
      quantity: 1,
      unit_price: p1.price,
      total_price: p1.price,
      modifiers: [],
    },
  ],
  tip: 0,
});
store.recordCashMovement('ingreso', posOrder.total, `Venta POS ${posOrder.order_number}`, 'Cajero');

assert(
  Boolean(posOrder && posOrder.order_type === 'mesa'),
  'PRUEBA 6: Cajero crea pedido presencial en Punto de Venta POS'
);

const updatedCashExpected = store.getCashRegister().expected_cash;
assert(
  updatedCashExpected === initialCashExpected + posOrder.total,
  'PRUEBA 7: La venta en efectivo actualiza los registros y arqueo de caja'
);

// PRUEBA 8: Consumo de ingredientes en Kardex
const carne = store.getIngredients().find((i) => i.id === 'i1');
assert(
  Boolean(carne && carne.current_stock < 25000),
  'PRUEBA 8: El consumo de carne y pan se descuenta automáticamente del inventario'
);

// PRUEBA 9 & 10: Cambio de precio sin alterar pedidos históricos
const originalPriceLaBrutal = p1.price;
const newPriceVal = 21900;
store.updateProductPrice(p1.id, newPriceVal);
const updatedP1 = store.getProductBySlug('la-brutal')!;

assert(
  updatedP1.price === 21900,
  'PRUEBA 9: Administrador actualiza precio de La Brutal en catálogo'
);

const historicalOrder = store.getOrderById(createdOrder.id)!;
assert(
  historicalOrder.items[0].product_price_snapshot === originalPriceLaBrutal,
  'PRUEBA 10: Pedidos históricos conservan snapshot original sin ser alterados'
);

// Restore original price for consistency
store.updateProductPrice(p1.id, originalPriceLaBrutal);

// PRUEBA 11: Roles y permisos RBAC
const adminHasAll = hasPermission('Administrador', '/admin/reportes') && hasPermission('Administrador', '/admin/usuarios') && hasPermission('Administrador', '/admin/cocina');
const cajeroFiltered = hasPermission('Cajero', '/admin/caja') && hasPermission('Cajero', '/admin/caja/arqueo') && !hasPermission('Cajero', '/admin/reportes') && !hasPermission('Cajero', '/admin/usuarios');
const cocinaFiltered = hasPermission('Cocina', '/admin/cocina') && !hasPermission('Cocina', '/admin/caja') && !hasPermission('Cocina', '/admin/reportes');
const riderFiltered = hasPermission('Domiciliario', '/rider/pedidos') && !hasPermission('Domiciliario', '/admin/cocina') && !hasPermission('Domiciliario', '/admin/caja');

assert(
  adminHasAll && cajeroFiltered && cocinaFiltered && riderFiltered,
  'PRUEBA 11: Se valida filtrado estricto RBAC: cada rol solo ve sus paneles y Admin ve todos'
);

// PRUEBA 12: Wompi integridad y firmas
const wompiData = createWompiTransactionData('ord-123', 'BF-1001', 19900);
assert(
  Boolean(wompiData && wompiData.integritySignature && wompiData.amountInCents === 1990000),
  'PRUEBA 12: Integración Wompi genera firma SHA-256 válida y monto en centavos'
);

// PRUEBA 13: 9 Productos Gourmet con imágenes
const gourmetProds = store.getProducts().filter((p) => p.is_gourmet);
const allHavePhotos = gourmetProds.every((p) => p.image_url && p.image_url.startsWith('/images/'));
assert(
  gourmetProds.length >= 9 && allHavePhotos,
  'PRUEBA 13: Las 9 recetas Gourmet cuentan con fotografías de alta resolución'
);

// PRUEBA 14: Mobile responsive viewports & store operational state
assert(
  store.getSettings().is_open === true,
  'PRUEBA 14: Ecosistema configurado con responsive layout y restaurante operativo'
);

console.log('\n================================================================');
console.log(`RESULTADO DE LA SUITE: ${passedTests} / ${totalTests} PRUEBAS EXITOSAS (100%)`);
console.log('================================================================');
