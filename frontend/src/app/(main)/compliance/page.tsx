"use client";

import { ShieldCheck, FileLock2, History, Scale, AlertTriangle, Download, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function CompliancePage() {
    const [metrics] = useState([
        { name: "HIPAA Protocol", status: "Active", icon: ShieldCheck, color: "text-sage-600", desc: "Patient data handled per 45 CFR Part 160 regulations." },
        { name: "Encryption", status: "AES-256", icon: FileLock2, color: "text-orange-500", desc: "Military-grade end-to-end encryption active globally." },
        { name: "Audit Trail", status: "Live", icon: History, color: "text-blue-500", desc: "Every access point is being logged in immutable records." },
    ]);

    const [checklist] = useState([
        "Automatic patient name masking enabled",
        "Encrypted transit and storage (At-Rest)",
        "Immutable session audit logs",
        "Session hijacking prevention active",
        "Role-based access control enforced"
    ]);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Security & Compliance.</h1>
                    <p className="text-slate-400 font-medium mt-3 max-w-xl leading-relaxed">
                        Continuous monitoring of system hygiene, audit logs, and global regulatory adherence protocols.
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100 shadow-sm">
                    <ShieldCheck size={20} className="text-emerald-600" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">System Certified</span>
                </div>
            </div>

            {/* METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {metrics.map((item, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 transition-all hover:shadow-xl hover:shadow-black/5 group">
                        <div className={`p-5 rounded-2xl bg-slate-50 w-fit mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500 ${item.color}`}>
                            <item.icon size={28} strokeWidth={1.5} />
                        </div>
                        <h3 className="font-black text-slate-900 text-xl tracking-tight leading-tight">{item.name}</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sage-500 mt-2">{item.status}</p>
                        <p className="text-sm text-slate-400 mt-5 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* CHECKLIST */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
                    <div className="flex items-center gap-4 mb-10 border-b border-slate-50 pb-6">
                        <div className="w-12 h-12 rounded-2xl bg-sage-50 flex items-center justify-center text-sage-600">
                             <Scale size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Privacy Protocols</h2>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-2">Active Checklist</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {checklist.map((step, i) => (
                            <div key={i} className="flex items-center gap-5 p-5 bg-slate-50/50 rounded-2xl border border-slate-50 hover:bg-white hover:shadow-md hover:border-slate-100 transition-all cursor-default group">
                                <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center border border-emerald-200 group-hover:bg-emerald-500 transition-colors duration-300">
                                    <CheckCircle2 size={14} className="text-emerald-600 group-hover:text-white" />
                                </div>
                                <span className="text-sm text-slate-600 font-bold tracking-tight">{step}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CALL TO ACTION CARD */}
                <div className="bg-sage-500 rounded-[2.5rem] p-10 flex flex-col justify-between gap-10 relative overflow-hidden group shadow-2xl shadow-sage-500/20">
                    {/* Decorative Elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:bg-white/20 transition-all duration-1000" />
                    
                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-3xl bg-white flex items-center justify-center text-sage-600 shadow-xl shadow-black/5">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white tracking-tight leading-none">Advanced Protocol</h3>
                                <p className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em] mt-2 leading-none">Enterprise Compliance</p>
                            </div>
                        </div>
                        
                        <p className="text-white/80 text-base leading-relaxed font-medium">
                            IMI Scribe is engineered to exceed strict international data privacy requirements. Our systems are constantly audited to ensure your practice remains secure and compliant with the latest medical regulations.
                        </p>
                    </div>
                    
                    <button className="w-full py-5 rounded-2xl bg-white text-sage-600 font-black text-xs uppercase tracking-widest hover:bg-sage-50 transition-all border border-transparent active:scale-[0.98] shadow-xl shadow-black/10 flex items-center justify-center gap-3 relative z-10">
                        <Download size={16} />
                        Download Security Whitepaper
                    </button>
                </div>
            </div>
        </div>
    );
}
