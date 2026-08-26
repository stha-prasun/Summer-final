import { Order } from '../order.model.js';

const VALID_STATUSES = ['pending', 'paid', 'failed', 'cancelled'];
const VALID_PAYMENT_STATUSES = ['pending', 'initiated', 'Completed', 'User canceled', 'failed'];

export const createOrder = (data) => {
  const { user, items, totalAmount } = data;

  if (!user || !items || items.length === 0 || totalAmount == null) {
    throw new Error('User, items, and totalAmount are required.');
  }

  for (const item of items) {
    if (!item.product || !item.quantity || item.price == null) {
      throw new Error('Each item must have product, quantity, and price.');
    }
  }

  return new Order({
    user,
    items,
    totalAmount,
    status: 'pending',
    payment: {
      gateway: 'khalti',
      pidx: '',
      transactionId: '',
      status: 'pending',
      amount: 0,
    },
  });
};

export const applyOrderPaymentUpdate = (order, paymentData) => {
  const { pidx, transactionId, amount, status } = paymentData;

  if (pidx !== undefined) order.payment.pidx = pidx;
  if (transactionId !== undefined) order.payment.transactionId = transactionId;
  if (amount !== undefined) order.payment.amount = amount;

  if (status !== undefined) {
    if (!VALID_PAYMENT_STATUSES.includes(status)) {
      throw new Error(`Invalid payment status. Must be one of: ${VALID_PAYMENT_STATUSES.join(', ')}`);
    }
    order.payment.status = status;
  }
};

export const applyOrderStatusUpdate = (order, status) => {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  order.status = status;
};
