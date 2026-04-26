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
import { useLocale } from "../Contexts/LocaleContext";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const { t } = useLocale();

  const menuItems = [
    { path: "/dashboard", icon: FaHome, label: t("common.dashboard") },
    { path: "/resume-form", icon: FaFileAlt, label: t("sidebar.editResume") },
    { path: "/resume", icon: FaFileAlt, label: t("sidebar.myResume") },
    { path: "/ats-checker", icon: FaRobot, label: t("sidebar.atsCompatibility") },
    { path: "/templates", icon: FaCogs, label: t("common.templates") },
    { path: "/profile", icon: FaUser, label: t("common.profile") },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-30 lg:hidden"
            style={{ backgroundColor: "rgba(26, 18, 11, 0.3)" }}
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
            className="fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] py-6 px-3 bg-[color:var(--surface-base)] border-r border-[color:var(--border-hairline)] overflow-y-auto"
          >
            <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] px-3 mb-4">
              {t("sidebar.navigation")}
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
                          ? "bg-[color:var(--accent-soft)] text-[color:var(--text-primary)] border-[color:var(--text-primary)]"
                          : "text-[color:var(--text-secondary)] border-transparent hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--text-primary)]"
                      )}
                    >
                      <Icon
                        size={16}
                        className={isActive ? "opacity-100" : "opacity-50"}
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
