package com.beffger.app.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
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
fun OrderTrackingScreen(
    orderId: String,
    repository: BeffgerRepository,
    onBack: () -> Unit,
    onGoHome: () -> Unit
) {
    val orders by repository.activeOrders.collectAsState()
    val order = orders.find { it.id == orderId } ?: orders.firstOrNull()

    val currencyFormat = remember {
        NumberFormat.getCurrencyInstance(Locale("es", "CO")).apply {
            maximumFractionDigits = 0
        }
    }

    Scaffold(
        containerColor = BeffgerCream,
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Rastreo de Pedido",
                        fontWeight = FontWeight.Black,
                        color = BeffgerCream,
                        fontSize = 20.sp
                    )
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
                actions = {
                    Text(
                        text = "Inicio",
                        color = BeffgerYellow,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        modifier = Modifier
                            .padding(end = 16.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color.White.copy(alpha = 0.15f))
                            .padding(horizontal = 10.dp, vertical = 6.dp)
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = BeffgerCharcoal
                )
            )
        }
    ) { innerPadding ->
        if (order == null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("🔍", fontSize = 48.sp)
                    Text("No se encontró el pedido $orderId", fontWeight = FontWeight.Bold, color = BeffgerCharcoal)
                    Button(
                        onClick = onGoHome,
                        colors = ButtonDefaults.buttonColors(containerColor = BeffgerOrange),
                        modifier = Modifier.padding(top = 16.dp)
                    ) {
                        Text("Ir al Inicio", color = BeffgerWhite)
                    }
                }
            }
        } else {
            val steps = listOf(
                OrderStatus.NUEVO to Pair("Recibido", "Comanda confirmada en sistema"),
                OrderStatus.EN_PREPARACION to Pair("En Cocina", "Preparando con carne 100% res"),
                OrderStatus.LISTO to Pair("Listo", "Empacado y listo para salir"),
                OrderStatus.EN_RUTA to Pair("En Ruta", "Repartidor va en camino"),
                OrderStatus.ENTREGADO to Pair("Entregado", "¡Buen provecho! La calle tiene sabor")
            )

            val currentStepIndex = steps.indexOfFirst { it.first == order.status }.coerceAtLeast(0)
            val progress = (currentStepIndex + 1).toFloat() / steps.size.toFloat()

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Main Live Status Card
                Card(
                    colors = CardDefaults.cardColors(containerColor = BeffgerCharcoal),
                    shape = RoundedCornerShape(16.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "ORDEN #${order.id}",
                                    fontWeight = FontWeight.Black,
                                    color = BeffgerYellow,
                                    fontSize = 20.sp
                                )
                                Text(
                                    text = order.createdAt,
                                    color = BeffgerCream.copy(alpha = 0.8f),
                                    fontSize = 12.sp
                                )
                            }

                            Surface(
                                color = if (order.status == OrderStatus.ENTREGADO) BeffgerGreen else BeffgerOrange,
                                shape = RoundedCornerShape(20.dp)
                            ) {
                                Text(
                                    text = order.status.displayName.uppercase(),
                                    fontWeight = FontWeight.Black,
                                    color = BeffgerWhite,
                                    fontSize = 11.sp,
                                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                                )
                            }
                        }

                        // Progress bar
                        LinearProgressIndicator(
                            progress = { progress },
                            color = BeffgerOrange,
                            trackColor = Color.White.copy(alpha = 0.2f),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(8.dp)
                                .clip(RoundedCornerShape(4.dp))
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "Tiempo estimado:",
                                color = BeffgerCream,
                                fontSize = 13.sp
                            )
                            Text(
                                text = order.estimatedMinutes,
                                fontWeight = FontWeight.Bold,
                                color = BeffgerYellow,
                                fontSize = 13.sp
                            )
                        }
                    }
                }

                // 5-Step Pipeline Card
                Card(
                    colors = CardDefaults.cardColors(containerColor = BeffgerWhite),
                    shape = RoundedCornerShape(16.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Text(
                            text = "Estado en Tiempo Real",
                            fontWeight = FontWeight.Black,
                            fontSize = 17.sp,
                            color = BeffgerCharcoal
                        )

                        steps.forEachIndexed { index, (status, info) ->
                            val isCompleted = index <= currentStepIndex
                            val isCurrent = index == currentStepIndex

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                // Step Indicator Bubble
                                Box(
                                    modifier = Modifier
                                        .size(36.dp)
                                        .background(
                                            color = when {
                                                isCurrent -> BeffgerOrange
                                                isCompleted -> BeffgerGreen
                                                else -> Color.LightGray.copy(alpha = 0.5f)
                                            },
                                            shape = CircleShape
                                        ),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = if (isCompleted && !isCurrent) "✓" else "${index + 1}",
                                        color = if (isCompleted) BeffgerWhite else Color.DarkGray,
                                        fontWeight = FontWeight.Black,
                                        fontSize = 14.sp
                                    )
                                }

                                Spacer(modifier = Modifier.width(14.dp))

                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = info.first,
                                        fontWeight = if (isCurrent) FontWeight.Black else FontWeight.Bold,
                                        fontSize = 15.sp,
                                        color = if (isCurrent) BeffgerOrange else if (isCompleted) BeffgerCharcoal else Color.Gray
                                    )
                                    Text(
                                        text = info.second,
                                        fontSize = 12.sp,
                                        color = if (isCurrent) Color.DarkGray else Color.Gray
                                    )
                                }

                                if (isCurrent) {
                                    Text(
                                        text = "EN VIVO",
                                        fontWeight = FontWeight.Black,
                                        fontSize = 10.sp,
                                        color = BeffgerOrange,
                                        modifier = Modifier
                                            .background(BeffgerOrange.copy(alpha = 0.12f), RoundedCornerShape(6.dp))
                                            .padding(horizontal = 6.dp, vertical = 3.dp)
                                    )
                                }
                            }
                        }
                    }
                }

                // Interactive Simulator Controls
                Card(
                    colors = CardDefaults.cardColors(containerColor = BeffgerYellow.copy(alpha = 0.2f)),
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(
                            text = "⚡ Simulador de Operaciones:",
                            fontWeight = FontWeight.Black,
                            fontSize = 14.sp,
                            color = BeffgerCharcoal
                        )
                        Text(
                            text = "Prueba el ciclo de vida del pedido avanzando las etapas de cocina y entrega:",
                            fontSize = 12.sp,
                            color = Color.DarkGray
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Button(
                                onClick = { repository.advanceOrderStatus(order.id) },
                                enabled = order.status != OrderStatus.ENTREGADO,
                                colors = ButtonDefaults.buttonColors(containerColor = BeffgerCharcoal),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Text(
                                    text = if (order.status == OrderStatus.ENTREGADO) "Completado" else "Avanzar Etapa →",
                                    color = BeffgerYellow,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 13.sp
                                )
                            }
                        }
                    }
                }

                // Comanda Details Card
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
                            text = "Detalles de la Comanda",
                            fontWeight = FontWeight.Black,
                            fontSize = 16.sp,
                            color = BeffgerCharcoal
                        )

                        order.items.forEach { item ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Image(
                                    painter = painterResource(id = item.product.drawableRes),
                                    contentDescription = item.product.name,
                                    contentScale = ContentScale.Crop,
                                    modifier = Modifier
                                        .size(45.dp)
                                        .clip(RoundedCornerShape(8.dp))
                                )
                                Spacer(modifier = Modifier.width(10.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = "${item.quantity}x ${item.product.name}",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 14.sp,
                                        color = BeffgerCharcoal
                                    )
                                    if (item.selectedModifiers.isNotEmpty()) {
                                        Text(
                                            text = item.selectedModifiers.joinToString(", ") { it.name },
                                            fontSize = 11.sp,
                                            color = Color.Gray
                                        )
                                    }
                                }
                                Text(
                                    text = currencyFormat.format(item.totalPrice),
                                    fontWeight = FontWeight.Bold,
                                    color = BeffgerCharcoal,
                                    fontSize = 13.sp
                                )
                            }
                        }

                        Divider(color = Color.LightGray.copy(alpha = 0.4f), modifier = Modifier.padding(vertical = 4.dp))

                        // Customer & Destination
                        Text(text = "Destino: ${order.customerAddress}", fontSize = 13.sp, color = Color.DarkGray)
                        Text(text = "Cliente: ${order.customerName} (${order.customerPhone})", fontSize = 13.sp, color = Color.DarkGray)
                        Text(text = "Pago: ${order.paymentMethod}", fontSize = 13.sp, color = Color.DarkGray)

                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(top = 4.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Total:", fontWeight = FontWeight.Black, fontSize = 16.sp, color = BeffgerCharcoal)
                            Text(currencyFormat.format(order.totalAmount), fontWeight = FontWeight.Black, fontSize = 18.sp, color = BeffgerOrange)
                        }
                    }
                }

                // Actions
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = onGoHome,
                        colors = ButtonDefaults.buttonColors(containerColor = BeffgerOrange),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                    ) {
                        Text("Hacer Otra Orden", fontWeight = FontWeight.Bold, color = BeffgerWhite)
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}
