import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AntimVaani = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [needsUserInteraction, setNeedsUserInteraction] = useState(false);

  const videourl =
    "https://res.cloudinary.com/dkgfdtk2v/video/upload/v1717646686/Video_2_ss3ymn.mp4";

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleBeforeUnload = () => {
      navigate("/", { replace: true });
    };

    const handleKeyDown = (e) => {
      if (
        e.key === "F5" ||
        (e.ctrlKey && (e.key === "r" || e.key === "R")) ||
        (e.metaKey && (e.key === "r" || e.key === "R"))
      ) {
        e.preventDefault();
        navigate("/", { replace: true });
        return false;
      }
    };

    const handlePopState = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("resize", checkMobile);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  const handleVideoEnd = () => {
    navigate("/all-complaints", { replace: true });
  };

  const startVideo = async () => {
    if (videoRef.current) {
      try {
        // First try to play with sound
        videoRef.current.muted = false;
        await videoRef.current.play();
        setNeedsUserInteraction(false);
      } catch (error) {
        // If failed, try muted first then unmute
        try {
          videoRef.current.muted = true;
          await videoRef.current.play();

          // After successful muted play, try to unmute
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.muted = false;
            }
          }, 100);
          setNeedsUserInteraction(false);
        } catch (mutedError) {
          // If even muted fails, show click prompt
          console.log("Autoplay blocked, user interaction needed");
          setNeedsUserInteraction(true);
        }
      }
    }
  };

  const handleVideoLoad = () => {
    setIsVideoReady(true);
    setTimeout(() => {
      setVideoStarted(true);
      startVideo();
    }, 100);
  };

  const handleVideoError = (error) => {
    console.error("Video loading error:", error);
  };

  const handleUserInteraction = () => {
    if (needsUserInteraction || (videoRef.current && videoRef.current.paused)) {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.play();
        setNeedsUserInteraction(false);
      }
    }
  };

  // Force video play on component mount
  useEffect(() => {
    if (isVideoReady && videoRef.current) {
      const timer = setTimeout(() => {
        startVideo();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isVideoReady]);

  return (
    <div
      className="min-h-screen relative overflow-hidden cursor-pointer"
      onClick={handleUserInteraction}
      style={{
        backgroundImage: `url("/videocave.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* SVG Filter for Fire Effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="fire" x="0" y="0">
            <feTurbulence
              x="0"
              y="0"
              baseFrequency="0.09"
              numOctaves="5"
              seed="2"
            >
              <animate
                attributeName="baseFrequency"
                dur="50s"
                values="0.02;0.003;0.02;"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              scale={isMobile ? "15" : "30"}
            />
          </filter>
        </defs>
      </svg>

      {/* Fire particles background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(isMobile ? 25 : 50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-500 rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `floatSpark ${
                2 + Math.random() * 3
              }s infinite ease-in-out`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Click to play message - only show when user interaction is needed */}
      {needsUserInteraction && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50">
          <div className="bg-white text-black px-6 py-4 rounded-lg text-center shadow-lg">
            <p className="text-lg font-semibold mb-2">🔥 Antim Vaani 🔥</p>
            <p className="text-sm">Click anywhere to start the video</p>
            <p className="text-xs mt-1 opacity-70">
              कहीं भी क्लिक करें वीडियो शुरू करने के लिए
            </p>
          </div>
        </div>
      )}

      {/* Video Container with Fire Frame */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`relative transition-all duration-1000 ease-out ${
            videoStarted
              ? isMobile
                ? "w-full max-w-sm"
                : "w-4/5 h-4/5"
              : "w-32 h-32"
          }`}
          style={
            isMobile
              ? {
                  aspectRatio: "16/9",
                  height: "auto",
                  maxHeight: "50vh",
                }
              : {}
          }
        >
          {/* Fire Frame - Only show when video is started */}
          {videoStarted && isVideoReady && (
            <div
              className="fire-frame absolute inset-0 pointer-events-none"
              style={{
                filter: `url(#fire) blur(${isMobile ? "0.5px" : "1px"})`,
                zIndex: 10,
              }}
            >
              {/* Outer Frame */}
              <div className="fire-frame-outer absolute inset-0"></div>
              {/* Inner Frame */}
              <div className="fire-frame-inner absolute inset-0"></div>
            </div>
          )}

          {/* Video */}
          <video
            ref={videoRef}
            onEnded={handleVideoEnd}
            onLoadedData={handleVideoLoad}
            onCanPlay={handleVideoLoad}
            onError={handleVideoError}
            autoPlay
            muted={false}
            playsInline
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplaybook"
            preload="metadata"
            className={`w-full h-full transition-opacity duration-500 relative z-0 ${
              !isVideoReady ? "opacity-0" : "opacity-100"
            }`}
            style={{
              pointerEvents: "none",
              filter: "brightness(1.1) contrast(1.2)",
              objectFit: isMobile ? "cover" : "cover",
              borderRadius: isMobile ? "8px" : "10px",
            }}
          >
            <source src={videourl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Overlay for interactions */}
      <div
        className="absolute inset-0 bg-transparent"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{
          pointerEvents: "auto",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
          WebkitTouchCallout: "none",
        }}
      />

      <style>{`
        .fire-frame-outer::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: ${isMobile ? "10px" : "20px"} solid white;
          box-shadow: 0 0 ${isMobile ? "25px" : "50px"} #fff,
            inset 0 0 ${isMobile ? "25px" : "50px"} #fff;
          border-radius: ${isMobile ? "8px" : "10px"};
        }

        .fire-frame-inner::before {
          content: "";
          position: absolute;
          top: ${isMobile ? "5px" : "10px"};
          left: ${isMobile ? "5px" : "10px"};
          right: ${isMobile ? "5px" : "10px"};
          bottom: ${isMobile ? "5px" : "10px"};
          border: ${isMobile ? "10px" : "20px"} solid white;
          box-shadow: 0 0 ${isMobile ? "25px" : "50px"} #ff4500,
            inset 0 0 ${isMobile ? "25px" : "50px"} #ff4500;
          animation: fireAnimation 5s linear infinite;
          border-radius: ${isMobile ? "6px" : "8px"};
        }

        @keyframes fireAnimation {
          0% {
            box-shadow: 0 0 ${isMobile ? "25px" : "50px"} #ff4500,
              inset 0 0 ${isMobile ? "25px" : "50px"} #ff4500;
            filter: hue-rotate(0deg);
          }
          20% {
            box-shadow: 0 0 ${isMobile ? "30px" : "60px"} #ff6500,
              inset 0 0 ${isMobile ? "30px" : "60px"} #ff6500;
          }
          40% {
            box-shadow: 0 0 ${isMobile ? "20px" : "40px"} #ff8c00,
              inset 0 0 ${isMobile ? "20px" : "40px"} #ff8c00;
          }
          60% {
            box-shadow: 0 0 ${isMobile ? "40px" : "80px"} #ffa500,
              inset 0 0 ${isMobile ? "40px" : "80px"} #ffa500;
          }
          80% {
            box-shadow: 0 0 ${isMobile ? "35px" : "70px"} #ff2500,
              inset 0 0 ${isMobile ? "35px" : "70px"} #ff2500;
          }
          100% {
            box-shadow: 0 0 ${isMobile ? "25px" : "50px"} #ff4500,
              inset 0 0 ${isMobile ? "25px" : "50px"} #ff4500;
            filter: hue-rotate(360deg);
          }
        }

        @keyframes floatSpark {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-10px) translateX(5px) rotate(90deg);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-5px) translateX(-3px) rotate(180deg);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-15px) translateX(8px) rotate(270deg);
            opacity: 0.9;
          }
          100% {
            transform: translateY(0) translateX(0) rotate(360deg);
            opacity: 0.4;
          }
        }

        @media (max-width: 768px) {
          .min-h-screen {
            height: 100vh;
            height: 100dvh;
          }
        }
      `}</style>
    </div>
  );
};

export default AntimVaani;
