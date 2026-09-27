import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "../../../shared/ui/Alert";
import { TextField } from "../../../shared/ui/TextField";
import { useAuthStore } from "../model/auth.store";

export function LoginForm() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const success = await login(email, password);
    if (success) navigate("/chat");
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error ? <Alert message={error} /> : null}
      <TextField
        id="email"
        label="Email"
        autoComplete="email"
        autoFocus
        onChange={setEmail}
        placeholder="you@example.com"
        required
        type="email"
        value={email}
      />
      <TextField
        id="password"
        label="Password"
        autoComplete="current-password"
        minLength={8}
        onChange={setPassword}
        placeholder="••••••••"
        required
        type="password"
        value={password}
      />
      <button
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}