import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  FiCheckCircle,
  FiZap,
  FiShield,
  FiEdit,
  FiBarChart2,
  FiUpload,
  FiFileText,
  FiLayers,
  FiArrowRight,
} from "react-icons/fi";

import Marquee from "../Components/Home/Marquee";
import StatsSection from "../Components/Home/StatsSection";
import Steps from "../Components/Home/Steps";
import Testimonials from "../Components/Home/Testimonials";
import TemplateCarousel from "../Components/Home/TemplateCarousel";
import FAQ from "../Components/Home/FAQ";

const features = [
  {
    icon: FiEdit,
    title: "Step-by-step builder",
    desc: "Guided form for personal info, education, work experience, skills, and certifications.",
  },
  {
    icon: FiUpload,
    title: "Upload & enhance",
    desc: "Upload your existing resume to edit, optimize, and refresh its design.",
  },
  {
    icon: FiBarChart2,
    title: "ATS compatibility",
    desc: "Check ATS compatibility for any uploaded resume in seconds.",
  },
  {
    icon: FiLayers,
    title: "Live preview & editor",
    desc: "Edit in real-time with formatting, fonts, colors, and hyperlink support.",
  },
  {
    icon: FiFileText,
    title: "Beautiful templates",
    desc: "Choose from modern, classic, sidebar, and standard layouts.",
  },
  {
    icon: FiZap,
    title: "AI bullet enhancer",
    desc: "Turn weak bullet points into action-oriented statements with AI.",
  },
  {
    icon: FiCheckCircle,
    title: "ATS scoring",
    desc: "Get a 0–100 score with concrete suggestions to fix your resume.",
  },
  {
    icon: FiShield,
    title: "Secure profiles & PDF export",
    desc: "Your data is securely stored and exported as a polished PDF anytime.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleCTA = () => {
    navigate(auth.currentUser ? "/dashboard" : "/signup");
  };

  return (
    <div className="surface-base text-zinc-900">
      {/* Hero */}
      <section className="container-page pt-20 md:pt-28 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="eyebrow mb-4">AI-powered resume builder</p>
            <h1 className="h-display mb-6">
              Build a resume that lands the interview.
            </h1>
            <p className="body-lg max-w-xl mb-8">
              CVCheck combines a clean editor, ATS-friendly templates, and an
              AI bullet enhancer so you spend less time formatting and more
              time applying.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={handleCTA} className="btn-primary">
                Get started
                <FiArrowRight />
              </button>
              <button
                onClick={() => navigate("/templates")}
                className="btn-secondary"
              >
                View templates
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card-flat overflow-hidden"
          >
            <img
              src="https://res.cloudinary.com/dyetf2h9n/image/upload/v1757157796/homepage_npyssp.png"
              alt="CVCheck dashboard preview"
              className="w-full h-auto"
              loading="eager"
            />
          </motion.div>
        </div>
      </section>

      <Marquee />

      {/* Features */}
      <section className="surface-base">
        <div className="container-page section-py">
          <div className="max-w-2xl mb-14 md:mb-16">
            <p className="eyebrow mb-3">Features</p>
            <h2 className="h-section mb-4">
              Everything you need to ship a great resume
            </h2>
            <p className="body-lg">
              Built for job seekers who'd rather focus on the content than the
              format.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-200 border border-zinc-200 rounded-2xl overflow-hidden">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-white p-7 flex flex-col gap-3 hover:bg-zinc-50 transition-colors"
                >
                  <Icon className="text-sky-600 text-2xl" />
                  <h3 className="text-base font-semibold text-zinc-900">
                    {f.title}
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Steps />
      <StatsSection />
      <TemplateCarousel />
      <Testimonials />
      <FAQ />

      {/* Final CTA */}
      <section className="bg-zinc-900 text-white">
        <div className="container-page py-20 md:py-28 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Ready to land your next role?
          </h2>
          <p className="text-lg text-zinc-300 max-w-xl mx-auto mb-8">
            Join thousands of job seekers building better resumes with CVCheck.
          </p>
          <button
            onClick={handleCTA}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-full transition-colors"
          >
            Get started
            <FiArrowRight />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
