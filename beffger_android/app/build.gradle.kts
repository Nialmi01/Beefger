plugins {
  alias(libs.plugins.android.application)
  alias(libs.plugins.compose.compiler)
  alias(libs.plugins.kotlin.serialization)
}

android {
  namespace = "com.beffger.app"
  compileSdk = 36
  defaultConfig {
    applicationId = "com.beffger.app"
    minSdk = 24
    targetSdk = 36
    versionCode = 1
    versionName = "1.0"
    manifestPlaceholders["appLabel"] = "BEFFGER"
  }

  flavorDimensions += "role"
  productFlavors {
    create("cliente") {
      dimension = "role"
      applicationIdSuffix = ".cliente"
      manifestPlaceholders["appLabel"] = "BEFFGER Clientes"
      buildConfigField("String", "APP_ROLE", "\"CLIENTE\"")
    }
    create("domiciliario") {
      dimension = "role"
      applicationIdSuffix = ".rider"
      manifestPlaceholders["appLabel"] = "BEFFGER Domiciliarios"
      buildConfigField("String", "APP_ROLE", "\"DOMICILIARIO\"")
    }
    create("cocina") {
      dimension = "role"
      applicationIdSuffix = ".kds"
      manifestPlaceholders["appLabel"] = "BEFFGER Cocina KDS"
      buildConfigField("String", "APP_ROLE", "\"COCINA\"")
    }
    create("mesero") {
      dimension = "role"
      applicationIdSuffix = ".mesero"
      manifestPlaceholders["appLabel"] = "BEFFGER Meseros POS"
      buildConfigField("String", "APP_ROLE", "\"MESERO\"")
    }
    create("admin") {
      dimension = "role"
      applicationIdSuffix = ".admin"
      manifestPlaceholders["appLabel"] = "BEFFGER Administrador"
      buildConfigField("String", "APP_ROLE", "\"ADMIN\"")
    }
  }

  buildTypes {
    release {
      isMinifyEnabled = false
      proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
    }
  }
  compileOptions {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
  }
  buildFeatures {
    compose = true
    aidl = false
    buildConfig = true
    shaders = false
  }

  packaging {
    resources {
      excludes += "/META-INF/{AL2.0,LGPL2.1}"
    }
  }
}

kotlin {
  jvmToolchain(17)
}

dependencies {
  val composeBom = platform(libs.androidx.compose.bom)
  implementation(composeBom)
  androidTestImplementation(composeBom)

  // Core Android dependencies
  implementation(libs.androidx.core.ktx)
  implementation(libs.androidx.lifecycle.runtime.ktx)
  implementation(libs.androidx.activity.compose)

  // Arch Components
  implementation(libs.androidx.lifecycle.runtime.compose)
  implementation(libs.androidx.lifecycle.viewmodel.compose)

  // Compose
  implementation(libs.androidx.compose.ui)
  implementation(libs.androidx.compose.ui.tooling.preview)
  implementation(libs.androidx.compose.material3)
  // Tooling
  debugImplementation(libs.androidx.compose.ui.tooling)
  // Instrumented tests
  androidTestImplementation(libs.androidx.compose.ui.test.junit4)
  debugImplementation(libs.androidx.compose.ui.test.manifest)

  // Local tests: jUnit, coroutines, Android runner
  testImplementation(libs.junit)
  testImplementation(libs.kotlinx.coroutines.test)

  // Instrumented tests: jUnit rules and runners
  androidTestImplementation(libs.androidx.test.core)
  androidTestImplementation(libs.androidx.test.ext.junit)
  androidTestImplementation(libs.androidx.test.runner)
  androidTestImplementation(libs.androidx.test.espresso.core)

  // Navigation
  implementation(libs.androidx.navigation3.ui)
  implementation(libs.androidx.navigation3.runtime)
  implementation(libs.androidx.lifecycle.viewmodel.navigation3)
}
