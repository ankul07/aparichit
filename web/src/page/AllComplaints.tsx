import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  Eye,
  AlertTriangle,
  Skull,
  Flame,
  Menu,
  X,
  UserCircle,
  FileText,
} from "lucide-react";
// Note: You'll need to import useNavigate from react-router-dom and axios in your actual project
const API_URL = import.meta.env.VITE_API_URL;
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  username: string;
  email: string;
}

interface Complaint {
  crimeId: string;
  user: User;
  kyaHua: string;
  doshiNaam: string;
  doshiUmar: string;
  doshiGender: string;
  doshiPehchan: string;
  status: string;
  incidentDate: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCrimes: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

const AllComplaints: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [bloodDrip, setBloodDrip] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalCrimes: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 3,
  });
  const [error, setError] = useState<string>("");
  console.log(complaints);
  const navigate = useNavigate();
  const complaintsPerPage = 3;

  // Blood drip effect
  useEffect(() => {
    const dripInterval = setInterval(() => {
      setBloodDrip(true);
      setTimeout(() => setBloodDrip(false), 2000);
    }, 6000);

    return () => clearInterval(dripInterval);
  }, []);

  // Fetch complaints from API
  const fetchComplaints = async (page: number = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/crime/getAllcrime`, {
        params: {
          page,
          limit: complaintsPerPage,
        },
      });
      console.log(response);
      if (response.data.success) {
        setComplaints(response.data.data.crimes);
        setPagination(response.data.data.pagination);
        setCurrentPage(response.data.data.pagination.currentPage);
      } else {
        setError("डेटा लोड करने में समस्या हुई");
      }
    } catch (error: any) {
      console.error("Error fetching complaints:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      } else if (error.response?.status === 404) {
        setError("कोई शिकायत नहीं मिली");
      } else {
        setError("डेटा लोड करने में समस्या हुई। कृपया दोबारा कोशिश करें।");
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchComplaints(1);
  }, []);

  // Navigation handlers
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  // Pagination handlers
  const nextPage = () => {
    if (pagination.hasNextPage) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchComplaints(newPage);
    }
  };

  const prevPage = () => {
    if (pagination.hasPrevPage) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchComplaints(newPage);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    fetchComplaints(page);
  };

  // Loading component
  if (loading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-red-200 text-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl">शिकायतें लोड हो रही हैं...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-red-100 p-6 overflow-hidden">
      {/* Desktop Navigation - Right Side */}
      <div className="hidden md:block fixed right-6 top-1/2 transform -translate-y-1/2 z-30">
        <div className="flex flex-col space-y-6">
          {/* Garud Puran Navigation */}
          <div className="group relative">
            <button
              onClick={() => handleNavigation("/garuda-purana")}
              className="w-16 h-16 bg-gradient-to-b from-red-900/80 to-red-950/90 border-2 border-red-700/60 rounded-full shadow-lg shadow-red-900/50 transition-all duration-500 hover:scale-110 hover:shadow-red-600/70 relative overflow-hidden"
            >
              {/* Rotating horror effect */}
              <div className="absolute inset-0 animate-spin duration-2000">
                <Skull className="w-8 h-8 text-red-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
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
              गरुड़ पुराण
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-l-8 border-l-stone-900/90 border-t-4 border-b-4 border-t-transparent border-b-transparent"></div>
            </div>
          </div>

          {/* Form Navigation */}
          <div className="group relative">
            <button
              onClick={() => handleNavigation("/aparadh-details")}
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
              अपराध विवरण
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-l-8 border-l-stone-900/90 border-t-4 border-b-4 border-t-transparent border-b-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Top */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 p-4">
        <div className="flex justify-between items-center">
          <div className="text-red-200 text-lg font-bold">शिकायतें</div>

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
                className="w-full p-4 text-left hover:bg-red-900/30 transition-all duration-300 group flex items-center space-x-3"
              >
                <div className="relative">
                  <Skull className="w-6 h-6 text-red-200 group-hover:animate-spin" />
                  <div className="absolute bottom-0 left-0 w-1 h-1 bg-orange-500 rounded-full animate-ping"></div>
                </div>
                <span className="text-red-200 group-hover:text-red-100 transition-colors duration-300">
                  गरुड़ पुराण
                </span>
              </button>

              <button
                onClick={() => handleNavigation("/aparadh-details")}
                className="w-full p-4 text-left hover:bg-red-900/30 transition-all duration-300 group flex items-center space-x-3"
              >
                <div className="relative">
                  <FileText className="w-6 h-6 text-red-200 group-hover:animate-spin" />
                  <div className="absolute bottom-0 left-0 w-1 h-1 bg-orange-500 rounded-full animate-ping"></div>
                </div>
                <span className="text-red-200 group-hover:text-red-100 transition-colors duration-300">
                  अपराध विवरण
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-red-950/20 to-black"></div>

      {/* Header */}
      <div className="text-center mb-8 mt-16 md:mt-0 relative z-10">
        <h1 className="text-4xl font-bold text-red-500 mb-2 animate-pulse">
          डरावनी शिकायतें
        </h1>
        <p className="text-red-300 text-lg">
          अंधेरे में छुपे रहस्यों की गवाही...
        </p>
        <div className="w-32 h-1 bg-red-600 mx-auto mt-4 animate-pulse"></div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto mb-6 relative z-10">
          <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 text-center">
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => fetchComplaints(1)}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              दोबारा कोशिश करें
            </button>
          </div>
        </div>
      )}

      {/* Complaints List */}
      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {complaints.length === 0 ? (
          <div className="text-center py-12">
            <Skull className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
            <p className="text-red-300 text-xl">कोई शिकायत नहीं मिली</p>
            <p className="text-red-500 text-sm mt-2">अंधेरा शांत है...</p>
          </div>
        ) : (
          complaints.map((complaint) => (
            <div
              key={complaint.crimeId}
              className="bg-gray-900 border border-red-800 rounded-lg p-6 shadow-2xl hover:shadow-red-900/20 transition-all duration-300 hover:border-red-600 group"
            >
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-red-800/50 pb-3">
                {/* User Info */}
                <div className="flex items-center space-x-3 mb-2 md:mb-0">
                  <div className="flex items-center space-x-2">
                    <UserCircle className="h-6 w-6 text-red-400" />
                    <div>
                      <span className="text-red-300 font-semibold block">
                        {complaint.user.username}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Time and Status */}
                <div className="flex flex-col md:items-end space-y-1">
                  <div className="flex items-center space-x-2 text-red-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{complaint.timestamp}</span>
                  </div>
                  {complaint.status && (
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        complaint.status === "pending"
                          ? "bg-yellow-900/30 border-yellow-600/50 text-yellow-300"
                          : complaint.status === "resolved"
                          ? "bg-green-900/30 border-green-600/50 text-green-300"
                          : "bg-red-900/30 border-red-600/50 text-red-300"
                      }`}
                    >
                      {complaint.status === "pending"
                        ? "लंबित"
                        : complaint.status === "resolved"
                        ? "समाधान"
                        : complaint.status}
                    </div>
                  )}
                </div>
              </div>

              {/* Incident Description */}
              <div className="mb-6">
                <h3 className="text-red-400 font-semibold mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  क्या हुआ था:
                </h3>
                <p className="text-red-100 leading-relaxed bg-black/50 p-4 rounded border-l-4 border-red-600">
                  {complaint.kyaHua}
                </p>
              </div>

              {/* Incident Date */}
              {complaint.incidentDate && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-red-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">घटना की तारीख: </span>
                    <span className="text-red-300">
                      {new Date(complaint.incidentDate).toLocaleDateString(
                        "hi-IN"
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Suspect Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Eye className="h-4 w-4 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-red-400 font-medium block">
                        दोषी का नाम:
                      </span>
                      <span className="text-red-200">
                        {complaint.doshiNaam}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 bg-red-600 rounded-full mt-1 flex-shrink-0 animate-pulse"></div>
                    <div>
                      <span className="text-red-400 font-medium block">
                        उम्र:
                      </span>
                      <span className="text-red-200">
                        {complaint.doshiUmar}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 bg-red-600 rounded-full mt-1 flex-shrink-0 animate-pulse"></div>
                    <div>
                      <span className="text-red-400 font-medium block">
                        लिंग:
                      </span>
                      <span className="text-red-200">
                        {complaint.doshiGender}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start space-x-3">
                    <Eye className="h-4 w-4 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-red-400 font-medium block mb-2">
                        पहचान/विवरण:
                      </span>
                      <p className="text-red-200 bg-black/50 p-3 rounded border border-red-800/50 leading-relaxed">
                        {complaint.doshiPehchan}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horror hover effect */}
              <div className="absolute inset-0 bg-red-600/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))
        )}
      </div>

      {/* Horror Pagination */}
      {complaints.length > 0 && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center mt-10 space-x-4 relative z-10">
          <button
            onClick={prevPage}
            disabled={!pagination.hasPrevPage}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg border transition-all duration-300 relative group overflow-hidden ${
              !pagination.hasPrevPage
                ? "bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-red-900/50 to-red-800/50 border-red-700 text-red-300 hover:from-red-800/70 hover:to-red-700/70 hover:border-red-600 shadow-lg shadow-red-900/30"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="font-medium">पिछला</span>
            {pagination.hasPrevPage && (
              <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (pageNum) => {
                const isCurrentPage = currentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-12 h-12 rounded-lg border transition-all duration-300 relative group overflow-hidden font-medium ${
                      isCurrentPage
                        ? "bg-gradient-to-b from-red-600 to-red-700 border-red-500 text-white shadow-lg shadow-red-600/50 animate-pulse"
                        : "bg-gradient-to-b from-gray-900 to-black border-red-800 text-red-300 hover:from-red-900/50 hover:to-red-800/50 hover:border-red-600 shadow-lg shadow-red-900/20"
                    }`}
                  >
                    {pageNum}
                    {!isCurrentPage && (
                      <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                    {isCurrentPage && (
                      <div className="absolute top-1 right-1 w-1 h-1 bg-orange-400 rounded-full animate-ping"></div>
                    )}
                  </button>
                );
              }
            )}
          </div>

          <button
            onClick={nextPage}
            disabled={!pagination.hasNextPage}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg border transition-all duration-300 relative group overflow-hidden ${
              !pagination.hasNextPage
                ? "bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-red-800/50 to-red-900/50 border-red-700 text-red-300 hover:from-red-700/70 hover:to-red-800/70 hover:border-red-600 shadow-lg shadow-red-900/30"
            }`}
          >
            <span className="font-medium">अगला</span>
            <ChevronRight className="h-5 w-5" />
            {pagination.hasNextPage && (
              <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="text-center mt-8 relative z-10">
        <div className="bg-black/50 border border-red-800/50 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-red-400">
            कुल शिकायतें:{" "}
            <span className="text-red-300 font-semibold animate-pulse">
              {pagination.totalCrimes}
            </span>
          </p>
          <p className="text-red-500 text-sm mt-1">
            पृष्ठ{" "}
            <span className="text-red-300 font-semibold">{currentPage}</span> of{" "}
            <span className="text-red-300 font-semibold">
              {pagination.totalPages}
            </span>
          </p>
          <div className="mt-2 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
            <span className="text-red-500 text-xs">अंधेरे की गवाही</span>
            <div
              className="w-2 h-2 bg-red-600 rounded-full animate-ping"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllComplaints;
