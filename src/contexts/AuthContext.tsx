import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  // Auth gate modal
  authModalOpen: boolean;
  authModalMode: "login" | "signup";
  openAuthModal: (mode?: "login" | "signup", reason?: string) => void;
  closeAuthModal: () => void;
  authReason: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "od_bsb_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("signup");
  const [authReason, setAuthReason] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login = async (email: string, _password: string) => {
    // Mock — accept anything
    const u: User = {
      id: crypto.randomUUID(),
      name: email.split("@")[0],
      email,
      createdAt: new Date().toISOString(),
    };
    persist(u);
    setAuthModalOpen(false);
    setAuthReason(null);
  };

  const signup = async (name: string, email: string, _password: string) => {
    const u: User = {
      id: crypto.randomUUID(),
      name,
      email,
      createdAt: new Date().toISOString(),
    };
    persist(u);
    setAuthModalOpen(false);
    setAuthReason(null);
  };

  const logout = () => persist(null);

  const openAuthModal = (mode: "login" | "signup" = "signup", reason?: string) => {
    setAuthModalMode(mode);
    setAuthReason(reason ?? null);
    setAuthModalOpen(true);
  };
  const closeAuthModal = () => { setAuthModalOpen(false); setAuthReason(null); };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        authReason,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
