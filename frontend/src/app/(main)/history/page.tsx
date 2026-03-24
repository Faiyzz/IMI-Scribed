"use client";

import { 
    Calendar, 
    ChevronDown, 
    Briefcase, 
    Shield, 
    Search,
    FileText,
    AlertCircle,
    Inbox
} from "lucide-react";
import { useState } from "react";

export default function HistoryPage() {
    const [sessions] = useState([]);

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Patient History & Records</h1>
                    <p className="text-white/50 mt-2">
                        Review and manage past clinical sessions with precision and security.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-xs font-medium text-white/70 uppercase tracking-wider">Audit Log Ready</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                        <Shield size={14} className="text-blue-400" />
                        <span className="text-xs font-medium text-white/70 uppercase tracking-wider">HIPAA Compliant</span>
                    </div>
                </div>
            </div>

            {/* FILTERS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 opacity-50 pointer-events-none grayscale">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">Date Range</label>
                    <div className="bg-[#101522] border border-white/5 rounded-xl p-3 flex items-center justify-between">
                        <span className="text-sm font-medium">Last 30 Days</span>
                        <Calendar size={16} className="text-white/40" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">Clinician</label>
                    <div className="bg-[#101522] border border-white/5 rounded-xl p-3 flex items-center justify-between">
                        <span className="text-sm font-medium">All Clinicians</span>
                        <ChevronDown size={16} className="text-white/40" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">Department</label>
                    <div className="bg-[#101522] border border-white/5 rounded-xl p-3 flex items-center justify-between">
                        <span className="text-sm font-medium">All Departments</span>
                        <Briefcase size={16} className="text-white/40" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">Session Status</label>
                    <div className="bg-[#101522] border border-white/5 rounded-xl p-1 flex">
                        <button className="flex-1 text-xs font-medium py-2 rounded-lg bg-blue-600 text-white transition">All</button>
                        <button className="flex-1 text-xs font-medium py-2 rounded-lg text-white/50 transition">Verified</button>
                        <button className="flex-1 text-xs font-medium py-2 rounded-lg text-white/50 transition">Pending</button>
                    </div>
                </div>
            </div>

            {/* TABLE / EMPTY STATE */}
            <div className="bg-[#101522]/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm min-h-[400px] flex flex-col items-center justify-center">
                {sessions.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                        {/* Table header and body logic here when real data arrives */}
                    </table>
                ) : (
                    <div className="flex flex-col items-center gap-6 py-20 px-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/10 ring-1 ring-white/10">
                            <Inbox size={40} strokeWidth={1} />
                        </div>
                        <div className="max-w-xs space-y-2">
                            <h3 className="text-lg font-semibold text-white/90">No historical data found</h3>
                            <p className="text-sm text-white/40 leading-relaxed">
                                Once you start transcribing clinical encounters, your history and detailed session reports will be securely stored here.
                            </p>
                        </div>
                        <button className="mt-4 bg-white/5 border border-white/10 px-6 py-2.5 rounded-xl text-sm font-bold text-white/70 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition duration-300">
                             Start Your First Session
                        </button>
                    </div>
                )}
            </div>

            {/* PRIVACY FOOTER */}
            <div className="bg-[#101522]/30 border border-white/5 rounded-2xl p-6 flex gap-4 items-start">
                <div className="bg-blue-400/10 p-2 rounded-lg">
                    <AlertCircle size={18} className="text-blue-400" />
                </div>
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Privacy Protocol Active</h3>
                    <p className="text-sm text-white/40 mt-1 leading-relaxed">
                        Data access is strictly controlled. Auditable privacy protocols are automatically enforced on every record to maintain <span className="text-blue-400/80 hover:text-blue-400 cursor-pointer underline underline-offset-4 font-medium transition cursor-help">Clinical Privacy Framework Compliance</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}
