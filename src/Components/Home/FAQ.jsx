import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";

const faqs = [
  {
    question: "How is CVCheck different from other resume builders?",
    answer:
      "CVCheck offers AI-powered resume optimization, ATS-friendly templates, and real-time feedback. Our platform uses advanced algorithms to analyze your resume and ensure maximum compatibility with Applicant Tracking Systems.",
  },
  {
    question: "Are the resume templates ATS-friendly?",
    answer:
      "Yes — every template is designed to be ATS-compatible. Proper formatting, readable fonts, and structured layouts pass through tracking systems while looking professional.",
  },
  {
    question: "Can I customize the resume templates?",
    answer:
      "Absolutely. Customize colors, fonts, layouts, and sections — every aspect of your resume — while maintaining ATS compatibility and professional standards.",
  },
  {
    question: "How many resumes can I create?",
    answer:
      "Unlimited. Save multiple versions to tailor different resumes for various job applications and industries without restrictions.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "CVCheck is a responsive web app that works seamlessly on phones and tablets. A dedicated mobile app is in development.",
  },
  {
    question: "What if I need help?",
    answer:
      "Reach out anytime for assistance with technical issues, questions about features, or general guidance on resume building.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
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
              <span className="eyebrow">FAQ</span>
            </div>
            <h2 className="h-section mb-6">
              Questions, <em className="italic font-normal">answered.</em>
            </h2>
            <p className="text-[16px] leading-relaxed text-[color:var(--text-secondary)] max-w-md">
              The short version of what you might be wondering.
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
