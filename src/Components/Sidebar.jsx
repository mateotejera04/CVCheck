import {
  FaUser,
  FaFileAlt,
  FaHome,
  FaCogs,
  FaRobot,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: FaHome, label: "Dashboard" },
    { path: "/resume-form", icon: FaFileAlt, label: "Edit Resume" },
    { path: "/resume", icon: FaFileAlt, label: "My Resume" },
    { path: "/ats-checker", icon: FaRobot, label: "ATS Compatibility" },
    { path: "/templates", icon: FaCogs, label: "Templates" },
    { path: "/profile", icon: FaUser, label: "Profile" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-30 bg-zinc-900/30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
          />

          <motion.aside
            id="sidebar"
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
            className="fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] py-6 px-3 bg-white border-r border-zinc-200 overflow-y-auto"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 px-3 mb-3">
              Navigation
            </p>
            <ul className="space-y-1 text-sm">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={closeSidebar}
                      className={classNames(
                        "flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-lg transition-colors border-l-2",
                        isActive
                          ? "bg-sky-50 text-sky-700 border-sky-600 font-medium"
                          : "text-zinc-700 border-transparent hover:bg-zinc-50 hover:text-zinc-900"
                      )}
                    >
                      <Icon
                        size={16}
                        className={isActive ? "text-sky-600" : "text-zinc-400"}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
