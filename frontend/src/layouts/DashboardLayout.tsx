import { Menu } from "lucide-react";
import { ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";

interface NavItem {
  to: string;
  label: string;
}

const roleNav: Record<UserRole, NavItem[]> = {
  citizen: [
    { to: "/citizen", label: "Overview" },
    { to: "/citizen/vehicles", label: "My Vehicles" },
    { to: "/citizen/challans", label: "My Challans" },
    { to: "/citizen/payment", label: "Payment" },
    { to: "/citizen/payment-history", label: "Payment History" },
    { to: "/citizen/profile", label: "Profile" }
  ],
  officer: [
    { to: "/officer", label: "Officer Home" },
    { to: "/officer/queue", label: "Violations Queue" },
    { to: "/officer/history", label: "Verification History" }
  ],
  admin: [
    { to: "/admin", label: "Admin Overview" },
    { to: "/admin/users", label: "User Management" },
    { to: "/admin/officers", label: "Officer Management" },
    { to: "/admin/analytics", label: "Violation Analytics" },
    { to: "/admin/logs", label: "System Logs" },
    { to: "/admin/settings", label: "Settings" }
  ]
};

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { currentUser, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!currentUser) return null;
  const navItems = roleNav[currentUser.role];

  return (
    <div className="min-h-screen bg-surface text-ink">
      <div className="fixed inset-x-0 top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button className="rounded border border-slate-200 p-2 md:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle navigation">
              <Menu size={18} />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Traffic Enforcement Platform</p>
              <p className="text-base font-bold">TRAFFICSENSE</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold">{currentUser.name}</p>
              <p className="text-xs uppercase text-muted">{currentUser.role}</p>
            </div>
            <button onClick={logout} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white">
              Logout
            </button>
          </div>
        </div>
      </div>

      <aside
        className={`fixed bottom-0 left-0 top-16 z-20 w-64 border-r border-slate-200 bg-white p-3 transition-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-amber-100 text-amber-900" : "text-slate-700 hover:bg-slate-100"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="px-4 pb-6 pt-20 md:ml-64">
        <div className="mx-auto max-w-[1600px]">{children}</div>
      </main>
    </div>
  );
}
