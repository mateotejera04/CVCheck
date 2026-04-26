import { FaGithub, FaEnvelope } from "react-icons/fa";
import { useLocale } from "../Contexts/LocaleContext";

const CONTACT_EMAIL = "mateotejera0207@gmail.com";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLocale();

  const socialLinks = [
    { icon: FaGithub, href: "https://github.com/mateotejera04", label: "GitHub" },
    { icon: FaEnvelope, href: `mailto:${CONTACT_EMAIL}`, label: "Email" },
  ];

  return (
    <footer className="surface-base border-t border-[color:var(--border-hairline)]">
      <div className="container-page py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[color:var(--text-primary)]" />
              <span
                className="text-lg tracking-tight text-[color:var(--text-primary)]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                CVCheck
              </span>
            </div>
            <p className="text-[14px] text-[color:var(--text-secondary)] max-w-xs leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-4">
                {t("footer.product")}
              </h3>
              <ul className="space-y-2 text-[14px]">
                <li>
                  <a
                    href="/templates"
                    className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
                  >
                    {t("common.templates")}
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard"
                    className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
                  >
                    {t("common.dashboard")}
                  </a>
                </li>
                <li>
                  <a
                    href="/ats-checker"
                    className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
                  >
                    {t("footer.atsChecker")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-4">
                {t("footer.account")}
              </h3>
              <ul className="space-y-2 text-[14px]">
                <li>
                  <a
                    href="/login"
                    className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
                  >
                    {t("nav.login")}
                  </a>
                </li>
                <li>
                  <a
                    href="/signup"
                    className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
                  >
                    {t("common.signup")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:text-right">
            <h3 className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-4">
              {t("footer.connect")}
            </h3>
            <div className="flex md:justify-end gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-[color:var(--border-hairline)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:border-[color:var(--text-primary)] transition-colors"
                  aria-label={s.label}
                >
                  <s.icon className="text-base" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[color:var(--border-hairline)] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[color:var(--text-muted)]">
          <p>© {currentYear} CVCheck. {t("footer.rights")}</p>
          <div className="flex gap-4">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=CVCheck%20bug%20report`}
              className="hover:text-[color:var(--text-primary)] transition-colors"
            >
              {t("footer.reportBug")}
            </a>
            <a href="#" className="hover:text-[color:var(--text-primary)] transition-colors">
              {t("footer.privacy")}
            </a>
            <a href="#" className="hover:text-[color:var(--text-primary)] transition-colors">
              {t("footer.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
