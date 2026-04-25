import { memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const templates = [
  {
    id: 1,
    name: "Sidebar",
    image:
      "https://res.cloudinary.com/dyetf2h9n/image/upload/v1757157828/sidebar_hduvee.jpg",
    description: "Clean and modern with a color sidebar accent.",
  },
  {
    id: 2,
    name: "Classic",
    image:
      "https://res.cloudinary.com/dyetf2h9n/image/upload/v1757157768/classic_fjq31b.jpg",
    description: "Traditional, formal, timeless.",
  },
  {
    id: 3,
    name: "Standard",
    image:
      "https://res.cloudinary.com/dyetf2h9n/image/upload/v1757157832/standard_vjm4w9.jpg",
    description: "Clean, simple, gets the job done.",
  },
  {
    id: 4,
    name: "Modern",
    image:
      "https://res.cloudinary.com/dyetf2h9n/image/upload/v1757157832/standard_vjm4w9.jpg",
    description: "Profile-style with circular photo.",
  },
];

const TemplateCarousel = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-white border-t border-zinc-200">
      <div className="container-page section-py">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <p className="eyebrow mb-3">Templates</p>
            <h2 className="h-section">
              Pick a layout that fits your story
            </h2>
          </div>
          <button
            onClick={() => navigate("/templates")}
            className="btn-secondary text-sm"
          >
            View all templates
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
              className="card-flat overflow-hidden text-left group"
            >
              <div className="aspect-[3/4] bg-zinc-100 overflow-hidden">
                <img
                  src={t.image}
                  alt={t.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="p-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {t.description}
                  </p>
                </div>
                <FiArrowRight className="text-zinc-400 group-hover:text-sky-700 transition-colors mt-1" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(TemplateCarousel);
