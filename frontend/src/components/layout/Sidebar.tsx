"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    History,
    FileText,
    Settings,
    ShieldCheck,
    HelpCircle,
    Activity,
    Shield
} from "lucide-react";

const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "History", icon: History, href: "/history" },
    { name: "Templates", icon: FileText, href: "/templates" },
    { name: "Settings", icon: Settings, href: "/settings" },
    { name: "Compliance", icon: ShieldCheck, href: "/compliance" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-[280px] bg-sage-500 flex flex-col justify-between shrink-0 h-full overflow-y-auto scrollbar-hide border-r border-black/5">
            {/* TOP */}
            <div>
                <div className="p-8 border-b border-black/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sage-600 shadow-xl shadow-black/5">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">IMI Scribe</h1>
                            <p className="text-[10px] text-slate-600/60 font-black uppercase tracking-widest mt-0.5">Clinical Edition</p>
                        </div>
                    </div>
                </div>

                <nav className="p-4 mt-8 space-y-2">
                    {navItems.map((item, i) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={i}
                                href={item.href}
                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group
                                    ${isActive
                                        ? "bg-white text-sage-600 shadow-xl shadow-black/5 font-black"
                                        : "text-slate-800/60 hover:text-slate-900 hover:bg-black/5 font-bold"
                                    }`}
                            >
                                <Icon size={22} className={isActive ? "text-sage-600" : "text-slate-700/40 group-hover:text-slate-900 transition-colors"} />
                                <span className="text-sm tracking-wide">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* BOTTOM */}
            <div className="p-6 space-y-6">
                <div className="bg-black/5 border border-black/5 rounded-2xl p-4 flex items-center gap-4">
                    <div className="bg-black/5 p-2 rounded-lg">
                        <Shield size={18} className="text-slate-700" />
                    </div>
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">
                        HIPAA SECURE
                    </span>
                </div>

                <div className="space-y-4 px-2">
                    <div className="flex items-center gap-4 text-sm font-black text-slate-500 hover:text-slate-900 cursor-pointer transition uppercase tracking-widest text-[11px]">
                        <HelpCircle size={18} />
                        Support Portal
                    </div>
                    <div className="flex items-center gap-4 text-sm font-black text-slate-500 hover:text-slate-900 cursor-pointer transition uppercase tracking-widest text-[11px]">
                        <ShieldCheck size={18} />
                        Compliance Logs
                    </div>
                </div>
            </div>
        </aside>
    );
}