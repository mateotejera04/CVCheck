import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

const testimonials = [
  {
    name: "Aarav Mehta",
    image:
      "https://res.cloudinary.com/dyetf2h9n/image/upload/v1757157839/user1_asnexm.jpg",
    feedback:
      "CVCheck helped me land my first internship. The AI suggestions were on-point and the ATS checker gave me confidence my resume would pass automated screening.",
    role: "Software Developer",
    company: "Tech Corp",
    rating: 5,
  },
  {
    name: "Simran Kaur",
    image:
      "https://res.cloudinary.com/dyetf2h9n/image/upload/v1757157854/user2_t0qesa.jpg",
    feedback:
      "Building my resume felt effortless and modern. The real-time editor made it so easy to customize everything perfectly.",
    role: "Marketing Manager",
    company: "Digital Agency",
    rating: 5,
  },
  {
    name: "Rahul Sharma",
    image:
      "https://res.cloudinary.com/dyetf2h9n/image/upload/v1757157861/user3_bm0ybv.png",
    feedback:
      "The best resume builder I've used — simple, elegant, and very effective. AI-powered suggestions tailored my resume perfectly.",
    role: "Data Analyst",
    company: "Analytics Inc",
    rating: 5,
  },
  {
    name: "Priya Patel",
    image:
      "https://res.cloudinary.com/dyetf2h9n/image/upload/v1757157867/user4_oj1svf.png",
    feedback:
      "The ATS compatibility checker is a game-changer. My interview rate increased significantly after using CVCheck.",
    role: "Product Manager",
    company: "Innovation Labs",
    rating: 5,
  },
];

function Testimonials() {
  return (
    <section className="bg-white border-y border-zinc-200">
      <div className="container-page section-py">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
          <p className="eyebrow mb-3">Customers</p>
          <h2 className="h-section mb-4">Trusted by professionals worldwide</h2>
          <p className="body-lg">
            Join thousands of job seekers who landed their dream jobs using CVCheck.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="card-flat p-6 flex flex-col"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, idx) => (
                  <FiStar
                    key={idx}
                    className="w-4 h-4 text-zinc-900 fill-current"
                  />
                ))}
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed flex-1">
                "{t.feedback}"
              </p>
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-zinc-200">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
