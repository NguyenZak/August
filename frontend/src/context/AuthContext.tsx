"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export type UserRole = "USER" | "ADMIN" | "SUPER" | null;

interface AuthUser {
    email: string;
    role: UserRole;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (email: string, role: UserRole, token?: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Load user from localStorage on mount
        const savedUser = localStorage.getItem("august_auth_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (email: string, role: UserRole, token?: string) => {
        const authUser = { email, role };
        setUser(authUser);
        localStorage.setItem("august_auth_user", JSON.stringify(authUser));
        if (token) {
            localStorage.setItem("admin_token", token);
        }

        // Redirect based on role
        if (role === "SUPER") router.push("/dashboard");
        else if (role === "ADMIN") router.push("/admin");
        else if (role === "USER") router.push("/dashboard");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("august_auth_user");
        localStorage.removeItem("admin_token");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
