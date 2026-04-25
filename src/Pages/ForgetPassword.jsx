import { useState } from "react";
import { FiMail } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import showSuccessToast from "../Components/showSuccessToast";
import showErrorToast from "../Components/showErrorToast";

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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center surface-base px-4 py-12">
      <div className="w-full max-w-md card-flat p-8 md:p-10">
        <h1 className="h-section mb-2">Forgot password?</h1>
        <p className="text-sm text-zinc-600 mb-8">
          Enter your email and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-700 mb-2 block"
            >
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm text-zinc-900 bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Sending…" : "Send reset email"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-zinc-600">
          Remember your password?{" "}
          <Link to="/login" className="text-sky-700 font-medium hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
