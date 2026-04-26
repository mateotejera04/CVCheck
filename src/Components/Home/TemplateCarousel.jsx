import { memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import TemplatePreview from "../ui/TemplatePreview";
import { useLocale } from "../../Contexts/LocaleContext";

const templates = [
  {
    id: 1,
    variant: "sidebar",
  },
  {
    id: 2,
    variant: "classic",
  },
  {
    id: 3,
    variant: "standard",
  },
  {
    id: 4,
    variant: "modern",
  },
];

const TemplateCarousel = () => {
  const navigate = useNavigate();
  const { t } = useLocale();
  const templateCopy = t("templates.carouselItems", []);
  return (
    <section
      className="surface-base"
      style={{ borderTop: "1px solid var(--border-hairline)" }}
    >
      <div className="container-page section-py">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-[color:var(--text-muted)]" />
              <span className="eyebrow">{t("templates.eyebrow")}</span>
            </div>
            <h2 className="h-section">
              {t("templates.carouselTitleLine1")}
              <br />
              <em className="italic font-normal">{t("templates.carouselTitleEmphasis")}</em>
            </h2>
          </div>
          <button
            onClick={() => navigate("/templates")}
            className="btn-secondary text-sm self-start md:self-end"
          >
            {t("templates.viewAll")}
            <FiArrowRight />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((t, i) => (
            <motion.button
              key={t.id}
              onClick={() => navigate("/resume")}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="overflow-hidden text-left group rounded-2xl"
              style={{
                border: "1px solid var(--border-hairline)",
                backgroundColor: "var(--surface-card)",
              }}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <TemplatePreview variant={t.variant} />
              </div>
              <div className="p-5 flex items-start justify-between gap-3">
                <div>
                  <p
                    className="text-[16px] tracking-tight text-[color:var(--text-primary)]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {templateCopy[i]?.name}
                  </p>
                  <p className="text-[12px] text-[color:var(--text-muted)] mt-1">
                    {templateCopy[i]?.description}
                  </p>
                </div>
                <FiArrowRight className="text-[color:var(--text-muted)] group-hover:text-[color:var(--text-primary)] group-hover:translate-x-0.5 transition-all mt-1" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(TemplateCarousel);
