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
        <aside className="w-[280px] bg-[#0E1422] border-r border-white/5 flex flex-col justify-between shrink-0 h-full overflow-y-auto scrollbar-hide">
            {/* TOP */}
            <div>
                <div className="p-8 border-b border-white/5 bg-gradient-to-b from-[#111827] to-[#0E1422]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">The Sanctum</h1>
                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-0.5">v1.0.4 PRECISION</p>
                        </div>
                    </div>
                </div>

                <nav className="p-4 mt-4 space-y-1.5">
                    {navItems.map((item, i) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={i}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3 rounded-[14px] transition-all duration-300 group
                                    ${isActive
                                        ? "bg-blue-600 shadow-lg shadow-blue-600/20 text-white"
                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <Icon size={20} className={isActive ? "text-white" : "text-white/40 group-hover:text-white transition-colors"} />
                                <span className={`text-sm font-semibold tracking-wide ${isActive ? "text-white" : "text-white/60 group-hover:text-white"}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* BOTTOM */}
            <div className="p-6 space-y-6">
                <div className="bg-[#151B2B] border border-green-500/20 rounded-2xl p-4 flex items-center gap-4">
                    <div className="bg-green-500/10 p-2 rounded-lg">
                        <Shield size={18} className="text-green-500" />
                    </div>
                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">
                        HIPAA/GDPR SECURE
                    </span>
                </div>

                <div className="space-y-3 px-2">
                    <div className="flex items-center gap-3 text-sm font-semibold text-white/40 hover:text-white cursor-pointer transition">
                        <HelpCircle size={18} />
                        Support
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold text-white/40 hover:text-white cursor-pointer transition">
                        <ShieldCheck size={18} />
                        HIPAA Logs
                    </div>
                </div>
            </div>
        </aside>
    );
}