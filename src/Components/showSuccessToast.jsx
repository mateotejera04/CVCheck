import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const showSuccessToast = (message) => {
  toast.custom((t) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: 50 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 50 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg"
      style={{
        backgroundColor: "var(--surface-card)",
        border: "1px solid var(--border-hairline)",
        color: "var(--text-primary)",
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1.2 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        <FaCheckCircle
          className="text-xl"
          style={{ color: "var(--status-success)" }}
        />
      </motion.div>
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  ));
};
export default showSuccessToast;
