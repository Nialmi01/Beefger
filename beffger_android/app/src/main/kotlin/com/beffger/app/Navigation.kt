package com.beffger.app

import android.app.Activity
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext
import androidx.navigation3.runtime.entryProvider
import androidx.navigation3.runtime.rememberNavBackStack
import androidx.navigation3.ui.NavDisplay
import com.beffger.app.data.BeffgerRepository
import com.beffger.app.model.AppRole
import com.beffger.app.ui.screens.CheckoutScreen
import com.beffger.app.ui.screens.HomeScreen
import com.beffger.app.ui.screens.OrderTrackingScreen
import com.beffger.app.ui.screens.ProductDetailScreen
import com.beffger.app.ui.screens.RoleLauncherScreen
import com.beffger.app.ui.screens.admin.AdminAppScreen
import com.beffger.app.ui.screens.auth.StaffLoginScreen
import com.beffger.app.ui.screens.customer.CustomerProfileScreen
import com.beffger.app.ui.screens.kds.KdsAppScreen
import com.beffger.app.ui.screens.mesero.MeseroAppScreen
import com.beffger.app.ui.screens.rider.RiderAppScreen

@Composable
fun MainNavigation(appRole: String = BuildConfig.APP_ROLE) {
    val repository = BeffgerRepository.instance
    val context = LocalContext.current
    val activity = context as? Activity

    // Select start screen based on Flavor / Role & Security Authentication
    // Staff roles (DOMICILIARIO, COCINA, MESERO, ADMIN) MUST log in first!
    val initialKey = when (appRole.uppercase()) {
        "DOMICILIARIO" -> StaffLoginNavKey(AppRole.DOMICILIARIO)
        "COCINA" -> StaffLoginNavKey(AppRole.COCINA)
        "MESERO" -> StaffLoginNavKey(AppRole.MESERO)
        "ADMIN" -> StaffLoginNavKey(AppRole.ADMIN)
        "CLIENTE" -> ClienteHomeNavKey
        else -> LauncherNavKey
    }

    val backStack = rememberNavBackStack(initialKey)
    val isStandaloneRole = appRole.uppercase() in listOf("CLIENTE", "DOMICILIARIO", "COCINA", "MESERO", "ADMIN")

    fun handleExitOrBack() {
        if (backStack.size > 1) {
            backStack.removeLastOrNull()
        } else {
            activity?.finish()
        }
    }

    NavDisplay(
        backStack = backStack,
        onBack = { handleExitOrBack() },
        entryProvider = entryProvider {
            // Master Role Launcher (used only if no specific flavor role or for dev testing)
            entry<LauncherNavKey> {
                RoleLauncherScreen(
                    onSelectRole = { role ->
                        when (role) {
                            AppRole.CLIENTE -> backStack.add(ClienteHomeNavKey)
                            AppRole.DOMICILIARIO -> backStack.add(StaffLoginNavKey(AppRole.DOMICILIARIO))
                            AppRole.COCINA -> backStack.add(StaffLoginNavKey(AppRole.COCINA))
                            AppRole.MESERO -> backStack.add(StaffLoginNavKey(AppRole.MESERO))
                            AppRole.ADMIN -> backStack.add(StaffLoginNavKey(AppRole.ADMIN))
                        }
                    }
                )
            }

            // 🔐 Staff Login Authentication Gate for Operational Roles
            entry<StaffLoginNavKey> { key ->
                StaffLoginScreen(
                    role = key.role,
                    repository = repository,
                    onLoginSuccess = {
                        backStack.removeLastOrNull()
                        when (key.role) {
                            AppRole.DOMICILIARIO -> backStack.add(RiderNavKey)
                            AppRole.COCINA -> backStack.add(KdsNavKey)
                            AppRole.MESERO -> backStack.add(MeseroNavKey)
                            AppRole.ADMIN -> backStack.add(AdminNavKey)
                            AppRole.CLIENTE -> backStack.add(ClienteHomeNavKey)
                        }
                    }
                )
            }

            // 🍔 1. App Clientes
            entry<ClienteHomeNavKey> {
                HomeScreen(
                    repository = repository,
                    onProductClick = { product ->
                        backStack.add(ProductDetailNavKey(product.id))
                    },
                    onCartClick = {
                        backStack.add(CheckoutNavKey)
                    },
                    onProfileClick = {
                        backStack.add(CustomerProfileNavKey)
                    },
                    onStaffClick = {
                        if (!isStandaloneRole) {
                            handleExitOrBack()
                        }
                    },
                    onOrdersClick = {
                        val activeOrder = repository.orders.value.firstOrNull()
                        if (activeOrder != null) {
                            backStack.add(OrderTrackingNavKey(activeOrder.id))
                        }
                    }
                )
            }

            // 👤 Customer CRM Profile & Registration
            entry<CustomerProfileNavKey> {
                CustomerProfileScreen(
                    repository = repository,
                    onBack = { handleExitOrBack() },
                    onSaved = { handleExitOrBack() }
                )
            }

            entry<ProductDetailNavKey> { key ->
                ProductDetailScreen(
                    productId = key.productId,
                    repository = repository,
                    onBack = { handleExitOrBack() },
                    onAddedToCart = { handleExitOrBack() }
                )
            }

            entry<CheckoutNavKey> {
                CheckoutScreen(
                    repository = repository,
                    onBack = { handleExitOrBack() },
                    onOrderPlaced = { orderId ->
                        backStack.removeLastOrNull()
                        backStack.add(OrderTrackingNavKey(orderId))
                    }
                )
            }

            entry<OrderTrackingNavKey> { key ->
                OrderTrackingScreen(
                    orderId = key.orderId,
                    repository = repository,
                    onBack = { handleExitOrBack() },
                    onGoHome = {
                        while (backStack.size > 1) {
                            backStack.removeLastOrNull()
                        }
                    }
                )
            }

            // 🛵 2. App Domiciliarios
            entry<RiderNavKey> {
                RiderAppScreen(
                    repository = repository,
                    onBackToLauncher = {
                        repository.logoutStaff()
                        backStack.removeLastOrNull()
                        backStack.add(StaffLoginNavKey(AppRole.DOMICILIARIO))
                    },
                    onViewTracking = { orderId ->
                        backStack.add(OrderTrackingNavKey(orderId))
                    }
                )
            }

            // 🍳 3. App Cocina KDS
            entry<KdsNavKey> {
                KdsAppScreen(
                    repository = repository,
                    onBackToLauncher = {
                        repository.logoutStaff()
                        backStack.removeLastOrNull()
                        backStack.add(StaffLoginNavKey(AppRole.COCINA))
                    }
                )
            }

            // 👔 4. App Meseros POS
            entry<MeseroNavKey> {
                MeseroAppScreen(
                    repository = repository,
                    onBackToLauncher = {
                        repository.logoutStaff()
                        backStack.removeLastOrNull()
                        backStack.add(StaffLoginNavKey(AppRole.MESERO))
                    }
                )
            }

            // 👑 5. App Administrador
            entry<AdminNavKey> {
                AdminAppScreen(
                    repository = repository,
                    onBackToLauncher = {
                        repository.logoutStaff()
                        backStack.removeLastOrNull()
                        backStack.add(StaffLoginNavKey(AppRole.ADMIN))
                    }
                )
            }
        }
    )
}
