import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaRobot,
  FaSearch,
  FaSpellCheck,
  FaChartLine,
  FaCheckCircle,
} from "react-icons/fa";

const steps = [
  { id: 1, icon: FaSearch, title: "Scanning document", duration: 2500 },
  { id: 2, icon: FaSpellCheck, title: "Analyzing keywords", duration: 3000 },
  { id: 3, icon: FaRobot, title: "Simulating ATS filters", duration: 3500 },
  { id: 4, icon: FaChartLine, title: "Scoring", duration: 2000 },
  { id: 5, icon: FaCheckCircle, title: "Generating report", duration: 1500 },
];

const ATSCheckingLoader = ({ isVisible }) => {
  const [completed, setCompleted] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCompleted([]);
      setCurrentIdx(0);
      return;
    }
    if (currentIdx >= steps.length) return;
    const t = setTimeout(() => {
      setCompleted((prev) => [...prev, steps[currentIdx].id]);
      setCurrentIdx((prev) => prev + 1);
    }, steps[currentIdx]?.duration || 2000);
    return () => clearTimeout(t);
  }, [currentIdx, isVisible]);

  if (!isVisible) return null;

  const progress = Math.round((completed.length / steps.length) * 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-zinc-900/40 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15 }}
          className="bg-white max-w-md w-full mx-auto rounded-2xl border border-zinc-200 shadow-xl overflow-hidden"
        >
          <div className="px-6 pt-6 pb-4 border-b border-zinc-200">
            <p className="eyebrow mb-2">ATS check</p>
            <h2 className="text-lg font-semibold text-zinc-900">
              Analyzing your resume…
            </h2>
          </div>

          <div className="px-6 py-5 space-y-3">
            {steps.map((step, i) => {
              const isCompleted = completed.includes(step.id);
              const isCurrent = currentIdx === i && !isCompleted;
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className="flex items-center gap-3 text-sm"
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? "bg-sky-600 text-white"
                        : isCurrent
                        ? "bg-sky-100 text-sky-700"
                        : "bg-zinc-100 text-zinc-400"
                    }`}
                  >
                    {isCompleted ? (
                      <FaCheckCircle size={12} />
                    ) : isCurrent ? (
                      <span className="w-3 h-3 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Icon size={12} />
                    )}
                  </span>
                  <span
                    className={`flex-1 ${
                      isCompleted
                        ? "text-zinc-900"
                        : isCurrent
                        ? "text-zinc-900 font-medium"
                        : "text-zinc-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="px-6 pb-6">
            <div className="flex justify-between text-xs text-zinc-500 mb-2">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
                className="bg-sky-600 h-full"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ATSCheckingLoader;
