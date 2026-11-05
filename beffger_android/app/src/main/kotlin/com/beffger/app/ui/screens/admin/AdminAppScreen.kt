package com.beffger.app.ui.screens.admin

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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
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
import androidx.compose.runtime.mutableStateMapOf
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
fun AdminAppScreen(
    repository: BeffgerRepository,
    onBackToLauncher: () -> Unit
) {
    val orders by repository.orders.collectAsState()
    val tables by repository.tables.collectAsState()
    var selectedTab by remember { mutableIntStateOf(0) } // 0: Métricas & Caja, 1: Catálogo, 2: Comandas

    val currencyFormat = remember {
        NumberFormat.getCurrencyInstance(Locale("es", "CO")).apply {
            maximumFractionDigits = 0
        }
    }

    val metrics = repository.getAdminMetrics()

    // Local toggle state for products
    val productAvailability = remember {
        mutableStateMapOf<String, Boolean>().apply {
            repository.sampleProducts.forEach { put(it.id, it.isAvailable) }
        }
    }

    Scaffold(
        containerColor = BeffgerCream,
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("👑 ", fontSize = 22.sp)
                        Column {
                            Text(
                                text = "BEFFGER Administrador",
                                fontWeight = FontWeight.Black,
                                color = BeffgerCream,
                                fontSize = 18.sp
                            )
                            Text(
                                text = "Panel Gerencial • Mauricio P.",
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
                        color = BeffgerGreen,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.padding(end = 8.dp)
                    ) {
                        Text(
                            text = "EN VIVO",
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
                            text = "Métricas & Caja",
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
                            text = "Catálogo (${repository.sampleProducts.size})",
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
                            text = "Órdenes (${orders.size})",
                            fontWeight = if (selectedTab == 2) FontWeight.Black else FontWeight.Normal,
                            color = if (selectedTab == 2) BeffgerYellow else BeffgerCream
                        )
                    }
                )
            }

            // Tab 0: Métricas & Arqueo
            if (selectedTab == 0) {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    item {
                        // Revenue Hero Card
                        Card(
                            colors = CardDefaults.cardColors(containerColor = BeffgerCharcoal),
                            shape = RoundedCornerShape(16.dp),
                            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(20.dp)) {
                                Text("VENTAS TOTALES DEL DÍA", color = Color.Gray, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                Text(
                                    text = currencyFormat.format(metrics.todayRevenue),
                                    fontWeight = FontWeight.Black,
                                    color = BeffgerYellow,
                                    fontSize = 32.sp
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("Comandas: ${metrics.ordersCount}", color = BeffgerCream, fontSize = 13.sp)
                                    Text("Ticket Promedio: ${currencyFormat.format(metrics.averageTicket)}", color = BeffgerCream, fontSize = 13.sp)
                                }
                            }
                        }
                    }

                    item {
                        // 4-Quadrant Status Counters
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Card(
                                colors = CardDefaults.cardColors(containerColor = BeffgerWhite),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Column(modifier = Modifier.padding(14.dp)) {
                                    Text("🍳 En Cocina", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = BeffgerCharcoal)
                                    Text("${metrics.pendingKitchen} comandas", fontWeight = FontWeight.Black, fontSize = 18.sp, color = BeffgerOrange)
                                }
                            }

                            Card(
                                colors = CardDefaults.cardColors(containerColor = BeffgerWhite),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Column(modifier = Modifier.padding(14.dp)) {
                                    Text("🛵 En Ruta", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = BeffgerCharcoal)
                                    Text("${metrics.inTransitDelivery} despachos", fontWeight = FontWeight.Black, fontSize = 18.sp, color = BeffgerGreen)
                                }
                            }
                        }
                    }

                    item {
                        // Arqueo de Caja Card
                        Card(
                            colors = CardDefaults.cardColors(containerColor = BeffgerWhite),
                            shape = RoundedCornerShape(16.dp),
                            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(
                                modifier = Modifier.padding(16.dp),
                                verticalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Text(
                                    text = "Arqueo de Caja en Tiempo Real",
                                    fontWeight = FontWeight.Black,
                                    fontSize = 17.sp,
                                    color = BeffgerCharcoal
                                )

                                HorizontalDivider(color = Color.LightGray.copy(alpha = 0.4f))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("💳 Pagos Wompi (Online / PSE):", color = Color.DarkGray, fontSize = 14.sp)
                                    Text(currencyFormat.format(metrics.wompiSales), fontWeight = FontWeight.Bold, color = BeffgerCharcoal, fontSize = 14.sp)
                                }

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("💵 Efectivo Recaudado:", color = Color.DarkGray, fontSize = 14.sp)
                                    Text(currencyFormat.format(metrics.cashSales), fontWeight = FontWeight.Bold, color = BeffgerGreen, fontSize = 14.sp)
                                }

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("📱 Datáfono / Tarjetas Salón:", color = Color.DarkGray, fontSize = 14.sp)
                                    Text(currencyFormat.format(metrics.datafonoSales), fontWeight = FontWeight.Bold, color = BeffgerCharcoal, fontSize = 14.sp)
                                }
                            }
                        }
                    }
                }
            } else if (selectedTab == 1) {
                // Tab 1: Control de Catálogo (Pausar / Activar recetas)
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    item {
                        Text(
                            text = "Disponibilidad de Productos en Tiempo Real:",
                            fontWeight = FontWeight.Black,
                            fontSize = 16.sp,
                            color = BeffgerCharcoal,
                            modifier = Modifier.padding(bottom = 6.dp)
                        )
                    }

                    items(repository.sampleProducts, key = { it.id }) { product ->
                        val isAvailable = productAvailability[product.id] ?: true

                        Card(
                            colors = CardDefaults.cardColors(containerColor = BeffgerWhite),
                            shape = RoundedCornerShape(14.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Image(
                                        painter = painterResource(id = product.drawableRes),
                                        contentDescription = product.name,
                                        contentScale = ContentScale.Crop,
                                        modifier = Modifier
                                            .size(50.dp)
                                            .clip(RoundedCornerShape(8.dp))
                                    )
                                    Spacer(modifier = Modifier.width(12.dp))
                                    Column {
                                        Text(product.name, fontWeight = FontWeight.Black, fontSize = 15.sp, color = BeffgerCharcoal)
                                        Text(currencyFormat.format(product.price), fontWeight = FontWeight.Bold, fontSize = 13.sp, color = BeffgerOrange)
                                    }
                                }

                                Switch(
                                    checked = isAvailable,
                                    onCheckedChange = { checked ->
                                        productAvailability[product.id] = checked
                                        repository.toggleProductAvailability(product.id)
                                    },
                                    colors = SwitchDefaults.colors(checkedThumbColor = BeffgerOrange)
                                )
                            }
                        }
                    }
                }
            } else {
                // Tab 2: Monitor de Órdenes
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(orders, key = { it.id }) { order ->
                        Card(
                            colors = CardDefaults.cardColors(containerColor = BeffgerWhite),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(14.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text("#${order.id} • ${order.customerName}", fontWeight = FontWeight.Black, fontSize = 15.sp, color = BeffgerCharcoal)
                                    Text("${order.orderType.uppercase()} • ${order.createdAt} • ${order.paymentMethod}", fontSize = 12.sp, color = Color.Gray)
                                    Text(currencyFormat.format(order.total), fontWeight = FontWeight.Black, fontSize = 14.sp, color = BeffgerOrange)
                                }

                                Surface(
                                    color = when (order.status) {
                                        OrderStatus.ENTREGADO -> BeffgerGreen
                                        OrderStatus.EN_RUTA -> BeffgerOrange
                                        OrderStatus.LISTO -> Color(0xFF3B82F6)
                                        else -> BeffgerRed
                                    },
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Text(
                                        text = order.status.displayName.uppercase(),
                                        color = BeffgerWhite,
                                        fontWeight = FontWeight.Black,
                                        fontSize = 10.sp,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
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
