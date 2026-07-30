import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { updateQuantity, removeFromCart, clearCart } from '../../redux/cartSlice';

export function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.Cart.items);

  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.product.price?.replace(/[^0-9.]/g, '') || 0) * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-6 px-4">
        <FiShoppingBag className="text-zinc-600" size={64} />
        <h2 className="text-2xl font-display tracking-wider text-zinc-400 uppercase">Your cart is empty</h2>
        <p className="text-zinc-600 text-sm">Looks like you haven't added anything yet.</p>
        <Link
          to="/collection"
          className="mt-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-display tracking-wider text-white uppercase">
            Shopping Cart
          </h1>
          <button
            onClick={() => dispatch(clearCart())}
            className="text-xs text-zinc-500 hover:text-red-400 transition-colors uppercase tracking-widest"
          >
            Clear All
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.product._id}
              className="flex items-center gap-4 bg-neutral-900/60 border border-white/5 rounded-xl p-4"
            >
              <img
                src={item.product.image || '/placeholder.jpg'}
                alt={item.product.name}
                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg bg-neutral-800"
              />

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm md:text-base truncate">
                  {item.product.name}
                </h3>
                <p className="text-zinc-500 text-xs mt-0.5">
                  ${parseFloat(item.product.price?.replace(/[^0-9.]/g, '') || 0).toFixed(2)}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-2 bg-neutral-800 rounded-lg px-2 py-1">
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: item.product._id,
                            quantity: item.quantity - 1,
                          })
                        )
                      }
                      className="text-zinc-400 hover:text-white transition-colors p-0.5"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="text-white text-sm font-medium w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: item.product._id,
                            quantity: item.quantity + 1,
                          })
                        )
                      }
                      className="text-zinc-400 hover:text-white transition-colors p-0.5"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => dispatch(removeFromCart(item.product._id))}
                    className="text-zinc-600 hover:text-red-400 transition-colors ml-auto"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-white font-semibold text-sm">
                  ${(parseFloat(item.product.price?.replace(/[^0-9.]/g, '') || 0) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-widest">Total</p>
            <p className="text-white text-2xl font-bold">${total.toFixed(2)}</p>
          </div>
          <button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-sm">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
