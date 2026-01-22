"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Password configuration with expiration
const PASSWORD_CONFIG = {
    current: "euro_med@",
    expirationDate: new Date("2026-01-27T23:59:59"),
    next: "euromed_26"
};

const AUTH_KEY = "euromed_auth";

// Function to get the current valid password based on date
const getCurrentPassword = (): string => {
    const now = new Date();
    return now > PASSWORD_CONFIG.expirationDate
        ? PASSWORD_CONFIG.next
        : PASSWORD_CONFIG.current;
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already authenticated
        const authStatus = sessionStorage.getItem(AUTH_KEY);
        if (authStatus === "true") {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = (password: string): boolean => {
        const validPassword = getCurrentPassword();
        if (password === validPassword) {
            setIsAuthenticated(true);
            sessionStorage.setItem(AUTH_KEY, "true");
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem(AUTH_KEY);
    };

    if (isLoading) {
        return null; // or a loading spinner
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
