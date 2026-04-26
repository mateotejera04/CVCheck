import { AnimatePresence, motion } from "framer-motion";
import { FaTrash, FaTimes } from "react-icons/fa";

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  fileName,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(26, 18, 11, 0.4)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15 }}
          className="rounded-2xl max-w-md w-full mx-auto shadow-xl"
          style={{
            backgroundColor: "var(--surface-card)",
            border: "1px solid var(--border-hairline)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="flex items-center justify-between px-7 py-5"
            style={{ borderBottom: "1px solid var(--border-hairline)" }}
          >
            <h2
              className="text-[18px] tracking-tight text-[color:var(--text-primary)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Delete resume
            </h2>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)] disabled:opacity-50"
            >
              <FaTimes size={16} />
            </button>
          </div>

          <div className="px-7 py-6">
            <p className="text-sm text-[color:var(--text-secondary)]">
              Are you sure you want to delete this resume?
            </p>
            {fileName && (
              <div
                className="mt-3 px-3 py-2.5 rounded-lg text-sm text-[color:var(--text-primary)] truncate"
                style={{
                  backgroundColor: "var(--accent-soft)",
                  border: "1px solid var(--border-hairline)",
                }}
              >
                {fileName}
              </div>
            )}
            <p className="text-xs text-[color:var(--status-danger)] mt-3">
              This action cannot be undone.
            </p>
          </div>

          <div
            className="flex gap-3 px-7 py-5"
            style={{ borderTop: "1px solid var(--border-hairline)" }}
          >
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="btn-secondary flex-1 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-[color:var(--surface-base)] font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              style={{ backgroundColor: "var(--status-danger)" }}
            >
              {isDeleting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Deleting…
                </>
              ) : (
                <>
                  <FaTrash size={13} />
                  Delete
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
