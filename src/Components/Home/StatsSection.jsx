import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const StatsSection = () => {
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
    { value: `${counts.resumes.toLocaleString()}+`, label: "Resumes created" },
    { value: `${counts.hired.toLocaleString()}+`, label: "Users hired" },
    { value: `${counts.score}%`, label: "Average ATS score" },
  ];

  return (
    <section ref={ref} className="surface-base">
      <div className="container-page section-py">
        <p className="eyebrow text-center mb-3">By the numbers</p>
        <h2 className="h-section text-center mb-16">
          Helping careers take off
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200 border-y border-zinc-200">
          {items.map((s) => (
            <div key={s.label} className="px-6 py-12 text-center">
              <div className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 tabular-nums">
                {s.value}
              </div>
              <p className="mt-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">
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
