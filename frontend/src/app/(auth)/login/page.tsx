"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { getApiUrl } from "@/utils/api";

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
            const response = await fetch(`${getApiUrl()}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || "Login failed");
            }

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
        <div className="min-h-screen grid lg:grid-cols-12 bg-white selection:bg-sage-500/30 selection:text-sage-600">
            {/* LEFT SIDE — Form Area (7 cols on lg) */}
            <div className="lg:col-span-5 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative z-10 transition-all duration-700 ease-out animate-in fade-in slide-in-from-left-8">
                <div className="w-full max-w-sm mx-auto lg:mx-0">
                    {/* Logo/Brand */}
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-sage-500 rounded-xl flex items-center justify-center shadow-lg shadow-sage-500/20">
                            <span className="text-white font-black text-xl tracking-tighter">I</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">IMI Scribe</span>
                    </div>

                    <div className="mb-10">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Sign In.</h1>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Log in to access your clinical portal. New here? {" "}
                            <Link href="/register" className="text-sage-600 font-bold hover:text-sage-500 transition-colors">
                                Create Account
                            </Link>
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2 group">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1 transition-colors group-focus-within:text-sage-600">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@clinic.com"
                                className="w-full bg-slate-50 border border-slate-200 focus:border-sage-500/50 focus:bg-white outline-none py-4 px-5 rounded-2xl text-slate-900 font-medium ring-0 focus:ring-4 focus:ring-sage-500/5 transition-all duration-300 shadow-sm"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1 transition-colors group-focus-within:text-sage-600">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 border border-slate-200 focus:border-sage-500/50 focus:bg-white outline-none py-4 px-5 rounded-2xl text-slate-900 font-medium ring-0 focus:ring-4 focus:ring-sage-500/5 transition-all duration-300 shadow-sm"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                             <div className="flex items-center gap-2">
                                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-sage-600 focus:ring-sage-500/20" />
                                <label htmlFor="remember" className="text-xs font-bold text-slate-400 cursor-pointer">Remember me</label>
                             </div>
                            <Link href="#" className="text-xs font-bold text-slate-400 hover:text-sage-600 transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-accent text-white py-4 rounded-2xl font-black text-lg hover:bg-gray-accent-dark active:scale-[0.98] transition-all duration-300 shadow-xl shadow-gray-200 disabled:opacity-50 mt-4"
                        >
                            {isLoading ? "Validating..." : "Login to System"}
                        </button>
                    </form>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-100"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-[0.3em]">
                            <span className="bg-white px-6 text-slate-300 font-black">Or</span>
                        </div>
                    </div>

                    <button className="w-full bg-white border border-slate-200 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 active:scale-[0.98] shadow-sm">
                        <FcGoogle size={20} />
                        Authorized Login
                    </button>
                </div>
            </div>

            {/* RIGHT SIDE — Branding Area (7 cols on lg) */}
            <div className="hidden lg:flex lg:col-span-7 bg-sage-500 relative flex-col justify-center items-center overflow-hidden animate-in fade-in duration-1000">
                {/* Background Image */}
                <img 
                    src="/auth-bg.png" 
                    alt="Clinical Background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                
                {/* Sage overlay for color consistency */}
                <div className="absolute inset-0 bg-sage-600/30" />
                
                {/* Dark gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
                <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[80%] h-[80%] bg-sage-600/20 rounded-full blur-[150px]" />
                
                {/* Main Content */}
                <div className="relative z-10 text-center px-12">
                    <h2 className="text-white text-8xl xl:text-9xl font-black tracking-tighter leading-none mb-6 animate-in slide-in-from-bottom-12 duration-1000 delay-300">
                        Welcome.
                    </h2>
                    <p className="text-white/80 text-lg xl:text-xl font-medium max-w-lg mx-auto leading-relaxed animate-in fade-in duration-1000 delay-500 uppercase tracking-[0.2em]">
                        Advanced Clinical Scribing Platform
                    </p>
                </div>

                {/* Footer credit */}
                <div className="absolute bottom-12 text-white/40 text-[10px] font-black uppercase tracking-[0.5em] animate-in fade-in duration-1000 delay-700">
                    Trusted by 2000+ Clinicians Worldwide
                </div>
            </div>
        </div>
    );
}