import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import TemplatePreview from "../Components/ui/TemplatePreview";
import { useLocale } from "../Contexts/LocaleContext";

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

export default function Templates() {
  const navigate = useNavigate();
  const { t } = useLocale();
  const templateCopy = t("templates.items", []);

  return (
    <div className="surface-base min-h-[calc(100vh-4rem)]">
      <div className="container-page section-py">
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-[color:var(--text-muted)]" />
            <span className="eyebrow">{t("templates.eyebrow")}</span>
          </div>
          <h1 className="h-section mb-5">
            {t("templates.pageTitle")} <em className="italic font-normal">{t("templates.pageTitleEmphasis")}</em>
          </h1>
          <p className="text-[16px] md:text-[17px] leading-relaxed text-[color:var(--text-secondary)]">
            {t("templates.pageIntro")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <button
              key={template.id}
              type="button"
              onClick={() => navigate("/resume")}
              className="group text-left overflow-hidden rounded-2xl transition-colors"
              style={{
                border: "1px solid var(--border-hairline)",
                backgroundColor: "var(--surface-card)",
              }}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <TemplatePreview variant={template.variant} />
                <span
                  className="absolute top-3 left-3 text-[11px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full text-[color:var(--text-primary)]"
                  style={{
                    backgroundColor: "var(--surface-base)",
                    border: "1px solid var(--border-hairline)",
                  }}
                >
                  {templateCopy[index]?.badge}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className="text-[18px] tracking-tight text-[color:var(--text-primary)]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {templateCopy[index]?.name}
                  </h3>
                  <FiArrowRight className="text-[color:var(--text-muted)] group-hover:text-[color:var(--text-primary)] group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[13px] text-[color:var(--text-secondary)] leading-relaxed">
                  {templateCopy[index]?.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
