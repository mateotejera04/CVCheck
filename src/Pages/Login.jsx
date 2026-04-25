import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import showSuccessToast from "../Components/showSuccessToast";
import showErrorToast from "../Components/showErrorToast";
import { toast } from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center surface-base px-4 py-12">
      <div className="w-full max-w-md card-flat p-8 md:p-10">
        <h1 className="h-section mb-2">Welcome back</h1>
        <p className="text-sm text-zinc-600 mb-8">
          Log in to keep building your resume.
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
                name="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm text-zinc-900 bg-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-700 mb-2 block"
            >
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm text-zinc-900 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <div className="mt-2 text-right">
              <Link
                to="/forgot-password"
                className="text-xs text-zinc-500 hover:text-sky-700"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            Log in
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-zinc-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-sky-700 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
