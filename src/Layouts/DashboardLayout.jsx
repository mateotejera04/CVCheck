import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";
import { motion } from "framer-motion";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen surface-base text-[color:var(--text-primary)] flex flex-col">
      <Navbar
        toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1 pt-16">
        <Sidebar
          isOpen={isSidebarOpen}
          closeSidebar={() => setIsSidebarOpen(false)}
        />

        <div
          className={`flex-1 min-w-0 transition-[margin] duration-200 ${
            isSidebarOpen ? "lg:ml-64" : "ml-0"
          }`}
        >
          <motion.main
            className="px-4 md:px-8 py-6 overflow-x-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
