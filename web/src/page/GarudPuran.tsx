import React, { useEffect, useRef, useState } from "react";
import {
  Skull,
  Flame,
  Eye,
  Zap,
  Menu,
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const GarudPuran: React.FC = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [bloodDrip, setBloodDrip] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [narakData, setNarakData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false,
    limit: 6,
  });
  const navigate = useNavigate();

  // Blood drip effect
  useEffect(() => {
    const dripInterval = setInterval(() => {
      setBloodDrip(true);
      setTimeout(() => setBloodDrip(false), 2000);
    }, 6000);

    return () => clearInterval(dripInterval);
  }, []);

  // Fetch Garud Purans data
  const fetchGarudPurans = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/crime/garudpuran?page=${page}`
      );

      if (response.data.success) {
        setNarakData(response.data.data);
        setPagination(response.data.pagination);
      } else {
        // setError("Failed to fetch data");
      }
    } catch (err) {
      // setError("Error fetching Garud Puran data");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGarudPurans();
  }, []);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchGarudPurans(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Navigation handlers
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [narakData]);

  const getRandomIcon = (index: number) => {
    const icons = [Skull, Flame, Eye, Zap];
    return icons[index % icons.length];
  };

  const getAnimationClass = (index: number) => {
    const animations = [
      "slide-in-left",
      "slide-in-right",
      "slide-in-down",
      "slide-in-up",
    ];
    return animations[index % animations.length];
  };

  // Loading component
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-red-400 text-xl">Loading नरक data...</p>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Skull className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <p className="text-red-400 text-xl">{error}</p>
          <button
            onClick={() => fetchGarudPurans()}
            className="mt-4 px-6 py-2 bg-red-900 text-red-200 rounded-lg hover:bg-red-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Desktop Navigation - Right Side */}
      <div className="hidden md:block fixed right-6 top-1/2 transform -translate-y-1/2 z-30">
        <div className="flex flex-col space-y-6">
          {/* All Complaints Navigation */}
          <div className="group relative">
            <button
              onClick={() => handleNavigation("/all-complaints")}
              className="w-16 h-16 bg-gradient-to-b from-red-900/80 to-red-950/90 border-2 border-red-700/60 rounded-full shadow-lg shadow-red-900/50 transition-all duration-500 hover:scale-110 hover:shadow-red-600/70 relative overflow-hidden"
            >
              {/* Rotating horror effect */}
              <div className="absolute inset-0 animate-spin duration-2000">
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
                onClick={() => handleNavigation("/all-complaints")}
                className="w-full p-4 text-left hover:bg-red-900/30 transition-all duration-300 group flex items-center space-x-3"
              >
                <div className="relative">
                  <FileText className="w-6 h-6 text-red-200 group-hover:animate-spin" />
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

      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-red-950/20 to-black"></div>

      {/* Header */}
      <div className="relative z-10 text-center py-16 px-4 mt-16 md:mt-0">
        <h1 className="nosifer-regular text-6xl md:text-8xl text-red-600 mb-4 drop-shadow-2xl animate-pulse">
          गरुड़ पुराण
        </h1>
        <p className="rubik-glitch-regular text-xl md:text-2xl text-red-400 tracking-wider">
          28 नरकों की यातनाएं
        </p>
        <p className="text-red-500 mt-2">
          Page {pagination.currentPage} of {pagination.totalPages} (
          {pagination.totalItems} total नरक)
        </p>
      </div>

      {/* Cards Container */}
      <div className="relative z-10 px-4 pb-16">
        <div className="max-w-6xl mx-auto space-y-8">
          {narakData.map((narak: any, index: number) => {
            const IconComponent = getRandomIcon(index);
            return (
              <div
                key={narak._id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className={`card-container ${getAnimationClass(
                  index
                )} opacity-0 transform translate-y-20`}
              >
                <div className="bg-gradient-to-r from-red-950/90 via-black/90 to-red-950/90 rounded-xl border border-red-800/50 p-8 hover:border-red-600/70 transition-all duration-500 backdrop-blur-sm shadow-2xl hover:shadow-red-900/50 group">
                  {/* Card Header */}
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-red-900/80 rounded-full flex items-center justify-center border-2 border-red-600 group-hover:border-red-400 transition-colors duration-300">
                        <IconComponent className="w-8 h-8 text-red-400 group-hover:text-red-300" />
                      </div>
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-red-500 font-bold text-2xl nosifer-regular">
                          {narak.id}
                        </span>
                        <div className="h-px bg-gradient-to-r from-red-600 to-transparent flex-grow"></div>
                      </div>

                      <h2 className="nosifer-regular text-2xl md:text-3xl text-red-300 mb-4 leading-tight group-hover:text-red-200 transition-colors duration-300">
                        {narak.name}
                      </h2>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-black/60 rounded-lg p-6 border border-red-900/30 group-hover:border-red-800/50 transition-colors duration-300">
                    <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">
                      {narak.description}
                    </p>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                    <Flame className="w-12 h-12 text-red-600 animate-pulse" />
                  </div>

                  <div className="absolute bottom-4 left-4 opacity-10 group-hover:opacity-30 transition-opacity duration-300">
                    <Skull className="w-8 h-8 text-red-800" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      <div className="relative z-10 pb-16 px-10 pt-20 ">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center space-x-4">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                pagination.hasPrev
                  ? "bg-red-900/80 border-red-700 text-red-200 hover:bg-red-800/80 hover:border-red-600"
                  : "bg-gray-800/50 border-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  const current = pagination.currentPage;
                  return (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= current - 1 && page <= current + 1)
                  );
                })
                .map((page, index, filteredPages) => (
                  <React.Fragment key={page}>
                    {index > 0 && filteredPages[index - 1] !== page - 1 && (
                      <span className="text-red-500">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg border-2 transition-all duration-300 ${
                        page === pagination.currentPage
                          ? "bg-red-600 border-red-500 text-white"
                          : "bg-red-900/50 border-red-700 text-red-200 hover:bg-red-800/50 hover:border-red-600"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                pagination.hasNext
                  ? "bg-red-900/80 border-red-700 text-red-200 hover:bg-red-800/80 hover:border-red-600"
                  : "bg-gray-800/50 border-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Page Info */}
          <div className="text-center mt-6 text-red-400">
            <p>
              Showing {narakData.length} of {pagination.totalItems} नरक
            </p>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
      .card-container.animate-in {
        animation-duration: 0.8s;
        animation-fill-mode: forwards;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      }

      .slide-in-left.animate-in {
        animation-name: slideInLeft;
      }

      .slide-in-right.animate-in {
        animation-name: slideInRight;
      }

      .slide-in-down.animate-in {
        animation-name: slideInDown;
      }

      .slide-in-up.animate-in {
        animation-name: slideInUp;
      }

      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-100px) translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0) translateY(0);
        }
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100px) translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0) translateY(0);
        }
      }

      @keyframes slideInDown {
        from {
          opacity: 0;
          transform: translateY(-100px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(100px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
    </div>
  );
};

export default GarudPuran;
