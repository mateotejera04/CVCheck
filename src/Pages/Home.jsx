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

import TemplateCarousel from "../Components/Home/TemplateCarousel";
import FAQ from "../Components/Home/FAQ";
import { useLocale } from "../Contexts/LocaleContext";

const serif = { fontFamily: "Merriweather, ui-serif, Georgia, serif" };
const cream = "#F5EFE3";
const ink = "#1a120b";
const muted = "#6b5a4a";
const hairline = "#e2d4bd";

const featureIcons = [
  FiEdit,
  FiUpload,
  FiBarChart2,
  FiLayers,
  FiFileText,
  FiZap,
  FiCheckCircle,
  FiShield,
];

const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const { t } = useLocale();
  const features = t("home.features", []).map((feature, index) => ({
    ...feature,
    icon: featureIcons[index],
  }));

  const handleCTA = () => {
    navigate(auth.currentUser ? "/dashboard" : "/signup");
  };

  return (
    <div style={{ backgroundColor: cream, color: ink }}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Soft gradient art, top right */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-40 h-[640px] w-[640px] opacity-80"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #F4C9A8 0%, transparent 55%), radial-gradient(circle at 70% 60%, #E9B8D2 0%, transparent 55%), radial-gradient(circle at 50% 80%, #C9B6E4 0%, transparent 60%)",
            filter: "blur(20px)",
          }}
        />

        <div className="container-page relative pt-24 md:pt-36 pb-24 md:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <span
                className="h-px w-10"
                style={{ backgroundColor: muted }}
              />
              <span
                className="text-[12px] tracking-[0.18em] uppercase"
                style={{ color: muted }}
              >
                {t("home.eyebrow")}
              </span>
            </div>
            <h1
              className="text-[44px] sm:text-[60px] md:text-[76px] leading-[1.02] tracking-tight"
              style={{ ...serif, color: ink }}
            >
              {t("home.titleLine1")}
              <br />
              <em className="italic font-normal">{t("home.titleEmphasis")}</em>
            </h1>
            <p
              className="mt-8 text-[17px] md:text-[18px] leading-relaxed max-w-xl"
              style={{ color: muted }}
            >
              {t("home.intro")}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <button
                onClick={handleCTA}
                className="group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[14px] tracking-wide transition-colors"
                style={{ backgroundColor: ink, color: cream }}
              >
                {t("common.getStarted")}
                <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => navigate("/templates")}
                className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[14px] tracking-wide transition-colors hover:bg-black/5"
                style={{ color: ink, border: `1px solid ${ink}` }}
              >
                {t("common.viewTemplates")}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section style={{ borderTop: `1px solid ${hairline}` }}>
        <div className="container-page py-24 md:py-32">
          <div className="max-w-2xl mb-16 md:mb-20">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10" style={{ backgroundColor: muted }} />
              <span
                className="text-[12px] tracking-[0.18em] uppercase"
                style={{ color: muted }}
              >
                {t("home.featuresEyebrow")}
              </span>
            </div>
            <h2
              className="text-[34px] sm:text-[44px] md:text-[52px] leading-[1.05] tracking-tight"
              style={{ ...serif, color: ink }}
            >
              {t("home.featuresTitleLine1")}
              <br />
              <em className="italic font-normal">{t("home.featuresTitleEmphasis")}</em>
            </h2>
            <p
              className="mt-6 text-[16px] md:text-[17px] leading-relaxed"
              style={{ color: muted }}
            >
              {t("home.featuresIntro")}
            </p>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            style={{
              borderTop: `1px solid ${hairline}`,
              borderLeft: `1px solid ${hairline}`,
            }}
          >
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-8 transition-colors"
                  style={{
                    borderRight: `1px solid ${hairline}`,
                    borderBottom: `1px solid ${hairline}`,
                  }}
                >
                  <Icon className="text-[22px]" style={{ color: ink }} />
                  <h3
                    className="mt-6 text-[18px] tracking-tight"
                    style={{ ...serif, color: ink }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="mt-3 text-[14px] leading-relaxed"
                    style={{ color: muted }}
                  >
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <TemplateCarousel />
      <FAQ />

      {/* Final CTA */}
      <section style={{ backgroundColor: ink, color: cream }}>
        <div className="container-page relative overflow-hidden py-24 md:py-36 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -bottom-40 mx-auto h-[520px] w-[680px] opacity-30"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, #F4C9A8 0%, transparent 55%), radial-gradient(circle at 35% 60%, #E9B8D2 0%, transparent 55%), radial-gradient(circle at 65% 60%, #C9B6E4 0%, transparent 60%)",
              filter: "blur(30px)",
            }}
          />
          <h2
            className="relative text-[36px] sm:text-[52px] md:text-[64px] leading-[1.05] tracking-tight max-w-3xl mx-auto"
            style={{ ...serif, color: cream }}
          >
            {t("home.finalTitleLine1")}
            <br />
            <em className="italic font-normal">{t("home.finalTitleEmphasis")}</em>
          </h2>
          <p
            className="relative mt-6 text-[16px] md:text-[17px] max-w-xl mx-auto"
            style={{ color: "#cdbda6" }}
          >
            {t("home.finalIntro")}
          </p>
          <button
            onClick={handleCTA}
            className="group relative mt-10 inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[14px] tracking-wide transition-colors"
            style={{ backgroundColor: cream, color: ink }}
          >
            {t("common.getStarted")}
            <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
