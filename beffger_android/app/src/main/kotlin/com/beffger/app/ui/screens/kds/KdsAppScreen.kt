package com.beffger.app.ui.screens.kds

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.beffger.app.data.BeffgerRepository
import com.beffger.app.model.CookingStation
import com.beffger.app.model.Order
import com.beffger.app.model.OrderStatus
import com.beffger.app.model.ProductCategory
import com.beffger.app.ui.theme.BeffgerCharcoal
import com.beffger.app.ui.theme.BeffgerCream
import com.beffger.app.ui.theme.BeffgerGreen
import com.beffger.app.ui.theme.BeffgerOrange
import com.beffger.app.ui.theme.BeffgerRed
import com.beffger.app.ui.theme.BeffgerWhite
import com.beffger.app.ui.theme.BeffgerYellow

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KdsAppScreen(
    repository: BeffgerRepository,
    onBackToLauncher: () -> Unit
) {
    val orders by repository.orders.collectAsState()
    var selectedStation by remember { mutableStateOf(CookingStation.TODAS) }

    // Active orders in kitchen (NUEVO or EN_PREPARACION)
    val kitchenOrders = orders.filter {
        (it.status == OrderStatus.NUEVO || it.status == OrderStatus.EN_PREPARACION) &&
        when (selectedStation) {
            CookingStation.TODAS -> true
            CookingStation.PARRILLA_BURGERS -> it.items.any { item -> item.product.category == ProductCategory.HAMBURGUESAS }
            CookingStation.PLANCHA_HOTDOGS -> it.items.any { item -> item.product.category == ProductCategory.PERROS }
            CookingStation.HORNO_PIZZAS -> it.items.any { item -> item.product.category == ProductCategory.PIZZAS }
            CookingStation.FREIDORA_PAPAS -> it.items.any { item -> item.product.category == ProductCategory.COMPLEMENTOS }
        }
    }

    Scaffold(
        containerColor = Color(0xFF161C1C), // Deep charcoal kitchen mode
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("🍳 ", fontSize = 22.sp)
                        Column {
                            Text(
                                text = "BEFFGER Cocina KDS",
                                fontWeight = FontWeight.Black,
                                color = BeffgerCream,
                                fontSize = 18.sp
                            )
                            Text(
                                text = "Kitchen Display System • Parrilla & Salón",
                                color = BeffgerYellow,
                                fontSize = 11.sp
                            )
                        }
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBackToLauncher) {
                        Text("←", color = BeffgerCream, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                    }
                },
                actions = {
                    Surface(
                        color = BeffgerOrange,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.padding(end = 8.dp)
                    ) {
                        Text(
                            text = "${kitchenOrders.size} EN COLA",
                            color = BeffgerWhite,
                            fontWeight = FontWeight.Black,
                            fontSize = 12.sp,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                        )
                    }

                    Surface(
                        color = Color.White.copy(alpha = 0.15f),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .padding(end = 12.dp)
                            .clickable { onBackToLauncher() }
                    ) {
                        Text(
                            text = "🚪 SALIR",
                            color = BeffgerCream,
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = BeffgerCharcoal)
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            // Station Filter Chips
            Surface(
                color = BeffgerCharcoal,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    listOf(
                        CookingStation.TODAS to "Todas",
                        CookingStation.PARRILLA_BURGERS to "🍔 Parrilla",
                        CookingStation.PLANCHA_HOTDOGS to "🌭 Plancha",
                        CookingStation.HORNO_PIZZAS to "🍕 Horno",
                        CookingStation.FREIDORA_PAPAS to "🍟 Papas"
                    ).forEach { (station, label) ->
                        val isSelected = selectedStation == station
                        FilterChip(
                            selected = isSelected,
                            onClick = { selectedStation = station },
                            label = {
                                Text(
                                    text = label,
                                    fontSize = 11.sp,
                                    fontWeight = if (isSelected) FontWeight.Black else FontWeight.Normal
                                )
                            },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = BeffgerOrange,
                                selectedLabelColor = BeffgerWhite,
                                containerColor = Color.White.copy(alpha = 0.1f),
                                labelColor = BeffgerCream
                            )
                        )
                    }
                }
            }

            // KDS Tickets List
            if (kitchenOrders.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("✨", fontSize = 54.sp)
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = "Cocina al día • Sin comandas en espera",
                            fontWeight = FontWeight.Black,
                            fontSize = 18.sp,
                            color = BeffgerCream
                        )
                        Text(
                            text = "Los nuevos pedidos de clientes y meseros ingresarán con alarma visual aquí.",
                            fontSize = 13.sp,
                            color = Color.Gray,
                            modifier = Modifier.padding(top = 6.dp)
                        )
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = androidx.compose.foundation.layout.PaddingValues(14.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    items(kitchenOrders, key = { it.id }) { order ->
                        // Visual ticket card
                        val isNew = order.status == OrderStatus.NUEVO

                        Card(
                            colors = CardDefaults.cardColors(containerColor = BeffgerCharcoal),
                            shape = RoundedCornerShape(16.dp),
                            elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(
                                    if (isNew) BeffgerRed.copy(alpha = 0.15f) else Color.Transparent,
                                    RoundedCornerShape(16.dp)
                                )
                        ) {
                            Column(
                                modifier = Modifier.padding(16.dp),
                                verticalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                // Ticket Header: Order #, Type, Timer
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            text = "#${order.id}",
                                            fontWeight = FontWeight.Black,
                                            fontSize = 24.sp,
                                            color = BeffgerYellow
                                        )
                                        Spacer(modifier = Modifier.width(10.dp))
                                        Surface(
                                            color = when (order.orderType) {
                                                "mesa" -> BeffgerGreen
                                                "domicilio" -> BeffgerOrange
                                                else -> Color.DarkGray
                                            },
                                            shape = RoundedCornerShape(8.dp)
                                        ) {
                                            Text(
                                                text = when (order.orderType) {
                                                    "mesa" -> "🍽 MESA ${order.tableNumber ?: ""}"
                                                    "domicilio" -> "🛵 DOMICILIO"
                                                    else -> "🏪 RETIRO"
                                                },
                                                fontWeight = FontWeight.Black,
                                                color = BeffgerWhite,
                                                fontSize = 11.sp,
                                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                            )
                                        }
                                    }

                                    // Timer badge
                                    Surface(
                                        color = if (isNew) BeffgerRed else BeffgerOrange,
                                        shape = RoundedCornerShape(12.dp)
                                    ) {
                                        Text(
                                            text = if (isNew) "🔥 NUEVO" else "⏱ EN PREP",
                                            fontWeight = FontWeight.Black,
                                            color = BeffgerWhite,
                                            fontSize = 12.sp,
                                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp)
                                        )
                                    }
                                }

                                HorizontalDivider(color = Color.White.copy(alpha = 0.15f))

                                // Items to cook
                                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                                    order.items.forEach { item ->
                                        Surface(
                                            color = Color.White.copy(alpha = 0.05f),
                                            shape = RoundedCornerShape(10.dp),
                                            modifier = Modifier.fillMaxWidth()
                                        ) {
                                            Column(modifier = Modifier.padding(10.dp)) {
                                                Row(
                                                    modifier = Modifier.fillMaxWidth(),
                                                    horizontalArrangement = Arrangement.SpaceBetween
                                                ) {
                                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                                        Text(
                                                            text = "${item.quantity}x",
                                                            fontWeight = FontWeight.Black,
                                                            fontSize = 20.sp,
                                                            color = BeffgerYellow
                                                        )
                                                        Spacer(modifier = Modifier.width(10.dp))
                                                        Text(
                                                            text = item.product.name.uppercase(),
                                                            fontWeight = FontWeight.Black,
                                                            fontSize = 18.sp,
                                                            color = BeffgerCream
                                                        )
                                                    }
                                                }

                                                // Modifiers & Cooking doneness
                                                if (item.selectedModifiers.isNotEmpty()) {
                                                    Text(
                                                        text = "▶ " + item.selectedModifiers.joinToString(" • ") { it.name },
                                                        fontWeight = FontWeight.Bold,
                                                        fontSize = 13.sp,
                                                        color = BeffgerOrange,
                                                        modifier = Modifier.padding(top = 4.dp, start = 28.dp)
                                                    )
                                                }

                                                // Special Kitchen Notes
                                                if (item.notes.isNotBlank()) {
                                                    Surface(
                                                        color = BeffgerYellow.copy(alpha = 0.2f),
                                                        shape = RoundedCornerShape(6.dp),
                                                        modifier = Modifier
                                                            .padding(top = 6.dp, start = 28.dp)
                                                            .fillMaxWidth()
                                                    ) {
                                                        Text(
                                                            text = "⚠ NOTA: ${item.notes}",
                                                            fontWeight = FontWeight.Black,
                                                            fontSize = 13.sp,
                                                            color = BeffgerYellow,
                                                            modifier = Modifier.padding(6.dp)
                                                        )
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                HorizontalDivider(color = Color.White.copy(alpha = 0.15f))

                                // Giant KDS Action Button
                                Button(
                                    onClick = {
                                        if (isNew) {
                                            repository.updateOrderStatus(order.id, OrderStatus.EN_PREPARACION)
                                        } else {
                                            repository.updateOrderStatus(order.id, OrderStatus.LISTO)
                                        }
                                    },
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = if (isNew) BeffgerOrange else BeffgerGreen
                                    ),
                                    shape = RoundedCornerShape(12.dp),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(54.dp)
                                ) {
                                    Text(
                                        text = if (isNew) "🔥 Iniciar Cocción / Preparación" else "🔔 Listo para Despacho / Mesa ✓",
                                        fontWeight = FontWeight.Black,
                                        fontSize = 16.sp,
                                        color = BeffgerWhite
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
