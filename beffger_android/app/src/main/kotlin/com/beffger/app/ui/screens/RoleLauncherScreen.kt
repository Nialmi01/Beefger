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
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.beffger.app.R
import com.beffger.app.model.AppRole
import com.beffger.app.ui.theme.BeffgerCharcoal
import com.beffger.app.ui.theme.BeffgerCream
import com.beffger.app.ui.theme.BeffgerGreen
import com.beffger.app.ui.theme.BeffgerOrange
import com.beffger.app.ui.theme.BeffgerRed
import com.beffger.app.ui.theme.BeffgerWhite
import com.beffger.app.ui.theme.BeffgerYellow

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RoleLauncherScreen(
    onSelectRole: (AppRole) -> Unit
) {
    Scaffold(
        containerColor = BeffgerCream
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Header Logo
            Surface(
                color = BeffgerCharcoal,
                shape = RoundedCornerShape(20.dp),
                shadowElevation = 6.dp,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 20.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.beffger_logo_horizontal),
                        contentDescription = "BEFFGER",
                        modifier = Modifier
                            .height(55.dp)
                            .fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "ECOSISTEMA DIGITAL INTEGRADO",
                        fontWeight = FontWeight.Black,
                        fontSize = 12.sp,
                        letterSpacing = 2.sp,
                        color = BeffgerYellow
                    )
                    Text(
                        text = "Selecciona la aplicación independiente que deseas abrir:",
                        fontSize = 13.sp,
                        color = BeffgerCream.copy(alpha = 0.8f),
                        modifier = Modifier.padding(top = 4.dp)
                    )
                }
            }

            // 5 Role Cards
            val roleCards = listOf(
                AppRole.CLIENTE to Triple(
                    "App Clientes Beffger",
                    "Catálogo completo con 16 recetas de hamburguesas, perros calientes, pizzas y complementos, con personalización de adiciones, carrito, Wompi y rastreo en vivo.",
                    BeffgerOrange
                ),
                AppRole.DOMICILIARIO to Triple(
                    "App Domiciliarios / Riders",
                    "Recepción de pedidos listos, navegación GPS, cobro en efectivo / datáfono y contacto directo por WhatsApp.",
                    Color(0xFF0D9488)
                ),
                AppRole.COCINA to Triple(
                    "App Cocina KDS (Parrilla & Horno)",
                    "Kitchen Display System de alta visibilidad, filtros por estación (Hamburguesas, Perros, Pizzas) y tiempos de cocción.",
                    Color(0xFFE11D48)
                ),
                AppRole.MESERO to Triple(
                    "App Meseros POS (Salón)",
                    "Mapa interactivo de 12 mesas, apertura de cuentas, toma de comanda directa a cocina y cierre de mesas.",
                    Color(0xFF2563EB)
                ),
                AppRole.ADMIN to Triple(
                    "App Administrador & Gerencia",
                    "Métricas de ventas en tiempo real, arqueo de caja diario, control de catálogo de productos y monitoreo global.",
                    Color(0xFF7C3AED)
                )
            )

            Column(
                verticalArrangement = Arrangement.spacedBy(14.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                roleCards.forEach { (role, info) ->
                    val (title, desc, accentColor) = info

                    Card(
                        colors = CardDefaults.cardColors(containerColor = BeffgerWhite),
                        shape = RoundedCornerShape(18.dp),
                        elevation = CardDefaults.cardElevation(defaultElevation = 3.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onSelectRole(role) }
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            // Role Icon Box
                            Box(
                                modifier = Modifier
                                    .size(56.dp)
                                    .background(accentColor.copy(alpha = 0.15f), RoundedCornerShape(14.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(role.icon, fontSize = 28.sp)
                            }

                            Spacer(modifier = Modifier.width(14.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = title,
                                    fontWeight = FontWeight.Black,
                                    fontSize = 17.sp,
                                    color = BeffgerCharcoal
                                )
                                Text(
                                    text = desc,
                                    fontSize = 12.sp,
                                    color = Color.DarkGray,
                                    lineHeight = 17.sp,
                                    modifier = Modifier.padding(top = 4.dp)
                                )
                            }

                            Spacer(modifier = Modifier.width(8.dp))

                            Text("→", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = accentColor)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
            Text(
                text = "BEFFGER v1.0 • Android Native Multi-Role System",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Gray
            )
        }
    }
}
