package com.beffger.app.model

import androidx.annotation.DrawableRes
import kotlinx.serialization.Serializable

@Serializable
enum class AppRole(val title: String, val description: String, val icon: String) {
    CLIENTE("Clientes", "Pide tus hamburguesas y rastrea en vivo", "🍔"),
    DOMICILIARIO("Repartidores", "Gestión de despachos, rutas y cobros", "🛵"),
    COCINA("Cocina KDS", "Kitchen Display System para parrilla y horno", "🍳"),
    MESERO("Meseros POS", "Toma de comandas y gestión de mesas", "👔"),
    ADMIN("Administrador", "Métricas, arqueo de caja y control total", "👑")
}

@Serializable
enum class ProductCategory(val displayName: String) {
    ALL("Todo"),
    GOURMET_ESPECIAL("Línea Gourmet Especial"),
    HAMBURGUESAS("Hamburguesas"),
    PERROS("Perros Gourmet"),
    PIZZAS("Pizzas 30cm"),
    COMPLEMENTOS("Papas & Acompañantes")
}

@Serializable
data class ModifierOption(
    val name: String,
    val priceAdjustment: Int = 0
) {
    val id: String get() = name
    val price: Int get() = priceAdjustment
}

@Serializable
data class ModifierGroup(
    val name: String,
    val options: List<ModifierOption>,
    val isRequired: Boolean = false,
    val isMultiSelect: Boolean = !isRequired
) {
    val id: String get() = name
}

data class Product(
    val id: String,
    val slug: String,
    val name: String,
    val category: ProductCategory,
    val price: Int,
    val description: String,
    @DrawableRes val imageRes: Int,
    val isGourmet: Boolean = true,
    var isAvailable: Boolean = true,
    val ingredients: List<String>,
    val modifierGroups: List<ModifierGroup> = emptyList()
) {
    val drawableRes: Int get() = imageRes
}

data class CartItem(
    val id: String,
    val product: Product,
    val quantity: Int = 1,
    val selectedModifiers: List<ModifierOption> = emptyList(),
    val notes: String = ""
) {
    val unitPrice: Int get() = product.price + selectedModifiers.sumOf { it.priceAdjustment }
    val totalPrice: Int get() = unitPrice * quantity
}

enum class OrderStatus(val label: String, val stepIndex: Int) {
    NUEVO("Recibido en BEFFGER", 1),
    EN_PREPARACION("En Parrilla / Cocina", 2),
    LISTO("Empacado & Termosellado", 3),
    EN_RUTA("En Camino con Domiciliario", 4),
    ENTREGADO("¡Entregado! Buen Provecho", 5);

    val displayName: String get() = label
}

data class Order(
    val id: String,
    val orderNumber: String,
    val customerName: String,
    val customerPhone: String,
    val deliveryAddress: String,
    val orderType: String = "domicilio", // "domicilio", "retiro", "mesa"
    val tableNumber: Int? = null,
    val paymentMethod: String = "wompi", // "wompi", "efectivo", "datafono"
    val items: List<CartItem>,
    val subtotal: Int,
    val deliveryFee: Int,
    val tip: Int,
    val total: Int,
    var status: OrderStatus = OrderStatus.NUEVO,
    val createdAt: String,
    var assignedRider: String? = null,
    var elapsedMinutes: Int = 0
) {
    val customerAddress: String get() = deliveryAddress
    val isDelivery: Boolean get() = orderType.equals("domicilio", ignoreCase = true)
    val isDineIn: Boolean get() = orderType.equals("mesa", ignoreCase = true)
    val totalAmount: Int get() = total
    val estimatedMinutes: String get() = when (status) {
        OrderStatus.ENTREGADO -> "Entregado"
        OrderStatus.EN_RUTA -> "10-15 min"
        OrderStatus.LISTO -> "20-25 min"
        OrderStatus.EN_PREPARACION -> "25-35 min"
        OrderStatus.NUEVO -> "35-45 min"
    }
}

enum class TableStatus(val label: String) {
    LIBRE("Disponible"),
    OCUPADA("Ocupada"),
    ESPERANDO_CUENTA("Esperando Cuenta")
}

data class RestaurantTable(
    val id: String,
    val number: Int,
    val name: String,
    val capacity: Int,
    var status: TableStatus = TableStatus.LIBRE,
    var currentGuests: Int = 0,
    var currentOrderId: String? = null,
    var currentWaiter: String = "Mesero 1"
)

enum class CookingStation(val displayName: String, val icon: String) {
    TODAS("Todas las Estaciones", "🍳"),
    PARRILLA_BURGERS("Parrilla Hamburguesas", "🍔"),
    PLANCHA_HOTDOGS("Plancha Perros", "🌭"),
    HORNO_PIZZAS("Horno Pizzas", "🍕"),
    FREIDORA_PAPAS("Freidora Papas", "🍟")
}

data class AdminMetrics(
    val todayRevenue: Int,
    val ordersCount: Int,
    val averageTicket: Int,
    val pendingKitchen: Int,
    val inTransitDelivery: Int,
    val tablesOccupied: Int,
    val wompiSales: Int,
    val cashSales: Int,
    val datafonoSales: Int
)

data class RiderMetrics(
    val deliveriesCompleted: Int,
    val totalDistanceKm: Float,
    val cashCollected: Int,
    val tipsEarned: Int
)

@Serializable
data class Customer(
    val id: String = "c1",
    val name: String,
    val phone: String,
    val email: String = "",
    val address: String,
    val neighborhood: String = "",
    val deliveryNotes: String = "",
    val registeredAt: String = "2026-11-05"
)

@Serializable
data class StaffUserAccount(
    val username: String,
    val name: String,
    val role: AppRole,
    val email: String
)

