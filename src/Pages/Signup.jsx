import { useState } from "react";
import toast from "react-hot-toast";
import {
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiCircle,
  FiArrowRight,
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import showSuccessToast from "../Components/showSuccessToast";
import showErrorToast from "../Components/showErrorToast";
import { useLocale } from "../Contexts/LocaleContext";

const serif = { fontFamily: "Merriweather, ui-serif, Georgia, serif" };

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordValid, setPasswordValid] = useState({
    upper: false,
    lower: false,
    special: false,
    number: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      setPasswordValid({
        upper: /[A-Z]/.test(value),
        lower: /[a-z]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        number: /[0-9]/.test(value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!form.password) {
      setLoading(false);
      return toast.error(t("auth.emptyPassword"));
    }
    if (form.password !== form.confirmPassword) {
      setLoading(false);
      return toast.error(t("auth.passwordMismatch"));
    }
    const result = await signup({
      name: form.name,
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (result.success) {
      showSuccessToast(t("auth.signupSuccess"));
      navigate("/dashboard");
    } else {
      showErrorToast(result.error || t("auth.signupFailed"));
    }
  };

  const progress = Object.values(passwordValid).filter(Boolean).length;

  return (
    <div
      className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2"
      style={{ backgroundColor: "#F5EFE3" }}
    >
      {/* Art panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden p-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 75% 25%, #F4C9A8 0%, transparent 55%), radial-gradient(circle at 25% 70%, #E9B8D2 0%, transparent 50%), radial-gradient(circle at 60% 95%, #C9B6E4 0%, transparent 55%), linear-gradient(135deg, #EAD3BF 0%, #F2E2C8 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />

        <div className="relative">
          <span
            className="text-[13px] tracking-[0.18em] uppercase"
            style={{ color: "#3a2a1a" }}
          >
            CVCheck
          </span>
        </div>

        <div className="relative max-w-md">
          <p
            className="text-[44px] leading-[1.05] tracking-tight"
            style={{ ...serif, color: "#1a120b" }}
          >
            {t("auth.signupArtTitleLine1")}
            <br />
            <em className="italic font-normal">{t("auth.signupArtTitleEmphasis")}</em>
          </p>
          <p
            className="mt-6 text-[15px] leading-relaxed max-w-sm"
            style={{ color: "#4a3a2a" }}
          >
            {t("auth.signupArtIntro")}
          </p>
        </div>

        <div
          className="relative flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase"
          style={{ color: "#5a4a3a" }}
        >
          <span className="h-px w-8" style={{ backgroundColor: "#5a4a3a" }} />
          {t("auth.signupArtFooter")}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-16 sm:px-12">
        <div className="w-full max-w-sm">
          <h1
            className="text-[40px] leading-[1.05] tracking-tight"
            style={{ ...serif, color: "#1a120b" }}
          >
            {t("auth.signupTitle")} <em className="italic font-normal">{t("auth.signupTitleEmphasis")}</em>
          </h1>
          <p className="mt-3 text-[14px]" style={{ color: "#6b5a4a" }}>
            {t("auth.signupIntro")}
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-7">
            <Field
              id="name"
              label={t("common.fullName")}
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              required
            />
            <Field
              id="email"
              label={t("common.email")}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
            <Field
              id="password"
              label={t("common.password")}
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: "#1a120b" }}
                  aria-label={showPassword ? t("common.hidePassword") : t("common.showPassword")}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              }
            />
            <Field
              id="confirmPassword"
              label={t("common.confirmPassword")}
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              trailing={
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  tabIndex={-1}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: "#1a120b" }}
                  aria-label={showConfirm ? t("common.hidePassword") : t("common.showPassword")}
                >
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              }
            />

            {form.password && (
              <div>
                <div className="h-px w-full overflow-hidden" style={{ backgroundColor: "#e2d4bd" }}>
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${(progress / 4) * 100}%`,
                      backgroundColor: "#1a120b",
                    }}
                  />
                </div>
                <ul className="mt-3 grid grid-cols-2 gap-y-1.5 text-[12px]" style={{ color: "#6b5a4a" }}>
                  {[
                    ["upper", t("auth.passwordRules.upper")],
                    ["lower", t("auth.passwordRules.lower")],
                    ["number", t("auth.passwordRules.number")],
                    ["special", t("auth.passwordRules.special")],
                  ].map(([key, label]) => (
                    <li key={key} className="flex items-center gap-1.5">
                      {passwordValid[key] ? (
                        <FiCheckCircle style={{ color: "#1a120b" }} />
                      ) : (
                        <FiCircle className="opacity-40" />
                      )}
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 text-[14px] tracking-wide transition-colors disabled:opacity-60"
              style={{ backgroundColor: "#1a120b", color: "#F5EFE3" }}
            >
              {loading ? t("auth.creatingAccount") : t("auth.createAccount")}
              {!loading && (
                <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </form>

          <p className="mt-10 text-[13px] text-center" style={{ color: "#6b5a4a" }}>
            {t("auth.alreadyHaveAccount")}{" "}
            <Link
              to="/login"
              className="underline underline-offset-4 hover:opacity-70"
              style={{ color: "#1a120b" }}
            >
              {t("common.signIn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

function Field({ label, id, trailing, ...inputProps }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] tracking-[0.18em] uppercase mb-2"
        style={{ color: "#6b5a4a" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          {...inputProps}
          className="w-full bg-transparent border-0 border-b py-2.5 pr-8 text-[15px] focus:outline-none transition-colors placeholder:opacity-40"
          style={{ borderColor: "#cdbda6", color: "#1a120b" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#1a120b")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#cdbda6")}
        />
        {trailing && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            {trailing}
          </div>
        )}
      </div>
    </div>
  );
}

export default Signup;
