import { Link } from "react-router-dom";
import { RegisterForm } from "../../features/auth/ui/RegisterForm";

export function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          You will be signed in right away.
        </p>
        <div className="mt-6">
          <RegisterForm />
        </div>
        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            className="font-medium text-indigo-600 hover:underline"
            to="/login"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}