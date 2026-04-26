import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import showSuccessToast from "../Components/showSuccessToast";
import showErrorToast from "../Components/showErrorToast";
import Field from "../Components/ui/Field";

const serif = { fontFamily: "var(--font-serif)" };

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(getAuth(), email);
      showSuccessToast("Reset email sent. Check your inbox.");
      navigate("/login");
    } catch (err) {
      showErrorToast(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2"
      style={{ backgroundColor: "var(--surface-base)" }}
    >
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden p-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, #F4C9A8 0%, transparent 55%), radial-gradient(circle at 70% 70%, #C9B6E4 0%, transparent 55%), linear-gradient(135deg, #F2E2C8 0%, #EAD3BF 100%)",
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
            style={{ ...serif, color: "var(--text-primary)" }}
          >
            A new key,
            <br />
            <em className="italic font-normal">on its way.</em>
          </p>
        </div>
        <div
          className="relative flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase"
          style={{ color: "var(--text-secondary)" }}
        >
          <span
            className="h-px w-8"
            style={{ backgroundColor: "var(--text-secondary)" }}
          />
          One short email
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16 sm:px-12">
        <div className="w-full max-w-sm">
          <h1
            className="text-[40px] leading-[1.05] tracking-tight"
            style={{ ...serif, color: "var(--text-primary)" }}
          >
            Forgot <em className="italic font-normal">password?</em>
          </h1>
          <p className="mt-3 text-[14px] text-[color:var(--text-muted)]">
            Enter your email and we'll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-7">
            <Field
              id="email"
              label="Email"
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="group w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 text-[14px] tracking-wide transition-colors disabled:opacity-60"
              style={{
                backgroundColor: "var(--text-primary)",
                color: "var(--surface-base)",
              }}
            >
              {loading ? "Sending…" : "Send reset email"}
              {!loading && (
                <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </form>

          <p className="mt-10 text-[13px] text-center text-[color:var(--text-muted)]">
            Remember your password?{" "}
            <Link
              to="/login"
              className="underline underline-offset-4 hover:opacity-70 text-[color:var(--text-primary)]"
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
