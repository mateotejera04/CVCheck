import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useLocale } from "../../Contexts/LocaleContext";

const StatsSection = () => {
  const { t, locale } = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [counts, setCounts] = useState({ resumes: 0, hired: 0, score: 0 });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min((t - start) / duration, 1);
      setCounts({
        resumes: Math.floor(12000 * p),
        hired: Math.floor(3000 * p),
        score: Math.floor(92 * p),
      });
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView]);

  const items = [
    { value: `${counts.resumes.toLocaleString(locale === "es" ? "es-ES" : "en-US")}+`, label: t("stats.labels.0") },
    { value: `${counts.hired.toLocaleString(locale === "es" ? "es-ES" : "en-US")}+`, label: t("stats.labels.1") },
    { value: `${counts.score}%`, label: t("stats.labels.2") },
  ];

  return (
    <section
      ref={ref}
      className="surface-base"
      style={{ borderTop: "1px solid var(--border-hairline)" }}
    >
      <div className="container-page section-py">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-[color:var(--text-muted)]" />
            <span className="eyebrow">{t("stats.eyebrow")}</span>
            <span className="h-px w-10 bg-[color:var(--text-muted)]" />
          </div>
          <h2 className="h-section">
            {t("stats.title")} <em className="italic font-normal">{t("stats.titleEmphasis")}</em>
          </h2>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{
            borderTop: "1px solid var(--border-hairline)",
            borderBottom: "1px solid var(--border-hairline)",
          }}
        >
          {items.map((s, i) => (
            <div
              key={s.label}
              className="px-6 py-14 text-center"
              style={{
                borderRight:
                  i < items.length - 1
                    ? "1px solid var(--border-hairline)"
                    : "none",
              }}
            >
              <div
                className="text-[56px] md:text-[72px] tracking-tight text-[color:var(--text-primary)] tabular-nums leading-none"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {s.value}
              </div>
              <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
