package com.beffger.app.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
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
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
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
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateMapOf
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
import com.beffger.app.model.ModifierOption
import com.beffger.app.model.ProductCategory
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
fun ProductDetailScreen(
    productId: String,
    repository: BeffgerRepository,
    onBack: () -> Unit,
    onAddedToCart: () -> Unit
) {
    val product = repository.sampleProducts.find { it.id == productId }
        ?: repository.sampleProducts.first()

    val currencyFormat = remember {
        NumberFormat.getCurrencyInstance(Locale("es", "CO")).apply {
            maximumFractionDigits = 0
        }
    }

    var quantity by remember { mutableIntStateOf(1) }
    var notes by remember { mutableStateOf("") }

    // Selected single choices (group -> optionId)
    val selectedSingleChoices = remember {
        mutableStateMapOf<String, String>().apply {
            product.modifierGroups.filter { !it.isMultiSelect }.forEach { group ->
                group.options.firstOrNull()?.let { opt -> put(group.id, opt.id) }
            }
        }
    }

    // Selected multi choices (optionId -> Boolean)
    val selectedMultiChoices = remember { mutableStateMapOf<String, Boolean>() }

    // Calculate total price
    val basePrice = product.price
    var extrasPrice = 0
    product.modifierGroups.forEach { group ->
        if (group.isMultiSelect) {
            group.options.forEach { opt ->
                if (selectedMultiChoices[opt.id] == true) {
                    extrasPrice += opt.price
                }
            }
        } else {
            val selectedId = selectedSingleChoices[group.id]
            group.options.find { it.id == selectedId }?.let { opt ->
                extrasPrice += opt.price
            }
        }
    }
    val unitPrice = basePrice + extrasPrice
    val totalPrice = unitPrice * quantity

    Scaffold(
        containerColor = BeffgerCream,
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = product.name,
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
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = BeffgerCharcoal
                )
            )
        },
        bottomBar = {
            // Sticky Add To Cart Bar
            Surface(
                color = BeffgerCharcoal,
                shadowElevation = 12.dp
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    // Quantity +/-
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .background(Color.White.copy(alpha = 0.15f), RoundedCornerShape(24.dp))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        IconButton(
                            onClick = { if (quantity > 1) quantity-- },
                            modifier = Modifier.size(36.dp)
                        ) {
                            Text("-", color = BeffgerCream, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                        }
                        Text(
                            text = "$quantity",
                            color = BeffgerCream,
                            fontWeight = FontWeight.Black,
                            fontSize = 18.sp,
                            modifier = Modifier.padding(horizontal = 10.dp)
                        )
                        IconButton(
                            onClick = { quantity++ },
                            modifier = Modifier.size(36.dp)
                        ) {
                            Text("+", color = BeffgerCream, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    // Add Button
                    Button(
                        onClick = {
                            val selectedModifiers = mutableListOf<ModifierOption>()
                            product.modifierGroups.forEach { group ->
                                if (group.isMultiSelect) {
                                    group.options.forEach { opt ->
                                        if (selectedMultiChoices[opt.id] == true) {
                                            selectedModifiers.add(opt)
                                        }
                                    }
                                } else {
                                    val selId = selectedSingleChoices[group.id]
                                    group.options.find { it.id == selId }?.let { opt ->
                                        selectedModifiers.add(opt)
                                    }
                                }
                            }
                            repository.addToCart(
                                product = product,
                                quantity = quantity,
                                selectedModifiers = selectedModifiers,
                                notes = notes
                            )
                            onAddedToCart()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = BeffgerOrange),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier
                            .height(50.dp)
                            .padding(start = 12.dp)
                            .weight(1f)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = "Agregar a la Orden",
                                fontWeight = FontWeight.Black,
                                color = BeffgerWhite,
                                fontSize = 15.sp
                            )
                            Text(
                                text = currencyFormat.format(totalPrice),
                                fontWeight = FontWeight.Black,
                                color = BeffgerYellow,
                                fontSize = 15.sp
                            )
                        }
                    }
                }
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
        ) {
            // Product Hero Image
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(280.dp)
                    .background(BeffgerCharcoal)
            ) {
                Image(
                    painter = painterResource(id = product.drawableRes),
                    contentDescription = product.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
                // Category Chip Tag
                Surface(
                    color = BeffgerOrange,
                    shape = RoundedCornerShape(topEnd = 12.dp, bottomEnd = 12.dp),
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(top = 16.dp)
                ) {
                    Text(
                        text = product.category.displayName.uppercase(),
                        color = BeffgerWhite,
                        fontWeight = FontWeight.Black,
                        fontSize = 11.sp,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                    )
                }
            }

            // Info Card
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                // Name & Price
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = product.name,
                            fontWeight = FontWeight.Black,
                            fontSize = 26.sp,
                            color = BeffgerCharcoal
                        )
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(top = 4.dp)
                        ) {
                            Text("★ 4.9", color = BeffgerOrange, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            Text(" • ", color = Color.Gray, fontSize = 13.sp)
                            Text("⏱ 15-25 min", color = Color.DarkGray, fontSize = 13.sp)
                            Text(" • ", color = Color.Gray, fontSize = 13.sp)
                            Text("Gourmet Urbano", color = BeffgerGreen, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        }
                    }
                    Text(
                        text = currencyFormat.format(product.price),
                        fontWeight = FontWeight.Black,
                        fontSize = 22.sp,
                        color = BeffgerOrange
                    )
                }

                // Description
                Text(
                    text = product.description,
                    color = Color.DarkGray,
                    fontSize = 14.sp,
                    lineHeight = 20.sp,
                    modifier = Modifier.padding(top = 12.dp)
                )

                // Ingredients List
                Text(
                    text = "Ingredientes Artesanales:",
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = BeffgerCharcoal,
                    modifier = Modifier.padding(top = 16.dp, bottom = 8.dp)
                )
                Surface(
                    color = BeffgerWhite,
                    shape = RoundedCornerShape(12.dp),
                    shadowElevation = 1.dp,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        product.ingredients.forEach { ing ->
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(vertical = 3.dp)
                            ) {
                                Text("✔", color = BeffgerOrange, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(ing, color = BeffgerCharcoal, fontSize = 13.sp)
                            }
                        }
                    }
                }

                // Modifiers Groups
                product.modifierGroups.forEach { group ->
                    Text(
                        text = group.name + if (!group.isMultiSelect) " (Obligatorio)" else " (Opcional)",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = BeffgerCharcoal,
                        modifier = Modifier.padding(top = 20.dp, bottom = 8.dp)
                    )

                    Card(
                        colors = CardDefaults.cardColors(containerColor = BeffgerWhite),
                        shape = RoundedCornerShape(12.dp),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(8.dp)) {
                            group.options.forEach { opt ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable {
                                            if (group.isMultiSelect) {
                                                selectedMultiChoices[opt.id] = !(selectedMultiChoices[opt.id] ?: false)
                                            } else {
                                                selectedSingleChoices[group.id] = opt.id
                                            }
                                        }
                                        .padding(horizontal = 8.dp, vertical = 6.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        if (group.isMultiSelect) {
                                            Checkbox(
                                                checked = selectedMultiChoices[opt.id] == true,
                                                onCheckedChange = { selectedMultiChoices[opt.id] = it },
                                                colors = CheckboxDefaults.colors(checkedColor = BeffgerOrange)
                                            )
                                        } else {
                                            RadioButton(
                                                selected = selectedSingleChoices[group.id] == opt.id,
                                                onClick = { selectedSingleChoices[group.id] = opt.id },
                                                colors = RadioButtonDefaults.colors(selectedColor = BeffgerOrange)
                                            )
                                        }
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text(
                                            text = opt.name,
                                            color = BeffgerCharcoal,
                                            fontSize = 14.sp,
                                            fontWeight = FontWeight.Medium
                                        )
                                    }

                                    if (opt.price > 0) {
                                        Text(
                                            text = "+${currencyFormat.format(opt.price)}",
                                            color = BeffgerOrange,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 13.sp
                                        )
                                    }
                                }
                            }
                        }
                    }
                }

                // Special Instructions Notes
                Text(
                    text = "Instrucciones Especiales para Cocina:",
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = BeffgerCharcoal,
                    modifier = Modifier.padding(top = 20.dp, bottom = 8.dp)
                )
                OutlinedTextField(
                    value = notes,
                    onValueChange = { notes = it },
                    placeholder = { Text("Ej: Salsas aparte, tocineta extra crocante, sin pepinillos...") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = BeffgerWhite,
                        unfocusedContainerColor = BeffgerWhite,
                        focusedBorderColor = BeffgerOrange,
                        unfocusedBorderColor = Color.LightGray
                    ),
                    minLines = 3,
                    maxLines = 5
                )

                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}
