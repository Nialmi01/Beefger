import { NextResponse, NextRequest } from 'next/server';
import { store } from '@/lib/store';

// Helper to sanitize text and prevent XSS / injections
function sanitizeInput(str: unknown, maxLen = 150): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Strip angle brackets
    .trim()
    .slice(0, maxLen);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get('orderNumber');
  const phone = searchParams.get('phone');

  // If searching for a specific order by orderNumber or phone
  if (orderNumber) {
    const order = store.getOrderByNumber(orderNumber);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Orden no encontrada' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  }

  if (phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    const orders = store.getOrders().filter((o) => o.customer_phone.replace(/\D/g, '').includes(cleanPhone));
    return NextResponse.json({ success: true, count: orders.length, orders });
  }

  // Security Defense: Listing ALL orders is restricted to authorized staff
  const authCookie = request.cookies.get('beffger_auth_session');
  if (!authCookie || !authCookie.value) {
    return NextResponse.json(
      { success: false, error: 'Acceso no autorizado al libro de comandas general.' },
      { status: 401 }
    );
  }

  const orders = store.getOrders();
  return NextResponse.json({ success: true, count: orders.length, orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = sanitizeInput(body.customer_name, 80);
    const rawPhone = String(body.customer_phone || '').replace(/\D/g, '');
    const email = body.customer_email ? sanitizeInput(body.customer_email, 100) : undefined;
    const address = sanitizeInput(body.delivery_address, 200);
    const instructions = sanitizeInput(body.delivery_instructions, 200);
    const kitchenNotes = sanitizeInput(body.kitchen_notes, 250);

    // Strict validation
    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Nombre de cliente inválido (mínimo 2 caracteres).' },
        { status: 400 }
      );
    }

    if (!rawPhone || rawPhone.length < 7 || rawPhone.length > 15) {
      return NextResponse.json(
        { success: false, error: 'Número de teléfono inválido (debe contener entre 7 y 15 dígitos).' },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'El pedido debe contener al menos un producto.' },
        { status: 400 }
      );
    }

    // Validate item quantities and prevent negative quantities / massive spam
    for (const item of body.items) {
      const q = Number(item.quantity);
      if (!Number.isInteger(q) || q < 1 || q > 50) {
        return NextResponse.json(
          { success: false, error: 'Cantidad de producto inválida (debe ser entre 1 y 50 unidades).' },
          { status: 400 }
        );
      }
    }

    // Validate tip
    const rawTip = Number(body.tip || 0);
    const tip = Number.isFinite(rawTip) && rawTip >= 0 && rawTip <= 200000 ? Math.round(rawTip) : 0;

    const allowedOrderTypes = ['domicilio', 'para_llevar', 'mesa'];
    const orderType = allowedOrderTypes.includes(body.order_type) ? body.order_type : 'domicilio';

    const allowedPaymentMethods = ['efectivo', 'wompi', 'nequi', 'datafono'];
    const paymentMethod = allowedPaymentMethods.includes(body.payment_method) ? body.payment_method : 'efectivo';

    const order = store.createOrder({
      customer_name: name,
      customer_phone: rawPhone,
      customer_email: email,
      order_type: orderType,
      delivery_zone_id: sanitizeInput(body.delivery_zone_id, 30),
      delivery_address: address,
      delivery_instructions: instructions,
      payment_method: paymentMethod,
      items: body.items,
      tip,
      kitchen_notes: kitchenNotes,
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Error procesando la solicitud de comanda.' },
      { status: 500 }
    );
  }
}
