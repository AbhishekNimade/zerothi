"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { logLoginToSheet } from "@/lib/sheets";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkUserSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUserSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("API check session failed, falling back to LocalStorage:", err);
    }

    // LocalStorage fallback
    const savedUser = localStorage.getItem("zerothi_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("zerothi_user", JSON.stringify(data.user));
        logLoginToSheet(data.user.name, data.user.email, "Email Login");
        return { success: true };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (err) {
      console.warn("API login failed, falling back to LocalStorage:", err);
    }

    // Local storage mock login fallback
    const mockUser = {
      id: "user-" + Date.now(),
      name: email.split("@")[0],
      email: email,
      role: (email.toLowerCase().includes("admin") || email.toLowerCase() === "it@zerothi.com") ? "ADMIN" : "CUSTOMER"
    };
    localStorage.setItem("zerothi_user", JSON.stringify(mockUser));
    setUser(mockUser);
    logLoginToSheet(mockUser.name, mockUser.email, "Local Email Login");
    return { success: true };
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("zerothi_user", JSON.stringify(data.user));
        logLoginToSheet(data.user.name, data.user.email, "Email Registration");
        return { success: true };
      } else {
        return { success: false, error: data.error || "Registration failed" };
      }
    } catch (err) {
      console.warn("API register failed, falling back to LocalStorage:", err);
    }

    // Local storage mock register fallback
    const mockUser = {
      id: "user-" + Date.now(),
      name,
      email,
      role: (email.toLowerCase().includes("admin") || email.toLowerCase() === "it@zerothi.com") ? "ADMIN" : "CUSTOMER"
    };
    localStorage.setItem("zerothi_user", JSON.stringify(mockUser));
    setUser(mockUser);
    logLoginToSheet(mockUser.name, mockUser.email, "Local Email Registration");
    return { success: true };
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.warn("API logout failed:", err);
    }
    localStorage.removeItem("zerothi_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkUserSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
