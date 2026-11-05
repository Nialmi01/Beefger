# MANUAL OPERATIVO DEL ECOSISTEMA BEFFGER
## Procedimientos para Administración, Cocina KDS, Caja POS y Domicilios

Este manual describe el flujo de trabajo diario de cada rol dentro del restaurante.

---

## 1. FLUJO GENERAL DE UNA COMANDA

```
[ Cliente en Tienda Web o Cajero en POS ]
                  │
                  ▼
         [ Pedido Creado ] ──► (Se descuentan insumos del Kardex)
                  │
                  ▼
       [ Pantalla KDS Cocina ] ──► (Alerta sonora, cocinero inicia preparación)
                  │
                  ▼
         [ Comanda Lista ] ──► (Empacada en caja térmica)
                  │
                  ▼
       [ Despacho & Domicilio ] ──► (Asignada a repartidor con dirección y teléfono)
                  │
                  ▼
         [ Entrega & Cobro ] ──► (Confirmación cliente, arqueo en caja)
```

---

## 2. ROL: CAJERO / PUNTO DE VENTA POS (`/admin/caja`)

### 2.1 Apertura de Caja
1. Al inicio del turno, ingresar a `/admin/caja/arqueo`.
2. Verificar la base de efectivo inicial (por defecto $200.000 COP).
3. Registrar cualquier novedad en las notas de apertura.

### 2.2 Registro de Venta Presencial (Mesa / Llevar)
1. Ingresar a `/admin/caja`.
2. Seleccionar el tipo de servicio (Consumo en Mesa o Para Llevar).
3. Tocar los productos solicitados por el cliente en el catálogo táctil.
4. Seleccionar el método de pago (Efectivo, Datáfono/Wompi o Nequi).
5. Si paga en efectivo, digitar el monto recibido para que el sistema calcule el cambio automáticamente.
6. Presionar **COBRAR Y MANDAR A COCINA KDS**.
7. La orden se envía inmediatamente a la pantalla de cocina y se genera el comprobante interno de venta.

### 2.3 Cierre de Turno y Arqueo Ciego
1. Al finalizar la jornada, ingresar a `/admin/caja/arqueo`.
2. Ingresar la cantidad física de billetes y monedas en la calculadora de conteo ciego.
3. El sistema comparará el monto físico con el efectivo esperado del sistema.
4. Presionar **CERRAR TURNO & ARQUEO** para emitir el comprobante de cierre.

---

## 3. ROL: COCINA — KITCHEN DISPLAY SYSTEM (`/admin/cocina`)

1. La pantalla debe permanecer abierta en tablets o monitores táctiles de la cocina.
2. Cada comanda nueva emite una alerta sonora y visual.
3. El cronómetro del ticket indica el tiempo transcurrido:
   - **Verde:** Menos de 10 minutos.
   - **Amarillo:** Entre 10 y 20 minutos.
   - **Rojo parpadeante:** Más de 20 minutos (Alerta de demora).
4. El parrillero presiona **INICIAR PREPARACIÓN** cuando coloca la carne o masa en cocción.
5. Una vez emplatado y empacado el producto, presiona **MARCAR COMANDA LISTA ✓**.
6. Esto alerta automáticamente al área de despacho y actualiza el seguimiento en vivo del cliente.

---

## 4. ROL: CONTROL DE DESPACHOS Y DOMICILIOS (`/admin/domicilios` & `/rider/pedidos`)

1. Las comandas marcadas como listas aparecen en la cola de despacho.
2. El despachador selecciona el repartidor disponible y presiona **DESPACHAR PEDIDO**.
3. El domiciliario recibe la orden en su app móvil (`/rider/pedidos`), donde visualiza:
   - Nombre y teléfono directo del cliente.
   - Dirección y barrio de entrega en Cali.
   - Método de cobro (Efectivo o ya pagado digitalmente).
4. Al llegar a la dirección del cliente, valida la entrega y presiona **CONFIRMAR ENTREGA AL CLIENTE**.
5. El sistema marca el pedido como finalizado y acumula la carrera en la liquidación del domiciliario.

---

## 5. ROL: GERENTE / ADMINISTRADOR (`/admin`)

- **Dashboard:** Monitoreo en vivo de ventas brutas, comandas activas, ticket promedio y productos más vendidos.
- **Tablero Kanban (`/admin/pedidos`):** Vista de pájaro con 6 columnas de avance operativo.
- **Productos (`/admin/productos`):** Modificación inmediata de precios de venta y activación/desactivación de productos agotados.
- **Inventario & Kardex (`/admin/inventario`):** Semáforos de stock mínimo y registro de compras de insumos.
- **Recetas & Costeo (`/admin/recetas`):** Fichas técnicas, porcentaje de food cost y margen bruto de contribución.
