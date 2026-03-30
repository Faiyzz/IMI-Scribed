"use client";

import { Mic, Calendar, Activity, ChevronRight, Clock, Star } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import Link from "next/link";
import StartSessionModal from "@/components/modals/StartSessionModal";

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="grid grid-cols-12 gap-8 animate-in fade-in duration-700">
            {/* LEFT SIDE */}
            <div className="col-span-12 xl:col-span-8 space-y-8">
                {/* HEADER */}
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Good Day, {user?.name?.split(' ')[0] || "Clinician"}.
                        </h1>
                        <div className="flex items-center gap-3 mt-3">
                            <span className="bg-sage-50 text-sage-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-sage-100">
                                ⚡ System Active
                            </span>
                            <p className="text-sm text-slate-400 font-medium tracking-tight">
                                Your clinical intelligence hub is synchronized and ready.
                            </p>
                        </div>
                    </div>
                </div>

                {/* HERO CARD (Redesigned) */}
                <div className="relative bg-sage-500 rounded-[2.5rem] p-10 overflow-hidden group shadow-2xl shadow-sage-500/20">
                    {/* Decorative Elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[100%] bg-white/10 rounded-full blur-[100px] group-hover:bg-white/20 transition-all duration-700" />
                    
                    <div className="relative z-10 max-w-lg">
                        <p className="text-[10px] text-white/50 font-black tracking-[0.4em] mb-4 uppercase">
                            Instant Capture
                        </p>
                        <h2 className="text-4xl font-black text-white leading-tight tracking-tight mb-8">
                            Experience the flow <br /> of effortless scribing.
                        </h2>

                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-3 bg-white text-sage-600 px-8 py-4 rounded-2xl text-sm font-black hover:bg-sage-50 transition-all active:scale-95 shadow-xl shadow-black/10 uppercase tracking-widest"
                        >
                            <Mic size={18} />
                            Launch New Session
                        </button>
                    </div>

                    {/* Subtle Illustration area */}
                    <div className="absolute right-12 bottom-12 opacity-20 hidden lg:block">
                        <Activity size={120} className="text-white" strokeWidth={1} />
                    </div>
                </div>

                {/* STATS SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-sage-50 text-sage-600 p-3 rounded-2xl group-hover:bg-sage-500 group-hover:text-white transition-colors duration-300">
                                <Calendar size={20} />
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Daily</span>
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Sessions</p>
                            <h3 className="text-3xl font-black text-slate-900">04</h3>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-orange-50 text-orange-500 p-3 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                                <Clock size={20} />
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Avg Time</span>
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Efficiency Ratio</p>
                            <h3 className="text-3xl font-black text-slate-900">12:45</h3>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-blue-50 text-blue-500 p-3 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                                <Star size={20} />
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">AI Score</span>
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Transcription Quality</p>
                            <h3 className="text-3xl font-black text-slate-900">98.4%</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE — RECENT ACTIVITY */}
            <div className="col-span-12 xl:col-span-4 space-y-6">
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 h-full shadow-sm">
                    <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-4">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Activity.</h3>
                        <Link href="/history" className="text-xs font-black text-sage-600 hover:text-sage-700 flex items-center gap-1 uppercase tracking-widest transition-colors">
                            View All <ChevronRight size={14} />
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {/* Empty state placeholder but with premium design */}
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200 border border-slate-100">
                               <Activity size={32} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Active History</p>
                                <p className="text-xs text-slate-300 font-medium max-w-[200px] leading-relaxed mx-auto italic">
                                    "Your transcribed clinical sessions will generate sophisticated records here."
                                </p>
                            </div>
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