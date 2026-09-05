import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type AuthUser = { name: string; email: string };
type StoredUser = AuthUser & { password: string };
export type AuthResult = { ok: boolean; error?: string };

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
};

const USERS_KEY = 'taskflow-users';
const SESSION_KEY = 'taskflow-session';
export const DEMO_EMAIL = 'demo@taskflow.app';
export const DEMO_PASSWORD = 'demo1234';

const AuthContext = createContext<AuthContextValue | null>(null);

function readUsers(): Record<string, StoredUser> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '{}');
  } catch {
    return {};
  }
}
function writeUsers(users: Record<string, StoredUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * This project has no backend, so there is nowhere to safely check a
 * password - obscuring it here just keeps it from sitting in localStorage
 * as plain text. It is NOT real security. A production login always
 * verifies credentials on a server.
 */
function obscure(value: string) {
  return btoa(unescape(encodeURIComponent(value)));
}

function seedDemoAccount() {
  const users = readUsers();
  if (!users[DEMO_EMAIL]) {
    users[DEMO_EMAIL] = { name: 'Ayesha Khan', email: DEMO_EMAIL, password: obscure(DEMO_PASSWORD) };
    writeUsers(users);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedDemoAccount();
    const sessionEmail = localStorage.getItem(SESSION_KEY);
    if (sessionEmail) {
      const stored = readUsers()[sessionEmail];
      if (stored) setUser({ name: stored.name, email: stored.email });
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string): Promise<AuthResult> {
    const normalized = email.trim().toLowerCase();
    const stored = readUsers()[normalized];
    if (!stored || stored.password !== obscure(password)) {
      return { ok: false, error: 'That email and password don\u2019t match our records.' };
    }
    localStorage.setItem(SESSION_KEY, stored.email);
    setUser({ name: stored.name, email: stored.email });
    return { ok: true };
  }

  async function signup(name: string, email: string, password: string): Promise<AuthResult> {
    const normalized = email.trim().toLowerCase();
    const users = readUsers();
    if (users[normalized]) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const stored: StoredUser = { name: name.trim(), email: normalized, password: obscure(password) };
    users[normalized] = stored;
    writeUsers(users);
    localStorage.setItem(SESSION_KEY, normalized);
    setUser({ name: stored.name, email: stored.email });
    return { ok: true };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
