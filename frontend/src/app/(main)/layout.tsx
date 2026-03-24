"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { token } = useAuthStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is authenticated
        // We use a small timeout to allow hydration of the persisted store
        const checkAuth = () => {
            if (!token) {
                router.push("/login");
            } else {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [token, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#060910]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-sm font-medium text-slate-400">Verifying session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#060910] text-white overflow-hidden">
            {/* Sidebar - desktop */}
            <div className="hidden md:flex h-full">
                <Sidebar />
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#060910]">
                    {children}
                </main>
            </div>
        </div>
    );
}
