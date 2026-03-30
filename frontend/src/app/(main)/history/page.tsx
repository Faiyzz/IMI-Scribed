"use client";

import { 
    Calendar, 
    ChevronDown, 
    Search,
    AlertCircle,
    Inbox,
    User,
    Clock,
    ChevronRight,
    Loader2,
    Filter
} from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getApiUrl } from "@/utils/api";

export default function HistoryPage() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const authStorage = localStorage.getItem("auth-storage");
            const token = authStorage ? JSON.parse(authStorage).state?.token : null;

            if (!token) return;

            const response = await fetch(`${getApiUrl()}/api/sessions`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                setSessions(result.data.sessions);
            }
        } catch (error) {
            toast.error("Failed to load session history");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredSessions = sessions.filter(session => 
        session.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const formatDuration = (sec: number) => {
        if (!sec) return "0s";
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return m > 0 ? `${m}m ${s}s` : `${s}s`;
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Clinical Records.</h1>
                    <p className="text-slate-400 font-medium mt-3 max-w-xl leading-relaxed">
                        Secure immutable archive of all clinical scribing sessions. Maintain HIPAA compliance with auditable logs.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 bg-sage-50 px-4 py-2 rounded-full border border-sage-100">
                        <div className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
                        <span className="text-[10px] font-black text-sage-600 uppercase tracking-widest">Audit Sync Active</span>
                    </div>
                </div>
            </div>

            {/* ACTION BAR */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sage-500 transition-colors" size={20} />
                    <input 
                        type="text"
                        placeholder="Search patient encounters..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-100 focus:border-sage-500/30 outline-none py-5 pl-14 pr-6 rounded-3xl text-slate-900 font-bold placeholder:text-slate-300 transition-all duration-300 shadow-sm focus:shadow-lg focus:shadow-sage-500/5"
                    />
                </div>
                <button className="bg-white border border-slate-100 flex items-center gap-3 px-8 py-5 rounded-3xl text-xs font-black text-slate-400 hover:text-sage-600 hover:bg-sage-50 transition-all duration-300 group shadow-sm">
                    <Filter size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                    ADVANCED FILTERS
                </button>
            </div>

            {/* TABLE AREA */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm min-h-[450px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-[450px]">
                        <Loader2 className="animate-spin text-sage-500" size={40} />
                    </div>
                ) : filteredSessions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50 bg-slate-50/30">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Profile</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clinical Date</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Session Time</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Duration</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Encounters</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredSessions.map((session) => (
                                    <tr key={session.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-sage-50 flex items-center justify-center text-sage-600 group-hover:bg-sage-500 group-hover:text-white transition-all duration-500 shadow-sm">
                                                    <User size={22} />
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900 tracking-tight text-lg leading-tight">{session.patientName}</div>
                                                    <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1">
                                                        {session.patientGender} • {session.patientAge}Y
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                                                <Calendar size={16} className="text-slate-300" />
                                                {formatDate(session.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3 text-slate-600 font-bold text-sm uppercase tracking-tighter">
                                                <Clock size={16} className="text-slate-300" />
                                                {formatTime(session.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="inline-flex items-center gap-2 bg-slate-50 text-slate-500 px-3 py-1 rounded-full text-xs font-black tracking-widest">
                                                {formatDuration(session.duration)}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="inline-flex items-center gap-2 bg-white hover:bg-sage-500 text-slate-400 hover:text-white px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-widest transition-all duration-300 border border-slate-100 hover:border-sage-500 shadow-sm uppercase group-hover:scale-105">
                                                View Report
                                                <ChevronRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-8 py-32 px-6 text-center">
                        <div className="w-24 h-24 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200">
                            <Inbox size={48} strokeWidth={1} />
                        </div>
                        <div className="max-w-xs space-y-3">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Vault is Empty.</h3>
                            <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                No records found matching your search parameters. Initiate a new session to populate your history.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* PRIVACY FOOTER */}
            <div className="bg-sage-50/50 border border-sage-100/50 rounded-[2rem] p-8 flex gap-6 items-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-sage-100">
                    <AlertCircle size={24} className="text-sage-500" />
                </div>
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-sage-600">Enterprise Data Protocol</h3>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed font-medium">
                        Your data is encrypted using military-grade AES-256 and is exclusively accessible to your credentialed clinician account. HIPAA compliance is maintained through immutable log-traceability.
                    </p>
                </div>
            </div>
        </div>
    );
}
