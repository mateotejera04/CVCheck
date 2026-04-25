import { FaGithub, FaEnvelope } from "react-icons/fa";

const CONTACT_EMAIL = "mateotejera0207@gmail.com";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaGithub, href: "https://github.com/mateotejera04", label: "GitHub" },
    { icon: FaEnvelope, href: `mailto:${CONTACT_EMAIL}`, label: "Email" },
  ];

  return (
    <footer className="surface-base border-t border-zinc-200">
      <div className="container-page py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
              <span className="text-lg font-bold tracking-tight text-zinc-900">
                CVCheck
              </span>
            </div>
            <p className="text-sm text-zinc-600 max-w-xs leading-relaxed">
              AI-powered resume builder for your career success.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                Product
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/templates"
                    className="text-zinc-700 hover:text-sky-700 transition-colors"
                  >
                    Templates
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard"
                    className="text-zinc-700 hover:text-sky-700 transition-colors"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/ats-checker"
                    className="text-zinc-700 hover:text-sky-700 transition-colors"
                  >
                    ATS Checker
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                Account
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/login"
                    className="text-zinc-700 hover:text-sky-700 transition-colors"
                  >
                    Log in
                  </a>
                </li>
                <li>
                  <a
                    href="/signup"
                    className="text-zinc-700 hover:text-sky-700 transition-colors"
                  >
                    Sign up
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social */}
          <div className="md:text-right">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
              Connect
            </h3>
            <div className="flex md:justify-end gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-zinc-200 text-zinc-500 hover:text-sky-600 hover:border-sky-300 transition-colors"
                  aria-label={s.label}
                >
                  <s.icon className="text-base" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-zinc-500">
          <p>© {currentYear} CVCheck. All rights reserved.</p>
          <div className="flex gap-4">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=CVCheck%20bug%20report`}
              className="hover:text-sky-700 transition-colors"
            >
              Report a bug
            </a>
            <a href="#" className="hover:text-sky-700 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-sky-700 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
