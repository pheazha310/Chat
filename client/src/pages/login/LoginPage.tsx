import { Link } from "react-router-dom";
import { LoginForm } from "../../features/auth/ui/LoginForm";

export function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to start chatting.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
        <p className="mt-4 text-center text-sm text-slate-600">
          No account?{" "}
          <Link
            className="font-medium text-indigo-600 hover:underline"
            to="/register"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}