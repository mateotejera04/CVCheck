import { useState } from "react";
import { FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import showSuccessToast from "../Components/showSuccessToast";
import showErrorToast from "../Components/showErrorToast";
import { toast } from "react-hot-toast";

const serif = { fontFamily: "Merriweather, ui-serif, Georgia, serif" };

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Logging in…");
    try {
      const result = await login({
        email: form.email,
        password: form.password,
      });
      toast.dismiss(toastId);
      if (result.success) {
        showSuccessToast("Login successful");
        navigate("/dashboard");
      } else {
        toast.error(result.error || "Login failed");
      }
    } catch (err) {
      toast.dismiss(toastId);
      showErrorToast(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              "radial-gradient(circle at 20% 20%, #F4C9A8 0%, transparent 55%), radial-gradient(circle at 80% 30%, #E9B8D2 0%, transparent 50%), radial-gradient(circle at 50% 85%, #C9B6E4 0%, transparent 55%), linear-gradient(135deg, #F2E2C8 0%, #EAD3BF 100%)",
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
            Resumes that
            <br />
            <em className="italic font-normal">read like you.</em>
          </p>
          <p
            className="mt-6 text-[15px] leading-relaxed max-w-sm"
            style={{ color: "#4a3a2a" }}
          >
            A quiet workspace for crafting the document that opens the
            next door.
          </p>
        </div>

        <div
          className="relative flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase"
          style={{ color: "#5a4a3a" }}
        >
          <span className="h-px w-8" style={{ backgroundColor: "#5a4a3a" }} />
          A calmer way to apply
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-16 sm:px-12">
        <div className="w-full max-w-sm">
          <h1
            className="text-[40px] leading-[1.05] tracking-tight"
            style={{ ...serif, color: "#1a120b" }}
          >
            Welcome <em className="italic font-normal">back.</em>
          </h1>
          <p
            className="mt-3 text-[14px]"
            style={{ color: "#6b5a4a" }}
          >
            Sign in to continue building your resume.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-7">
            <Field
              id="email"
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />

            <div>
              <Field
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
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
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                }
              />
              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-[12px] tracking-wide hover:underline"
                  style={{ color: "#6b5a4a" }}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 text-[14px] tracking-wide transition-colors disabled:opacity-60"
              style={{ backgroundColor: "#1a120b", color: "#F5EFE3" }}
            >
              {loading ? "Signing in…" : "Sign in"}
              {!loading && (
                <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </form>

          <p
            className="mt-10 text-[13px] text-center"
            style={{ color: "#6b5a4a" }}
          >
            New here?{" "}
            <Link
              to="/signup"
              className="underline underline-offset-4 hover:opacity-70"
              style={{ color: "#1a120b" }}
            >
              Get started
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

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
          style={{
            borderColor: "#cdbda6",
            color: "#1a120b",
          }}
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
