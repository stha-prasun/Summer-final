

export function orderTotals(order) {
  const subtotal = order.items.reduce(
    (sum, it) => sum + Number(it.price) * it.qty,
    0,
  );
  const itemCount = order.items.reduce((sum, it) => sum + it.qty, 0);
  return { subtotal, total: subtotal, itemCount };
}