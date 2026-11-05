package com.beffger.app.ui.screens.customer

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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.beffger.app.R
import com.beffger.app.data.BeffgerRepository
import com.beffger.app.model.Customer
import com.beffger.app.ui.theme.BeffgerCharcoal
import com.beffger.app.ui.theme.BeffgerCream
import com.beffger.app.ui.theme.BeffgerGreen
import com.beffger.app.ui.theme.BeffgerOrange
import com.beffger.app.ui.theme.BeffgerWhite
import com.beffger.app.ui.theme.BeffgerYellow

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CustomerProfileScreen(
    repository: BeffgerRepository,
    onBack: () -> Unit,
    onSaved: () -> Unit
) {
    val existingCustomer by repository.currentCustomer.collectAsState()

    var name by remember { mutableStateOf(existingCustomer?.name ?: "") }
    var phone by remember { mutableStateOf(existingCustomer?.phone ?: "") }
    var email by remember { mutableStateOf(existingCustomer?.email ?: "") }
    var address by remember { mutableStateOf(existingCustomer?.address ?: "") }
    var neighborhood by remember { mutableStateOf(existingCustomer?.neighborhood ?: "") }
    var notes by remember { mutableStateOf(existingCustomer?.deliveryNotes ?: "") }

    var errorMessage by remember { mutableStateOf<String?>(null) }
    var successSaved by remember { mutableStateOf(false) }

    fun handleSave() {
        if (name.trim().isBlank()) {
            errorMessage = "Por favor ingresa tu nombre completo"
            return
        }
        if (phone.trim().isBlank() || phone.length < 7) {
            errorMessage = "Por favor ingresa un teléfono o WhatsApp de contacto válido"
            return
        }
        if (address.trim().isBlank()) {
            errorMessage = "Por favor ingresa tu dirección principal de entrega"
            return
        }

        errorMessage = null
        val customer = Customer(
            id = existingCustomer?.id ?: "cust-${System.currentTimeMillis() % 10000}",
            name = name.trim(),
            phone = phone.trim(),
            email = email.trim(),
            address = address.trim(),
            neighborhood = neighborhood.trim(),
            deliveryNotes = notes.trim()
        )
        repository.registerCustomer(customer)
        successSaved = true
        onSaved()
    }

    Scaffold(
        containerColor = BeffgerCream,
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = if (existingCustomer != null) "Mi Perfil BEFFGER" else "Registro de Cliente",
                        fontWeight = FontWeight.Black,
                        color = BeffgerCream,
                        fontSize = 18.sp
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Text("←", color = BeffgerCream, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = BeffgerCharcoal)
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            // Header Card
            Card(
                colors = CardDefaults.cardColors(containerColor = BeffgerCharcoal),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        color = BeffgerOrange,
                        shape = CircleShape,
                        modifier = Modifier.size(52.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text("👤", fontSize = 26.sp)
                        }
                    }

                    Spacer(modifier = Modifier.size(14.dp))

                    Column {
                        Text(
                            text = if (existingCustomer != null) "Tus Datos Guardados" else "¡Únete al Sabor de la Calle!",
                            fontWeight = FontWeight.Black,
                            color = BeffgerWhite,
                            fontSize = 16.sp
                        )
                        Text(
                            text = "Tus datos quedarán guardados en el CRM de BEFFGER para agilizar todos tus pedidos.",
                            color = BeffgerCream.copy(alpha = 0.8f),
                            fontSize = 12.sp,
                            lineHeight = 16.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Form Card
            Card(
                colors = CardDefaults.cardColors(containerColor = BeffgerWhite),
                shape = RoundedCornerShape(20.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = "INFORMACIÓN DE CONTACTO",
                        fontWeight = FontWeight.Black,
                        fontSize = 12.sp,
                        color = BeffgerOrange,
                        letterSpacing = 1.sp
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Nombre Completo *") },
                        placeholder = { Text("Ej: Carlos Rodríguez") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = BeffgerOrange,
                            focusedLabelColor = BeffgerOrange
                        )
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = phone,
                        onValueChange = { phone = it },
                        label = { Text("Celular / WhatsApp *") },
                        placeholder = { Text("Ej: 310 123 4567") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = BeffgerOrange,
                            focusedLabelColor = BeffgerOrange
                        )
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = email,
                        onValueChange = { email = it },
                        label = { Text("Correo Electrónico (Opcional)") },
                        placeholder = { Text("Ej: carlos@gmail.com") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = BeffgerOrange,
                            focusedLabelColor = BeffgerOrange
                        )
                    )

                    Spacer(modifier = Modifier.height(24.dp))

                    Text(
                        text = "DIRECCIÓN DE ENTREGA HABITUAL",
                        fontWeight = FontWeight.Black,
                        fontSize = 12.sp,
                        color = BeffgerOrange,
                        letterSpacing = 1.sp
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = address,
                        onValueChange = { address = it },
                        label = { Text("Dirección de Entrega *") },
                        placeholder = { Text("Ej: Carrera 15 # 85-30") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = BeffgerOrange,
                            focusedLabelColor = BeffgerOrange
                        )
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = neighborhood,
                        onValueChange = { neighborhood = it },
                        label = { Text("Barrio o Sector") },
                        placeholder = { Text("Ej: El Poblado / Chapinero") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = BeffgerOrange,
                            focusedLabelColor = BeffgerOrange
                        )
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = notes,
                        onValueChange = { notes = it },
                        label = { Text("Detalles de Entrega / Referencias") },
                        placeholder = { Text("Ej: Apto 402 Torre 3, dejar en portería") },
                        modifier = Modifier.fillMaxWidth(),
                        maxLines = 3,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = BeffgerOrange,
                            focusedLabelColor = BeffgerOrange
                        )
                    )

                    if (errorMessage != null) {
                        Spacer(modifier = Modifier.height(14.dp))
                        Surface(
                            color = Color(0xFFFEE2E2),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = "⚠️ ${errorMessage}",
                                color = Color(0xFFDC2626),
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                modifier = Modifier.padding(10.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    Button(
                        onClick = { handleSave() },
                        colors = ButtonDefaults.buttonColors(containerColor = BeffgerOrange),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp)
                    ) {
                        Text(
                            text = if (existingCustomer != null) "ACTUALIZAR DATOS" else "GUARDAR MI PERFIL",
                            fontWeight = FontWeight.Black,
                            fontSize = 15.sp,
                            color = BeffgerWhite
                        )
                    }
                }
            }
        }
    }
}
