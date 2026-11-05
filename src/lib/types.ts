export type UserRole = 'admin' | 'gerente' | 'cajero' | 'cocina' | 'domiciliario' | 'cliente';

export type OrderType = 'domicilio' | 'retiro' | 'mesa';

export type OrderStatus =
  | 'nuevo'
  | 'confirmado'
  | 'en_preparacion'
  | 'listo'
  | 'en_domicilio'
  | 'entregado'
  | 'cancelado';

export type PaymentMethod = 'efectivo' | 'wompi' | 'nequi' | 'transferencia';

export type PaymentStatus = 'pendiente' | 'aprobado' | 'rechazado' | 'anulado';

export type InventoryMovementType =
  | 'compra'
  | 'consumo_orden'
  | 'merma'
  | 'ajuste'
  | 'devolucion';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  display_order: number;
  is_active: boolean;
}

export interface ModifierOption {
  id: string;
  modifier_group_id: string;
  name: string;
  price_adjustment: number;
  is_default: boolean;
  is_available: boolean;
  display_order: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  description?: string;
  min_selection: number;
  max_selection: number;
  is_required: boolean;
  options: ModifierOption[];
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  preparation_time_minutes: number;
  is_available: boolean;
  is_gourmet: boolean;
  image_url: string;
  allergens?: string[];
  badge?: string;
  display_order: number;
  modifier_groups?: ModifierGroup[];
}

export interface SelectedModifier {
  group_name: string;
  option_name: string;
  price_adjustment: number;
}

export interface CartItem {
  id: string; // unique item instance id
  product: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
  modifiers: SelectedModifier[];
  notes?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name_snapshot: string;
  product_price_snapshot: number;
  product_image_snapshot: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
  modifiers: SelectedModifier[];
}

export interface OrderStatusHistoryItem {
  id: string;
  order_id: string;
  previous_status?: OrderStatus;
  new_status: OrderStatus;
  changed_by?: string;
  notes?: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  order_type: OrderType;
  status: OrderStatus;
  delivery_zone_id?: string;
  delivery_address?: string;
  delivery_instructions?: string;
  delivery_fee: number;
  subtotal: number;
  discount: number;
  tip: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  assigned_rider_id?: string;
  assigned_rider_name?: string;
  cash_register_id?: string;
  kitchen_notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  status_history?: OrderStatusHistoryItem[];
}

export interface Ingredient {
  id: string;
  name: string;
  sku: string;
  unit: 'g' | 'ml' | 'un';
  current_stock: number;
  minimum_stock: number;
  cost_per_unit: number; // Cost in COP per unit (e.g. per gram)
  supplier?: string;
  is_active: boolean;
}

export interface RecipeItem {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  ingredient_name: string;
  quantity: number;
  unit: string;
  unit_cost_snapshot: number;
  total_cost: number;
  is_packaging?: boolean;
}

export interface Recipe {
  id: string;
  product_id: string;
  product_name: string;
  yield_portions: number;
  packaging_cost: number;
  labor_variable_cost: number;
  preparation_notes?: string;
  items: RecipeItem[];
  total_ingredient_cost: number;
  total_cost: number;
  sale_price: number;
  food_cost_percentage: number;
  gross_margin_percentage: number;
}

export interface CashRegister {
  id: string;
  name: string;
  status: 'open' | 'closed';
  opened_at?: string;
  closed_at?: string;
  opened_by_name?: string;
  closed_by_name?: string;
  initial_cash: number;
  counted_cash: number;
  expected_cash: number;
  cash_difference: number;
  notes?: string;
}

export interface CashMovement {
  id: string;
  cash_register_id: string;
  type: 'ingreso' | 'egreso' | 'venta_efectivo';
  amount: number;
  description: string;
  performed_by_name?: string;
  created_at: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  delivery_fee: number;
  min_order_amount: number;
  estimated_time_minutes: number;
  is_active: boolean;
}

export interface Customer {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  notes?: string;
  total_spent: number;
  orders_count: number;
  loyalty_points: number;
  created_at: string;
  last_order_at?: string;
}

export interface InventoryMovement {
  id: string;
  ingredient_id: string;
  ingredient_name: string;
  movement_type: InventoryMovementType;
  quantity: number;
  previous_stock: number;
  new_stock: number;
  unit_cost: number;
  reason: string;
  reference_order_id?: string;
  performed_by_name?: string;
  created_at: string;
}

export interface BusinessSettings {
  restaurant_name: string;
  slogan: string;
  phone: string;
  address: string;
  city: string;
  tax_rate: number;
  is_open: boolean;
  currency: string;
  timezone: string;
  wompi_public_key?: string;
  wompi_sandbox_mode: boolean;
  delivery_enabled: boolean;
  pickup_enabled: boolean;
  dine_in_enabled: boolean;
}
