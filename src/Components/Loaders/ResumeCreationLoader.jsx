import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaFileAlt,
  FaUser,
  FaBriefcase,
  FaGraduationCap,
  FaCheckCircle,
} from "react-icons/fa";
import { useLocale } from "../../Contexts/LocaleContext";

const stepConfig = [
  { id: 1, icon: FaFileAlt, duration: 3000 },
  { id: 2, icon: FaUser, duration: 2000 },
  { id: 3, icon: FaBriefcase, duration: 2500 },
  { id: 4, icon: FaGraduationCap, duration: 3000 },
  { id: 5, icon: FaCheckCircle, duration: 3500 },
];

const ResumeCreationLoader = ({ isVisible }) => {
  const [completed, setCompleted] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const { t } = useLocale();
  const steps = stepConfig.map((step, index) => ({
    ...step,
    title: t(`loaders.resumeSteps.${index}`),
  }));

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
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(26, 18, 11, 0.4)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15 }}
          className="max-w-md w-full mx-auto rounded-2xl shadow-xl overflow-hidden"
          style={{
            backgroundColor: "var(--surface-card)",
            border: "1px solid var(--border-hairline)",
          }}
        >
          <div
            className="px-7 pt-7 pb-5"
            style={{ borderBottom: "1px solid var(--border-hairline)" }}
          >
            <p className="eyebrow mb-3">{t("loaders.buildingResume")}</p>
            <h2
              className="text-[20px] tracking-tight text-[color:var(--text-primary)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {t("loaders.processingDocument")}{" "}
              <em className="italic font-normal">{t("loaders.document")}</em>
            </h2>
          </div>

          <div className="px-7 py-6 space-y-3">
            {steps.map((step, i) => {
              const isCompleted = completed.includes(step.id);
              const isCurrent = currentIdx === i && !isCompleted;
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center gap-3 text-sm">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: isCompleted
                        ? "var(--text-primary)"
                        : isCurrent
                        ? "var(--accent-soft)"
                        : "var(--surface-muted)",
                      color: isCompleted
                        ? "var(--surface-base)"
                        : "var(--text-primary)",
                    }}
                  >
                    {isCompleted ? (
                      <FaCheckCircle size={12} />
                    ) : isCurrent ? (
                      <span
                        className="w-3 h-3 rounded-full animate-spin"
                        style={{
                          border: "2px solid var(--text-primary)",
                          borderTopColor: "transparent",
                        }}
                      />
                    ) : (
                      <Icon size={12} />
                    )}
                  </span>
                  <span
                    className="flex-1"
                    style={{
                      color: isCompleted || isCurrent
                        ? "var(--text-primary)"
                        : "var(--text-muted)",
                    }}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="px-7 pb-7">
            <div className="flex justify-between text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2">
              <span>{t("loaders.progress")}</span>
              <span>{progress}%</span>
            </div>
            <div
              className="w-full h-px overflow-hidden"
              style={{ backgroundColor: "var(--border-hairline)" }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
                className="h-full"
                style={{ backgroundColor: "var(--text-primary)" }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResumeCreationLoader;
