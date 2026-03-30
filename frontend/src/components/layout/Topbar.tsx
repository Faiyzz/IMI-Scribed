"use client";

import { useState } from "react";
import { LogOut, User, ChevronDown, Bell, Search } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function Topbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const userInitials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
        : "C";

    return (
        <header className="h-20 px-8 flex items-center justify-between bg-white border-b border-slate-100 shrink-0 relative z-50">
            {/* LEFT — Search/Action Context */}
            <div className="flex items-center gap-4 group">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sage-500 transition-colors" size={18} />
                    <input 
                        type="search" 
                        placeholder="Global Patient Search..." 
                        className="bg-slate-50 border border-slate-100 focus:border-sage-500/30 outline-none py-2.5 pl-12 pr-6 rounded-full text-sm font-medium w-64 transition-all duration-300 focus:w-80"
                    />
                </div>
            </div>

            {/* RIGHT — User Actions */}
            <div className="flex items-center gap-6">
                <button className="p-3 text-slate-400 hover:text-sage-600 hover:bg-sage-50 rounded-xl transition-all">
                    <Bell size={20} />
                </button>

                <div className="h-8 w-px bg-slate-100 mx-2" />

                {/* PROFILE DROPDOWN */}
                <div className="relative">
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <div className="flex flex-col items-end mr-1">
                            <span className="text-xs font-black text-slate-900 tracking-tight leading-none mb-1">{user?.name || "Clinician"}</span>
                            <span className="text-[10px] font-black text-sage-500 uppercase tracking-widest leading-none">Professional</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-sage-500 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-sage-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                            {userInitials}
                        </div>
                        <ChevronDown size={14} className={`text-slate-300 transition-transform duration-300 ${isMenuOpen ? 'rotate-180 text-sage-500' : ''}`} />
                    </div>

                    {/* DROPDOWN MENU */}
                    {isMenuOpen && (
                        <>
                            <div
                                className="fixed inset-0"
                                onClick={() => setIsMenuOpen(false)}
                            />
                            <div className="absolute right-0 mt-4 w-60 bg-white border border-slate-100 rounded-2xl shadow-2xl py-3 overflow-hidden animate-in fade-in zoom-in duration-200">
                                <div className="px-5 py-4 border-b border-slate-50 mb-2">
                                    <p className="text-sm font-black text-slate-900 truncate tracking-tight">{user?.name || "Clinician"}</p>
                                    <p className="text-[10px] text-slate-400 truncate mt-1 uppercase tracking-widest font-black">{user?.email || "No email linked"}</p>
                                </div>

                                <div className="px-2 space-y-1">
                                    <button
                                        className="w-full flex items-center gap-4 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-sage-600 hover:bg-sage-50 rounded-xl transition-all"
                                        onClick={() => {
                                            router.push("/settings");
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        <User size={16} />
                                        Account Portal
                                    </button>
                                    <button
                                        className="w-full flex items-center gap-4 px-4 py-3 text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-50 rounded-xl transition-all"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={16} />
                                        Log Out System
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}