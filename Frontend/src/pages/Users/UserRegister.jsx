import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoggedInUser } from '../../redux/userSlice';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';

export function UserRegister() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { signInWithGoogle } = useGoogleAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const credential = await signInWithGoogle();
      const { data } = await api.post('/user/google', { credential });
      if (data.success) {
        localStorage.setItem('accessToken', data.accessToken);
        dispatch(setLoggedInUser(data.loggedInUser));
        toast.success(data.message);
        if (data.needsOnboarding) {
          navigate('/onboarding', { state: { mode: 'google', name: data.loggedInUser.name, email: data.loggedInUser.email } });
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/onboarding', { state: { name, email, password } });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0b0b] text-white">
      {/* Left Pane: Form Section */}
      <div className="flex flex-1 flex-col justify-between bg-white px-16 py-10 text-neutral-900">
        <div className="w-full max-w-[420px] mx-auto my-auto">
          {/* Brand Logo */}
          <div className="mb-8">
            <button type="button" onClick={() => navigate('/')} className="text-2xl font-black tracking-widest text-[#e50914]">WHEELSRUS</button>
          </div>

          {/* Welcome Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">
              Join the Elite Garage!
            </h2>
            <p className="text-sm text-neutral-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-semibold text-[#e50914] hover:underline focus:outline-none"
              >
                Log in
              </button>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-neutral-700">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-lg border border-neutral-300 text-base outline-none focus:border-[#e50914] focus:ring-4 focus:ring-red-500/10 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-neutral-700">Email Address</label>
              <input
                type="email"
                placeholder="collector@wheelsrus.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-lg border border-neutral-300 text-base outline-none focus:border-[#e50914] focus:ring-4 focus:ring-red-500/10 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-neutral-700">Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-lg border border-neutral-300 text-base outline-none focus:border-[#e50914] focus:ring-4 focus:ring-red-500/10 transition-all"
                />
                <button
                  type="button"
                  className="absolute right-4 text-xs font-semibold text-neutral-500 hover:text-neutral-800"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-[#e50914] hover:bg-[#b80710] text-white font-bold py-3.5 rounded-lg transition-colors shadow-lg shadow-red-600/20"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-[1px] bg-neutral-200"></div>
            <span className="text-[10px] font-bold tracking-widest text-neutral-400">OR</span>
            <div className="flex-1 h-[1px] bg-neutral-200"></div>
          </div>

          {/* SSO Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold py-3 rounded-lg border border-neutral-300 transition-colors text-sm flex items-center justify-center gap-3 disabled:opacity-60"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.87 7.35 2.56 10.56l7.97-5.97z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.97C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            {googleLoading ? 'Signing in with Google...' : 'Continue with Google'}
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-neutral-400 border-t border-neutral-100 pt-5">
          <span>WHEELSRUS</span>
          <span className="font-semibold text-neutral-600">Unleash the Need for Speed</span>
        </div>
      </div>

      {/* Right Pane: Immersive Luxury Car Visual Showcase */}
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
            EVERY COLLECTION TELLS A STORY
          </h1>
          <p className="text-neutral-300 text-base leading-relaxed">
            Explore exclusive model releases, 3D showcases, and legendary rare drops built for true enthusiasts.
          </p>
        </div>
      </div>
    </div>
  );
}