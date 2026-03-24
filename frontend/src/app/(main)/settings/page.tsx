"use client";

import { Settings, User, Bell, Lock, Database, Globe } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("General");

    const tabs = [
        { name: "General", icon: Globe },
        { name: "Profile", icon: User },
        { name: "Notifications", icon: Bell },
        { name: "Security", icon: Lock },
        { name: "Data Storage", icon: Database },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                <p className="text-white/50 mt-2">Configure your account, preferences, and security protocols.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-2">
                    {tabs.map((item, i) => (
                        <div 
                            key={i} 
                            onClick={() => setActiveTab(item.name)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${activeTab === item.name ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-white/50 hover:bg-white/5'}`}
                        >
                            <item.icon size={18} />
                            <span className="text-sm font-medium">{item.name}</span>
                        </div>
                    ))}
                </div>

                <div className="md:col-span-3 bg-[#101522] border border-white/5 rounded-3xl p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">Theme Preferences</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition cursor-pointer">
                                    <div className="space-y-1">
                                        <span className="text-sm font-semibold block">Dark Mode</span>
                                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Enabled</span>
                                    </div>
                                    <div className="w-12 h-7 bg-blue-600 rounded-full relative shadow-inner ring-1 ring-white/10">
                                        <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 opacity-40 grayscale-[0.5]">
                                    <div className="space-y-1">
                                        <span className="text-sm font-semibold block">Auto-Sync</span>
                                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Disabled</span>
                                    </div>
                                    <div className="w-12 h-7 bg-white/10 rounded-full flex items-center px-1">
                                        <div className="w-5 h-5 bg-white/20 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">Language & Region</h3>
                            <div className="space-y-3">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group cursor-pointer hover:bg-white/[0.07] transition">
                                    <span className="text-sm font-semibold">Display Language</span>
                                    <span className="text-xs text-blue-400/80 font-bold uppercase tracking-wider group-hover:text-blue-400 transition">English (US)</span>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group cursor-pointer hover:bg-white/[0.07] transition">
                                    <span className="text-sm font-semibold">Time Zone</span>
                                    <span className="text-xs text-blue-400/80 font-bold uppercase tracking-wider group-hover:text-blue-400 transition">Auto (Detect)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                        <p className="text-xs text-white/30 font-medium italic">All changes are automatically synced with your account.</p>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-3 rounded-xl text-sm font-bold transition shadow-xl shadow-blue-600/10 active:scale-95">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
