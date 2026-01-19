"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
    const { login } = useAuth();
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Small delay for UX
        await new Promise(resolve => setTimeout(resolve, 500));

        const success = login(password);
        if (!success) {
            setError("Contraseña incorrecta");
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <div className={styles.iconWrapper}>
                    <Lock size={48} />
                </div>

                <h1 className={styles.title}>Acceso a Euromed Intelplanner</h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Contraseña"
                                className={styles.input}
                                autoFocus
                                required
                            />
                            <button
                                type="button"
                                className={styles.toggleBtn}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className={styles.errorBox}>
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isLoading || !password}
                    >
                        {isLoading ? (
                            <span className={styles.loading}>Verificando...</span>
                        ) : (
                            "Acceder"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
