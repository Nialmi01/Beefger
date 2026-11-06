package com.beffger.app.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
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
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.beffger.app.R
import com.beffger.app.data.BeffgerRepository
import com.beffger.app.model.Product
import com.beffger.app.model.ProductCategory
import com.beffger.app.ui.theme.BeffgerCharcoal
import com.beffger.app.ui.theme.BeffgerCream
import com.beffger.app.ui.theme.BeffgerGreen
import com.beffger.app.ui.theme.BeffgerOrange
import com.beffger.app.ui.theme.BeffgerRed
import com.beffger.app.ui.theme.BeffgerWhite
import com.beffger.app.ui.theme.BeffgerYellow

@Composable
fun HomeScreen(
    repository: BeffgerRepository,
    onProductClick: (Product) -> Unit,
    onCartClick: () -> Unit,
    onOrdersClick: () -> Unit,
    onProfileClick: () -> Unit,
    onStaffClick: () -> Unit = {}
) {
    var selectedCategory by remember { mutableStateOf(ProductCategory.ALL) }
    val cartItems by repository.cartItems.collectAsState()
    val customer by repository.currentCustomer.collectAsState()
    val itemCount = cartItems.sumOf { it.quantity }
    val subtotal = cartItems.sumOf { it.totalPrice }

    val filteredProducts = remember(selectedCategory) {
        if (selectedCategory == ProductCategory.ALL) {
            repository.sampleProducts
        } else {
            repository.sampleProducts.filter { it.category == selectedCategory }
        }
    }

    Scaffold(
        containerColor = BeffgerCream,
        topBar = {
            // Brand Top Header Bar (Street Dark Theme)
            Surface(
                color = BeffgerCharcoal,
                shadowElevation = 6.dp
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Official Horizontal Logo
                        Image(
                            painter = painterResource(id = R.drawable.beffger_logo_horizontal),
                            contentDescription = "BEFFGER - La Calle Tiene Sabor",
                            modifier = Modifier
                                .height(38.dp)
                                .clickable { /* Refresh */ },
                            contentScale = ContentScale.Fit
                        )

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            // Customer Profile / CRM Registration
                            IconButton(onClick = onProfileClick) {
                                Surface(
                                    color = if (customer != null) BeffgerGreen.copy(alpha = 0.3f) else Color.White.copy(alpha = 0.15f),
                                    shape = CircleShape,
                                    modifier = Modifier.size(36.dp)
                                ) {
                                    Box(contentAlignment = Alignment.Center) {
                                        Text(if (customer != null) "👤" else "📝", fontSize = 16.sp)
                                    }
                                }
                            }

                            // Orders tracking icon
                            IconButton(onClick = onOrdersClick) {
                                Surface(
                                    color = Color.White.copy(alpha = 0.15f),
                                    shape = CircleShape,
                                    modifier = Modifier.size(36.dp)
                                ) {
                                    Box(contentAlignment = Alignment.Center) {
                                        Text("📋", fontSize = 16.sp)
                                    }
                                }
                            }

                            // Cart Trigger with Badge
                            IconButton(onClick = onCartClick) {
                                BadgedBox(
                                    badge = {
                                        if (itemCount > 0) {
                                            Badge(
                                                containerColor = BeffgerOrange,
                                                contentColor = BeffgerWhite
                                            ) {
                                                Text(itemCount.toString(), fontWeight = FontWeight.Bold)
                                            }
                                        }
                                    }
                                ) {
                                    Surface(
                                        color = BeffgerOrange.copy(alpha = 0.2f),
                                        shape = CircleShape,
                                        modifier = Modifier.size(36.dp)
                                    ) {
                                        Box(contentAlignment = Alignment.Center) {
                                            Text("🛍️", fontSize = 16.sp)
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Live Store Status or Customer Greeting
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(top = 4.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .background(BeffgerGreen, CircleShape)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        if (customer != null) {
                            Text(
                                text = "HOLA, ${customer!!.name.uppercase()} • ${customer!!.address.uppercase()}",
                                color = BeffgerYellow,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Black,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        } else {
                            Text(
                                text = "ABIERTO AHORA • ENVÍOS 30-45 MIN",
                                color = BeffgerYellow,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.sp
                            )
                        }
                    }
                }
            }
        },
        bottomBar = {
            // Floating Sticky Cart Pill
            if (itemCount > 0) {
                Surface(
                    color = BeffgerCream,
                    modifier = Modifier.padding(16.dp)
                ) {
                    Button(
                        onClick = onCartClick,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = BeffgerOrange),
                        shape = RoundedCornerShape(20.dp),
                        elevation = ButtonDefaults.buttonElevation(defaultElevation = 8.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Surface(
                                    color = BeffgerWhite,
                                    shape = CircleShape,
                                    modifier = Modifier.size(28.dp)
                                ) {
                                    Box(contentAlignment = Alignment.Center) {
                                        Text(
                                            text = itemCount.toString(),
                                            color = BeffgerOrange,
                                            fontWeight = FontWeight.ExtraBold,
                                            fontSize = 12.sp
                                        )
                                    }
                                }
                                Spacer(modifier = Modifier.width(10.dp))
                                Text(
                                    text = "VER TU PEDIDO",
                                    color = BeffgerWhite,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp
                                )
                            }
                            Text(
                                text = "$${"%,d".format(subtotal).replace(',', '.')} COP →",
                                color = BeffgerWhite,
                                fontWeight = FontWeight.ExtraBold,
                                fontSize = 15.sp
                            )
                        }
                    }
                }
            }
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentPadding = PaddingValues(bottom = 24.dp)
        ) {
            // 1. Promotional Street Banner
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = BeffgerCharcoal),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                ) {
                    Column {
                        Image(
                            painter = painterResource(id = R.drawable.beffger_banner),
                            contentDescription = "Promo Street Food BEFFGER",
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(160.dp),
                            contentScale = ContentScale.Crop
                        )
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Surface(
                                    color = BeffgerRed,
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Text(
                                        text = "🔥 PROMO DE BARRIO",
                                        color = BeffgerWhite,
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "LA CALLE TIENE SABOR MONUMENTAL",
                                color = BeffgerWhite,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.ExtraBold
                            )
                            Text(
                                text = "Hamburguesas de 150g, perros de 22cm y pizzas al horno de piedra.",
                                color = BeffgerCream.copy(alpha = 0.85f),
                                fontSize = 12.sp
                            )
                        }
                    }
                }
            }

            // Customer CRM / Loyalty Banner
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 4.dp)
                        .clickable { onProfileClick() },
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = BeffgerWhite),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            color = if (customer != null) BeffgerGreen.copy(alpha = 0.15f) else BeffgerOrange.copy(alpha = 0.15f),
                            shape = CircleShape,
                            modifier = Modifier.size(40.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(if (customer != null) "📍" else "🎁", fontSize = 20.sp)
                            }
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = if (customer != null) "Dirección de Entrega" else "¡Regístrate como Cliente!",
                                fontWeight = FontWeight.Black,
                                fontSize = 13.sp,
                                color = BeffgerCharcoal
                            )
                            Text(
                                text = if (customer != null) "${customer!!.address} • Toca para editar" else "Guarda tu dirección en el CRM para pedir en 1 clic.",
                                fontSize = 11.sp,
                                color = BeffgerCharcoal.copy(alpha = 0.7f),
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                        Text(
                            text = if (customer != null) "EDITAR →" else "REGISTRARME →",
                            color = BeffgerOrange,
                            fontWeight = FontWeight.Black,
                            fontSize = 11.sp
                        )
                    }
                }
            }

            // 2. Category Selector Chips
            item {
                LazyRow(
                    modifier = Modifier.fillMaxWidth(),
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(ProductCategory.entries) { cat ->
                        val isSelected = selectedCategory == cat
                        FilterChip(
                            selected = isSelected,
                            onClick = { selectedCategory = cat },
                            label = {
                                Text(
                                    text = cat.displayName,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                    fontSize = 12.sp
                                )
                            },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = BeffgerOrange,
                                selectedLabelColor = BeffgerWhite,
                                containerColor = BeffgerWhite,
                                labelColor = BeffgerCharcoal
                            ),
                            shape = RoundedCornerShape(16.dp),
                            border = FilterChipDefaults.filterChipBorder(
                                enabled = true,
                                selected = isSelected,
                                borderColor = if (isSelected) BeffgerOrange else Color(0xFFDEC0B1)
                            )
                        )
                    }
                }
                Spacer(modifier = Modifier.height(12.dp))
            }

            // 3. Section Title
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = selectedCategory.displayName.uppercase(),
                        fontWeight = FontWeight.ExtraBold,
                        fontSize = 16.sp,
                        color = BeffgerCharcoal,
                        letterSpacing = 0.5.sp
                    )
                    Text(
                        text = "${filteredProducts.size} recetas",
                        fontSize = 11.sp,
                        color = Color(0xFF8B7265)
                    )
                }
            }

            // 4. Products List
            items(filteredProducts) { product ->
                ProductCard(
                    product = product,
                    onClick = { onProductClick(product) }
                )
            }
        }
    }
}

@Composable
fun ProductCard(
    product: Product,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = BeffgerWhite),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Food Image with rounded border
            Box(
                modifier = Modifier
                    .size(105.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(BeffgerCharcoal)
            ) {
                Image(
                    painter = painterResource(id = product.imageRes),
                    contentDescription = product.name,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
            }

            Spacer(modifier = Modifier.width(14.dp))

            // Details
            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
            ) {
                if (product.isGourmet && !product.badge.isNullOrBlank()) {
                    Surface(
                        color = Color(0xFFFEF3C7),
                        shape = RoundedCornerShape(6.dp),
                        modifier = Modifier.padding(bottom = 3.dp)
                    ) {
                        Text(
                            text = product.badge,
                            color = Color(0xFF92400E),
                            fontSize = 9.sp,
                            fontWeight = FontWeight.ExtraBold,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }

                Text(
                    text = product.name,
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 16.sp,
                    color = BeffgerCharcoal
                )

                Text(
                    text = product.description,
                    fontSize = 11.sp,
                    color = Color(0xFF574237),
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    lineHeight = 15.sp,
                    modifier = Modifier.padding(vertical = 4.dp)
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "$${"%,d".format(product.price).replace(',', '.')} COP",
                        fontWeight = FontWeight.ExtraBold,
                        fontSize = 15.sp,
                        color = BeffgerOrange
                    )

                    Surface(
                        color = BeffgerOrange,
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = "+ AGREGAR",
                            color = BeffgerWhite,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                        )
                    }
                }
            }
        }
    }
}
