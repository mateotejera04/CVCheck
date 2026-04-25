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
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="eyebrow mb-3">Templates</p>
          <h1 className="h-section mb-4">Pick a starting point</h1>
          <p className="body-lg">
            Every template is ATS-friendly and fully editable. Choose one to
            jump straight into the editor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => navigate("/resume")}
              className="group text-left card-flat overflow-hidden hover:border-zinc-300 transition-colors"
            >
              <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden">
                <img
                  src={t.image}
                  alt={`${t.name} template preview`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 text-[11px] font-medium px-2 py-1 rounded-full bg-white/90 text-zinc-700 border border-zinc-200">
                  {t.badge}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-semibold text-zinc-900">
                    {t.name}
                  </h3>
                  <FiArrowRight className="text-zinc-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed">
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
