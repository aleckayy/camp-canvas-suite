// Mock auth provider with localStorage persistence.
// Two seeded accounts; ready to swap for Supabase Auth later.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type UserRole = "admin" | "animador";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  animatorId?: string; // link to an animator record for "animador" role
}

interface MockAccount extends AuthUser {
  password: string;
}

const DEFAULT_ACCOUNTS: MockAccount[] = [
  {
    id: "u-admin",
    email: "admin@campaweb.com",
    password: "admin123",
    name: "Administrador",
    role: "admin",
  },
  {
    id: "u-ana",
    email: "animador@campaweb.com",
    password: "animador123",
    name: "Ana Ramírez",
    role: "animador",
    animatorId: "an-ana",
  },
];

const SESSION_KEY = "campaweb_session_v1";
const ACCOUNTS_KEY = "campaweb_accounts_v1";

function loadAccounts(): MockAccount[] {
  if (typeof window === "undefined") return DEFAULT_ACCOUNTS;
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return DEFAULT_ACCOUNTS;
    return JSON.parse(raw) as MockAccount[];
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

function saveAccounts(a: MockAccount[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(a));
}

function loadSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

interface AuthContextValue {
  user: AuthUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  // Admin account management
  listAccounts: () => AuthUser[];
  createAccount: (a: Omit<MockAccount, "id">) => AuthUser;
  updateAccount: (id: string, patch: Partial<MockAccount>) => void;
  deleteAccount: (id: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<MockAccount[]>(() => DEFAULT_ACCOUNTS);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  // hydrate on mount (client only)
  useEffect(() => {
    setAccounts(loadAccounts());
    setUser(loadSession());
    setReady(true);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const match = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
      if (!match) throw new Error("Credenciales incorrectas");
      const { password: _p, ...safe } = match;
      void _p;
      setUser(safe);
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
      return safe;
    },
    [accounts],
  );

  const logout = useCallback(() => {
    setUser(null);
    window.localStorage.removeItem(SESSION_KEY);
  }, []);

  const persistAccounts = useCallback((next: MockAccount[]) => {
    setAccounts(next);
    saveAccounts(next);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      login,
      logout,
      listAccounts: () => accounts.map(({ password: _p, ...rest }) => { void _p; return rest; }),
      createAccount: (a) => {
        const id = `u-${Math.random().toString(36).slice(2, 8)}`;
        const next: MockAccount = { id, ...a };
        persistAccounts([...accounts, next]);
        const { password: _p, ...safe } = next;
        void _p;
        return safe;
      },
      updateAccount: (id, patch) => {
        persistAccounts(accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)));
      },
      deleteAccount: (id) => {
        persistAccounts(accounts.filter((a) => a.id !== id));
      },
    }),
    [user, ready, login, logout, accounts, persistAccounts],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
