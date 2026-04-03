import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useSearchParams } from "react-router";
import {
  Sprout,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Phone,
  KeyRound,
} from "lucide-react";
import { useState, useEffect } from "react";
import { authAPI, RegisterRequest } from "../services/api";
import { setupRecaptcha, sendOTP, verifyOTP } from "../services/firebase";

export function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Determine initial method from URL params (e.g. redirected from login)
  const initialMethod =
    searchParams.get("method") === "phone" ? "phone" : "email";
  const initialPhone = searchParams.get("phone") || "";

  const [signupMethod, setSignupMethod] = useState<"email" | "phone">(
    initialMethod
  );

  // Shared states
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Email states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone states
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [firebaseToken, setFirebaseToken] = useState("");
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>(null);

  useEffect(() => {
    if (signupMethod === "phone" && !recaptchaVerifier) {
      try {
        const verifier = setupRecaptcha("recaptcha-container");
        setRecaptchaVerifier(verifier);
      } catch (err) {
        console.error("Failed to setup recaptcha", err);
      }
    }
  }, [signupMethod, recaptchaVerifier]);

  const handleLoginSuccess = async (data: any) => {
    if (data?.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userId", data.user._id);
      navigate("/input");
    }
  };

  // ============ EMAIL SIGNUP ============
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const registerData: RegisterRequest = {
        name: name.trim(),
        email: email.trim(),
        password: password,
      };

      await authAPI.register(registerData);

      // Auto-login after registration
      const loginResponse = await authAPI.login({
        email: email.trim(),
        password: password,
      });

      await handleLoginSuccess(loginResponse.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============ PHONE SIGNUP ============
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return setError("Please enter a phone number");
    if (!name.trim()) return setError("Please enter your name first");
    setLoading(true);
    setError("");

    try {
      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
      await sendOTP(formattedPhone, recaptchaVerifier);
      setOtpSent(true);
    } catch (err: any) {
      console.error(err);
      setError(
        "Failed to send OTP. Make sure the number is valid with country code (+91)."
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
      setFirebaseToken(idToken);
      setOtpVerified(true);

      // Immediately register after OTP verification
      const response = await authAPI.phoneRegister({
        firebaseToken: idToken,
        name: name.trim(),
      });
      await handleLoginSuccess(response.data);
    } catch (err: any) {
      if (err.response?.data?.alreadyRegistered) {
        setError(
          "This phone number is already registered. Please login instead."
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to verify OTP."
        );
      }
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
            Create Account
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Join us to start your smart farming journey
          </p>

          {/* Signup Method Toggle */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-8">
            <button
              onClick={() => {
                setSignupMethod("email");
                setError("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                signupMethod === "email"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              onClick={() => {
                setSignupMethod("phone");
                setError("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                signupMethod === "phone"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Phone className="w-4 h-4" />
              Phone OTP
            </button>
          </div>

          <AnimatePresence mode="wait">
            {signupMethod === "email" ? (
              <motion.form
                key="email-signup"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleEmailSubmit}
                className="space-y-5"
              >
                {/* Name Field */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      required
                    />
                  </div>
                </div>

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
                      placeholder="Create a strong password"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      required
                    />
                  </div>
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
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="phone-signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {!otpSent ? (
                  <form onSubmit={handleSendOTP} className="space-y-5">
                    {/* Name Field */}
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">
                        Full Name
                      </label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
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
                          Verifying & Creating Account...
                        </>
                      ) : (
                        "Verify OTP & Create Account"
                      )}
                    </motion.button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}