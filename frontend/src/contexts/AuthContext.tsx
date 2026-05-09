import { createContext, useState, useEffect, type ReactNode } from "react";
import api from "../services/api";
import type { User } from "../interfaces/user";

interface AuthContextData {
  user: User;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  authenticated: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storagedUser = localStorage.getItem("@RefundApp:user");
    const storagedToken = localStorage.getItem("@RefundApp:token");

    if (storagedUser && storagedToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${storagedToken}`;
      setUser(JSON.parse(storagedUser));
    }

    setLoading(false);
  }, []);

  async function signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const response = await api.post("/auth/login", { email, password });

    const { token, user: userData } = response.data;

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    localStorage.setItem("@RefundApp:token", token);
    localStorage.setItem("@RefundApp:user", JSON.stringify(userData));

    setUser(userData);
  }

  return (
    <AuthContext.Provider
      value={{ user, signIn, authenticated: !!user, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
