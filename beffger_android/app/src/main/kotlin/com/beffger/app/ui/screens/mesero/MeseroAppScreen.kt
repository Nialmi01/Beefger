package com.beffger.app.ui.screens.mesero

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
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.beffger.app.data.BeffgerRepository
import com.beffger.app.model.CartItem
import com.beffger.app.model.Product
import com.beffger.app.model.RestaurantTable
import com.beffger.app.model.TableStatus
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
fun MeseroAppScreen(
    repository: BeffgerRepository,
    onBackToLauncher: () -> Unit
) {
    val tables by repository.tables.collectAsState()
    val orders by repository.orders.collectAsState()

    var selectedTable by remember { mutableStateOf<RestaurantTable?>(null) }
    var isTakingOrder by remember { mutableStateOf(false) }
    val newOrderItems = remember { mutableStateListOf<CartItem>() }

    val currencyFormat = remember {
        NumberFormat.getCurrencyInstance(Locale("es", "CO")).apply {
            maximumFractionDigits = 0
        }
    }

    val occupiedCount = tables.count { it.status != TableStatus.LIBRE }

    Scaffold(
        containerColor = BeffgerCream,
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("👔 ", fontSize = 22.sp)
                        Column {
                            Text(
                                text = "BEFFGER Meseros POS",
                                fontWeight = FontWeight.Black,
                                color = BeffgerCream,
                                fontSize = 18.sp
                            )
                            Text(
                                text = "Salón Principal • Mesero: Andrés",
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
                        color = BeffgerCharcoal,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.padding(end = 8.dp)
                    ) {
                        Text(
                            text = "$occupiedCount/12 OCUPADAS",
                            color = BeffgerYellow,
                            fontWeight = FontWeight.Black,
                            fontSize = 11.sp,
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
                .padding(14.dp)
        ) {
            Text(
                text = "Mapa de Mesas en Salón",
                fontWeight = FontWeight.Black,
                fontSize = 17.sp,
                color = BeffgerCharcoal,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            // Grid of 12 tables
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(tables, key = { it.id }) { table ->
                    val activeOrder = orders.find { it.id == table.currentOrderId }
                    val isFree = table.status == TableStatus.LIBRE
                    val isWaitingBill = table.status == TableStatus.ESPERANDO_CUENTA

                    Card(
                        colors = CardDefaults.cardColors(
                            containerColor = when {
                                isFree -> BeffgerWhite
                                isWaitingBill -> Color(0xFFFFF9E6)
                                else -> Color(0xFFFFF1EB)
                            }
                        ),
                        shape = RoundedCornerShape(16.dp),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { selectedTable = table }
                    ) {
                        Column(
                            modifier = Modifier.padding(14.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "MESA ${table.number}",
                                    fontWeight = FontWeight.Black,
                                    fontSize = 18.sp,
                                    color = BeffgerCharcoal
                                )

                                Surface(
                                    color = when {
                                        isFree -> BeffgerGreen
                                        isWaitingBill -> BeffgerYellow
                                        else -> BeffgerOrange
                                    },
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Text(
                                        text = when {
                                            isFree -> "LIBRE"
                                            isWaitingBill -> "CUENTA"
                                            else -> "OCUPADA"
                                        },
                                        color = if (isWaitingBill) BeffgerCharcoal else BeffgerWhite,
                                        fontWeight = FontWeight.Black,
                                        fontSize = 10.sp,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp)
                                    )
                                }
                            }

                            Text(
                                text = "Capacidad: ${table.capacity} personas",
                                fontSize = 12.sp,
                                color = Color.Gray
                            )

                            if (!isFree && activeOrder != null) {
                                Text(
                                    text = "Comanda: ${activeOrder.items.sumOf { it.quantity }} ítems",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = BeffgerCharcoal
                                )
                                Text(
                                    text = currencyFormat.format(activeOrder.total),
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Black,
                                    color = BeffgerOrange
                                )
                            } else {
                                Text(
                                    text = "Disponible para asignar",
                                    fontSize = 12.sp,
                                    color = BeffgerGreen
                                )
                            }
                        }
                    }
                }
            }
        }
    }

    // Modal Sheet for Table Operations
    selectedTable?.let { table ->
        val activeOrder = orders.find { it.id == table.currentOrderId }

        ModalBottomSheet(
            onDismissRequest = {
                selectedTable = null
                isTakingOrder = false
                newOrderItems.clear()
            },
            containerColor = BeffgerCream
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Mesa ${table.number} • ${table.status.label}",
                            fontWeight = FontWeight.Black,
                            fontSize = 22.sp,
                            color = BeffgerCharcoal
                        )
                        Text(
                            text = "Capacidad máxima: ${table.capacity} comensales",
                            fontSize = 13.sp,
                            color = Color.DarkGray
                        )
                    }
                }

                HorizontalDivider(color = Color.LightGray.copy(alpha = 0.5f))

                if (table.status == TableStatus.LIBRE && !isTakingOrder) {
                    // Action: Open Table
                    Button(
                        onClick = { isTakingOrder = true },
                        colors = ButtonDefaults.buttonColors(containerColor = BeffgerOrange),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp)
                    ) {
                        Text("Abrir Mesa y Tomar Comanda ➕", fontWeight = FontWeight.Black, fontSize = 15.sp, color = BeffgerWhite)
                    }
                } else if (isTakingOrder) {
                    // Quick Order Taking Catalog
                    Text(
                        text = "Agregar Productos a Mesa ${table.number}:",
                        fontWeight = FontWeight.Black,
                        fontSize = 16.sp,
                        color = BeffgerCharcoal
                    )

                    // Fast Catalog List
                    repository.sampleProducts.take(6).forEach { product ->
                        Card(
                            colors = CardDefaults.cardColors(containerColor = BeffgerWhite),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    newOrderItems.add(CartItem(id = "item-${System.currentTimeMillis()}", product = product, quantity = 1))
                                }
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(product.name, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = BeffgerCharcoal)
                                    Text(currencyFormat.format(product.price), fontSize = 12.sp, color = BeffgerOrange, fontWeight = FontWeight.Bold)
                                }
                                Surface(
                                    color = BeffgerYellow.copy(alpha = 0.3f),
                                    shape = CircleShape
                                ) {
                                    Text("+ Agregar", fontWeight = FontWeight.Black, fontSize = 12.sp, color = BeffgerCharcoal, modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp))
                                }
                            }
                        }
                    }

                    if (newOrderItems.isNotEmpty()) {
                        Text(
                            text = "Productos en Comanda (${newOrderItems.size}):",
                            fontWeight = FontWeight.Black,
                            fontSize = 15.sp,
                            color = BeffgerCharcoal,
                            modifier = Modifier.padding(top = 8.dp)
                        )

                        newOrderItems.forEach { item ->
                            Text("• 1x ${item.product.name} (${currencyFormat.format(item.product.price)})", fontSize = 13.sp, color = Color.DarkGray)
                        }

                        Button(
                            onClick = {
                                repository.sendDineInOrder(
                                    tableNumber = table.number,
                                    items = newOrderItems.toList(),
                                    notes = "Servicio en salón"
                                )
                                selectedTable = null
                                isTakingOrder = false
                                newOrderItems.clear()
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = BeffgerGreen),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(52.dp)
                        ) {
                            Text("Enviar Directo a Cocina KDS 🍳", fontWeight = FontWeight.Black, fontSize = 16.sp, color = BeffgerWhite)
                        }
                    }
                } else {
                    // Occupied Table Actions
                    if (activeOrder != null) {
                        Text("Consumo Actual:", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = BeffgerCharcoal)
                        activeOrder.items.forEach { item ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("${item.quantity}x ${item.product.name}", fontSize = 14.sp, color = Color.DarkGray)
                                Text(currencyFormat.format(item.totalPrice), fontWeight = FontWeight.Bold, fontSize = 14.sp, color = BeffgerCharcoal)
                            }
                        }

                        HorizontalDivider(color = Color.LightGray.copy(alpha = 0.4f))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("TOTAL CUENTA:", fontWeight = FontWeight.Black, fontSize = 16.sp, color = BeffgerCharcoal)
                            Text(currencyFormat.format(activeOrder.total), fontWeight = FontWeight.Black, fontSize = 18.sp, color = BeffgerOrange)
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedButton(
                            onClick = { repository.requestBillForTable(table.number) },
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("Pedir Cuenta 💵", color = BeffgerCharcoal, fontWeight = FontWeight.Bold)
                        }

                        Button(
                            onClick = {
                                repository.closeTable(table.number)
                                selectedTable = null
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = BeffgerGreen),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("Cobrar & Liberar 🔓", color = BeffgerWhite, fontWeight = FontWeight.Black)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}
