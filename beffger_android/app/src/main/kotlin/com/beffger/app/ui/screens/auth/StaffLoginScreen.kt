package com.beffger.app.ui.screens.auth

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
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
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
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.beffger.app.R
import com.beffger.app.data.BeffgerRepository
import com.beffger.app.model.AppRole
import com.beffger.app.ui.theme.BeffgerCharcoal
import com.beffger.app.ui.theme.BeffgerCream
import com.beffger.app.ui.theme.BeffgerGreen
import com.beffger.app.ui.theme.BeffgerOrange
import com.beffger.app.ui.theme.BeffgerWhite
import com.beffger.app.ui.theme.BeffgerYellow

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StaffLoginScreen(
    role: AppRole,
    repository: BeffgerRepository,
    onLoginSuccess: () -> Unit
) {
    val defaultUser = when (role) {
        AppRole.DOMICILIARIO -> "rider@beffger.com"
        AppRole.COCINA -> "cocina@beffger.com"
        AppRole.MESERO -> "mesero@beffger.com"
        AppRole.ADMIN -> "admin@beffger.com"
        AppRole.CLIENTE -> ""
    }

    val defaultPass = when (role) {
        AppRole.DOMICILIARIO -> "rider123"
        AppRole.COCINA -> "cocina123"
        AppRole.MESERO -> "mesero123"
        AppRole.ADMIN -> "admin123"
        AppRole.CLIENTE -> ""
    }

    var username by remember { mutableStateOf(defaultUser) }
    var password by remember { mutableStateOf(defaultPass) }
    var passwordVisible by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    val roleThemeColor = when (role) {
        AppRole.DOMICILIARIO -> Color(0xFF3B82F6) // Blue
        AppRole.COCINA -> Color(0xFFEF4444)       // Red
        AppRole.MESERO -> Color(0xFF10B981)       // Green
        AppRole.ADMIN -> Color(0xFF8B5CF6)        // Purple
        AppRole.CLIENTE -> BeffgerOrange
    }

    fun handleLogin() {
        if (username.isBlank() || password.isBlank()) {
            errorMessage = "Ingresa tu usuario y contraseña"
            return
        }

        val success = repository.authenticateStaff(role, username, password)
        if (success) {
            errorMessage = null
            onLoginSuccess()
        } else {
            errorMessage = "Credenciales incorrectas para el perfil ${role.title}"
        }
    }

    Scaffold(
        containerColor = BeffgerCream
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Horizontal Logo
            Image(
                painter = painterResource(id = R.drawable.beffger_logo_horizontal),
                contentDescription = "BEFFGER",
                modifier = Modifier
                    .height(48.dp)
                    .fillMaxWidth(),
                contentScale = ContentScale.Fit
            )

            Spacer(modifier = Modifier.height(28.dp))

            // Role Card Header
            Card(
                colors = CardDefaults.cardColors(containerColor = BeffgerCharcoal),
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Surface(
                        color = roleThemeColor,
                        shape = CircleShape,
                        modifier = Modifier.size(64.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(role.icon, fontSize = 32.sp)
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = "BEFFGER ${role.title.uppercase()}",
                        fontWeight = FontWeight.Black,
                        fontSize = 20.sp,
                        color = BeffgerWhite
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = "Acceso Operativo Seguro",
                        fontSize = 12.sp,
                        color = BeffgerYellow,
                        fontWeight = FontWeight.Bold
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Text(
                        text = "Ingresa tus credenciales asignadas para iniciar tu turno.",
                        fontSize = 12.sp,
                        color = BeffgerCream.copy(alpha = 0.8f),
                        lineHeight = 16.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Login Form Card
            Card(
                colors = CardDefaults.cardColors(containerColor = BeffgerWhite),
                shape = RoundedCornerShape(24.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(24.dp)) {
                    Text(
                        text = "INICIAR SESIÓN",
                        fontWeight = FontWeight.Black,
                        fontSize = 12.sp,
                        color = BeffgerCharcoal,
                        letterSpacing = 1.sp
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    OutlinedTextField(
                        value = username,
                        onValueChange = {
                            username = it
                            errorMessage = null
                        },
                        label = { Text("Usuario o Correo Institucional") },
                        placeholder = { Text(defaultUser) },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = roleThemeColor,
                            focusedLabelColor = roleThemeColor
                        )
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    OutlinedTextField(
                        value = password,
                        onValueChange = {
                            password = it
                            errorMessage = null
                        },
                        label = { Text("Contraseña") },
                        placeholder = { Text("••••••••") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                        trailingIcon = {
                            IconButton(onClick = { passwordVisible = !passwordVisible }) {
                                Text(if (passwordVisible) "👁️" else "🙈", fontSize = 16.sp)
                            }
                        },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = roleThemeColor,
                            focusedLabelColor = roleThemeColor
                        )
                    )

                    if (errorMessage != null) {
                        Spacer(modifier = Modifier.height(12.dp))
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

                    Spacer(modifier = Modifier.height(14.dp))

                    // Credential hint pill
                    Surface(
                        color = BeffgerCream,
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                username = defaultUser
                                password = defaultPass
                            }
                    ) {
                        Row(
                            modifier = Modifier.padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("🔑", fontSize = 14.sp)
                            Spacer(modifier = Modifier.size(8.dp))
                            Text(
                                text = "Demo: $defaultUser / $defaultPass (Toca para autocompletar)",
                                fontSize = 11.sp,
                                color = BeffgerCharcoal.copy(alpha = 0.8f),
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(20.dp))

                    Button(
                        onClick = { handleLogin() },
                        colors = ButtonDefaults.buttonColors(containerColor = roleThemeColor),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp)
                    ) {
                        Text(
                            text = "ENTRAR AL MÓDULO",
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
