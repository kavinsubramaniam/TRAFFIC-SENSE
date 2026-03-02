import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types";

export function LoginPage() {
  const [email, setEmail] = useState("rohan@trafficsense.gov");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState<UserRole>("citizen");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = login({ email, password, role });
    if (!result.ok) {
      setError(result.message || "Login failed.");
      return;
    }
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950/80 p-6 text-slate-100 shadow-panel">
        <h1 className="text-2xl font-bold">TRAFFICSENSE Login</h1>
        <p className="mt-1 text-sm text-slate-300">AI-powered traffic enforcement access portal.</p>
        <form className="mt-5 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Role</label>
            <select
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value="citizen">Citizen / Vehicle Owner</option>
              <option value="officer">Verification Officer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button className="w-full rounded-lg bg-amber-500 px-4 py-2 font-semibold text-slate-900">Sign In</button>
        </form>
        <p className="mt-4 text-sm text-slate-300">
          New vehicle owner?{" "}
          <Link to="/signup" className="font-semibold text-amber-300">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
