package com.beffger.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = BeffgerOrange,
    onPrimary = BeffgerWhite,
    primaryContainer = BeffgerCharcoal,
    onPrimaryContainer = BeffgerCream,
    secondary = BeffgerYellow,
    onSecondary = BeffgerCharcoal,
    background = BeffgerCharcoal,
    onBackground = BeffgerCream,
    surface = BeffgerDarkSurface,
    onSurface = BeffgerCream,
    surfaceVariant = BeffgerCharcoal,
    onSurfaceVariant = BeffgerCream,
)

private val LightColorScheme = lightColorScheme(
    primary = BeffgerOrange,
    onPrimary = BeffgerWhite,
    primaryContainer = BeffgerCream,
    onPrimaryContainer = BeffgerCharcoal,
    secondary = BeffgerYellow,
    onSecondary = BeffgerCharcoal,
    background = BeffgerCream,
    onBackground = BeffgerTextDark,
    surface = BeffgerWhite,
    onSurface = BeffgerTextDark,
    surfaceVariant = BeffgerSurfaceVariant,
    onSurfaceVariant = BeffgerTextMuted,
    outline = BeffgerOutline,
)

@Composable
fun BEFFGERTheme(
    darkTheme: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
