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
          ? "bg-[#f5efe3]/95 backdrop-blur border-b border-[color:var(--border-hairline)]"
          : "bg-[color:var(--surface-base)] border-b border-transparent"
      }`}
    >
      <div className="container-page flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          {showSidebarToggle && (
            <button
              onClick={toggleSidebar}
              className="p-2 -ml-2 text-[color:var(--text-primary)] hover:opacity-70 rounded-lg transition-opacity"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <RxCross2 size={22} /> : <FaBars size={20} />}
            </button>
          )}

          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[color:var(--text-primary)]" />
            <span
              className="text-lg md:text-xl tracking-tight text-[color:var(--text-primary)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              CVCheck
            </span>
          </Link>
        </div>

        <div className="relative flex items-center gap-2 md:gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex text-[13px] tracking-[0.04em] text-[color:var(--text-primary)] hover:opacity-60 px-3 py-2 transition-opacity"
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
                className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-[color:var(--accent-soft)] transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-[color:var(--text-primary)] text-[color:var(--surface-base)] flex items-center justify-center font-medium text-sm uppercase">
                  {user?.displayName?.charAt(0).toUpperCase() ||
                    user?.email?.charAt(0).toUpperCase() ||
                    "U"}
                </span>
                <span className="hidden md:inline text-sm text-[color:var(--text-primary)] truncate max-w-32">
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
                      className="absolute right-0 top-12 w-64 bg-[color:var(--surface-card)] border border-[color:var(--border-hairline)] rounded-2xl shadow-lg z-50 overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-[color:var(--border-hairline)]">
                        <p
                          className="text-base text-[color:var(--text-primary)] truncate"
                          style={{ fontFamily: "var(--font-serif)" }}
                        >
                          {user?.displayName || "User"}
                        </p>
                        <p className="text-xs text-[color:var(--text-muted)] truncate mt-0.5">
                          {user?.email}
                        </p>
                      </div>
                      <div className="py-1.5">
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-5 py-2.5 text-sm text-[color:var(--text-primary)] hover:bg-[color:var(--accent-soft)] transition-colors"
                        >
                          <FaTachometerAlt className="opacity-60" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-5 py-2.5 text-sm text-[color:var(--text-primary)] hover:bg-[color:var(--accent-soft)] transition-colors"
                        >
                          <FaUser className="opacity-60" />
                          Profile
                        </Link>
                      </div>
                      <div className="border-t border-[color:var(--border-hairline)] py-1.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-[color:var(--text-primary)] hover:bg-[color:var(--accent-soft)] transition-colors"
                        >
                          <FaSignOutAlt className="opacity-60" />
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
