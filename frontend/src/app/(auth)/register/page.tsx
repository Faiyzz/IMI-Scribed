"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const setAuth = useAuthStore((state) => state.setAuth);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || "Registration failed");
            }

            // Successfully registered — we'll automatically log them in since the backend returns user+token on register too
            setAuth(result.data.user, result.data.token);
            toast.success("Account created successfully!");
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
                        Join the <br /> Future of Scribing ⚡
                    </h1>

                    <p className="mt-6 text-lg text-white/60 max-w-sm font-medium leading-relaxed">
                        Start your journey towards effortless documentation. Join thousands of clinicians using AI to reclaim their time.
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
                        <h3 className="text-3xl font-extrabold text-slate-900 mb-2">Create Account</h3>
                        <p className="text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-600 font-bold hover:underline">
                                Sign in here
                            </Link>
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Dr. Jane Doe"
                                className="w-full bg-[#F1F5F9] border-2 border-transparent focus:border-blue-500/50 focus:bg-white outline-none py-3 px-4 rounded-xl transition-all duration-200 text-slate-900"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="jane@clinic.com"
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
                                placeholder="Minimum 8 characters"
                                className="w-full bg-[#F1F5F9] border-2 border-transparent focus:border-blue-500/50 focus:bg-white outline-none py-3 px-4 rounded-xl transition-all duration-200 text-slate-900"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="pt-2">
                             <p className="text-[11px] text-slate-400 pb-4 text-center">
                                By signing up, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                             </p>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#0B0F19] text-white py-4 rounded-xl font-bold hover:bg-black active:scale-[0.98] transition-all duration-200 shadow-xl shadow-slate-200 disabled:opacity-50"
                            >
                                {isLoading ? "Creating Account..." : "Start Free Trial"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
