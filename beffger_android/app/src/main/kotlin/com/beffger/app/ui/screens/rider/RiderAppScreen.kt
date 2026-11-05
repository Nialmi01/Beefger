package com.beffger.app.ui.screens.rider

import android.content.Intent
import android.net.Uri
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
import androidx.compose.material3.HorizontalDivider
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
import androidx.compose.ui.platform.LocalContext
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
fun RiderAppScreen(
    repository: BeffgerRepository,
    onBackToLauncher: () -> Unit,
    onViewTracking: (String) -> Unit
) {
    val context = LocalContext.current
    val orders by repository.orders.collectAsState()
    var selectedTab by remember { mutableIntStateOf(0) } // 0: Disponibles, 1: En Ruta, 2: Entregados

    val currencyFormat = remember {
        NumberFormat.getCurrencyInstance(Locale("es", "CO")).apply {
            maximumFractionDigits = 0
        }
    }

    val readyOrders = orders.filter { it.status == OrderStatus.LISTO && it.isDelivery }
    val inTransitOrders = orders.filter { it.status == OrderStatus.EN_RUTA && it.isDelivery }
    val deliveredOrders = orders.filter { it.status == OrderStatus.ENTREGADO && it.isDelivery }

    // Metrics for Rider
    val totalCashToTurnIn = deliveredOrders.filter { it.paymentMethod.contains("efectivo", ignoreCase = true) }.sumOf { it.total }
    val tipsEarned = deliveredOrders.sumOf { it.tip }

    Scaffold(
        containerColor = BeffgerCream,
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("🛵 ", fontSize = 20.sp)
                            Text(
                                text = "BEFFGER Domiciliarios",
                                fontWeight = FontWeight.Black,
                                color = BeffgerCream,
                                fontSize = 18.sp
                            )
                        }
                        Text(
                            text = "Rider: Carlos Mendoza • Turno Activo",
                            color = BeffgerYellow,
                            fontSize = 12.sp
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBackToLauncher) {
                        Text("←", color = BeffgerCream, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                    }
                },
                actions = {
                    Surface(
                        color = BeffgerGreen,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.padding(end = 8.dp)
                    ) {
                        Text(
                            text = "DISPONIBLE",
                            color = BeffgerWhite,
                            fontWeight = FontWeight.Black,
                            fontSize = 11.sp,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
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
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
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
            // Metrics Banner for Rider
            Surface(
                color = BeffgerCharcoal,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text("Entregas Hoy", color = Color.Gray, fontSize = 11.sp)
                        Text("${deliveredOrders.size} pedidos", color = BeffgerWhite, fontWeight = FontWeight.Black, fontSize = 15.sp)
                    }
                    Column {
                        Text("Efectivo a Entregar", color = Color.Gray, fontSize = 11.sp)
                        Text(currencyFormat.format(totalCashToTurnIn), color = BeffgerYellow, fontWeight = FontWeight.Black, fontSize = 15.sp)
                    }
                    Column {
                        Text("Tus Propinas", color = Color.Gray, fontSize = 11.sp)
                        Text(currencyFormat.format(tipsEarned), color = BeffgerGreen, fontWeight = FontWeight.Black, fontSize = 15.sp)
                    }
                }
            }

            // Tabs
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
                            text = "Listos (${readyOrders.size})",
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
                            text = "En Ruta (${inTransitOrders.size})",
                            fontWeight = if (selectedTab == 1) FontWeight.Black else FontWeight.Normal,
                            color = if (selectedTab == 1) BeffgerYellow else BeffgerCream
                        )
                    }
                )
                Tab(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    text = {
                        Text(
                            text = "Historial (${deliveredOrders.size})",
                            fontWeight = if (selectedTab == 2) FontWeight.Black else FontWeight.Normal,
                            color = if (selectedTab == 2) BeffgerYellow else BeffgerCream
                        )
                    }
                )
            }

            val currentOrders = when (selectedTab) {
                0 -> readyOrders
                1 -> inTransitOrders
                else -> deliveredOrders
            }

            if (currentOrders.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(if (selectedTab == 0) "📦" else if (selectedTab == 1) "🛵" else "🏁", fontSize = 48.sp)
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = when (selectedTab) {
                                0 -> "No hay pedidos listos en restaurante"
                                1 -> "No tienes entregas activas en este momento"
                                else -> "Aún no has completado entregas hoy"
                            },
                            fontWeight = FontWeight.Bold,
                            color = BeffgerCharcoal,
                            fontSize = 16.sp
                        )
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    items(currentOrders, key = { it.id }) { order ->
                        Card(
                            colors = CardDefaults.cardColors(containerColor = BeffgerWhite),
                            shape = RoundedCornerShape(16.dp),
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
                                            text = "Hora comanda: ${order.createdAt}",
                                            fontSize = 12.sp,
                                            color = Color.Gray
                                        )
                                    }

                                    Surface(
                                        color = when (order.status) {
                                            OrderStatus.LISTO -> BeffgerGreen
                                            OrderStatus.EN_RUTA -> BeffgerOrange
                                            OrderStatus.ENTREGADO -> Color.DarkGray
                                            else -> BeffgerCharcoal
                                        },
                                        shape = RoundedCornerShape(10.dp)
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

                                HorizontalDivider(color = Color.LightGray.copy(alpha = 0.4f))

                                // Destination Address & Customer Info
                                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                    Row(verticalAlignment = Alignment.Top) {
                                        Text("📍 ", fontSize = 16.sp)
                                        Column {
                                            Text(
                                                text = order.deliveryAddress,
                                                fontWeight = FontWeight.Black,
                                                fontSize = 15.sp,
                                                color = BeffgerCharcoal
                                            )
                                            Text(
                                                text = "Cliente: ${order.customerName}",
                                                fontSize = 13.sp,
                                                color = Color.DarkGray
                                            )
                                        }
                                    }

                                    // Payment Requirement
                                    val isCash = order.paymentMethod.contains("efectivo", ignoreCase = true)
                                    val isDatafono = order.paymentMethod.contains("datafono", ignoreCase = true)

                                    Surface(
                                        color = if (isCash) BeffgerYellow.copy(alpha = 0.25f) else BeffgerGreen.copy(alpha = 0.15f),
                                        shape = RoundedCornerShape(8.dp),
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(top = 4.dp)
                                    ) {
                                        Row(
                                            modifier = Modifier.padding(8.dp),
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Text(
                                                text = if (isCash) "💵 COBRAR EN EFECTIVO:" else if (isDatafono) "📱 COBRAR CON DATÁFONO:" else "✅ YA PAGADO ONLINE:",
                                                fontWeight = FontWeight.Black,
                                                fontSize = 12.sp,
                                                color = if (isCash) BeffgerCharcoal else BeffgerGreen
                                            )
                                            Spacer(modifier = Modifier.width(6.dp))
                                            Text(
                                                text = currencyFormat.format(order.total),
                                                fontWeight = FontWeight.Black,
                                                fontSize = 14.sp,
                                                color = BeffgerOrange
                                            )
                                        }
                                    }
                                }

                                // Quick Actions (Llamar, WhatsApp, Mapa)
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    OutlinedButton(
                                        onClick = {
                                            val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:${order.customerPhone}"))
                                            context.startActivity(intent)
                                        },
                                        shape = RoundedCornerShape(10.dp),
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Text("📞 Llamar", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = BeffgerCharcoal)
                                    }

                                    OutlinedButton(
                                        onClick = {
                                            val uri = Uri.parse("https://api.whatsapp.com/send?phone=57${order.customerPhone}&text=Hola+${order.customerName},+soy+tu+repartidor+de+BEFFGER+con+tu+pedido+${order.id}")
                                            val intent = Intent(Intent.ACTION_VIEW, uri)
                                            context.startActivity(intent)
                                        },
                                        shape = RoundedCornerShape(10.dp),
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Text("💬 WhatsApp", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = BeffgerGreen)
                                    }

                                    OutlinedButton(
                                        onClick = {
                                            val mapUri = Uri.parse("geo:0,0?q=${Uri.encode(order.deliveryAddress)}")
                                            val intent = Intent(Intent.ACTION_VIEW, mapUri)
                                            context.startActivity(intent)
                                        },
                                        shape = RoundedCornerShape(10.dp),
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Text("🗺 Mapa", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = BeffgerOrange)
                                    }
                                }

                                HorizontalDivider(color = Color.LightGray.copy(alpha = 0.4f))

                                // Main Delivery Transition Button
                                when (order.status) {
                                    OrderStatus.LISTO -> {
                                        Button(
                                            onClick = { repository.takeDelivery(order.id, "Carlos Mendoza") },
                                            colors = ButtonDefaults.buttonColors(containerColor = BeffgerOrange),
                                            shape = RoundedCornerShape(12.dp),
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .height(48.dp)
                                        ) {
                                            Text("Tomar Pedido y Salir a Ruta 🛵", fontWeight = FontWeight.Black, fontSize = 15.sp, color = BeffgerWhite)
                                        }
                                    }
                                    OrderStatus.EN_RUTA -> {
                                        Button(
                                            onClick = { repository.completeDelivery(order.id) },
                                            colors = ButtonDefaults.buttonColors(containerColor = BeffgerGreen),
                                            shape = RoundedCornerShape(12.dp),
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .height(48.dp)
                                        ) {
                                            Text("Confirmar Entrega al Cliente ✓", fontWeight = FontWeight.Black, fontSize = 15.sp, color = BeffgerWhite)
                                        }
                                    }
                                    OrderStatus.ENTREGADO -> {
                                        Text(
                                            text = "✔ Entregado exitosamente",
                                            fontWeight = FontWeight.Bold,
                                            color = BeffgerGreen,
                                            fontSize = 13.sp,
                                            modifier = Modifier.align(Alignment.CenterHorizontally)
                                        )
                                    }
                                    else -> {}
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
