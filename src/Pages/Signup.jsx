import { useState } from "react";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import showSuccessToast from "../Components/showSuccessToast";
import showErrorToast from "../Components/showErrorToast";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
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
      return toast.error("Password cannot be empty.");
    }
    if (form.password !== form.confirmPassword) {
      setLoading(false);
      return toast.error("Passwords do not match.");
    }
    const result = await signup({
      name: form.name,
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (result.success) {
      showSuccessToast("Signup successful");
      navigate("/dashboard");
    } else {
      showErrorToast(result.error || "Signup failed");
    }
  };

  const progress = Object.values(passwordValid).filter(Boolean).length;
  const strengthLabel =
    progress === 4 ? "Strong" : progress >= 2 ? "Medium" : "Weak";
  const strengthColor =
    progress === 4
      ? "text-green-700"
      : progress >= 2
      ? "text-amber-700"
      : "text-red-700";

  const inputCls =
    "w-full pl-10 pr-3 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm text-zinc-900 bg-white";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center surface-base px-4 py-12">
      <div className="w-full max-w-lg card-flat p-8 md:p-10">
        <h1 className="h-section mb-2">Create your account</h1>
        <p className="text-sm text-zinc-600 mb-8">
          Build a professional resume in minutes.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="text-sm font-medium text-zinc-700 mb-2 block"
            >
              Full name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                value={form.name}
                onChange={handleChange}
                required
                className={inputCls}
              />
            </div>
          </div>

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
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className={inputCls}
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
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className={`${inputCls} pr-10`}
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-zinc-700 mb-2 block"
            >
              Confirm password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className={`${inputCls} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showConfirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {form.password && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-500">Password strength</span>
                <span className={`text-xs font-medium ${strengthColor}`}>
                  {strengthLabel}
                </span>
              </div>
              <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-sky-600 transition-all"
                  style={{ width: `${(progress / 4) * 100}%` }}
                />
              </div>
              <ul className="grid grid-cols-2 gap-1.5 text-xs text-zinc-600">
                {[
                  ["upper", "1 uppercase letter"],
                  ["lower", "1 lowercase letter"],
                  ["number", "1 number"],
                  ["special", "1 special character"],
                ].map(([key, label]) => (
                  <li key={key} className="flex items-center gap-1.5">
                    {passwordValid[key] ? (
                      <FiCheckCircle className="text-green-600" />
                    ) : (
                      <FiXCircle className="text-zinc-300" />
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
            className="btn-primary w-full"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-zinc-600">
          Already have an account?{" "}
          <Link to="/login" className="text-sky-700 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
