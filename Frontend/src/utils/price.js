export const parsePrice = (price) => {
  const match = String(price ?? '').match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
};

export const formatPrice = (amount) =>
  Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
