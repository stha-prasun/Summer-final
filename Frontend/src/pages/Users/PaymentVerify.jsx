import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiLoader, FiArrowLeft } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { clearCart } from '../../redux/cartSlice';
import { formatPrice } from '../../utils/price';
import api from '../../services/api';

export function PaymentVerify() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const pidx = searchParams.get('pidx');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const verify = async () => {
      if (!pidx) {
        setMessage('No payment reference found.');
        setSuccess(false);
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.post('/payment/verify', { pidx });
        setSuccess(data.success);
        setMessage(data.message || 'Payment was not completed.');
        setTransactionId(data.transactionId || '');
        setAmount(data.totalAmount || 0);

        if (data.success) {
          dispatch(clearCart());
        }
      } catch (err) {
        setSuccess(false);
        setMessage(err.response?.data?.message || 'Failed to verify payment.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [pidx, dispatch]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neutral-950 pt-32 pb-16 px-4 md:px-8 flex items-center">
        <div className="max-w-md mx-auto w-full">
          <div className="bg-neutral-900/60 border border-white/5 rounded-xl p-8 text-center">
            {loading ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <FiLoader className="text-zinc-400 animate-spin" size={36} />
                <p className="text-zinc-400 text-sm">Verifying your payment...</p>
              </div>
            ) : (
              <>
                {success ? (
                  <FiCheckCircle className="text-emerald-500 mx-auto mb-4" size={56} />
                ) : (
                  <FiXCircle className="text-red-500 mx-auto mb-4" size={56} />
                )}

                <h2
                  className={`text-2xl font-display tracking-wider uppercase ${
                    success ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {success ? 'Payment Successful' : 'Payment Failed'}
                </h2>
                <p className="text-zinc-500 text-sm mt-3">{message}</p>

                {success && (
                  <div className="mt-6 space-y-2 text-left bg-black/30 border border-white/5 rounded-lg p-4">
                    <div className="flex justify-between">
                      <span className="text-zinc-500 text-xs uppercase tracking-widest">Amount Paid</span>
                      <span className="text-white text-sm font-semibold">
                        Rs. {formatPrice(amount / 100)}
                      </span>
                    </div>
                    {transactionId && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500 text-xs uppercase tracking-widest">Transaction ID</span>
                        <span className="text-zinc-300 text-sm font-mono">{transactionId}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-3 mt-8">
                  <Link
                    to="/collection"
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 text-zinc-400 hover:text-white text-xs uppercase tracking-widest transition-colors"
                  >
                    <FiArrowLeft size={14} />
                    Back Home
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
