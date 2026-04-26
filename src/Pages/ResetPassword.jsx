import { useState, useEffect } from "react";
import { confirmPasswordReset, getAuth } from "firebase/auth";
import { FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

import showSuccessToast from "../Components/showSuccessToast";
import showErrorToast from "../Components/showErrorToast";
import Field from "../Components/ui/Field";

const serif = { fontFamily: "var(--font-serif)" };

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [oobCode, setOobCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("oobCode");
    if (code) setOobCode(code);
    else showErrorToast("Invalid or expired reset link.");
  }, [searchParams]);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmPasswordReset(getAuth(), oobCode, newPassword);
      showSuccessToast("Password reset successful");
      navigate("/login");
    } catch (err) {
      showErrorToast(err.message || "Failed to reset password.");
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
              "radial-gradient(circle at 70% 20%, #E9B8D2 0%, transparent 55%), radial-gradient(circle at 25% 75%, #C9B6E4 0%, transparent 55%), linear-gradient(135deg, #EAD3BF 0%, #F2E2C8 100%)",
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
            A fresh start,
            <br />
            <em className="italic font-normal">one keystroke away.</em>
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
          Pick something memorable
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16 sm:px-12">
        <div className="w-full max-w-sm">
          <h1
            className="text-[40px] leading-[1.05] tracking-tight"
            style={{ ...serif, color: "var(--text-primary)" }}
          >
            Reset <em className="italic font-normal">password.</em>
          </h1>
          <p className="mt-3 text-[14px] text-[color:var(--text-muted)]">
            Choose a new password for your account.
          </p>

          <form onSubmit={handleReset} className="mt-10 space-y-7">
            <Field
              id="newPassword"
              label="New password"
              type={showPassword ? "text" : "password"}
              name="newPassword"
              required
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              }
            />

            <button
              type="submit"
              disabled={loading || !oobCode}
              className="group w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 text-[14px] tracking-wide transition-colors disabled:opacity-60"
              style={{
                backgroundColor: "var(--text-primary)",
                color: "var(--surface-base)",
              }}
            >
              {loading ? "Resetting…" : "Reset password"}
              {!loading && (
                <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </form>

          <p className="mt-10 text-[13px] text-center text-[color:var(--text-muted)]">
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
