"use client";

import { useAuth, UserRole } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface RouteGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

export default function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push("/login");
            } else if (user.role !== "SUPER" && !allowedRoles.includes(user.role)) {
                // If not super and role not allowed, redirect to their default home
                if (user.role === "USER") router.push("/dashboard");
                else if (user.role === "ADMIN") router.push("/admin");
            }
        }
    }, [user, isLoading, router, allowedRoles]);

    if (isLoading || !user || (user.role !== "SUPER" && !allowedRoles.includes(user.role))) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#dafc69]/20 border-t-[#dafc69] rounded-full animate-spin"></div>
            </div>
        );
    }

    return <>{children}</>;
}
