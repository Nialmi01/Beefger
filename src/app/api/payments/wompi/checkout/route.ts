import { NextResponse } from 'next/server';
import { createWompiTransactionData } from '@/lib/wompi';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const { orderNumber } = await request.json();
    const order = store.getOrderByNumber(orderNumber);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    const checkoutData = createWompiTransactionData(order.id, order.order_number, order.total);

    return NextResponse.json({
      success: true,
      data: checkoutData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
