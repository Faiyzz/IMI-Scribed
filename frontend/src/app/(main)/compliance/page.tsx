"use client";

import { ShieldCheck, FileLock2, History, Scale, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function CompliancePage() {
    // Current security metrics (could later be fetched from backend)
    const [metrics] = useState([
        { name: "HIPAA Protocol", status: "Active", icon: ShieldCheck, color: "text-blue-400", desc: "Patient data handled per 45 CFR Part 160." },
        { name: "Encryption", status: "AES-256", icon: FileLock2, color: "text-green-400", desc: "Military-grade end-to-end encryption active." },
        { name: "Audit Trail", status: "Live", icon: History, color: "text-purple-400", desc: "Every access point is being logged in real-time." },
    ]);

    const [checklist] = useState([
        "Automatic patient name masking enabled",
        "Encrypted transit and storage (At-Rest)",
        "Immutable session audit logs",
        "Session hijacking prevention active",
        "Role-based access control enforced"
    ]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Compliance & Privacy</h1>
                    <p className="text-white/50 mt-2">Monitor system hygiene, audit logs, and regulatory adherence.</p>
                </div>
                <div className="flex items-center gap-3 bg-green-500/10 px-6 py-3 rounded-2xl border border-green-500/20 shadow-lg shadow-green-500/5">
                    <ShieldCheck size={20} className="text-green-500" />
                    <span className="text-xs font-black text-green-400 uppercase tracking-[0.1em]">Fully Compliant</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metrics.map((item, i) => (
                    <div key={i} className="bg-[#101522] border border-white/5 rounded-3xl p-6 transition hover:border-white/10 group">
                        <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-6 transition group-hover:scale-110 duration-500 ${item.color}`}>
                            <item.icon size={26} />
                        </div>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-xs font-black uppercase tracking-widest text-blue-400/80 mt-1">{item.status}</p>
                        <p className="text-sm text-white/30 mt-4 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="bg-[#101522] border border-white/5 rounded-3xl p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                             <Scale size={20} />
                        </div>
                        <h2 className="text-xl font-bold">Privacy Protocol Checklist</h2>
                    </div>

                    <div className="space-y-3">
                        {checklist.map((step, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/[0.08] transition cursor-default">
                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/20">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                </div>
                                <span className="text-sm text-white/60 font-medium">{step}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-blue-600/10 border border-blue-500/20 rounded-3xl p-8 flex flex-col justify-center gap-6 relative overflow-hidden group">
                     {/* Decorative pattern */}
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] group-hover:bg-blue-500/10 transition duration-1000" />
                    
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Standard of Excellence</h3>
                            <p className="text-sm text-blue-400/70 font-medium mt-0.5">Automated Clinical Documentation Protection</p>
                        </div>
                    </div>
                    
                    <p className="text-white/60 text-sm leading-relaxed relative z-10 font-medium">
                        IMI Scribe is engineered to exceed the strict requirements of data privacy laws. Our systems are constantly scanned and audited to ensure your practice remains beyond reproach.
                    </p>
                    
                    <button className="w-full py-4 rounded-2xl bg-white text-blue-600 font-bold text-sm tracking-wide hover:bg-white/90 transition shadow-xl shadow-blue-900/10 relative z-10 active:scale-95">
                        Download Security Whitepaper
                    </button>
                </div>
            </div>
        </div>
    );
}
