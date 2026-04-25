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
        className="fixed inset-0 bg-zinc-900/40 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15 }}
          className="bg-white rounded-2xl max-w-md w-full mx-auto shadow-xl border border-zinc-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
            <h2 className="text-base font-semibold text-zinc-900">
              Delete resume
            </h2>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="text-zinc-400 hover:text-zinc-600 disabled:opacity-50"
            >
              <FaTimes size={16} />
            </button>
          </div>

          <div className="px-6 py-5">
            <p className="text-sm text-zinc-700">
              Are you sure you want to delete this resume?
            </p>
            {fileName && (
              <div className="mt-3 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-800 truncate">
                {fileName}
              </div>
            )}
            <p className="text-xs text-red-600 mt-3">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-3 px-6 py-4 border-t border-zinc-200">
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
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
