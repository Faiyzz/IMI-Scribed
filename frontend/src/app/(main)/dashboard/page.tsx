"use client";

import { Mic, Calendar, Activity } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import StartSessionModal from "@/components/modals/StartSessionModal";

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="grid grid-cols-12 gap-6">
            {/* LEFT SIDE */}
            <div className="col-span-12 xl:col-span-8 space-y-6">
                {/* HEADER */}
                <div>
                    <h1 className="text-2xl font-semibold">
                        Welcome back, {user?.name || "Clinician"}.
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded-md">
                            ⚡ SYSTEM IDLE
                        </span>
                        <p className="text-sm text-white/60">
                            You're ready to start your first session of the day.
                        </p>
                    </div>
                </div>

                {/* HERO CARD */}
                <div className="relative bg-gradient-to-br from-[#151A2E] to-[#101522] rounded-2xl p-6 overflow-hidden">
                    <p className="text-xs text-white/40 tracking-widest mb-2 uppercase">
                        Quick Action
                    </p>

                    <h2 className="text-xl font-semibold max-w-md">
                        Ready to transcribe your next patient consultation?
                    </h2>

                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="mt-6 flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg text-sm hover:opacity-90 transition active:scale-95"
                    >
                        <Mic size={16} />
                        Start New Session
                    </button>

                    {/* decorative blob */}
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-[#101522] rounded-xl p-5 flex justify-between items-center">
                        <div>
                            <p className="text-sm text-white/50">Total Sessions Today</p>
                            <h3 className="text-2xl font-semibold mt-1">0</h3>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg">
                            <Calendar size={18} />
                        </div>
                    </div>

                    <div className="bg-[#101522] rounded-xl p-5 flex justify-between items-center">
                        <div>
                            <p className="text-sm text-white/50">Average AI Accuracy</p>
                            <h3 className="text-2xl font-semibold mt-1">-%</h3>
                        </div>
                        <div className="bg-blue-500/10 text-blue-400 p-3 rounded-lg">
                            <Activity size={18} />
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-span-12 xl:col-span-4">
                <div className="bg-[#101522] rounded-2xl p-5 h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold">Recent Activity</h3>
                    </div>

                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                           <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white/70">No recent activity</p>
                            <p className="text-xs text-white/30 mt-1 max-w-[150px]">Your transcribed sessions will appear here.</p>
                        </div>
                    </div>
                </div>
            </div>

            <StartSessionModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
}