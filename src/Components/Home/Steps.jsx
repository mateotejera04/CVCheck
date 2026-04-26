import { motion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Upload or create",
    description:
      "Begin by uploading your current resume in PDF or DOCX format. If you don't have one, our intuitive builder will guide you through creating a new resume from scratch, ensuring you cover all essential sections.",
    videoUrl:
      "https://res.cloudinary.com/dyetf2h9n/video/upload/fl_progressive,q_auto,f_auto/v1753257462/step1_wpszpo.mp4",
  },
  {
    id: 2,
    title: "Edit and refine",
    description:
      "Our real-time editor lets you perfect every detail. Update your contact information, professional summary, work experience, and skills. Use our formatting tools to ensure your resume is clean and readable.",
    videoUrl:
      "https://res.cloudinary.com/dyetf2h9n/video/upload/fl_progressive,q_auto,f_auto/v1753257466/step2_ylozmt.mp4",
  },
  {
    id: 3,
    title: "Choose a professional template",
    description:
      "Make a lasting impression by selecting from our library of professionally designed templates. Whether modern, classic, or standard, we have a style that fits your career goals.",
    videoUrl:
      "https://res.cloudinary.com/dyetf2h9n/video/upload/fl_progressive,q_auto,f_auto/v1753257466/step3_jjgx49.mp4",
  },
  {
    id: 4,
    title: "Organize and customize",
    description:
      "Tailor your resume to the job you're applying for. Drag and drop sections to reorder them, customize colors and fonts, and ensure the most important information is front and center.",
    videoUrl:
      "https://res.cloudinary.com/dyetf2h9n/video/upload/fl_progressive,q_auto,f_auto/v1753257462/step4_rbvyin.mp4",
  },
  {
    id: 5,
    title: "Download and share",
    description:
      "With one click, download your resume as a high-quality, ATS-friendly PDF. Your resume is now ready to be sent to recruiters and uploaded to job application portals.",
    videoUrl:
      "https://res.cloudinary.com/dyetf2h9n/video/upload/fl_progressive,q_auto,f_auto/v1753268547/step5_swnkij.mp4",
  },
];

const Steps = () => {
  return (
    <section className="surface-base" style={{ borderTop: "1px solid var(--border-hairline)" }}>
      <div className="container-page section-py">
        <div className="max-w-2xl mb-20 md:mb-28">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-[color:var(--text-muted)]" />
            <span className="eyebrow">Process</span>
          </div>
          <h2 className="h-section mb-6">
            How it <em className="italic font-normal">works.</em>
          </h2>
          <p className="text-[16px] md:text-[17px] leading-relaxed text-[color:var(--text-secondary)]">
            Five quiet steps from blank page to ready-to-send PDF.
          </p>
        </div>

        <div className="space-y-24 md:space-y-36">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center ${
                index % 2 === 0 ? "" : "lg:[&>:first-child]:order-2"
              }`}
            >
              <div
                className="overflow-hidden rounded-2xl"
                style={{ border: "1px solid var(--border-hairline)" }}
              >
                <div className="aspect-video" style={{ backgroundColor: "var(--surface-muted)" }}>
                  <video
                    src={step.videoUrl}
                    autoPlay
                    preload="auto"
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <span
                  className="text-[40px] leading-none mr-3 align-baseline"
                  style={{ fontFamily: "var(--font-serif)", color: "var(--text-muted)" }}
                >
                  {String(step.id).padStart(2, "0")}
                </span>
                <span className="eyebrow">Step</span>
                <h3
                  className="mt-5 text-[28px] md:text-[36px] tracking-tight leading-[1.1] text-[color:var(--text-primary)]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {step.title}
                </h3>
                <p className="mt-5 text-[16px] leading-relaxed text-[color:var(--text-secondary)]">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;
