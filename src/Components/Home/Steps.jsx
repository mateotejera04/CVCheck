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
    <section className="surface-base">
      <div className="container-page section-py">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <p className="eyebrow mb-3">Process</p>
          <h2 className="h-section mb-4">How CVCheck works</h2>
          <p className="body-lg">
            Follow these simple steps to create your perfect professional resume in minutes.
          </p>
        </div>

        <div className="space-y-20 md:space-y-32">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                index % 2 === 0 ? "" : "lg:[&>:first-child]:order-2"
              }`}
            >
              <div className="card-flat overflow-hidden">
                <div className="aspect-video bg-zinc-100">
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
                <p className="eyebrow mb-3">
                  Step {String(step.id).padStart(2, "0")}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 mb-4 leading-tight">
                  {step.title}
                </h3>
                <p className="body-lg">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;
