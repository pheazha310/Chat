import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "../../../shared/ui/Alert";
import { TextField } from "../../../shared/ui/TextField";
import { useAuthStore } from "../model/auth.store";

export function RegisterForm() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const success = await register(name, email, password);
    if (success) navigate("/chat");
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error ? <Alert message={error} /> : null}
      <TextField
        id="name"
        label="Name"
        autoComplete="name"
        autoFocus
        onChange={setName}
        placeholder="Sophea"
        required
        value={name}
      />
      <TextField
        id="email"
        label="Email"
        autoComplete="email"
        onChange={setEmail}
        placeholder="you@example.com"
        required
        type="email"
        value={email}
      />
      <TextField
        id="password"
        label="Password"
        autoComplete="new-password"
        minLength={8}
        onChange={setPassword}
        placeholder="At least 8 characters"
        required
        type="password"
        value={password}
      />
      <button
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}