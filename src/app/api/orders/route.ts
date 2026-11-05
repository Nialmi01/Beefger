import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const orders = store.getOrders();
  return NextResponse.json({ success: true, count: orders.length, orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.customer_name || !body.customer_phone || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios para registrar la comanda.' },
        { status: 400 }
      );
    }

    const order = store.createOrder({
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      customer_email: body.customer_email,
      order_type: body.order_type || 'domicilio',
      delivery_zone_id: body.delivery_zone_id,
      delivery_address: body.delivery_address,
      delivery_instructions: body.delivery_instructions,
      payment_method: body.payment_method || 'efectivo',
      items: body.items,
      tip: body.tip || 0,
      kitchen_notes: body.kitchen_notes,
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
