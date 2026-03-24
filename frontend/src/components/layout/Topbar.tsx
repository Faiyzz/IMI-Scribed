"use client";

import { useState } from "react";
import { Bell, HelpCircle, Mic, LogOut, User, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import StartSessionModal from "../modals/StartSessionModal";

export default function Topbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login"); // Redirect to login page on logout
    };

    const userInitials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
        : "Clinician";

    return (
        <header className="h-16 px-8 flex items-center justify-between bg-[#0B0F19] border-b border-white/5 shrink-0 relative z-50">
            {/* LEFT — branding */}
            <div className="flex items-center gap-3">
                <h2 className="text-base font-bold tracking-tight">IMI Scribe</h2>
            </div>

            {/* RIGHT — actions */}
            <div className="flex items-center gap-6">
                <span className="text-sm font-medium text-white/50 hover:text-white cursor-pointer transition">
                    Profile Settings
                </span>

                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 transition active:scale-95"
                >
                    <Mic size={16} />
                    Start New Session
                </button>

                <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                    <Bell size={18} className="text-white/50 hover:text-white cursor-pointer transition" />
                    <HelpCircle size={18} className="text-white/50 hover:text-white cursor-pointer transition" />
                    
                    {/* PROFILE DROPDOWN */}
                    <div className="relative">
                        <div 
                            className="flex items-center gap-2 cursor-pointer group"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-xs font-bold shadow transition group-hover:ring-2 group-hover:ring-blue-500/50">
                                {userInitials}
                            </div>
                            <ChevronDown size={14} className={`text-white/40 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {/* DROPDOWN MENU */}
                        {isMenuOpen && (
                            <>
                                <div 
                                    className="fixed inset-0" 
                                    onClick={() => setIsMenuOpen(false)}
                                />
                                <div className="absolute right-0 mt-3 w-48 bg-[#151B2B] border border-white/10 rounded-xl shadow-2xl py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                                    <div className="px-4 py-2 border-b border-white/5 mb-1">
                                        <p className="text-sm font-semibold truncate">{user?.name || "Clinician"}</p>
                                        <p className="text-[10px] text-white/40 truncate">{user?.email || ""}</p>
                                    </div>

                                    <div className="px-1">
                                        <button 
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <User size={16} />
                                            Your Profile
                                        </button>
                                        <button 
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <StartSessionModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </header>
    );
}