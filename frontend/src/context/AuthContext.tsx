import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { initialUsers } from "../data/mockData";
import { AuthUser, UserRole } from "../types";

interface LoginInput {
  email: string;
  password: string;
  role: UserRole;
}

interface SignupInput {
  name: string;
  email: string;
  phone: string;
  vehicleNumber: string;
  password: string;
}

interface AuthContextType {
  users: AuthUser[];
  currentUser: AuthUser | null;
  login: (input: LoginInput) => { ok: boolean; message?: string };
  signup: (input: SignupInput) => { ok: boolean; message?: string };
  setUserActive: (userId: string, active: boolean) => void;
  addOfficer: (payload: { name: string; email: string; phone: string }) => { ok: boolean; message?: string };
  removeOfficer: (officerId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_USER = "trafficsense.currentUser";

const readStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem(STORAGE_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AuthUser[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => readStoredUser());

  // Keep the mock session persistent to simulate real authentication behavior.
  useEffect(() => {
    if (!currentUser) {
      localStorage.removeItem(STORAGE_USER);
      return;
    }
    localStorage.setItem(STORAGE_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  const login = ({ email, password, role }: LoginInput) => {
    const matched = users.find((u) => u.email === email && u.role === role);
    if (!matched) return { ok: false, message: "Account not found for selected role." };
    if (!matched.active) return { ok: false, message: "This account has been disabled by admin." };
    if (matched.password !== password) return { ok: false, message: "Invalid credentials." };

    setCurrentUser(matched);
    localStorage.setItem(STORAGE_USER, JSON.stringify(matched));
    return { ok: true };
  };

  const signup = ({ name, email, phone, vehicleNumber, password }: SignupInput) => {
    const existing = users.find((u) => u.email === email);
    if (existing) return { ok: false, message: "An account with this email already exists." };

    const newUser: AuthUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      phone,
      vehicleNumber,
      role: "citizen",
      password,
      active: true
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem(STORAGE_USER, JSON.stringify(newUser));
    return { ok: true };
  };

  const setUserActive = (userId: string, active: boolean) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, active } : u)));
    setCurrentUser((prev) => (prev && prev.id === userId ? { ...prev, active } : prev));
  };

  const addOfficer = (payload: { name: string; email: string; phone: string }) => {
    if (users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
      return { ok: false, message: "Email already exists." };
    }
    const officer: AuthUser = {
      id: `o-${Date.now()}`,
      role: "officer",
      password: "password123",
      active: true,
      ...payload
    };
    setUsers((prev) => [...prev, officer]);
    return { ok: true };
  };

  const removeOfficer = (officerId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== officerId));
    setCurrentUser((prev) => (prev?.id === officerId ? null : prev));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_USER);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      users,
      currentUser,
      login,
      signup,
      setUserActive,
      addOfficer,
      removeOfficer,
      logout
    }),
    [users, currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
