import React, { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";

const HorrorStarter = ({ onNavigate }) => {
  const [videoEnded, setVideoEnded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(console.error);
    }
  }, []);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setTimeout(() => {
      setShowButton(true);
    }, 1000);
  };

  const handleEnter = () => {
    // Navigate to AparichitVaani page
    if (onNavigate) {
      onNavigate();
    } else {
      // Default navigation logic - you can replace this with your router logic
      window.location.href = "/aparichit-vaani";
    }
  };

  return (
    <>
      {/* Custom CSS */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes ghostFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes bloodDrip {
            0% { transform: translateY(-100px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(200px); opacity: 0; }
          }
          
          .fade-in-up {
            animation: fadeInUp 1s ease-out;
          }
          
          .ghost-float {
            animation: ghostFloat 3s ease-in-out infinite;
          }
          
          .blood-drip {
            animation: bloodDrip 4s ease-in-out infinite;
          }
        `}
      </style>

      <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
        {/* Background Video - Fully Responsive */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-50 sm:opacity-60"
          muted
          playsInline
          onEnded={handleVideoEnd}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          style={{ pointerEvents: "none" }}
        >
          <source
            src="https://res.cloudinary.com/dkgfdtk2v/video/upload/v1757454864/a7233b310a26aee8cfc87d6c3d67f999_ge8bip.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark Overlay - Responsive */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-red-950/30 to-black/90 sm:from-black/70 sm:via-red-950/20 sm:to-black/90"></div>

        {/* Animated Background Elements - Responsive */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating shadows - Fewer on mobile */}
          {[...Array(window.innerWidth < 768 ? 8 : 15)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-red-900/10 rounded-full ghost-float"
              style={{
                width: `${
                  Math.random() * (window.innerWidth < 768 ? 50 : 100) + 30
                }px`,
                height: `${
                  Math.random() * (window.innerWidth < 768 ? 50 : 100) + 30
                }px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            ></div>
          ))}

          {/* Blood drips effect - Fewer on mobile */}
          {[...Array(window.innerWidth < 768 ? 4 : 8)].map((_, i) => (
            <div
              key={`drip-${i}`}
              className="absolute w-0.5 sm:w-1 bg-gradient-to-b from-red-800 to-transparent opacity-30 sm:opacity-40 blood-drip"
              style={{
                height: `${Math.random() * 150 + 80}px`,
                left: `${Math.random() * 100}%`,
                top: "0",
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Main Content - Fully Responsive */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
          {/* Title - Responsive Typography */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <h1 className="nosifer-regular text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-red-600 mb-2 sm:mb-4 animate-pulse drop-shadow-2xl leading-tight">
              WELCOME
            </h1>
            <div className="relative">
              <h2 className="nosifer-regular text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-1 sm:mb-2 ghost-float drop-shadow-2xl leading-tight">
                Galti Ki Saza
              </h2>
              <h3 className="nosifer-regular text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-red-500 animate-pulse drop-shadow-2xl leading-tight">
                MOUT
              </h3>

              {/* Glowing effect around text - Responsive */}
              <div className="absolute inset-0 nosifer-regular text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-red-500 opacity-20 blur-sm animate-pulse leading-tight">
                MOUT
              </div>
            </div>
          </div>

          {/* Horror Button - Fully Responsive */}
          {showButton && (
            <div className="relative fade-in-up">
              <button
                onClick={handleEnter}
                className="group relative px-6 py-4 sm:px-8 sm:py-5 lg:px-12 lg:py-6 
                          bg-gradient-to-r from-red-900 to-black border-2 border-red-600 
                          text-white text-sm sm:text-lg lg:text-xl font-bold 
                          transform hover:scale-105 transition-all duration-300 
                          hover:shadow-2xl hover:shadow-red-600/50
                          animate-pulse hover:animate-none overflow-hidden
                          w-full max-w-sm sm:max-w-md mx-auto"
                style={{
                  clipPath:
                    "polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)",
                }}
              >
                {/* Button background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-800 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Button content - Responsive */}
                <div className="relative flex items-center justify-center space-x-2 sm:space-x-3">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-400 group-hover:text-white transition-colors duration-300" />
                  <span className="nosifer-regular text-red-300 group-hover:text-white transition-colors duration-300 text-xs sm:text-sm lg:text-base">
                    ENTER IF YOU DARE
                  </span>
                </div>

                {/* Glowing border effect */}
                <div
                  className="absolute inset-0 border-2 border-red-400 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"
                  style={{
                    clipPath:
                      "polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)",
                  }}
                ></div>
              </button>

              {/* Button glow effect */}
              <div className="absolute inset-0 bg-red-600/20 blur-xl animate-pulse rounded-full scale-125 sm:scale-150 -z-10"></div>
            </div>
          )}

          {/* Loading indicator - Responsive */}
          {!videoEnded && (
            <div className="fixed bottom-30 sm:bottom-30 left-1/2 transform -translate-x-1/2 z-20">
              <div className="flex items-center space-x-1 sm:space-x-2 text-red-400">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-600 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 sm:w-3 sm:h-3 bg-red-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 sm:w-3 sm:h-3 bg-red-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <p className="nosifer-regular text-red-500 text-xs sm:text-sm mt-2 animate-pulse text-center">
                Loading...
              </p>
            </div>
          )}
        </div>

        {/* Corner decorations - Responsive */}
        <div className="absolute top-0 left-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 border-l-2 border-t-2 sm:border-l-4 sm:border-t-4 border-red-600 opacity-60"></div>
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 border-r-2 border-t-2 sm:border-r-4 sm:border-t-4 border-red-600 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 border-l-2 border-b-2 sm:border-l-4 sm:border-b-4 border-red-600 opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 border-r-2 border-b-2 sm:border-r-4 sm:border-b-4 border-red-600 opacity-60"></div>
      </div>
    </>
  );
};

export default HorrorStarter;
