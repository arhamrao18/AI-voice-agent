import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Radio } from "lucide-react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useAuth } from "@/hooks/useAuth";
import { validateLoginForm } from "@/utils/validators";
import { APP_NAME } from "@/utils/constants";

/**
 * Simple login form. Structured to be JWT-ready: `signIn` already returns
 * a token+user shape, so wiring this to a real Django `/api/auth/login/`
 * endpoint later only requires editing `authService.login`.
 */
export default function LoginForm() {
  const { signIn, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateLoginForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    try {
      await signIn(form);
      const redirectTo = location.state?.from?.pathname || "/chat";
      navigate(redirectTo, { replace: true });
    } catch {
      // error already surfaced via useAuth().error
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-panel">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-900 text-teal-400">
            <Radio className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-lg font-bold text-ink-900">Welcome to {APP_NAME}</h1>
            <p className="mt-1 text-sm text-ink-600">Sign in to talk with your assistant.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange("email")}
            error={fieldErrors.email}
            autoComplete="email"
          />
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange("password")}
            error={fieldErrors.password}
            autoComplete="current-password"
          />
          {error && <ErrorMessage message={error} />}
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign in
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-ink-600/70">
          This demo accepts any email and a 6+ character password.
        </p>
      </div>
    </div>
  );
}
