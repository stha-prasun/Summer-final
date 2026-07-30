import React, { useState } from 'react';

export function UserRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Registering user ${name} with Email: ${email}`);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0b0b] text-white">
      {/* Left Pane: Form Section */}
      <div className="flex flex-1 flex-col justify-between bg-white px-16 py-10 text-neutral-900 overflow-y-auto">
        <div className="w-full max-w-[420px] mx-auto my-auto">
          {/* Brand Logo */}
          <div className="mb-8">
            <span className="text-2xl font-black tracking-widest text-[#e50914]">WHEELSRUS</span>
          </div>

          {/* Welcome Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">
              Join the Elite Garage!
            </h2>
            <p className="text-sm text-neutral-600">
              Already have an account?{' '}
              <a
                href="#login"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Navigate to Login Page');
                }}
                className="font-semibold text-[#e50914] hover:underline focus:outline-none"
              >
                Log in
              </a>
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
            onClick={() => alert('SSO Authentication Triggered')}
            className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold py-3 rounded-lg border border-neutral-300 transition-colors text-sm"
          >
            Continue with Google
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-neutral-400 border-t border-neutral-100 pt-5">
          <span>WHEELSRUS Desktop Client</span>
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