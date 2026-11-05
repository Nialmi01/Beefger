package com.beffger.app

import androidx.navigation3.runtime.NavKey
import com.beffger.app.model.AppRole
import kotlinx.serialization.Serializable

@Serializable data object LauncherNavKey : NavKey
@Serializable data object ClienteHomeNavKey : NavKey
@Serializable data class ProductDetailNavKey(val productId: String) : NavKey
@Serializable data object CheckoutNavKey : NavKey
@Serializable data class OrderTrackingNavKey(val orderId: String) : NavKey
@Serializable data object CustomerProfileNavKey : NavKey
@Serializable data class StaffLoginNavKey(val role: AppRole) : NavKey
@Serializable data object RiderNavKey : NavKey
@Serializable data object KdsNavKey : NavKey
@Serializable data object MeseroNavKey : NavKey
@Serializable data object AdminNavKey : NavKey
