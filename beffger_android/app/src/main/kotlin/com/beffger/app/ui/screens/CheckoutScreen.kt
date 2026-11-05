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
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
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
import com.beffger.app.R
import com.beffger.app.data.BeffgerRepository
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
fun CheckoutScreen(
    repository: BeffgerRepository,
    onBack: () -> Unit,
    onOrderPlaced: (String) -> Unit
) {
    val cartItems by repository.cartItems.collectAsState()

    val currencyFormat = remember {
        NumberFormat.getCurrencyInstance(Locale("es", "CO")).apply {
            maximumFractionDigits = 0
        }
    }

    // Delivery method: true = Domicilio, false = Retiro
    var isDelivery by remember { mutableStateOf(true) }
    val deliveryFee = if (isDelivery) 5000 else 0

    val savedCustomer by repository.currentCustomer.collectAsState()

    // Form fields prefilled from CRM
    var customerName by remember(savedCustomer) { mutableStateOf(savedCustomer?.name ?: "") }
    var customerPhone by remember(savedCustomer) { mutableStateOf(savedCustomer?.phone ?: "") }
    var customerAddress by remember(savedCustomer) { mutableStateOf(savedCustomer?.address ?: "") }
    var deliveryNotes by remember(savedCustomer) { mutableStateOf(savedCustomer?.deliveryNotes ?: "") }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    // Payment method
    var paymentMethod by remember { mutableStateOf("WOMPI") } // WOMPI, CASH, CARD_ON_DELIVERY

    // Tip selection: 0, 5, 10
    var tipPercent by remember { mutableIntStateOf(5) }

    val subtotal = cartItems.sumOf { it.totalPrice }
    val tipAmount = (subtotal * tipPercent) / 100
    val grandTotal = subtotal + deliveryFee + tipAmount

    Scaffold(
        containerColor = BeffgerCream,
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Tu Orden BEFFGER",
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
                    if (cartItems.isNotEmpty()) {
                        Text(
                            text = "Vaciar",
                            color = BeffgerYellow,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            modifier = Modifier
                                .clickable { repository.clearCart() }
                                .padding(end = 16.dp)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = BeffgerCharcoal
                )
            )
        },
        bottomBar = {
            if (cartItems.isNotEmpty()) {
                Surface(
                    color = BeffgerCharcoal,
                    shadowElevation = 12.dp
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "Total a Pagar:",
                                    color = Color.LightGray,
                                    fontSize = 12.sp
                                )
                                Text(
                                    text = currencyFormat.format(grandTotal),
                                    fontWeight = FontWeight.Black,
                                    color = BeffgerYellow,
                                    fontSize = 24.sp
                                )
                            }

                            Button(
                                onClick = {
                                    if (customerName.isBlank()) {
                                        errorMessage = "Por favor ingresa tu nombre completo"
                                        return@Button
                                    }
                                    if (customerPhone.isBlank() || customerPhone.length < 7) {
                                        errorMessage = "Ingresa un número de teléfono válido (mínimo 7 dígitos)"
                                        return@Button
                                    }
                                    if (isDelivery && customerAddress.isBlank()) {
                                        errorMessage = "Ingresa la dirección completa para el domicilio"
                                        return@Button
                                    }

                                    errorMessage = null
                                    // Save or update customer in CRM
                                    if (savedCustomer == null && customerName.isNotBlank() && customerPhone.isNotBlank()) {
                                        repository.registerCustomer(
                                            com.beffger.app.model.Customer(
                                                name = customerName.trim(),
                                                phone = customerPhone.trim(),
                                                address = customerAddress.trim(),
                                                deliveryNotes = deliveryNotes.trim()
                                            )
                                        )
                                    }

                                    val order = repository.createOrder(
                                        customerName = customerName.trim(),
                                        customerPhone = customerPhone.trim(),
                                        customerAddress = if (isDelivery) customerAddress.trim() else "Retiro en local BEFFGER",
                                        isDelivery = isDelivery,
                                        paymentMethod = when (paymentMethod) {
                                            "WOMPI" -> "Wompi Pasarela Segura"
                                            "CASH" -> "Efectivo contraentrega"
                                            else -> "Datáfono contraentrega"
                                        },
                                        tip = tipAmount
                                    )
                                    onOrderPlaced(order.id)
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = BeffgerOrange),
                                shape = RoundedCornerShape(14.dp),
                                modifier = Modifier
                                    .height(52.dp)
                                    .padding(start = 16.dp)
                            ) {
                                Text(
                                    text = "Confirmar Pedido 🔥",
                                    fontWeight = FontWeight.Black,
                                    color = BeffgerWhite,
                                    fontSize = 16.sp
                                )
                            }
                        }
                    }
                }
            }
        }
    ) { innerPadding ->
        if (cartItems.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.padding(24.dp)
                ) {
                    Text("🛒", fontSize = 64.sp)
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "Tu comanda está vacía",
                        fontWeight = FontWeight.Black,
                        fontSize = 22.sp,
                        color = BeffgerCharcoal
                    )
                    Text(
                        text = "Agrega deliciosas hamburguesas, perros gourmet o pizzas artesanales de nuestro menú.",
                        color = Color.DarkGray,
                        fontSize = 14.sp,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                        modifier = Modifier.padding(vertical = 12.dp)
                    )
                    Button(
                        onClick = onBack,
                        colors = ButtonDefaults.buttonColors(containerColor = BeffgerOrange),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.padding(top = 8.dp)
                    ) {
                        Text("Explorar Menú Gourmet", color = BeffgerWhite, fontWeight = FontWeight.Bold)
                    }
                }
            }
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp)
            ) {
                // Error banner if any
                if (errorMessage != null) {
                    Surface(
                        color = BeffgerRed.copy(alpha = 0.12f),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 12.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(12.dp)
                        ) {
                            Text("⚠", color = BeffgerRed, fontSize = 18.sp)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = errorMessage ?: "",
                                color = BeffgerRed,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp
                            )
                        }
                    }
                }

                // Section 1: Cart Items
                Text(
                    text = "1. Resumen de Productos (${cartItems.sumOf { it.quantity }})",
                    fontWeight = FontWeight.Black,
                    fontSize = 17.sp,
                    color = BeffgerCharcoal,
                    modifier = Modifier.padding(bottom = 8.dp)
                )

                Card(
                    colors = CardDefaults.cardColors(containerColor = BeffgerWhite),
                    shape = RoundedCornerShape(14.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        cartItems.forEachIndexed { index, item ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                // Thumbnail
                                Image(
                                    painter = painterResource(id = item.product.drawableRes),
                                    contentDescription = item.product.name,
                                    contentScale = ContentScale.Crop,
                                    modifier = Modifier
                                        .size(60.dp)
                                        .clip(RoundedCornerShape(8.dp))
                                )

                                Spacer(modifier = Modifier.width(12.dp))

                                // Details
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = item.product.name,
                                        fontWeight = FontWeight.Black,
                                        color = BeffgerCharcoal,
                                        fontSize = 15.sp
                                    )
                                    if (item.selectedModifiers.isNotEmpty()) {
                                        Text(
                                            text = item.selectedModifiers.joinToString(", ") { it.name },
                                            color = Color.Gray,
                                            fontSize = 12.sp
                                        )
                                    }
                                    if (item.notes.isNotBlank()) {
                                        Text(
                                            text = "Nota: ${item.notes}",
                                            color = BeffgerOrange,
                                            fontSize = 11.sp
                                        )
                                    }
                                    Text(
                                        text = currencyFormat.format(item.totalPrice),
                                        fontWeight = FontWeight.Bold,
                                        color = BeffgerOrange,
                                        fontSize = 13.sp,
                                        modifier = Modifier.padding(top = 2.dp)
                                    )
                                }

                                // Quantity Controls
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier
                                        .background(BeffgerCream, RoundedCornerShape(16.dp))
                                        .padding(horizontal = 4.dp)
                                ) {
                                    IconButton(
                                        onClick = { repository.updateCartItemQuantity(item.id, item.quantity - 1) },
                                        modifier = Modifier.size(30.dp)
                                    ) {
                                        Text("-", fontWeight = FontWeight.Black, color = BeffgerCharcoal)
                                    }
                                    Text(
                                        text = "${item.quantity}",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 14.sp,
                                        color = BeffgerCharcoal,
                                        modifier = Modifier.padding(horizontal = 4.dp)
                                    )
                                    IconButton(
                                        onClick = { repository.updateCartItemQuantity(item.id, item.quantity + 1) },
                                        modifier = Modifier.size(30.dp)
                                    ) {
                                        Text("+", fontWeight = FontWeight.Black, color = BeffgerCharcoal)
                                    }
                                }
                            }

                            if (index < cartItems.size - 1) {
                                Divider(color = Color.LightGray.copy(alpha = 0.4f), modifier = Modifier.padding(vertical = 4.dp))
                            }
                        }
                    }
                }

                // Section 2: Delivery Method
                Text(
                    text = "2. Método de Entrega",
                    fontWeight = FontWeight.Black,
                    fontSize = 17.sp,
                    color = BeffgerCharcoal,
                    modifier = Modifier.padding(top = 20.dp, bottom = 8.dp)
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // Domicilio Option
                    Card(
                        colors = CardDefaults.cardColors(
                            containerColor = if (isDelivery) BeffgerCharcoal else BeffgerWhite
                        ),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .weight(1f)
                            .clickable { isDelivery = true }
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Text(
                                text = "🛵 Domicilio",
                                fontWeight = FontWeight.Black,
                                fontSize = 15.sp,
                                color = if (isDelivery) BeffgerYellow else BeffgerCharcoal
                            )
                            Text(
                                text = "Entrega en tu puerta",
                                fontSize = 12.sp,
                                color = if (isDelivery) BeffgerCream else Color.Gray,
                                modifier = Modifier.padding(top = 2.dp)
                            )
                            Text(
                                text = "$5.000 COP",
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                color = if (isDelivery) BeffgerOrange else BeffgerOrange,
                                modifier = Modifier.padding(top = 4.dp)
                            )
                        }
                    }

                    // Retiro Option
                    Card(
                        colors = CardDefaults.cardColors(
                            containerColor = if (!isDelivery) BeffgerCharcoal else BeffgerWhite
                        ),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .weight(1f)
                            .clickable { isDelivery = false }
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Text(
                                text = "🏪 Retiro en Local",
                                fontWeight = FontWeight.Black,
                                fontSize = 15.sp,
                                color = if (!isDelivery) BeffgerYellow else BeffgerCharcoal
                            )
                            Text(
                                text = "Pasa por el restaurante",
                                fontSize = 12.sp,
                                color = if (!isDelivery) BeffgerCream else Color.Gray,
                                modifier = Modifier.padding(top = 2.dp)
                            )
                            Text(
                                text = "GRATIS",
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                color = BeffgerGreen,
                                modifier = Modifier.padding(top = 4.dp)
                            )
                        }
                    }
                }

                // Section 3: Customer Details
                Text(
                    text = "3. Datos del Cliente",
                    fontWeight = FontWeight.Black,
                    fontSize = 17.sp,
                    color = BeffgerCharcoal,
                    modifier = Modifier.padding(top = 20.dp, bottom = 8.dp)
                )

                Card(
                    colors = CardDefaults.cardColors(containerColor = BeffgerWhite),
                    shape = RoundedCornerShape(14.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        OutlinedTextField(
                            value = customerName,
                            onValueChange = { customerName = it },
                            label = { Text("Nombre Completo *") },
                            placeholder = { Text("Ej: Mauricio Pérez") },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp),
                            singleLine = true
                        )

                        OutlinedTextField(
                            value = customerPhone,
                            onValueChange = { customerPhone = it },
                            label = { Text("Teléfono / WhatsApp *") },
                            placeholder = { Text("Ej: 300 123 4567") },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp),
                            singleLine = true
                        )

                        if (isDelivery) {
                            OutlinedTextField(
                                value = customerAddress,
                                onValueChange = { customerAddress = it },
                                label = { Text("Dirección de Entrega *") },
                                placeholder = { Text("Ej: Calle 45 # 12-34, Apto 302") },
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(10.dp),
                                singleLine = true
                            )

                            OutlinedTextField(
                                value = deliveryNotes,
                                onValueChange = { deliveryNotes = it },
                                label = { Text("Barrio o Indicaciones (Opcional)") },
                                placeholder = { Text("Ej: Portón blanco frente al parque") },
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(10.dp),
                                singleLine = true
                            )
                        }
                    }
                }

                // Section 4: Payment Method
                Text(
                    text = "4. Método de Pago",
                    fontWeight = FontWeight.Black,
                    fontSize = 17.sp,
                    color = BeffgerCharcoal,
                    modifier = Modifier.padding(top = 20.dp, bottom = 8.dp)
                )

                Card(
                    colors = CardDefaults.cardColors(containerColor = BeffgerWhite),
                    shape = RoundedCornerShape(14.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        // Wompi
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { paymentMethod = "WOMPI" }
                                .padding(vertical = 8.dp, horizontal = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = paymentMethod == "WOMPI",
                                onClick = { paymentMethod = "WOMPI" },
                                colors = RadioButtonDefaults.colors(selectedColor = BeffgerOrange)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(
                                    text = "💳 Wompi Pasarela Segura",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = BeffgerCharcoal
                                )
                                Text(
                                    text = "PSE, Tarjetas de Crédito, Nequi, Bancolombia",
                                    fontSize = 12.sp,
                                    color = Color.Gray
                                )
                            }
                        }

                        Divider(color = Color.LightGray.copy(alpha = 0.3f))

                        // Cash
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { paymentMethod = "CASH" }
                                .padding(vertical = 8.dp, horizontal = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = paymentMethod == "CASH",
                                onClick = { paymentMethod = "CASH" },
                                colors = RadioButtonDefaults.colors(selectedColor = BeffgerOrange)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(
                                    text = "💵 Efectivo contraentrega",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = BeffgerCharcoal
                                )
                                Text(
                                    text = "Pagas al recibir tu pedido",
                                    fontSize = 12.sp,
                                    color = Color.Gray
                                )
                            }
                        }

                        Divider(color = Color.LightGray.copy(alpha = 0.3f))

                        // Datafono
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { paymentMethod = "CARD_ON_DELIVERY" }
                                .padding(vertical = 8.dp, horizontal = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = paymentMethod == "CARD_ON_DELIVERY",
                                onClick = { paymentMethod = "CARD_ON_DELIVERY" },
                                colors = RadioButtonDefaults.colors(selectedColor = BeffgerOrange)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(
                                    text = "📱 Datáfono contraentrega",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = BeffgerCharcoal
                                )
                                Text(
                                    text = "Tarjeta débito/crédito con el domiciliario",
                                    fontSize = 12.sp,
                                    color = Color.Gray
                                )
                            }
                        }
                    }
                }

                // Section 5: Tip Selection
                Text(
                    text = "5. Propina Voluntaria para el Equipo",
                    fontWeight = FontWeight.Black,
                    fontSize = 17.sp,
                    color = BeffgerCharcoal,
                    modifier = Modifier.padding(top = 20.dp, bottom = 8.dp)
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf(0, 5, 10).forEach { pct ->
                        val isSelected = tipPercent == pct
                        FilterChip(
                            selected = isSelected,
                            onClick = { tipPercent = pct },
                            label = {
                                Text(
                                    text = if (pct == 0) "Sin propina" else "$pct% (${currencyFormat.format((subtotal * pct) / 100)})",
                                    fontWeight = if (isSelected) FontWeight.Black else FontWeight.Normal,
                                    fontSize = 13.sp
                                )
                            },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = BeffgerOrange,
                                selectedLabelColor = BeffgerWhite,
                                containerColor = BeffgerWhite,
                                labelColor = BeffgerCharcoal
                            ),
                            modifier = Modifier.weight(1f)
                        )
                    }
                }

                // Section 6: Breakdown Card
                Card(
                    colors = CardDefaults.cardColors(containerColor = BeffgerWhite),
                    shape = RoundedCornerShape(14.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 20.dp, bottom = 16.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Subtotal comanda:", color = Color.DarkGray, fontSize = 14.sp)
                            Text(currencyFormat.format(subtotal), fontWeight = FontWeight.Bold, color = BeffgerCharcoal, fontSize = 14.sp)
                        }

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Costo de Domicilio:", color = Color.DarkGray, fontSize = 14.sp)
                            Text(
                                if (deliveryFee > 0) currencyFormat.format(deliveryFee) else "GRATIS",
                                fontWeight = FontWeight.Bold,
                                color = if (deliveryFee > 0) BeffgerCharcoal else BeffgerGreen,
                                fontSize = 14.sp
                            )
                        }

                        if (tipAmount > 0) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("Propina voluntaria ($tipPercent%):", color = Color.DarkGray, fontSize = 14.sp)
                                Text(currencyFormat.format(tipAmount), fontWeight = FontWeight.Bold, color = BeffgerOrange, fontSize = 14.sp)
                            }
                        }

                        Divider(color = Color.LightGray.copy(alpha = 0.5f), modifier = Modifier.padding(vertical = 4.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("TOTAL GENERAL:", fontWeight = FontWeight.Black, color = BeffgerCharcoal, fontSize = 16.sp)
                            Text(currencyFormat.format(grandTotal), fontWeight = FontWeight.Black, color = BeffgerOrange, fontSize = 20.sp)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(30.dp))
            }
        }
    }
}
