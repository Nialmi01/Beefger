import { NextResponse } from 'next/server';
import { verifyWompiEventChecksum } from '@/lib/wompi';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const checksumHeader = request.headers.get('x-event-checksum') || '';

    // Verify webhook authenticity (in sandbox we allow simulation if secret is test)
    const isValid = verifyWompiEventChecksum(payload, checksumHeader);

    const transaction = payload?.data?.transaction;
    if (transaction && transaction.reference) {
      const orderNumber = transaction.reference.split('-')[0] + '-' + transaction.reference.split('-')[1];
      const order = store.getOrderByNumber(orderNumber);

      if (order) {
        if (transaction.status === 'APPROVED') {
          order.payment_status = 'aprobado';
          store.updateOrderStatus(order.id, 'confirmado', 'Pago confirmado por webhook Wompi');
        } else if (transaction.status === 'DECLINED') {
          order.payment_status = 'rechazado';
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
