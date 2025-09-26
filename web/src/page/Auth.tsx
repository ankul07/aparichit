import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Menu, X, Skull, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
import axios from "axios";
import { useHorrorToast } from "../components/ToastAlert/HorrorToast";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkPulse, setIsDarkPulse] = useState(false);
  const [bloodDrip, setBloodDrip] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useHorrorToast();

  // Dark pulsing effect
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setIsDarkPulse(true);
      setTimeout(() => setIsDarkPulse(false), 1500);
    }, 4000);

    return () => clearInterval(pulseInterval);
  }, []);

  // Blood drip effect
  useEffect(() => {
    const dripInterval = setInterval(() => {
      setBloodDrip(true);
      setTimeout(() => setBloodDrip(false), 2000);
    }, 6000);

    return () => clearInterval(dripInterval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!isLogin && !formData.fullName.trim()) {
      newErrors.fullName = "नरक में भी नाम चाहिए होता है!";
    } else if (!isLogin && formData.fullName.trim().length < 2) {
      newErrors.fullName = "इतना छोटा नाम? शैतान भी हँसेगा!";
    }

    if (!formData.email.trim()) {
      newErrors.email = "बिना पहचान के नरक में प्रवेश असंभव!";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "गलत पता! यमदूत भी भ्रमित हैं!";
    }

    if (!formData.password.trim()) {
      newErrors.password = "बिना रहस्य के द्वार नहीं खुलेगा!";
    } else if (formData.password.length < 6) {
      newErrors.password = "कम से कम 6 अक्षर! नरक भी सुरक्षित रखता है!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("सभी जानकारी सही से भरें!", "error");
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // Login API call
        const response = await axios.post(`${API_URL}/auth/login`, {
          email: formData.email,
          password: formData.password,
        });

        if (response.data.success) {
          // Save data to localStorage
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("userData", JSON.stringify(response.data.user));

          showToast("स्वागत है न्याय व्यवस्था में!", "success");

          // Navigate to aparadh-detail
          setTimeout(() => {
            navigate("/aparadh-detail");
          }, 1500);
        }
      } else {
        // Register API call
        const response = await axios.post(`${API_URL}/auth/register`, {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        });

        if (response.data === true || response.data.success) {
          showToast("पंजीकरण सफल! अब प्रवेश करें!", "success");
          // Switch to login form
          setIsLogin(true);
          // Clear form
          setFormData({
            fullName: "",
            email: "",
            password: "",
          });
        } else {
          showToast("पंजीकरण असफल! पुनः प्रयास करें!", "error");
        }
      }
    } catch (error: any) {
      // console.error("Auth error:", error);

      let errorMessage = "अज्ञात त्रुटि! नरक में भी कोई समस्या है!";

      if (error.response?.data?.message) {
        // Convert common error messages to Hindi horror theme
        const msg = error.response.data.message.toLowerCase();
        if (
          msg.includes("user already exists") ||
          msg.includes("already registered")
        ) {
          errorMessage = "यह आत्मा पहले से पंजीकृत है!";
        } else if (
          msg.includes("user not found") ||
          msg.includes("invalid email")
        ) {
          errorMessage = "यह आत्मा अज्ञात है! पहले पंजीकरण करें!";
        } else if (
          msg.includes("invalid password") ||
          msg.includes("wrong password")
        ) {
          errorMessage = "गलत रहस्य कोड! यमदूत क्रोधित हैं!";
        } else if (msg.includes("validation")) {
          errorMessage = "जानकारी अपूर्ण! सभी विवरण भरें!";
        } else {
          errorMessage = error.response.data.message;
        }
      } else if (error.message === "Network Error") {
        errorMessage = "संपर्क टूटा! नरक से जुड़ाव असफल!";
      }

      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="h-screen w-screen bg-[url('/formcave.jpg')] bg-cover bg-center bg-no-repeat overflow-hidden flex items-center justify-center relative">
      {/* Multiple dark overlays for hell atmosphere */}
      <ToastContainer />
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/60 via-black/90 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-950/30 to-transparent"></div>

      {/* Dark pulsing overlay */}
      {isDarkPulse && (
        <div className="absolute inset-0 bg-red-950/40 animate-pulse"></div>
      )}

      {/* Desktop Navigation - Right Side */}
      <div className="hidden md:block fixed right-6 top-1/2 transform -translate-y-1/2 z-30">
        <div className="flex flex-col space-y-6">
          {/* Garuda Purana Navigation */}
          <div className="group relative">
            <button
              onClick={() => handleNavigation("/garuda-purana")}
              className="w-16 h-16 bg-gradient-to-b from-red-900/80 to-red-950/90 border-2 border-red-700/60 rounded-full shadow-lg shadow-red-900/50 transition-all duration-500 hover:scale-110 hover:shadow-red-600/70 relative overflow-hidden"
            >
              {/* Rotating horror effect */}
              <div className="absolute inset-0 animate-spin duration-3000">
                <Skull className="w-8 h-8 text-red-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>

              {/* Blood drop effect */}
              {bloodDrip && (
                <div className="absolute top-2 right-3 w-1 h-6 bg-gradient-to-b from-red-600 to-red-900 animate-pulse"></div>
              )}

              {/* Glow effect */}
              <div className="absolute inset-0 bg-red-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </button>

            {/* Tooltip */}
            <div className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-stone-900/90 text-red-200 px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none border border-red-800/50 shadow-lg">
              गरुड़ पुराण
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-l-8 border-l-stone-900/90 border-t-4 border-b-4 border-t-transparent border-b-transparent"></div>
            </div>
          </div>

          {/* All Complaints Navigation */}
          <div className="group relative">
            <button
              onClick={() => handleNavigation("/all-complaints")}
              className="w-16 h-16 bg-gradient-to-b from-red-900/80 to-red-950/90 border-2 border-red-700/60 rounded-full shadow-lg shadow-red-900/50 transition-all duration-500 hover:scale-110 hover:shadow-red-600/70 relative overflow-hidden"
            >
              {/* Rotating horror effect */}
              <div className="absolute inset-0 animate-spin duration-2000 reverse">
                <FileText className="w-8 h-8 text-red-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>

              {/* Ember effect */}
              <div className="absolute top-2 left-2 w-1 h-1 bg-orange-500 rounded-full animate-ping"></div>
              <div
                className="absolute bottom-3 right-2 w-1 h-1 bg-red-600 rounded-full animate-ping"
                style={{ animationDelay: "1s" }}
              ></div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-red-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </button>

            {/* Tooltip */}
            <div className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-stone-900/90 text-red-200 px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none border border-red-800/50 shadow-lg">
              सभी शिकायतें
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-l-8 border-l-stone-900/90 border-t-4 border-b-4 border-t-transparent border-b-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Top */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 p-4">
        <div className="flex justify-between items-center">
          <div className="text-red-200 text-lg font-bold rubik-glitch-regular">
            अपरिचित
          </div>

          <button
            onClick={toggleMenu}
            className="w-12 h-12 bg-gradient-to-b from-red-900/80 to-red-950/90 border-2 border-red-700/60 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden"
          >
            {/* Rotating icon effect */}
            <div
              className={`absolute inset-0 transition-transform duration-500 ${
                isMenuOpen ? "rotate-180" : "rotate-0"
              }`}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-red-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              ) : (
                <Menu className="w-6 h-6 text-red-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
            </div>

            {/* Blood effect */}
            {bloodDrip && (
              <div className="absolute top-1 right-2 w-1 h-4 bg-gradient-to-b from-red-600 to-red-900 animate-pulse"></div>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-4">
            <div className="bg-gradient-to-b from-stone-900/95 to-black/95 backdrop-blur-md border-2 border-red-700/60 rounded-lg shadow-2xl shadow-red-900/50 overflow-hidden">
              {/* Menu items */}
              <button
                onClick={() => handleNavigation("/garuda-purana")}
                className="w-full p-4 text-left hover:bg-red-900/30 transition-all duration-300 border-b border-red-800/30 group flex items-center space-x-3"
              >
                <div className="relative">
                  <Skull className="w-6 h-6 text-red-200 group-hover:animate-spin" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                </div>
                <span className="text-red-200 group-hover:text-red-100 transition-colors duration-300">
                  गरुड़ पुराण
                </span>
              </button>

              <button
                onClick={() => handleNavigation("/all-complaints")}
                className="w-full p-4 text-left hover:bg-red-900/30 transition-all duration-300 group flex items-center space-x-3"
              >
                <div className="relative">
                  <FileText className="w-6 h-6 text-red-200 group-hover:animate-spin group-hover:animate-reverse" />
                  <div className="absolute bottom-0 left-0 w-1 h-1 bg-orange-500 rounded-full animate-ping"></div>
                </div>
                <span className="text-red-200 group-hover:text-red-100 transition-colors duration-300">
                  सभी शिकायतें
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating embers/souls effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/6 w-1 h-1 bg-red-600/60 rounded-full animate-ping"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-1 h-1 bg-orange-500/50 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-yellow-600/40 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/6 w-1 h-1 bg-red-700/60 rounded-full animate-ping"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-1 h-1 bg-orange-600/50 rounded-full animate-ping"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-sm mx-4 mt-16 md:mt-0">
        {/* Ancient stone tablet effect */}
        <div
          className={`relative bg-gradient-to-b from-stone-800/20 via-stone-900/40 to-black/60 backdrop-blur-md border-2 transition-all duration-1000 shadow-2xl
          ${
            isDarkPulse
              ? "border-red-700/80 shadow-red-950/60"
              : "border-stone-700/60 shadow-black/80"
          }`}
          style={{
            clipPath:
              "polygon(2% 0%, 98% 0%, 100% 3%, 100% 97%, 98% 100%, 2% 100%, 0% 97%, 0% 3%)",
            background:
              "linear-gradient(145deg, rgba(41, 37, 36, 0.3), rgba(28, 25, 23, 0.6))",
          }}
        >
          {/* Stone texture overlay */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23292524' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M0 0h20v20H0V0zm10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm-7-7a7 7 0 1 0 14 0 7 7 0 0 0-14 0z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          {/* Ancient cracks */}
          <div className="absolute top-0 left-1/4 w-px h-8 bg-gradient-to-b from-red-900/60 to-transparent"></div>
          <div className="absolute bottom-0 right-1/3 w-px h-6 bg-gradient-to-t from-red-900/40 to-transparent"></div>
          <div className="absolute left-0 top-1/2 h-px w-6 bg-gradient-to-r from-red-900/50 to-transparent"></div>

          {/* Blood drip effect */}
          {bloodDrip && (
            <div className="absolute top-0 right-1/4 w-1 h-8 bg-gradient-to-b from-red-800 to-red-950 opacity-80 animate-pulse"></div>
          )}

          {/* Main content */}
          <div className="p-6 relative">
            {/* Title section */}
            <div className="text-center mb-6">
              <div className="relative">
                {/* Ancient symbol */}
                <div className="flex justify-center mb-3">
                  <div className="relative">
                    <div
                      className={`w-8 h-8 border-2 border-red-700 rounded-full transition-all duration-1000 ${
                        isDarkPulse
                          ? "border-red-500 shadow-lg shadow-red-900/50"
                          : ""
                      }`}
                    >
                      <div className="absolute inset-1 border border-red-800 rounded-full">
                        <div className="absolute inset-1 bg-red-900/30 rounded-full"></div>
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-600/80 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <h1 className="rubik-glitch-regular text-2xl text-red-200 mb-2 drop-shadow-lg">
                  अपरिचित
                </h1>
                <div className="text-red-300/80 text-xs font-medium mb-1">
                  गरुड़ पुराण न्याय व्यवस्था
                </div>
                <p className="text-stone-300/90 text-sm">
                  {isLogin ? "पुनः प्रवेश" : "नया पंजीकरण"}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Form inputs */}
              <div className="space-y-4">
                {/* Full Name - Register only */}
                {!isLogin && (
                  <div>
                    <label className="block text-red-200/90 text-sm font-semibold mb-2">
                      पूरा नाम
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full bg-stone-900/50 backdrop-blur-sm border px-4 py-3 text-stone-200 placeholder-stone-400/70 focus:outline-none transition-all duration-300 shadow-inner ${
                        errors.fullName
                          ? "border-red-500/70 focus:border-red-400/90"
                          : "border-stone-600/50 focus:border-red-600/70 focus:bg-stone-900/70"
                      }`}
                      placeholder="अपना नाम दर्ज करें"
                      required={!isLogin}
                      style={{
                        background:
                          "linear-gradient(145deg, rgba(41, 37, 36, 0.4), rgba(28, 25, 23, 0.6))",
                      }}
                    />
                    {errors.fullName && (
                      <p className="text-red-400 text-xs mt-1 nosifer-regular animate-pulse">
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-red-200/90 text-sm font-semibold mb-2">
                    ईमेल पता
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-stone-900/50 backdrop-blur-sm border px-4 py-3 text-stone-200 placeholder-stone-400/70 focus:outline-none transition-all duration-300 shadow-inner ${
                      errors.email
                        ? "border-red-500/70 focus:border-red-400/90"
                        : "border-stone-600/50 focus:border-red-600/70 focus:bg-stone-900/70"
                    }`}
                    placeholder="example@email.com"
                    required
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(41, 37, 36, 0.4), rgba(28, 25, 23, 0.6))",
                    }}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1 nosifer-regular animate-pulse">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-red-200/90 text-sm font-semibold mb-2">
                    गुप्त कोड (Password)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full bg-stone-900/50 backdrop-blur-sm border px-4 py-3 pr-12 text-stone-200 placeholder-stone-400/70 focus:outline-none transition-all duration-300 shadow-inner ${
                        errors.password
                          ? "border-red-500/70 focus:border-red-400/90"
                          : "border-stone-600/50 focus:border-red-600/70 focus:bg-stone-900/70"
                      }`}
                      placeholder="***********"
                      required
                      style={{
                        background:
                          "linear-gradient(145deg, rgba(41, 37, 36, 0.4), rgba(28, 25, 23, 0.6))",
                      }}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400/80 hover:text-red-400 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-xs mt-1 nosifer-regular animate-pulse">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full mt-6 bg-gradient-to-b from-red-900/80 to-red-950/90 hover:from-red-800/90 hover:to-red-900 text-red-100 font-bold py-3 px-6 border border-red-700/60 transition-all duration-300 shadow-lg relative overflow-hidden group rubik-glitch-regular disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDarkPulse
                    ? "shadow-red-900/80 border-red-600"
                    : "shadow-black/60"
                }`}
                style={{
                  background:
                    "linear-gradient(145deg, rgba(127, 29, 29, 0.8), rgba(69, 10, 10, 0.9))",
                }}
              >
                <div className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-red-200 border-t-transparent rounded-full animate-spin"></div>
                      <span>प्रक्रिया जारी...</span>
                    </div>
                  ) : (
                    <span>
                      {isLogin
                        ? "न्याय व्यवस्था में प्रवेश"
                        : "पंजीकरण पूर्ण करें"}
                    </span>
                  )}
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-red-800/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>

            {/* Toggle section */}
            <div className="mt-5 text-center">
              <div className="text-stone-500/60 text-xs mb-2">
                ━━━━━━━━━━━━━━━━━━━━━━━━━
              </div>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ fullName: "", email: "", password: "" });
                  setErrors({});
                }}
                className="text-red-300/90 hover:text-red-200 font-medium text-sm transition-colors duration-200 underline decoration-dotted underline-offset-2"
              >
                {isLogin ? "नया खाता बनाएं" : "पहले से खाता है?"}
              </button>

              {/* Warning text */}
              <div className="mt-3 text-stone-400/70 text-xs leading-relaxed nosifer-regular">
                केवल सत्य रिपोर्ट ही स्वीकार की जाएगी
              </div>
            </div>
          </div>

          {/* Ancient corners */}
          <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-red-800/60"></div>
          <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-red-800/60"></div>
          <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-red-800/60"></div>
          <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-red-800/60"></div>
        </div>

        {/* Deep shadow */}
        <div className="absolute top-2 left-2 right-2 bottom-2 bg-black/40 blur-2xl -z-10"></div>
      </div>

      {/* Custom CSS for reverse spin animation */}
      <style>{`
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .animate-reverse {
          animation: spin-reverse 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Auth;
