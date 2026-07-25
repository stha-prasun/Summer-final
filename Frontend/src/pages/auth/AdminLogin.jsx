import { useEffect, useState } from "react";
import axios from "axios";


function AdminLogin() {
  const [adlogin, setadlogin] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = axios.get();
      setadlogin(response.data);
    };
    fetchData();
  
  });
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('/vehicles.png')] bg-cover bg-center bg-no-repeat">
      <div className="w-[800px] h-[500px] bg-black/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg flex items-center justify-center px-12">
        <div className="w-full max-w-md">
          <p className="text-white/50 text-sm mb-2">Login your account</p>
          <h1 className="text-white text-4xl font-semibold mb-2">
            Welcome Back Admin!
          </h1>
          <p className="text-white/50 text-sm mb-8">
            Enter your email and password
          </p>

          <form className="space-y-5">
            <div>
              <label className="text-white/70 text-sm block mb-2">
                Email address
              </label>
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="email"
                  placeholder="Hello@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                />
              </div>
            </div>

            <div>
              <label className="text-white/70 text-sm block mb-2">
                Password
              </label>
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <img
                    src={showPassword ? "/eye-off.png" : "/eye.png"}
                    alt={showPassword ? "Hide password" : "Show password"}
                    className="w-4 h-4 opacity-40 hover:opacity-70 transition-opacity"
                  />
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-white/70 text-sm underline hover:text-white">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:bg-black/80 transition-colors text-white font-medium py-3 rounded-xl mt-2"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


export default AdminLogin;