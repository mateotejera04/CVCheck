import { useState, useEffect } from "react";
import { confirmPasswordReset, getAuth } from "firebase/auth";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

import showSuccessToast from "../Components/showSuccessToast";
import showErrorToast from "../Components/showErrorToast";

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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center surface-base px-4 py-12">
      <div className="w-full max-w-md card-flat p-8 md:p-10">
        <h1 className="h-section mb-2">Reset password</h1>
        <p className="text-sm text-zinc-600 mb-8">
          Choose a new password for your account.
        </p>

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label
              htmlFor="newPassword"
              className="text-sm font-medium text-zinc-700 mb-2 block"
            >
              New password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm text-zinc-900 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !oobCode}
            className="btn-primary w-full"
          >
            {loading ? "Resetting…" : "Reset password"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-zinc-600">
          <Link to="/login" className="text-sky-700 font-medium hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
