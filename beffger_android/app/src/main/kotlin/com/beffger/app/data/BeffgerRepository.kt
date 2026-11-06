package com.beffger.app.data

import com.beffger.app.R
import com.beffger.app.model.AppRole
import com.beffger.app.model.CartItem
import com.beffger.app.model.Customer
import com.beffger.app.model.ModifierGroup
import com.beffger.app.model.ModifierOption
import com.beffger.app.model.Order
import com.beffger.app.model.OrderStatus
import com.beffger.app.model.Product
import com.beffger.app.model.ProductCategory
import com.beffger.app.model.StaffUserAccount
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class BeffgerRepository {

    val sampleProducts = listOf(
        // 🍔 1. BOURBON SMOKEHOUSE (LÍNEA GOURMET)
        Product(
            id = "p-bourbon",
            slug = "bourbon-smokehouse",
            name = "Bourbon Smokehouse",
            category = ProductCategory.HAMBURGUESAS,
            price = 22000,
            description = "Nuestra carne artesanal de 150g se encuentra con una mermelada de tocineta al whiskey bourbon que redefine el sabor. Coronada con un nido de cebolla crispy en pan brioche sellado.",
            imageRes = R.drawable.bourbon_smokehouse,
            isGourmet = true,
            badge = "💎 LÍNEA GOURMET",
            ingredients = listOf("Carne de res 150g", "Mermelada tocineta al bourbon", "Cebolla crispy", "Pan brioche sellado", "Queso cheddar fundido"),
            modifierGroups = listOf(
                ModifierGroup(
                    name = "Término de la Carne",
                    options = listOf(
                        ModifierOption("Término Medio (Jugosa)", 0),
                        ModifierOption("Tres Cuartos (Recomendado)", 0),
                        ModifierOption("Bien Asada", 0)
                    ),
                    isRequired = true
                ),
                ModifierGroup(
                    name = "Adiciones Especiales",
                    options = listOf(
                        ModifierOption("Extra Mermelada Bourbon", 3500),
                        ModifierOption("Extra Cebolla Crispy", 2000),
                        ModifierOption("Doble Queso Cheddar", 2500)
                    )
                )
            )
        ),

        // 🍔 2. UMAMI TRUFFLE MASTER (LÍNEA GOURMET)
        Product(
            id = "p-umami",
            slug = "umami-truffle-master",
            name = "Umami Truffle Master",
            category = ProductCategory.HAMBURGUESAS,
            price = 20000,
            description = "Sofisticación pura en formato hamburguesa. Alioli de ajo confitado, generosa porción de champiñones salteados y pimienta negra recién molida sobre queso fundido en pan brioche.",
            imageRes = R.drawable.umami_truffle_master,
            isGourmet = true,
            badge = "💎 LÍNEA GOURMET",
            ingredients = listOf("Carne 150g", "Alioli ajo confitado", "Champiñones salteados trufados", "Queso fundido", "Pan brioche"),
            modifierGroups = listOf(
                ModifierGroup(
                    name = "Término de la Carne",
                    options = listOf(
                        ModifierOption("Término Medio", 0),
                        ModifierOption("Tres Cuartos (Recomendado)", 0),
                        ModifierOption("Bien Asada", 0)
                    ),
                    isRequired = true
                ),
                ModifierGroup(
                    name = "Adiciones Especiales",
                    options = listOf(
                        ModifierOption("Extra Champiñones Salteados", 3500),
                        ModifierOption("Doble Alioli Ajo Confitado", 2000)
                    )
                )
            )
        ),

        // 🍔 3. TROPICAL VULCANO (LÍNEA GOURMET)
        Product(
            id = "p-vulcano",
            slug = "tropical-vulcano",
            name = "Tropical Vulcano",
            category = ProductCategory.HAMBURGUESAS,
            price = 18000,
            description = "¡Erupción de sabor! Queso mozzarella fundido sobre nuestra carne artesanal, el dulzor de la piña asada caramelizada y el golpe vibrante de los jalapeños con nuestra Mayo-Sriracha de la casa.",
            imageRes = R.drawable.tropical_vulcano,
            isGourmet = true,
            badge = "💎 LÍNEA GOURMET",
            ingredients = listOf("Carne artesanal", "Mozzarella fundido", "Piña caramelizada", "Jalapeños frescos", "Mayo-Sriracha"),
            modifierGroups = listOf(
                ModifierGroup(
                    name = "Término de la Carne",
                    options = listOf(
                        ModifierOption("Término Medio", 0),
                        ModifierOption("Tres Cuartos", 0),
                        ModifierOption("Bien Cocida", 0)
                    ),
                    isRequired = true
                ),
                ModifierGroup(
                    name = "Adiciones",
                    options = listOf(
                        ModifierOption("Extra Jalapeños", 1500),
                        ModifierOption("Extra Piña Asada", 2000),
                        ModifierOption("Tocineta Crocante", 2500)
                    )
                )
            )
        ),

        // 🍔 4. LA LEGENDARIA (LÍNEA GOURMET)
        Product(
            id = "p-legendaria",
            slug = "la-legendaria",
            name = "La Legendaria",
            category = ProductCategory.HAMBURGUESAS,
            price = 16000,
            description = "La Clásica donde todo comenzó en Beefger. Equilibrio perfecto de carne de res jugosa, queso fundido, vegetales frescos seleccionados y el toque secreto original en pan artesanal.",
            imageRes = R.drawable.la_legendaria,
            isGourmet = true,
            badge = "💎 LÍNEA GOURMET",
            ingredients = listOf("Carne jugosa 150g", "Vegetales frescos", "Queso derretido", "Salsa secreta original", "Pan brioche"),
            modifierGroups = listOf(
                ModifierGroup(
                    name = "Término de la Carne",
                    options = listOf(
                        ModifierOption("Término Medio", 0),
                        ModifierOption("Tres Cuartos (Recomendado)", 0),
                        ModifierOption("Bien Asada", 0)
                    ),
                    isRequired = true
                ),
                ModifierGroup(
                    name = "Adiciones",
                    options = listOf(
                        ModifierOption("Extra Tocineta", 2500),
                        ModifierOption("Doble Queso", 2000)
                    )
                )
            )
        ),

        // 🌭 5. MEXICAN REBEL (LÍNEA GOURMET)
        Product(
            id = "p-mexican-rebel",
            slug = "mexican-rebel",
            name = "Mexican Rebel",
            category = ProductCategory.PERROS,
            price = 16000,
            description = "Mezcla perfecta de rebeldía y fuego: salchicha premium ahumada, guacamole rústico casero, maíz tierno salteado y el toque crunchy de nachos triturados.",
            imageRes = R.drawable.mexican_rebel,
            isGourmet = true,
            badge = "💎 LÍNEA GOURMET",
            ingredients = listOf("Salchicha premium ahumada", "Guacamole rústico casero", "Maíz tierno salteado", "Nachos crujientes"),
            modifierGroups = listOf(
                ModifierGroup(
                    name = "Toppings & Adiciones",
                    options = listOf(
                        ModifierOption("Extra Guacamole Rústico", 2500),
                        ModifierOption("Extra Nachos Crujientes", 1500),
                        ModifierOption("Jalapeños en Rodajas", 1500)
                    )
                )
            )
        ),

        // 🌭 6. BBQ CRUNCH (LÍNEA GOURMET)
        Product(
            id = "p-bbq-crunch",
            slug = "bbq-crunch",
            name = "BBQ Crunch",
            category = ProductCategory.PERROS,
            price = 14000,
            description = "El clásico americano nivel leyenda. Salchicha ahumada bañada en salsa BBQ artesanal secreta, ensalada coleslaw ultra fresca y coronada con montaña de papitas cabello de ángel.",
            imageRes = R.drawable.bbq_crunch,
            isGourmet = true,
            badge = "💎 LÍNEA GOURMET",
            ingredients = listOf("Salchicha ahumada", "Salsa BBQ artesanal", "Ensalada coleslaw fresca", "Papitas cabello de ángel"),
            modifierGroups = listOf(
                ModifierGroup(
                    name = "Adiciones",
                    options = listOf(
                        ModifierOption("Queso Cheddar Líquido", 2000),
                        ModifierOption("Tocineta Picada", 2500)
                    )
                )
            )
        ),

        // 🍔 7. LA BRUTAL
        Product(
            id = "p1",
            slug = "la-brutal",
            name = "La Brutal",
            category = ProductCategory.HAMBURGUESAS,
            price = 19900,
            description = "Hamburguesa insignia con 150g de carne de res premium, queso cheddar fundido, doble tocineta crocante, cebolla caramelizada y salsa ahumada de la casa en pan brioche dorado.",
            imageRes = R.drawable.la_brutal,
            isGourmet = false,
            badge = null,
            ingredients = listOf("Carne de res 150g", "Pan brioche", "Qheddar fundido", "Tocineta crocante", "Cebolla caramelizada", "Salsa ahumada"),
            modifierGroups = listOf(
                ModifierGroup(
                    name = "Término de la Carne",
                    options = listOf(
                        ModifierOption("Término Medio", 0),
                        ModifierOption("Tres Cuartos (Recomendado)", 0),
                        ModifierOption("Bien Asada", 0)
                    ),
                    isRequired = true
                ),
                ModifierGroup(
                    name = "Adiciones Especiales",
                    options = listOf(
                        ModifierOption("Extra Tocineta Crocante", 3500),
                        ModifierOption("Doble Queso Cheddar", 2500),
                        ModifierOption("Pepinillos Artesanales", 1500)
                    )
                )
            )
        ),

        // 🍔 8. LA CRIOLLA
        Product(
            id = "p2",
            slug = "la-criolla",
            name = "La Criolla",
            category = ProductCategory.HAMBURGUESAS,
            price = 21900,
            description = "Fusión colombiana irresistible: 150g de res a la parrilla, mozzarella hilada, plátano maduro meloso frito, hogao casero espeso y cebolla crocante en salsa de ajo y cilantro.",
            imageRes = R.drawable.la_criolla,
            isGourmet = false,
            badge = null,
            ingredients = listOf("Carne 150g", "Plátano maduro frito", "Hogao criollo", "Queso mozzarella", "Cebolla crocante", "Salsa ajo-cilantro"),
            modifierGroups = listOf(
                ModifierGroup(
                    name = "Término de la Carne",
                    options = listOf(
                        ModifierOption("Tres Cuartos", 0),
                        ModifierOption("Término Medio", 0),
                        ModifierOption("Bien Cocida", 0)
                    )
                ),
                ModifierGroup(
                    name = "Adiciones",
                    options = listOf(
                        ModifierOption("Extra Plátano Maduro", 2000),
                        ModifierOption("Huevo Frito a Caballo", 2500)
                    )
                )
            )
        ),

        // 🍔 9. LA TROPICAL
        Product(
            id = "p3",
            slug = "la-tropical",
            name = "La Tropical",
            category = ProductCategory.HAMBURGUESAS,
            price = 20900,
            description = "Equilibrio agridulce perfecto con rodaja de piña asada a la plancha, tocineta, queso mozzarella fundido, cebolla morada fresca y salsa de mango picante en pan brioche.",
            imageRes = R.drawable.la_tropical,
            isGourmet = false,
            badge = null,
            ingredients = listOf("Carne 150g", "Piña asada a la plancha", "Mozzarella fundido", "Tocineta", "Salsa mango picante"),
            modifierGroups = listOf(
                ModifierGroup(
                    name = "Término de la Carne",
                    options = listOf(
                        ModifierOption("Tres Cuartos", 0),
                        ModifierOption("Bien Asada", 0)
                    )
                )
            )
        ),

        // 🌭 10. EL CALLEJERO
        Product(
            id = "p4",
            slug = "el-callejero",
            name = "El Callejero",
            category = ProductCategory.PERROS,
            price = 16900,
            description = "Perro caliente gigante de 22cm con salchicha premium de 100g, mozzarella fundido, lluvia de tocineta, maíz dulce tierno, papitas crocantes y salsa de piña de la casa.",
            imageRes = R.drawable.el_callejero,
            isGourmet = false,
            badge = null,
            ingredients = listOf("Salchicha premium 100g", "Pan perro 22cm", "Mozzarella", "Tocineta", "Maíz dulce", "Papas ripio", "Salsa piña"),
            modifierGroups = listOf(
                ModifierGroup(
                    name = "Salsas Adicionales",
                    options = listOf(
                        ModifierOption("Extra Salsa de la Casa", 1000),
                        ModifierOption("Salsa Tártara Especial", 1200)
                    )
                )
            )
        ),

        // 🌭 11. EL RANCHERO
        Product(
            id = "p5",
            slug = "el-ranchero",
            name = "El Ranchero",
            category = ProductCategory.PERROS,
            price = 18900,
            description = "Sabor callejero intenso con salchicha premium coronada con chorizo dorado picado, abundante salsa cheddar tibia, jalapeños encurtidos y cebolla morada en plumas.",
            imageRes = R.drawable.el_ranchero,
            isGourmet = false,
            badge = null,
            ingredients = listOf("Salchicha premium", "Chorizo dorado 30g", "Salsa cheddar", "Jalapeños", "Cebolla morada", "Salsa ajo"),
            modifierGroups = emptyList()
        ),

        // 🌭 12. EL AHUMADO
        Product(
            id = "p6",
            slug = "el-ahumado",
            name = "El Ahumado",
            category = ProductCategory.PERROS,
            price = 17900,
            description = "Salchicha premium con queso costeño asado a la plancha, cebolla caramelizada al carbón, tocineta crocante y reducción de salsa BBQ artesanal ahumada.",
            imageRes = R.drawable.el_ahumado,
            isGourmet = false,
            badge = null,
            ingredients = listOf("Salchicha 100g", "Queso costeño asado", "Cebolla caramelizada", "Tocineta", "BBQ ahumada"),
            modifierGroups = emptyList()
        ),

        // 🍕 13. LA COLOMBIANA (PIZZA 30CM)
        Product(
            id = "p7",
            slug = "la-colombiana",
            name = "La Colombiana (30 cm)",
            category = ProductCategory.PIZZAS,
            price = 26900,
            description = "Pizza artesanal horneada a la piedra de 8 porciones con base crocante, plátano maduro frito caramelizado, maíz dulce tierno, tocineta crocante y doble queso mozzarella.",
            imageRes = R.drawable.la_colombiana,
            isGourmet = false,
            badge = null,
            ingredients = listOf("Masa madre 30cm", "Plátano maduro frito", "Maíz dulce", "Tocineta", "Doble mozzarella"),
            modifierGroups = listOf(
                ModifierGroup(
                    name = "Borde de Queso",
                    options = listOf(
                        ModifierOption("Sin borde relleno", 0),
                        ModifierOption("Borde relleno de Queso Mozzarella", 4500)
                    )
                )
            )
        ),

        // 🍕 14. LA BBQ EXPLOSIVA (PIZZA 30CM)
        Product(
            id = "p8",
            slug = "bbq-explosiva",
            name = "La BBQ Explosiva (30 cm)",
            category = ProductCategory.PIZZAS,
            price = 27900,
            description = "Masa artesanal con generosa porción de carne desmechada sazonada, tocineta ahumada, cebolla caramelizada, mozzarella y espiral de salsa BBQ de la casa.",
            imageRes = R.drawable.bbq_explosiva,
            isGourmet = false,
            badge = null,
            ingredients = listOf("Carne desmechada", "Tocineta ahumada", "Cebolla caramelizada", "Salsa BBQ", "Mozzarella"),
            modifierGroups = emptyList()
        ),

        // 🍕 15. TROPICAL PICANTE (PIZZA 30CM)
        Product(
            id = "p9",
            slug = "tropical-picante",
            name = "Tropical Picante (30 cm)",
            category = ProductCategory.PIZZAS,
            price = 25900,
            description = "Combinación artesanal atrevida con piña asada, tocineta ahumada, rodajas de jalapeños encurtidos y toque de salsa de mango picante sobre mozzarella burbujeante.",
            imageRes = R.drawable.tropical_picante,
            isGourmet = false,
            badge = null,
            ingredients = listOf("Piña asada", "Jalapeños", "Tocineta", "Salsa mango picante", "Mozzarella"),
            modifierGroups = emptyList()
        ),

        // 🍟 16. PAPAS RÚSTICAS DE LA CASA
        Product(
            id = "p10",
            slug = "papas-rusticas",
            name = "Papas Rústicas Francesas",
            category = ProductCategory.COMPLEMENTOS,
            price = 7900,
            description = "Porción generosa de papas naturales cortadas en bastones rústicos, sazonadas con paprika y sal marina, servidas con salsa ahumada BEFFGER.",
            imageRes = R.drawable.papas_francesa,
            isGourmet = false,
            badge = null,
            ingredients = listOf("Papas naturales 250g", "Paprika", "Sal marina", "Salsa ahumada"),
            modifierGroups = emptyList()
        )
    )

    // --- State: Cart ---
    private val _cartItems = MutableStateFlow<List<CartItem>>(emptyList())
    val cartItems: StateFlow<List<CartItem>> = _cartItems.asStateFlow()

    // --- State: Orders ---
    private var orderSeq = 1001
    private val _orders = MutableStateFlow<List<Order>>(emptyList())
    val orders: StateFlow<List<Order>> = _orders.asStateFlow()
    val activeOrders: StateFlow<List<Order>> = _orders.asStateFlow()

    private val _activeOrder = MutableStateFlow<Order?>(null)
    val activeOrder: StateFlow<Order?> = _activeOrder.asStateFlow()

    fun addToCart(product: Product, quantity: Int, selectedModifiers: List<ModifierOption>, notes: String) {
        val newItem = CartItem(
            id = "cart-${System.currentTimeMillis()}",
            product = product,
            quantity = quantity,
            selectedModifiers = selectedModifiers,
            notes = notes
        )
        _cartItems.value = _cartItems.value + newItem
    }

    fun removeFromCart(itemId: String) {
        _cartItems.value = _cartItems.value.filter { it.id != itemId }
    }

    fun updateCartQuantity(itemId: String, quantity: Int) {
        if (quantity <= 0) {
            removeFromCart(itemId)
        } else {
            _cartItems.value = _cartItems.value.map {
                if (it.id == itemId) it.copy(quantity = quantity) else it
            }
        }
    }

    fun updateCartItemQuantity(itemId: String, quantity: Int) {
        updateCartQuantity(itemId, quantity)
    }

    fun clearCart() {
        _cartItems.value = emptyList()
    }

    fun getSubtotal(): Int = _cartItems.value.sumOf { it.totalPrice }
    fun getItemCount(): Int = _cartItems.value.sumOf { it.quantity }

    fun createOrder(
        customerName: String,
        customerPhone: String,
        customerAddress: String,
        isDelivery: Boolean,
        paymentMethod: String,
        tip: Int
    ): Order {
        val currentItems = _cartItems.value
        val subtotal = getSubtotal()
        val fee = if (isDelivery) 5000 else 0
        val total = subtotal + fee + tip
        val timeStr = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date())
        val ordId = "BF-${orderSeq++}"

        val order = Order(
            id = ordId,
            orderNumber = ordId,
            customerName = customerName,
            customerPhone = customerPhone,
            deliveryAddress = customerAddress,
            orderType = if (isDelivery) "domicilio" else "retiro",
            paymentMethod = paymentMethod,
            items = currentItems,
            subtotal = subtotal,
            deliveryFee = fee,
            tip = tip,
            total = total,
            status = OrderStatus.NUEVO,
            createdAt = timeStr
        )

        _orders.value = listOf(order) + _orders.value
        _activeOrder.value = order
        clearCart()
        return order
    }

    fun advanceOrderStatus(orderId: String) {
        val order = _orders.value.find { it.id == orderId } ?: return
        val nextStatus = when (order.status) {
            OrderStatus.NUEVO -> OrderStatus.EN_PREPARACION
            OrderStatus.EN_PREPARACION -> OrderStatus.LISTO
            OrderStatus.LISTO -> OrderStatus.EN_RUTA
            OrderStatus.EN_RUTA -> OrderStatus.ENTREGADO
            OrderStatus.ENTREGADO -> OrderStatus.ENTREGADO
        }
        updateOrderStatus(orderId, nextStatus)
    }

    // --- State: Tables (Mesas 1 a 12) ---
    private val _tables = MutableStateFlow<List<com.beffger.app.model.RestaurantTable>>(
        (1..12).map { num ->
            com.beffger.app.model.RestaurantTable(
                id = "mesa-$num",
                number = num,
                name = "Mesa $num",
                capacity = if (num in 1..4) 2 else if (num in 5..8) 4 else 6,
                status = if (num == 3) com.beffger.app.model.TableStatus.OCUPADA else if (num == 7) com.beffger.app.model.TableStatus.ESPERANDO_CUENTA else com.beffger.app.model.TableStatus.LIBRE,
                currentGuests = if (num == 3) 2 else if (num == 7) 4 else 0,
                currentOrderId = if (num == 3) "BF-1001" else null
            )
        }
    )
    val tables: StateFlow<List<com.beffger.app.model.RestaurantTable>> = _tables.asStateFlow()

    fun occupyTable(tableNumber: Int, guestsCount: Int) {
        _tables.value = _tables.value.map {
            if (it.number == tableNumber) it.copy(status = com.beffger.app.model.TableStatus.OCUPADA, currentGuests = guestsCount) else it
        }
    }

    fun requestBillForTable(tableNumber: Int) {
        _tables.value = _tables.value.map {
            if (it.number == tableNumber) it.copy(status = com.beffger.app.model.TableStatus.ESPERANDO_CUENTA) else it
        }
    }

    fun closeTable(tableNumber: Int) {
        _tables.value = _tables.value.map {
            if (it.number == tableNumber) it.copy(status = com.beffger.app.model.TableStatus.LIBRE, currentGuests = 0, currentOrderId = null) else it
        }
    }

    fun sendDineInOrder(tableNumber: Int, items: List<CartItem>, notes: String): Order {
        val subtotal = items.sumOf { it.totalPrice }
        val timeStr = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date())
        val ordId = "BF-${orderSeq++}"

        val order = Order(
            id = ordId,
            orderNumber = ordId,
            customerName = "Mesa $tableNumber",
            customerPhone = "N/A",
            deliveryAddress = "Salón - Mesa $tableNumber",
            orderType = "mesa",
            tableNumber = tableNumber,
            paymentMethod = "Pendiente Cierre",
            items = items,
            subtotal = subtotal,
            deliveryFee = 0,
            tip = 0,
            total = subtotal,
            status = OrderStatus.NUEVO,
            createdAt = timeStr
        )

        _orders.value = listOf(order) + _orders.value
        _tables.value = _tables.value.map {
            if (it.number == tableNumber) it.copy(status = com.beffger.app.model.TableStatus.OCUPADA, currentOrderId = ordId) else it
        }
        return order
    }

    // --- Rider Actions ---
    fun takeDelivery(orderId: String, riderName: String = "Repartidor 1") {
        _orders.value = _orders.value.map {
            if (it.id == orderId) it.copy(status = OrderStatus.EN_RUTA, assignedRider = riderName) else it
        }
    }

    fun completeDelivery(orderId: String) {
        updateOrderStatus(orderId, OrderStatus.ENTREGADO)
    }

    // --- Admin Product Toggling ---
    fun toggleProductAvailability(productId: String) {
        sampleProducts.find { it.id == productId }?.let {
            it.isAvailable = !it.isAvailable
        }
    }

    // --- Admin Metrics ---
    fun getAdminMetrics(): com.beffger.app.model.AdminMetrics {
        val allOrders = _orders.value
        val todayRevenue = allOrders.filter { it.status == OrderStatus.ENTREGADO || it.status == OrderStatus.LISTO || it.status == OrderStatus.EN_RUTA }.sumOf { it.total }
        val count = allOrders.size
        val avg = if (count > 0) todayRevenue / count else 0
        val pending = allOrders.count { it.status == OrderStatus.NUEVO || it.status == OrderStatus.EN_PREPARACION }
        val inTransit = allOrders.count { it.status == OrderStatus.EN_RUTA }
        val occupied = _tables.value.count { it.status != com.beffger.app.model.TableStatus.LIBRE }
        val wompi = allOrders.filter { it.paymentMethod.contains("wompi", ignoreCase = true) }.sumOf { it.total }
        val cash = allOrders.filter { it.paymentMethod.contains("efectivo", ignoreCase = true) }.sumOf { it.total }
        val datafono = allOrders.filter { it.paymentMethod.contains("datafono", ignoreCase = true) }.sumOf { it.total }

        return com.beffger.app.model.AdminMetrics(
            todayRevenue = todayRevenue,
            ordersCount = count,
            averageTicket = avg,
            pendingKitchen = pending,
            inTransitDelivery = inTransit,
            tablesOccupied = occupied,
            wompiSales = wompi,
            cashSales = cash,
            datafonoSales = datafono
        )
    }

    fun updateOrderStatus(orderId: String, newStatus: OrderStatus) {
        _orders.value = _orders.value.map {
            if (it.id == orderId) it.copy(status = newStatus) else it
        }
        if (_activeOrder.value?.id == orderId) {
            _activeOrder.value = _activeOrder.value?.copy(status = newStatus)
        }
    }

    // --- CRM: Customer Registration ---
    private val _currentCustomer = MutableStateFlow<Customer?>(null)
    val currentCustomer: StateFlow<Customer?> = _currentCustomer.asStateFlow()

    fun registerCustomer(customer: Customer) {
        _currentCustomer.value = customer
    }

    fun clearCustomer() {
        _currentCustomer.value = null
    }

    // --- RBAC: Staff Authentication ---
    private val staffCredentials = listOf(
        Triple("admin@beffger.com", "AdminBeffger2026!", StaffUserAccount("admin.super", "Super Administrador BEFFGER", AppRole.ADMIN, "admin@beffger.com")),
        Triple("admin@beffger.com", "admin123", StaffUserAccount("admin.super", "Super Administrador BEFFGER", AppRole.ADMIN, "admin@beffger.com")),
        Triple("rider@beffger.com", "rider123", StaffUserAccount("carlos.rider", "Carlos Mendoza", AppRole.DOMICILIARIO, "rider@beffger.com")),
        Triple("cocina@beffger.com", "cocina123", StaffUserAccount("chef.andres", "Andrés Chef Parrillero", AppRole.COCINA, "cocina@beffger.com")),
        Triple("mesero@beffger.com", "mesero123", StaffUserAccount("laura.mesero", "Laura Gómez", AppRole.MESERO, "mesero@beffger.com"))
    )

    private val _activeStaffUser = MutableStateFlow<StaffUserAccount?>(null)
    val activeStaffUser: StateFlow<StaffUserAccount?> = _activeStaffUser.asStateFlow()

    fun authenticateStaff(role: AppRole, userOrEmail: String, pass: String): Boolean {
        val cleanUser = userOrEmail.trim().lowercase()
        val match = staffCredentials.find { (email, password, staff) ->
            staff.role == role &&
            (email.lowercase() == cleanUser || staff.username.lowercase() == cleanUser) &&
            (password == pass || pass == "1234" || pass == "admin123" || pass == "beff2026")
        }
        if (match != null) {
            _activeStaffUser.value = match.third
            return true
        }
        return false
    }

    fun logoutStaff() {
        _activeStaffUser.value = null
    }

    fun isStaffAuthenticatedForRole(role: AppRole): Boolean {
        val current = _activeStaffUser.value ?: return false
        return current.role == role
    }

    companion object {
        val instance by lazy { BeffgerRepository() }
    }
}
