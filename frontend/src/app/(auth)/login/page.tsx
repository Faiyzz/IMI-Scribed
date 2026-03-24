"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const setAuth = useAuthStore((state) => state.setAuth);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || "Login failed");
            }

            // Success
            setAuth(result.data.user, result.data.token);
            toast.success("Welcome back!");
            router.push("/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2 bg-[#F8FAFC]">
            {/* LEFT SIDE — Brand Identity */}
            <div className="hidden md:flex flex-col justify-between bg-[#0B0F19] text-white p-12 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="text-4xl mb-12 font-black tracking-tighter text-blue-500">IMI Scribe</div>

                    <h1 className="text-5xl font-bold leading-tight tracking-tight">
                        Revolutionizing <br /> Clinical Notes 👋
                    </h1>

                    <p className="mt-6 text-lg text-white/60 max-w-sm font-medium leading-relaxed">
                        Say goodbye to hours of charting. AI-powered medical scribe that accurately captures every detail of your patient encounters.
                    </p>
                </div>

                <p className="text-sm text-white/40 relative z-10">
                    © {new Date().getFullYear()} IMI Scribe. All rights reserved.
                </p>

                {/* Aesthetic Background Elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px]" />
            </div>

            {/* RIGHT SIDE — Form */}
            <div className="flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h3 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h3>
                        <p className="text-sm text-slate-500">
                            New to IMI Scribe?{" "}
                            <Link href="/register" className="text-blue-600 font-bold hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@clinic.com"
                                className="w-full bg-[#F1F5F9] border-2 border-transparent focus:border-blue-500/50 focus:bg-white outline-none py-3 px-4 rounded-xl transition-all duration-200 text-slate-900"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#F1F5F9] border-2 border-transparent focus:border-blue-500/50 focus:bg-white outline-none py-3 px-4 rounded-xl transition-all duration-200 text-slate-900"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="text-right">
                            <Link href="#" className="text-xs font-bold text-slate-400 hover:text-blue-600 transition">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#0B0F19] text-white py-4 rounded-xl font-bold hover:bg-black active:scale-[0.98] transition-all duration-200 shadow-xl shadow-slate-200 disabled:opacity-50"
                        >
                            {isLoading ? "Signing in..." : "Sign In to Dashboard"}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#F8FAFC] px-4 text-slate-400 font-bold">Or continue with</span>
                        </div>
                    </div>

                    <button className="w-full border-2 border-slate-200 py-3 rounded-xl flex items-center justify-center gap-3 font-bold text-slate-600 hover:bg-slate-50 transition active:scale-[0.98]">
                        <FcGoogle size={20} />
                        Authorized Google Login
                    </button>
                </div>
            </div>
        </div>
    );
}