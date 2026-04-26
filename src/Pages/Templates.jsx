import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const templates = [
  {
    id: 1,
    name: "Sidebar",
    image: "/sidebar.jpg",
    description: "Two-column layout with a clean sidebar for skills and contact.",
    badge: "Popular",
  },
  {
    id: 2,
    name: "Classic",
    image: "/classic.jpg",
    description: "A timeless single-column design that reads well in any context.",
    badge: "Timeless",
  },
  {
    id: 3,
    name: "Standard",
    image: "/standard.jpg",
    description: "A balanced standard layout that works for most industries.",
    badge: "Standard",
  },
  {
    id: 4,
    name: "Modern",
    image: "/standard.jpg",
    description: "Profile-style header with photo and personal summary up top.",
    badge: "New",
  },
];

export default function Templates() {
  const navigate = useNavigate();

  return (
    <div className="surface-base min-h-[calc(100vh-4rem)]">
      <div className="container-page section-py">
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-[color:var(--text-muted)]" />
            <span className="eyebrow">Templates</span>
          </div>
          <h1 className="h-section mb-5">
            Pick a <em className="italic font-normal">starting point.</em>
          </h1>
          <p className="text-[16px] md:text-[17px] leading-relaxed text-[color:var(--text-secondary)]">
            Every template is ATS-friendly and fully editable. Pick one to step
            straight into the editor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => navigate("/resume")}
              className="group text-left overflow-hidden rounded-2xl transition-colors"
              style={{
                border: "1px solid var(--border-hairline)",
                backgroundColor: "var(--surface-card)",
              }}
            >
              <div
                className="relative aspect-[3/4] overflow-hidden"
                style={{ backgroundColor: "var(--surface-muted)" }}
              >
                <img
                  src={t.image}
                  alt={`${t.name} template preview`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span
                  className="absolute top-3 left-3 text-[11px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full text-[color:var(--text-primary)]"
                  style={{
                    backgroundColor: "var(--surface-base)",
                    border: "1px solid var(--border-hairline)",
                  }}
                >
                  {t.badge}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className="text-[18px] tracking-tight text-[color:var(--text-primary)]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {t.name}
                  </h3>
                  <FiArrowRight className="text-[color:var(--text-muted)] group-hover:text-[color:var(--text-primary)] group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[13px] text-[color:var(--text-secondary)] leading-relaxed">
                  {t.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
