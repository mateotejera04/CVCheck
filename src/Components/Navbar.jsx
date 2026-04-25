import { FaBars, FaSignOutAlt, FaUser, FaTachometerAlt } from "react-icons/fa";
import { useState, useEffect, useCallback, memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { RxCross2 } from "react-icons/rx";
import { useAuth } from "../Contexts/AuthContext";
import showSuccessToast from "./showSuccessToast";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";
  const isForgotPasswordPage = location.pathname === "/forgot-password";
  const showSidebarToggle =
    !isHomePage && !isSignupPage && !isLoginPage && !isForgotPasswordPage;

  const navigate = useNavigate();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 8);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleLogout = useCallback(() => {
    logout();
    showSuccessToast("Logged out successfully!");
    navigate("/");
  }, [logout, navigate]);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-colors duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur border-b border-zinc-200"
          : "bg-white border-b border-transparent"
      }`}
    >
      <div className="container-page flex items-center justify-between py-3">
        {/* Left: Logo + Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {showSidebarToggle && (
            <button
              onClick={toggleSidebar}
              className="p-2 -ml-2 text-zinc-700 hover:text-sky-700 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <RxCross2 size={22} /> : <FaBars size={20} />}
            </button>
          )}

          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
            <span className="text-lg md:text-xl font-bold tracking-tight text-zinc-900">
              CVCheck
            </span>
          </Link>
        </div>

        {/* Right: Auth / Dropdown */}
        <div className="relative flex items-center gap-2 md:gap-3">
          {!user ? (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex text-sm font-medium text-zinc-700 hover:text-sky-700 px-3 py-2 rounded-lg transition-colors"
              >
                Log in
              </Link>
              <Link to="/signup" className="btn-primary text-sm">
                Get started
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-zinc-100 transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-semibold text-sm uppercase">
                  {user?.displayName?.charAt(0).toUpperCase() ||
                    user?.email?.charAt(0).toUpperCase() ||
                    "U"}
                </span>
                <span className="hidden md:inline text-sm font-medium text-zinc-800 truncate max-w-32">
                  {user?.displayName || "Account"}
                </span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-64 bg-white border border-zinc-200 rounded-2xl shadow-lg z-50 overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-zinc-200">
                        <p className="text-sm font-semibold text-zinc-900 truncate">
                          {user?.displayName || "User"}
                        </p>
                        <p className="text-xs text-zinc-500 truncate mt-0.5">
                          {user?.email}
                        </p>
                      </div>
                      <div className="py-1.5">
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-5 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-sky-700 transition-colors"
                        >
                          <FaTachometerAlt className="text-zinc-400" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-5 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-sky-700 transition-colors"
                        >
                          <FaUser className="text-zinc-400" />
                          Profile
                        </Link>
                      </div>
                      <div className="border-t border-zinc-200 py-1.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                        >
                          <FaSignOutAlt className="text-zinc-400" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default memo(Navbar);
