import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Sprout, Mail, Lock, ArrowLeft, Phone, KeyRound } from "lucide-react";
import { useState, useEffect } from "react";
import { authAPI, farmsAPI, LoginRequest } from "../services/api";
import { setupRecaptcha, sendOTP, verifyOTP } from "../services/firebase";

export function Login() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");

  // Email states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone states
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>(null);

  // Remember Me
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-login if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Verify token is still valid by making a quick API call
      farmsAPI
        .getMyFarms()
        .then((farms) => {
          if (farms.data.length > 0) {
            navigate("/results");
          } else {
            navigate("/input");
          }
        })
        .catch(() => {
          // Token expired or invalid — clear and stay on login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("userId");
        });
    }
  }, [navigate]);

  useEffect(() => {
    if (loginMethod === "phone" && !recaptchaVerifier) {
      try {
        const verifier = setupRecaptcha("recaptcha-container");
        setRecaptchaVerifier(verifier);
      } catch (err) {
        console.error("Failed to setup recaptcha", err);
      }
    }
  }, [loginMethod, recaptchaVerifier]);

  const handleLoginSuccess = async (data: any) => {
    if (data?.token) {
      if (rememberMe) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user._id);
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("userId", data.user._id);
      }

      const farms = await farmsAPI.getMyFarms();
      if (farms.data.length > 0) {
        navigate("/results");
      } else {
        navigate("/input");
      }
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const loginData: LoginRequest = {
        email: email.trim(),
        password: password,
      };
      const response = await authAPI.login(loginData);
      await handleLoginSuccess(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return setError("Please enter a phone number");
    setLoading(true);
    setError("");

    try {
      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
      await sendOTP(formattedPhone, recaptchaVerifier);
      setOtpSent(true);
    } catch (err: any) {
      console.error(err);
      setError(
        "Failed to send OTP. Make sure the number is valid including country code (+91)."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return setError("Please enter OTP");
    setLoading(true);
    setError("");

    try {
      const idToken = await verifyOTP(otp);
      const response = await authAPI.phoneLogin({ firebaseToken: idToken });
      await handleLoginSuccess(response.data);
    } catch (err: any) {
      // If user not registered, redirect to signup with phone pre-filled
      if (err.response?.status === 404 && err.response?.data?.notRegistered) {
        const phoneNum = err.response.data.phone || phone;
        navigate(`/signup?method=phone&phone=${encodeURIComponent(phoneNum)}`);
        return;
      }
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to verify OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div id="recaptcha-container"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 -right-20 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-emerald-100 mb-6 hover:text-white transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        {/* Premium Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <motion.div
              className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-2xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sprout className="w-10 h-10 text-white" />
            </motion.div>
          </div>

          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Sign in to access your farming dashboard
          </p>

          {/* Login Method Toggle */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-8">
            <button
              onClick={() => {
                setLoginMethod("email");
                setError("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                loginMethod === "email"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              onClick={() => {
                setLoginMethod("phone");
                setError("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                loginMethod === "phone"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Phone className="w-4 h-4" />
              Phone OTP
            </button>
          </div>

          <AnimatePresence mode="wait">
            {loginMethod === "email" ? (
              <motion.form
                key="email-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleEmailSubmit}
                className="space-y-5"
              >
                {/* Email Field */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="farmer@example.com"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Remember Me + Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                    />
                    <span className="text-sm text-gray-600">Remember Me</span>
                  </label>
                  <button
                    type="button"
                    className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors text-sm"
                  >
                    Forgot Password?
                  </button>
                </div>

                {error && (
                  <div className="p-3 bg-rose-100 border border-rose-200 text-rose-800 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <motion.button
                  disabled={loading}
                  whileHover={loading ? {} : { scale: 1.02 }}
                  whileTap={loading ? {} : { scale: 0.98 }}
                  type="submit"
                  className={`w-full py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
                    loading
                      ? "bg-gray-500 cursor-not-allowed text-white/70"
                      : "bg-gradient-to-r from-emerald-600 to-green-600 text-white"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="phone-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {!otpSent ? (
                  <form onSubmit={handleSendOTP} className="space-y-5">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">
                        Phone Number
                      </label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+919876543210"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5 ml-1">
                        Include country code, e.g. +91
                      </p>
                    </div>

                    {/* Remember Me for phone */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                      />
                      <span className="text-sm text-gray-600">Remember Me</span>
                    </label>

                    {error && (
                      <div className="p-3 bg-rose-100 border border-rose-200 text-rose-800 rounded-xl text-sm">
                        {error}
                      </div>
                    )}

                    <motion.button
                      disabled={loading}
                      whileHover={loading ? {} : { scale: 1.02 }}
                      whileTap={loading ? {} : { scale: 0.98 }}
                      type="submit"
                      className={`w-full py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
                        loading
                          ? "bg-gray-500 cursor-not-allowed text-white/70"
                          : "bg-gradient-to-r from-emerald-600 to-green-600 text-white"
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </motion.button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-5">
                    <div className="text-center mb-2">
                      <p className="text-sm text-gray-500">
                        OTP sent to{" "}
                        <span className="font-semibold text-gray-700">
                          {phone.startsWith("+") ? phone : `+91${phone}`}
                        </span>
                      </p>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">
                        Enter 6-digit OTP
                      </label>
                      <div className="relative group">
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="123456"
                          maxLength={6}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all tracking-widest text-center text-lg font-semibold"
                          required
                        />
                      </div>
                    </div>

                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp("");
                          setError("");
                        }}
                        className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors text-sm"
                      >
                        Change Phone Number?
                      </button>
                    </div>

                    {error && (
                      <div className="p-3 bg-rose-100 border border-rose-200 text-rose-800 rounded-xl text-sm">
                        {error}
                      </div>
                    )}

                    <motion.button
                      disabled={loading}
                      whileHover={loading ? {} : { scale: 1.02 }}
                      whileTap={loading ? {} : { scale: 0.98 }}
                      type="submit"
                      className={`w-full py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
                        loading
                          ? "bg-gray-500 cursor-not-allowed text-white/70"
                          : "bg-gradient-to-r from-emerald-600 to-green-600 text-white"
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify OTP & Login"
                      )}
                    </motion.button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
            >
              Create Account
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}