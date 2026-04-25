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
    <section className="surface-base">
      <div className="container-page section-py">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-3">FAQ</p>
            <h2 className="h-section mb-4">Frequently asked questions</h2>
            <p className="body-lg max-w-md">
              Everything you need to know about CVCheck's AI-powered resume building platform.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="border-t border-zinc-200">
              {faqs.map((faq, index) => {
                const open = openIndex === index;
                return (
                  <div key={index} className="border-b border-zinc-200">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full py-5 text-left flex items-center justify-between gap-6 group"
                    >
                      <span className="text-base md:text-lg font-medium text-zinc-900 group-hover:text-sky-700 transition-colors">
                        {faq.question}
                      </span>
                      <motion.span
                        animate={{ rotate: open ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0 w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-700"
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
                          <p className="pb-6 pr-12 text-zinc-600 leading-relaxed">
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
