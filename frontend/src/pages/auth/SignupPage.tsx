import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleNumber: "",
    password: ""
  });
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const res = signup(form);
    if (!res.ok) {
      setError(res.message || "Signup failed.");
      return;
    }
    navigate("/citizen");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-800 to-blue-900 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-950/80 p-6 text-slate-100 shadow-panel">
        <h1 className="text-2xl font-bold">Citizen Registration</h1>
        <p className="mt-1 text-sm text-slate-300">Register vehicle owner profile for e-challan services.</p>
        <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <input
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
          <input
            type="email"
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
            placeholder="Vehicle Number"
            value={form.vehicleNumber}
            onChange={(e) => setForm((p) => ({ ...p, vehicleNumber: e.target.value.toUpperCase() }))}
            required
          />
          <input
            type="password"
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 md:col-span-2"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            required
          />
          {error && <p className="text-sm text-red-300 md:col-span-2">{error}</p>}
          <button className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-slate-900 md:col-span-2">
            Create Account
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-300">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-amber-300">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
