import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

export function Onboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, name, email, password } = location.state || {};
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1 && !phone.trim()) {
      toast.error('Phone number is required');
      return;
    }
    setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.street.trim() || !address.city.trim() || !address.state.trim() || !address.zip.trim() || !address.country.trim()) {
      toast.error('All address fields are required');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'google') {
        const { data } = await api.put('/user/profile', { phone, address });
        if (data.success) {
          toast.success('Profile completed!');
          navigate('/');
        }
      } else {
        const { data } = await api.post('/user/register', { name, email, password, phone, address });
        if (data.success) {
          toast.success('Account created! Please log in.');
          navigate('/login');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0b0b] text-white">
      {/* Left Pane: Form Section */}
      <div className="flex flex-1 flex-col justify-between bg-white px-16 py-10 text-neutral-900 overflow-y-auto">
        <div className="w-full max-w-[420px] mx-auto my-auto">
          {/* Brand Logo */}
          <div className="mb-8">
            <button type="button" onClick={() => navigate('/')} className="text-2xl font-black tracking-widest text-[#e50914]">WHEELSRUS</button>
          </div>

          {/* Stepper */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 1 ? 'bg-[#e50914] text-white' : 'bg-neutral-200 text-neutral-500'}`}>1</div>
                <span className={`text-sm font-semibold ${step >= 1 ? 'text-neutral-900' : 'text-neutral-400'}`}>Phone</span>
              </div>
              <div className="flex-1 h-0.5 mx-4 bg-neutral-200 relative">
                <div className={`absolute inset-0 bg-[#e50914] transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 2 ? 'bg-[#e50914] text-white' : 'bg-neutral-200 text-neutral-500'}`}>2</div>
                <span className={`text-sm font-semibold ${step >= 2 ? 'text-neutral-900' : 'text-neutral-400'}`}>Address</span>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">
              {step === 1 ? 'Enter your phone' : 'Enter your address'}
            </h2>
            <p className="text-sm text-neutral-600">
              {step === 1 ? 'We need your phone number for order updates.' : 'Set up your shipping address.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit} className="flex flex-col gap-5">
            {step === 1 && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-neutral-700">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-lg border border-neutral-300 text-base outline-none focus:border-[#e50914] focus:ring-4 focus:ring-red-500/10 transition-all"
                />
              </div>
            )}

            {step === 2 && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-neutral-700">Street Address</label>
                  <input
                    type="text"
                    placeholder="123 Main Street"
                    value={address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-lg border border-neutral-300 text-base outline-none focus:border-[#e50914] focus:ring-4 focus:ring-red-500/10 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-neutral-700">City</label>
                    <input
                      type="text"
                      placeholder="Springfield"
                      value={address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="w-full px-4 py-3.5 rounded-lg border border-neutral-300 text-base outline-none focus:border-[#e50914] focus:ring-4 focus:ring-red-500/10 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-neutral-700">State</label>
                    <input
                      type="text"
                      placeholder="IL"
                      value={address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className="w-full px-4 py-3.5 rounded-lg border border-neutral-300 text-base outline-none focus:border-[#e50914] focus:ring-4 focus:ring-red-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-neutral-700">ZIP Code</label>
                    <input
                      type="text"
                      placeholder="62701"
                      value={address.zip}
                      onChange={(e) => handleAddressChange('zip', e.target.value)}
                      className="w-full px-4 py-3.5 rounded-lg border border-neutral-300 text-base outline-none focus:border-[#e50914] focus:ring-4 focus:ring-red-500/10 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-neutral-700">Country</label>
                    <input
                      type="text"
                      placeholder="United States"
                      value={address.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      className="w-full px-4 py-3.5 rounded-lg border border-neutral-300 text-base outline-none focus:border-[#e50914] focus:ring-4 focus:ring-red-500/10 transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3 mt-2">
              {step === 2 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold py-3.5 rounded-lg border border-neutral-300 transition-colors"
                >
                  Back
                </button>
              )}
              {step === 1 ? (
                <button
                  type="submit"
                  className="flex-1 bg-[#e50914] hover:bg-[#b80710] text-white font-bold py-3.5 rounded-lg transition-colors shadow-lg shadow-red-600/20"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#e50914] hover:bg-[#b80710] text-white font-bold py-3.5 rounded-lg transition-colors shadow-lg shadow-red-600/20 disabled:opacity-60"
                >
                  {loading ? 'Saving...' : 'Complete'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-neutral-400 border-t border-neutral-100 pt-5">
          <span>WHEELSRUS</span>
          <span className="font-semibold text-neutral-600">Unleash the Need for Speed</span>
        </div>
      </div>

      {/* Right Pane */}
      <div 
        className="hidden lg:flex flex-[1.2] flex-col justify-end p-16 relative bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80')`
        }}
      >
        <div className="relative z-10 max-w-lg">
          <span className="inline-block text-xs font-bold tracking-[0.2em] text-[#e50914] mb-4 border-b-2 border-[#e50914] pb-1">
            HOT WHEELS ELITE COLLECTION
          </span>
          <h1 className="text-5xl font-black leading-none tracking-tight mb-4 text-white">
            COMPLETE YOUR COLLECTOR PROFILE
          </h1>
          <p className="text-neutral-300 text-base leading-relaxed">
            Set up your shipping details and stay updated on exclusive drops and limited releases.
          </p>
        </div>
      </div>
    </div>
  );
}
