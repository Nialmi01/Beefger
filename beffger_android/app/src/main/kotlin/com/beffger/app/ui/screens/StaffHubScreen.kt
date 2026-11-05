package com.beffger.app.ui.screens

import androidx.compose.foundation.Image
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.TabRowDefaults
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.beffger.app.data.BeffgerRepository
import com.beffger.app.model.Order
import com.beffger.app.model.OrderStatus
import com.beffger.app.ui.theme.BeffgerCharcoal
import com.beffger.app.ui.theme.BeffgerCream
import com.beffger.app.ui.theme.BeffgerGreen
import com.beffger.app.ui.theme.BeffgerOrange
import com.beffger.app.ui.theme.BeffgerRed
import com.beffger.app.ui.theme.BeffgerWhite
import com.beffger.app.ui.theme.BeffgerYellow
import java.text.NumberFormat
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StaffHubScreen(
    repository: BeffgerRepository,
    onBack: () -> Unit,
    onViewOrder: (String) -> Unit
) {
    val orders by repository.activeOrders.collectAsState()
    var selectedTab by remember { mutableIntStateOf(0) } // 0: KDS Cocina, 1: Rider Repartidor

    val currencyFormat = remember {
        NumberFormat.getCurrencyInstance(Locale("es", "CO")).apply {
            maximumFractionDigits = 0
        }
    }

    val kdsOrders = orders.filter { it.status == OrderStatus.NUEVO || it.status == OrderStatus.EN_PREPARACION }
    val riderOrders = orders.filter { it.status == OrderStatus.LISTO || it.status == OrderStatus.EN_RUTA }

    Scaffold(
        containerColor = BeffgerCream,
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "BEFFGER Staff Hub",
                            fontWeight = FontWeight.Black,
                            color = BeffgerCream,
                            fontSize = 18.sp
                        )
                        Text(
                            text = "KDS Cocina & Operaciones Móvil",
                            color = BeffgerYellow,
                            fontSize = 11.sp
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Text(
                            text = "←",
                            color = BeffgerCream,
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = BeffgerCharcoal
                )
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            // Tab Selector
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = BeffgerCharcoal,
                contentColor = BeffgerYellow,
                indicator = { tabPositions ->
                    TabRowDefaults.SecondaryIndicator(
                        Modifier.tabIndicatorOffset(tabPositions[selectedTab]),
                        color = BeffgerOrange,
                        height = 3.dp
                    )
                }
            ) {
                Tab(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    text = {
                        Text(
                            text = "🍳 Cocina KDS (${kdsOrders.size})",
                            fontWeight = if (selectedTab == 0) FontWeight.Black else FontWeight.Normal,
                            color = if (selectedTab == 0) BeffgerYellow else BeffgerCream
                        )
                    }
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = {
                        Text(
                            text = "🛵 Domiciliarios (${riderOrders.size})",
                            fontWeight = if (selectedTab == 1) FontWeight.Black else FontWeight.Normal,
                            color = if (selectedTab == 1) BeffgerYellow else BeffgerCream
                        )
                    }
                )
            }

            // Tab Content
            val currentList = if (selectedTab == 0) kdsOrders else riderOrders

            if (currentList.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(if (selectedTab == 0) "🍳" else "🛵", fontSize = 54.sp)
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = if (selectedTab == 0) "Sin comandas pendientes en cocina" else "Sin pedidos esperando despacho",
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp,
                            color = BeffgerCharcoal
                        )
                        Text(
                            text = "Las nuevas órdenes ingresadas por los clientes aparecerán automáticamente aquí.",
                            fontSize = 13.sp,
                            color = Color.DarkGray,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                            modifier = Modifier.padding(top = 8.dp)
                        )
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    items(currentList, key = { it.id }) { order ->
                        Card(
                            colors = CardDefaults.cardColors(containerColor = BeffgerWhite),
                            shape = RoundedCornerShape(14.dp),
                            elevation = CardDefaults.cardElevation(defaultElevation = 3.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(
                                modifier = Modifier.padding(16.dp),
                                verticalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                // Header: Order #, Status, Time
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column {
                                        Text(
                                            text = "ORDEN #${order.id}",
                                            fontWeight = FontWeight.Black,
                                            fontSize = 18.sp,
                                            color = BeffgerCharcoal
                                        )
                                        Text(
                                            text = "${order.customerName} • ${if (order.isDelivery) "🛵 Domicilio" else "🏪 Retiro"}",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 13.sp,
                                            color = if (order.isDelivery) BeffgerOrange else BeffgerGreen
                                        )
                                    }

                                    Surface(
                                        color = when (order.status) {
                                            OrderStatus.NUEVO -> BeffgerRed
                                            OrderStatus.EN_PREPARACION -> BeffgerOrange
                                            OrderStatus.LISTO -> BeffgerGreen
                                            else -> BeffgerCharcoal
                                        },
                                        shape = RoundedCornerShape(12.dp)
                                    ) {
                                        Text(
                                            text = order.status.displayName.uppercase(),
                                            fontWeight = FontWeight.Black,
                                            color = BeffgerWhite,
                                            fontSize = 10.sp,
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                        )
                                    }
                                }

                                Divider(color = Color.LightGray.copy(alpha = 0.4f))

                                // Items List (KDS View)
                                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                    order.items.forEach { item ->
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.Top
                                        ) {
                                            Column(modifier = Modifier.weight(1f)) {
                                                Text(
                                                    text = "${item.quantity}x ${item.product.name}",
                                                    fontWeight = FontWeight.Black,
                                                    fontSize = 15.sp,
                                                    color = BeffgerCharcoal
                                                )
                                                if (item.selectedModifiers.isNotEmpty()) {
                                                    Text(
                                                        text = "• " + item.selectedModifiers.joinToString(" • ") { it.name },
                                                        fontWeight = FontWeight.Bold,
                                                        fontSize = 12.sp,
                                                        color = BeffgerOrange
                                                    )
                                                }
                                                if (item.notes.isNotBlank()) {
                                                    Text(
                                                        text = "⚠ NOTA: ${item.notes}",
                                                        fontWeight = FontWeight.Bold,
                                                        fontSize = 12.sp,
                                                        color = BeffgerRed
                                                    )
                                                }
                                            }
                                        }
                                    }
                                }

                                Divider(color = Color.LightGray.copy(alpha = 0.4f))

                                // Extra details for Rider
                                if (selectedTab == 1) {
                                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                        Text(
                                            text = "📍 Dirección: ${order.customerAddress}",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 13.sp,
                                            color = BeffgerCharcoal
                                        )
                                        Text(
                                            text = "📞 Contacto: ${order.customerPhone}",
                                            fontSize = 12.sp,
                                            color = Color.DarkGray
                                        )
                                        Text(
                                            text = "💰 Cobro: ${currencyFormat.format(order.totalAmount)} (${order.paymentMethod})",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 13.sp,
                                            color = BeffgerOrange
                                        )
                                    }
                                }

                                // Action Buttons
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    OutlinedButton(
                                        onClick = { onViewOrder(order.id) },
                                        shape = RoundedCornerShape(10.dp),
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Text("Ver Tracking", color = BeffgerCharcoal, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                    }

                                    Button(
                                        onClick = { repository.advanceOrderStatus(order.id) },
                                        colors = ButtonDefaults.buttonColors(
                                            containerColor = if (selectedTab == 0) BeffgerOrange else BeffgerGreen
                                        ),
                                        shape = RoundedCornerShape(10.dp),
                                        modifier = Modifier.weight(1.5f)
                                    ) {
                                        val btnText = when (order.status) {
                                            OrderStatus.NUEVO -> "A Cocina 🍳"
                                            OrderStatus.EN_PREPARACION -> "Listo 🔔"
                                            OrderStatus.LISTO -> "Despachar 🛵"
                                            OrderStatus.EN_RUTA -> "Entregado ✓"
                                            else -> "Completado"
                                        }
                                        Text(btnText, color = BeffgerWhite, fontWeight = FontWeight.Black, fontSize = 13.sp)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
