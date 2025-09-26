import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Skull, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import { useHorrorToast } from "../components/ToastAlert/HorrorToast";

const AparadhDetails = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    kyaHua: "",
    doshiNaam: "",
    doshiUmar: "",
    doshiGender: "",
    doshiPehchan: "",
  });

  const [labelAnimation, setLabelAnimation] = useState(false);
  const [typingStates, setTypingStates] = useState({});
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [bloodDrip, setBloodDrip] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { showToast, ToastContainer } = useHorrorToast();
  const [validationErrors, setValidationErrors] = useState({});

  const typingTimeouts = useRef({});
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const validateField = (field, value) => {
    let errorMessage = "";

    switch (field) {
      case "kyaHua":
        if (value.length < 10) {
          errorMessage = "कम से कम 10 अक्षर लिखें";
          showToast(
            "घटना का विवरण कम से कम 10 अक्षर में लिखना जरूरी है",
            "error"
          );
        }
        if (value.length > 1000) {
          errorMessage = "1000 अक्षरों से ज्यादा नहीं लिख सकते";
          showToast(
            "घटना का विवरण 1000 अक्षरों से ज्यादा नहीं हो सकता",
            "error"
          );
        }
        break;
      case "doshiNaam":
        if (value.length > 0 && value.length < 2) {
          errorMessage = "कम से कम 2 अक्षर लिखें";
          showToast("नाम में कम से कम 2 अक्षर होने चाहिए", "error");
        }
        if (value.length > 100) {
          errorMessage = "100 अक्षरों से ज्यादा नहीं लिख सकते";
          showToast("नाम 100 अक्षरों से ज्यादा नहीं हो सकता", "error");
        }
        break;
      case "doshiPehchan":
        if (value.length < 10) {
          errorMessage = "कम से कम 10 अक्षर लिखें";
          showToast("पहचान में कम से कम 10 अक्षर लिखना जरूरी है", "error");
        }
        if (value.length > 1000) {
          errorMessage = "1000 अक्षरों से ज्यादा नहीं लिख सकते";
          showToast("पहचान 1000 अक्षरों से ज्यादा नहीं हो सकती", "error");
        }
        break;
    }
    return errorMessage;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const kyaHuaError = validateField("kyaHua", formData.kyaHua);
    const doshiPehchanError = validateField(
      "doshiPehchan",
      formData.doshiPehchan
    );
    const doshiNaamError =
      formData.doshiNaam !== "unknown"
        ? validateField("doshiNaam", formData.doshiNaam)
        : "";
    if (kyaHuaError || doshiPehchanError || doshiNaamError) {
      showToast("कृपया सभी जानकारी सही तरीके से भरें", "error");
      return;
    }
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(`${API_URL}/crime/addcrime`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      showToast("✅ आपकी शिकायत सफलतापूर्वक दर्ज हो गई है।", "success");

      setTimeout(() => {
        navigate("/antim-vaani");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  // Blood drip effect
  useEffect(() => {
    const dripInterval = setInterval(() => {
      setBloodDrip(true);
      setTimeout(() => setBloodDrip(false), 2000);
    }, 6000);

    return () => clearInterval(dripInterval);
  }, []);

  // Audio setup - Aggressive autoplay
  useEffect(() => {
    const initializeAudio = () => {
      try {
        const audio = new Audio("/Theme Song.mp3");
        audio.loop = true;
        audio.volume = 1;
        audio.preload = "auto";
        audio.autoplay = true;
        audioRef.current = audio;

        // Multiple attempts to play
        const playAudio = async () => {
          try {
            await audio.play();
            setAudioPlayed(true);
          } catch (error) {
            // Silent fallback - try again after tiny delay
            setTimeout(async () => {
              try {
                await audio.play();
                setAudioPlayed(true);
              } catch (e) {
                // Final fallback - play on any user interaction silently
                const silentPlay = async () => {
                  try {
                    await audio.play();
                    setAudioPlayed(true);
                    document.removeEventListener("click", silentPlay);
                    document.removeEventListener("keydown", silentPlay);
                    document.removeEventListener("touchstart", silentPlay);
                    document.removeEventListener("mousemove", silentPlay);
                  } catch (err) {
                    // Ignore
                  }
                };
                document.addEventListener("click", silentPlay, { once: true });
                document.addEventListener("keydown", silentPlay, {
                  once: true,
                });
                document.addEventListener("touchstart", silentPlay, {
                  once: true,
                });
                document.addEventListener("mousemove", silentPlay, {
                  once: true,
                });
              }
            }, 100);
          }
        };

        // Try to play immediately
        playAudio();

        // Also try after a small delay
        setTimeout(playAudio, 500);
        setTimeout(playAudio, 1000);
      } catch (error) {
        // Ignore errors silently
      }
    };

    initializeAudio();

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  // Enhanced label animation on step change
  useEffect(() => {
    setLabelAnimation(true);
    const timer = setTimeout(() => setLabelAnimation(false), 1200);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNext = () => {
    let canProceed = true;

    if (currentStep === 1) {
      const error = validateField("kyaHua", formData.kyaHua);
      if (error) {
        canProceed = false;
      } else {
        showToast("घटना का विवरण दर्ज हो गया", "success");
      }
    } else if (currentStep === 2) {
      showToast("लिंग चयन हो गया", "success");
    } else if (currentStep === 3 && formData.doshiNaam !== "unknown") {
      const error = validateField("doshiNaam", formData.doshiNaam);
      if (error) {
        canProceed = false;
      } else {
        showToast("दोषी का नाम दर्ज हो गया", "success");
      }
    } else if (currentStep === 4) {
      showToast("उम्र दर्ज हो गई", "success");
    }

    if (canProceed) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkipName = () => {
    setFormData((prev) => ({
      ...prev,
      doshiNaam: "unknown",
    }));
    showToast("नाम छोड़ दिया गया", "success");
    setCurrentStep((prev) => prev + 1);
  };

  // Navigation handlers
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  // Typing effect handlers
  const handleTypingStart = (fieldName) => {
    setTypingStates((prev) => ({ ...prev, [fieldName]: true }));
  };

  const handleTypingStop = (fieldName) => {
    setTimeout(() => {
      setTypingStates((prev) => ({ ...prev, [fieldName]: false }));
    }, 1000);
  };

  // Enhanced input change handler with typing effect
  const handleInputChangeWithTyping = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validation
    const error = validateField(field, value);
    setValidationErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    handleTypingStart(field);

    // Clear existing timeout
    if (typingTimeouts.current[field]) {
      clearTimeout(typingTimeouts.current[field]);
    }

    // Set new timeout
    typingTimeouts.current[field] = setTimeout(() => {
      handleTypingStop(field);
    }, 500);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="w-full max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <label
                className={`nosifer-regular block text-6xl font-black mb-4 tracking-wider drop-shadow-2xl transition-all duration-1000 ease-out text-cyan-900
                  ${labelAnimation ? "label-grow" : "label-grow"}`}
              >
                क्या हुआ?
              </label>
            </div>

            <div className="fire-frame-border backdrop-blur-xl bg-indigo-900/30 rounded-xl shadow-2xl p-6">
              <textarea
                value={formData.kyaHua}
                onChange={(e) =>
                  handleInputChangeWithTyping("kyaHua", e.target.value)
                }
                className={`w-full h-40 text-white text-lg placeholder-blue-300 bg-transparent resize-none outline-none border-none`}
                placeholder="यहाँ विस्तार से बताएं कि क्या हुआ था..."
              />
            </div>

            {validationErrors.kyaHua && (
              <p className="text-red-400 text-center mt-4 font-bold">
                {validationErrors.kyaHua}
              </p>
            )}

            {formData.kyaHua.trim() && !validationErrors.kyaHua && (
              <button
                type="button"
                onClick={handleNext}
                className="mt-8 mx-auto block px-8 py-3 bg-gradient-to-r from-purple-600/60 to-purple-800/60 backdrop-blur-md border border-purple-500/50 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:from-purple-600/80 hover:to-purple-800/80 shadow-lg hover:shadow-purple-500/30"
              >
                आगे बढ़ें
              </button>
            )}
          </div>
        );

      case 2:
        return (
          <div className="w-full max-w-xl mx-auto">
            <div className="text-center mb-8">
              <label
                className={`nosifer-regular block text-6xl font-black mb-4 tracking-wider drop-shadow-2xl transition-all duration-1000 ease-out text-cyan-900
                  ${labelAnimation ? "label-grow" : "label-grow"}`}
              >
                दोषी
              </label>
            </div>

            <div className="fire-frame-border backdrop-blur-xl bg-indigo-900/30 rounded-xl shadow-2xl p-8">
              <div className="space-y-6">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.doshiGender === "male"}
                    onChange={(e) =>
                      handleInputChangeWithTyping("doshiGender", e.target.value)
                    }
                    className="mr-4 w-6 h-6 text-purple-400 bg-transparent border-2 border-purple-300 focus:ring-2 focus:ring-purple-400 appearance-none rounded-full relative checked:bg-purple-400/30 checked:border-purple-400"
                  />
                  <span className="text-2xl text-white group-hover:text-purple-300 transition-colors drop-shadow-md font-bold">
                    पुरुष
                  </span>
                </label>

                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.doshiGender === "female"}
                    onChange={(e) =>
                      handleInputChangeWithTyping("doshiGender", e.target.value)
                    }
                    className="mr-4 w-6 h-6 text-purple-400 bg-transparent border-2 border-purple-300 focus:ring-2 focus:ring-purple-400 appearance-none rounded-full relative checked:bg-purple-400/30 checked:border-purple-400"
                  />
                  <span className="text-2xl text-white group-hover:text-purple-300 transition-colors drop-shadow-md font-bold">
                    महिला
                  </span>
                </label>
              </div>
            </div>

            {formData.doshiGender && (
              <button
                type="button"
                onClick={handleNext}
                className="mt-8 mx-auto block px-8 py-3 bg-gradient-to-r from-purple-600/60 to-purple-800/60 backdrop-blur-md border border-purple-500/50 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:from-purple-600/80 hover:to-purple-800/80 shadow-lg hover:shadow-purple-500/30"
              >
                आगे बढ़ें
              </button>
            )}
          </div>
        );

      case 3:
        return (
          <div className="w-full max-w-xl mx-auto">
            <div className="text-center mb-8">
              <label
                className={`nosifer-regular block text-6xl font-black mb-4 tracking-wider drop-shadow-2xl transition-all duration-1000 ease-out text-cyan-900
                  ${labelAnimation ? "label-grow" : "label-grow"}`}
              >
                दोषी का नाम
              </label>
            </div>

            <div className="fire-frame-border backdrop-blur-xl bg-indigo-900/30 rounded-xl shadow-2xl p-6">
              <input
                type="text"
                value={
                  formData.doshiNaam === "unknown" ? "" : formData.doshiNaam
                }
                onChange={(e) =>
                  handleInputChangeWithTyping("doshiNaam", e.target.value)
                }
                className="w-full text-white text-xl placeholder-blue-300 bg-transparent outline-none border-none"
                placeholder="नाम दर्ज करें..."
              />
            </div>

            {validationErrors.doshiNaam && (
              <p className="text-red-400 text-center mt-4 font-bold">
                {validationErrors.doshiNaam}
              </p>
            )}

            <div className="flex justify-center space-x-4 mt-8">
              {formData.doshiNaam.trim() && !validationErrors.doshiNaam && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600/60 to-purple-800/60 backdrop-blur-md border border-purple-500/50 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:from-purple-600/80 hover:to-purple-800/80 shadow-lg hover:shadow-purple-500/30"
                >
                  आगे बढ़ें
                </button>
              )}

              <button
                type="button"
                onClick={handleSkipName}
                className="px-8 py-3 bg-gradient-to-r from-gray-600/60 to-gray-800/60 backdrop-blur-md border border-gray-500/50 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:from-gray-600/80 hover:to-gray-800/80 shadow-lg hover:shadow-gray-500/30"
              >
                छोड़ें
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="w-full max-w-xl mx-auto">
            <div className="text-center mb-8">
              <label
                className={`block text-6xl font-black mb-4 tracking-wider drop-shadow-2xl transition-all duration-1000 ease-out text-cyan-900 ${
                  labelAnimation ? "label-grow" : "label-grow"
                }`}
              >
                उम्र
              </label>
            </div>

            <div className="fire-frame-border backdrop-blur-xl bg-indigo-900/30 rounded-xl shadow-2xl p-6">
              <input
                type="number"
                value={formData.doshiUmar}
                onChange={(e) =>
                  handleInputChangeWithTyping("doshiUmar", e.target.value)
                }
                className={`w-full text-white text-xl placeholder-blue-300 bg-transparent outline-none border-none`}
                placeholder="उम्र दर्ज करें..."
                min="1"
                max="120"
              />
            </div>

            {formData.doshiUmar && (
              <button
                type="button"
                onClick={handleNext}
                className="mt-8 mx-auto block px-8 py-3 bg-gradient-to-r from-purple-600/60 to-purple-800/60 backdrop-blur-md border border-purple-500/50 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:from-purple-600/80 hover:to-purple-800/80 shadow-lg hover:shadow-purple-500/30"
              >
                आगे बढ़ें
              </button>
            )}
          </div>
        );

      case 5:
        return (
          <div className="w-full max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <label
                className={`nosifer-regular block text-6xl font-black mb-4 tracking-wider drop-shadow-2xl transition-all duration-1000 ease-out text-cyan-900
                  ${labelAnimation ? "label-grow" : "label-grow"}`}
              >
                पहचान
              </label>
            </div>

            <div className="fire-frame-border backdrop-blur-xl bg-indigo-900/30 rounded-xl shadow-2xl p-6">
              <textarea
                value={formData.doshiPehchan}
                onChange={(e) =>
                  handleInputChangeWithTyping("doshiPehchan", e.target.value)
                }
                className={`w-full h-32 text-white text-lg placeholder-blue-300 bg-transparent resize-none outline-none border-none `}
                placeholder="दोषी की शारीरिक बनावट, कपड़े, या कोई विशेष पहचान बताएं..."
              />
            </div>

            {validationErrors.doshiPehchan && (
              <p className="text-red-400 text-center mt-4 font-bold">
                {validationErrors.doshiPehchan}
              </p>
            )}

            {formData.doshiPehchan.trim() && !validationErrors.doshiPehchan && (
              <button
                type="submit"
                className="mt-8 mx-auto block px-8 py-3 bg-gradient-to-r from-green-600/60 to-green-800/60 backdrop-blur-md border border-green-500/50 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:from-green-600/80 hover:to-green-800/80 shadow-lg hover:shadow-green-500/30"
              >
                शिकायत दर्ज करें
              </button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        @keyframes labelGrow {
          0% { 
            transform: scale(0.8);
            font-weight: 700;
          }
          50% { 
            transform: scale(1.15);
            font-weight: 900;
          }
          100% { 
            transform: scale(1);
            font-weight: 900;
          }
        }
        
        .label-grow {
          animation: labelGrow 1.2s ease-out forwards;
          font-weight: 900 !important;
        }

        /* Fire Frame Border CSS */
        .fire-frame-border {
          position: relative;
          overflow: visible;
        }

        .fire-frame-border::before {
          content: "";
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          border: 3px solid white;
          border-radius: 12px;
          box-shadow: 
            0 0 20px #0f0, 
            inset 0 0 20px #0f0,
            0 0 40px #0f0;
          animation: fireGlow 3s linear infinite;
          z-index: -1;
        }

        .fire-frame-border::after {
          content: "";
          position: absolute;
          top: -12px;
          left: -12px;
          right: -12px;
          bottom: -12px;
          border: 2px solid white;
          border-radius: 16px;
          box-shadow: 
            0 0 30px #fff, 
            inset 0 0 30px #fff;
          z-index: -2;
        }

        @keyframes fireGlow {
          0% {
            box-shadow: 
              0 0 20px #0f0, 
              inset 0 0 20px #0f0,
              0 0 40px #0f0;
            filter: hue-rotate(0deg);
          }
          20% {
            box-shadow: 
              0 0 30px #0f0, 
              inset 0 0 30px #0f0,
              0 0 50px #0f0;
          }
          40% {
            box-shadow: 
              0 0 15px #0f0, 
              inset 0 0 15px #0f0,
              0 0 35px #0f0;
          }
          60% {
            box-shadow: 
              0 0 35px #0f0, 
              inset 0 0 35px #0f0,
              0 0 60px #0f0;
          }
          100% {
            box-shadow: 
              0 0 20px #0f0, 
              inset 0 0 20px #0f0,
              0 0 40px #0f0;
            filter: hue-rotate(360deg);
          }
        }

        /* Reverse spin animation */
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

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .fire-frame-border::before {
            top: -6px;
            left: -6px;
            right: -6px;
            bottom: -6px;
            border-width: 2px;
            box-shadow: 
              0 0 15px #0f0, 
              inset 0 0 15px #0f0,
              0 0 30px #0f0;
          }

          .fire-frame-border::after {
            top: -9px;
            left: -9px;
            right: -9px;
            bottom: -9px;
            border-width: 1px;
            box-shadow: 
              0 0 20px #fff, 
              inset 0 0 20px #fff;
          }
        }

        @media (max-width: 480px) {
          .fire-frame-border::before {
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            border-width: 1px;
            box-shadow: 
              0 0 10px #0f0, 
              inset 0 0 10px #0f0,
              0 0 20px #0f0;
          }

          .fire-frame-border::after {
            top: -6px;
            left: -6px;
            right: -6px;
            bottom: -6px;
            border-width: 1px;
            box-shadow: 
              0 0 15px #fff, 
              inset 0 0 15px #fff;
          }
        }
      `}</style>

      <div
        className="min-h-screen w-full overflow-hidden relative"
        style={{
          backgroundImage: `url('/formcave.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <ToastContainer />
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
                <div className="absolute inset-0 animate-spin duration-2000 animate-reverse">
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

        <div className="flex items-center justify-center min-h-screen p-8 relative z-10">
          <form onSubmit={handleSubmit} className="w-full">
            {renderCurrentStep()}
          </form>
        </div>
      </div>
    </>
  );
};

export default AparadhDetails;
