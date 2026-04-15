// contexts/AuthContext.tsx
import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

// Use environment variable for Medusa backend URL
const MEDUSA_BACKEND_URL =
  import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000";
const MEDUSA_PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY;

interface User {
  id: string;
  name: string; // Medusa customer has first_name + last_name; combine as needed
  email: string;
  // optional: first_name, last_name, etc.
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  showAuthModal: boolean;
  authMode: "login" | "signup";
  postLoginRedirect: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  promptAuth: (mode?: "login" | "signup", redirectUrl?: string | null) => void;
  setShowAuthModal: (show: boolean) => void;
  setAuthMode: (mode: "login" | "signup") => void;
  setPostLoginRedirect: (url: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [postLoginRedirect, setPostLoginRedirect] = useState<string | null>(
    null,
  );

  // On mount, check if we have a token and fetch customer
  useEffect(() => {
    const token = localStorage.getItem("medusa_auth_token");
    if (token) {
      fetchCurrentCustomer(token);
    }
  }, []);

  const medusaFetch = (endpoint: String, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);

    headers.set("Content-Type", "application/json");
    headers.set("x-publishable-key", MEDUSA_PUBLISHABLE_KEY);
    // console.log("Publishable key:", MEDUSA_PUBLISHABLE_KEY);
    return fetch(`${MEDUSA_BACKEND_URL}${endpoint}`, {
      ...options,
      headers,
      // headers: {
      //   "Content-Type": "application/json",
      //   "x-publishable-key": MEDUSA_PUBLISHABLE_KEY,
      //   ...options.headers,
      // },
    });
  };

  const fetchCurrentCustomer = async (token: string) => {
    try {
      const response = await medusaFetch("/store/auth", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const customer = data.customer;
        // Medusa returns first_name, last_name – combine into a name
        const fullName =
          `${customer.first_name || ""} ${customer.last_name || ""}`.trim();
        setUser({
          id: customer.id,
          name: fullName || customer.email,
          email: customer.email,
        });
        setIsAuthenticated(true);
      } else {
        // Token invalid
        localStorage.removeItem("medusa_auth_token");
      }
    } catch (error) {
      console.error("Failed to fetch customer", error);
    }
  };

  // Medusa signup (register customer)
  const signup = async (name: string, email: string, password: string) => {
    // Split name into first and last (simple version)
    const nameParts = name.trim().split(" ");
    const first_name = nameParts[0] || "";
    const last_name = nameParts.slice(1).join(" ") || "";

    const response = await medusaFetch("/store/customers", {
      method: "POST",
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        password,
      }),
    });
    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", data); // only one read

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Signup error:", errorData);
      throw new Error(data.message || "Signup failed");
    }

    // After registration, Medusa does NOT automatically log you in.
    // You need to call login with the same credentials.
    // Automatically login after signup
    await login(email, password);
  };

  // Medusa login (get token)
  const login = async (email: string, password: string) => {
    const response = await medusaFetch("/store/auth", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (data.access_token) {
      localStorage.setItem("medusa_auth_token", data.access_token);
      // Fetch customer details using the token
      const customer = data.customer;
      const fullName =
        `${customer.first_name || ""} ${customer.last_name || ""}`.trim();
      setUser({
        id: customer.id,
        name: fullName || customer.email,
        email: customer.email,
      });
      setIsAuthenticated(true);
      setShowAuthModal(false);

      if (postLoginRedirect) {
        window.location.href = postLoginRedirect;
        setPostLoginRedirect(null);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("medusa_auth_token");
    setUser(null);
    setIsAuthenticated(false);
    // Optional: call DELETE /store/auth on server if needed
  };

  const promptAuth = (
    mode: "login" | "signup" = "login",
    redirectUrl: string | null = null,
  ) => {
    console.log("Publishable key:", MEDUSA_PUBLISHABLE_KEY);
    // console.log("🟡 promptAuth called, setting showAuthModal to true");
    setAuthMode(mode);
    setShowAuthModal(true);
    if (redirectUrl) setPostLoginRedirect(redirectUrl);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        showAuthModal,
        authMode,
        postLoginRedirect,
        login,
        signup,
        logout,
        promptAuth,
        setShowAuthModal,
        setAuthMode,
        setPostLoginRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
