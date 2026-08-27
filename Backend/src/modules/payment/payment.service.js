import { Product } from '../product/product.model.js';
import { Order } from '../order/order.model.js';
import { createOrder, applyOrderPaymentUpdate } from '../order/factory/order.factory.js';
import { clearUserOrdersCache } from '../order/order.service.js';

const KHALTI_PAYMENT_URL = process.env.KHALTI_PAYMENT_URL;
const KHALTI_VERIFICATION_URL = process.env.KHALTI_VERIFICATION_URL;
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const khaltiHeaders = {
  Authorization: `Key ${KHALTI_SECRET_KEY}`,
  'Content-Type': 'application/json',
};

const parsePrice = (price) => {
  const match = String(price ?? '').match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
};

const readKhaltiResponse = (res, data) => {
  const body = data?.data ?? data ?? {};
  if (!res.ok) {
    throw new Error(body.detail || body.message || 'Khalti request failed');
  }
  return body;
};

export const initiatePayment = async ({ userId, items, customer }) => {
  if (!items || items.length === 0) {
    throw new Error('Cart is empty');
  }

  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== productIds.length) {
    throw new Error('Some products could not be found');
  }

  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  const orderItems = items.map(({ productId, quantity }) => {
    const product = productMap.get(productId);
    return {
      product: product._id,
      quantity,
      price: parsePrice(product.price),
    };
  });

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const orderDoc = createOrder({
    user: userId,
    items: orderItems,
    totalAmount,
  });
  const order = await orderDoc.save();

  const response = await fetch(KHALTI_PAYMENT_URL, {
    method: 'POST',
    headers: khaltiHeaders,
    body: JSON.stringify({
      return_url: `${FRONTEND_URL}/payment/verify`,
      website_url: FRONTEND_URL,
      amount: String(Math.round(totalAmount * 100)),
      purchase_order_id: order._id.toString(),
      purchase_order_name: 'WheelsRUs Order',
      customer_info: {
        name: customer?.name || '',
        email: customer?.email || '',
        phone: customer?.phone || '',
      },
    }),
  });

  const rawData = await response.json().catch(() => ({}));
  const data = readKhaltiResponse(response, rawData);

  if (!data.pidx || !data.payment_url) {
    throw new Error('Khalti did not return a payment URL');
  }

  applyOrderPaymentUpdate(order, { pidx: data.pidx, status: 'initiated' });
  await order.save();
  await clearUserOrdersCache(userId);

  return {
    pidx: data.pidx,
    payment_url: data.payment_url,
    purchase_order_id: order._id.toString(),
  };
};

export const verifyPayment = async ({ pidx }) => {
  if (!pidx) {
    throw new Error('pidx is required');
  }

  const response = await fetch(KHALTI_VERIFICATION_URL, {
    method: 'POST',
    headers: khaltiHeaders,
    body: JSON.stringify({ pidx }),
  });

  const rawData = await response.json().catch(() => ({}));
  const data = readKhaltiResponse(response, rawData);

  const { status, total_amount, transaction_id, purchase_order_id } = data;

  const order = await Order.findOne({ 'payment.pidx': pidx });

  if (order) {
    applyOrderPaymentUpdate(order, {
      transactionId: transaction_id || '',
      amount: total_amount || 0,
      status: status || 'failed',
    });

    if (status === 'Completed') {
      order.status = 'paid';
    } else if (status === 'User canceled') {
      order.status = 'failed';
    }

    await order.save();
    await clearUserOrdersCache(order.user);
  }

  return {
    status,
    transactionId: transaction_id,
    totalAmount: total_amount,
    purchaseOrderId: purchase_order_id,
  };
};
