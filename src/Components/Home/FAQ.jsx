import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { useLocale } from "../../Contexts/LocaleContext";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const { t } = useLocale();
  const faqs = t("faq.items", []);
  const toggleFAQ = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      className="surface-base"
      style={{ borderTop: "1px solid var(--border-hairline)" }}
    >
      <div className="container-page section-py">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-[color:var(--text-muted)]" />
              <span className="eyebrow">{t("faq.eyebrow")}</span>
            </div>
            <h2 className="h-section mb-6">
              {t("faq.title")} <em className="italic font-normal">{t("faq.titleEmphasis")}</em>
            </h2>
            <p className="text-[16px] leading-relaxed text-[color:var(--text-secondary)] max-w-md">
              {t("faq.intro")}
            </p>
          </div>

          <div className="lg:col-span-8">
            <div style={{ borderTop: "1px solid var(--border-hairline)" }}>
              {faqs.map((faq, index) => {
                const open = openIndex === index;
                return (
                  <div
                    key={index}
                    style={{ borderBottom: "1px solid var(--border-hairline)" }}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full py-6 text-left flex items-center justify-between gap-6 group"
                    >
                      <span
                        className="text-[18px] md:text-[20px] tracking-tight text-[color:var(--text-primary)] transition-opacity group-hover:opacity-70"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {faq.question}
                      </span>
                      <motion.span
                        animate={{ rotate: open ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[color:var(--text-primary)]"
                        style={{ border: "1px solid var(--text-primary)" }}
                      >
                        <FiPlus />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-7 pr-12 text-[15px] leading-relaxed text-[color:var(--text-secondary)]">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
