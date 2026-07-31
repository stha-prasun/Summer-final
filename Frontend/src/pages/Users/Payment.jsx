import { useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import { FiShoppingBag, FiCreditCard } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { parsePrice, formatPrice } from '../../utils/price';

export function Payment() {
  const user = useSelector((state) => state.User?.loggedInUser);
  const items = useSelector((state) => state.Cart.items);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const total = items.reduce(
    (sum, item) => sum + parsePrice(item.product.price) * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-neutral-950 pt-32 flex flex-col items-center justify-center gap-6 px-4">
          <FiShoppingBag className="text-zinc-600" size={64} />
          <h2 className="text-2xl font-display tracking-wider text-zinc-400 uppercase">Your cart is empty</h2>
          <p className="text-zinc-600 text-sm">Add some products before checking out.</p>
          <Link
            to="/collection"
            className="mt-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Browse Collection
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neutral-950 pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-display tracking-wider text-white uppercase mb-8">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-neutral-900/60 border border-white/5 rounded-xl p-6">
              <h2 className="text-sm uppercase tracking-widest text-zinc-400 mb-4">Order Summary</h2>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product._id} className="flex items-center gap-4">
                    <img
                      src={item.product.image || '/placeholder.jpg'}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-lg bg-neutral-800"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white text-sm font-semibold truncate">{item.product.name}</h3>
                      <p className="text-zinc-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-white text-sm font-semibold">
                      Rs. {formatPrice(parsePrice(item.product.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 mt-6 pt-4 flex justify-between items-center">
                <p className="text-zinc-500 text-xs uppercase tracking-widest">Total</p>
                <p className="text-white text-2xl font-bold">Rs. {formatPrice(total)}</p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-neutral-900/60 border border-white/5 rounded-xl p-6">
              <h2 className="text-sm uppercase tracking-widest text-zinc-400 mb-4">Payment Method</h2>

              <div className="border border-white/10 rounded-lg p-4 flex items-center justify-between bg-gradient-to-r from-[#5c2d91]/10 to-[#9457eb]/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#5c2d91] to-[#9457eb] flex items-center justify-center">
                    <FiCreditCard className="text-white" size={18} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Khalti</p>
                    <p className="text-zinc-500 text-xs">Digital wallet · No.1 payment gateway in Nepal</p>
                  </div>
                </div>
                <span className="w-4 h-4 rounded-full border-2 border-[#9457eb] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#9457eb]" />
                </span>
              </div>

              <button className="w-full mt-6 bg-[#5c2d91] hover:bg-[#4a2474] text-white font-bold py-3.5 rounded-lg transition-colors text-sm">
                Pay with Khalti
              </button>
              <p className="text-zinc-600 text-xs text-center mt-4">
                Payments are processed securely by Khalti
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
