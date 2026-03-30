"use client";

import { Settings, User, Bell, Lock, Database, Globe, ChevronRight } from "lucide-react";
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
        <div className="space-y-10 animate-in fade-in duration-700">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Settings.</h1>
                <p className="text-slate-400 font-medium mt-3 max-w-xl leading-relaxed">
                    Configure your clinical environment, account preferences, and security protocols.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* TABS */}
                <div className="space-y-2">
                    {tabs.map((item, i) => (
                        <div 
                            key={i} 
                            onClick={() => setActiveTab(item.name)}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-all duration-300 group ${
                                activeTab === item.name 
                                ? 'bg-sage-500 text-white shadow-xl shadow-sage-500/20 font-black' 
                                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900 font-bold'
                            }`}
                        >
                            <item.icon size={20} className={activeTab === item.name ? 'text-white' : 'text-slate-300 group-hover:text-sage-500 transition-colors'} />
                            <span className="text-sm tracking-wide">{item.name}</span>
                        </div>
                    ))}
                </div>

                {/* CONTENT AREA */}
                <div className="lg:col-span-3 bg-white border border-slate-100 rounded-[2.5rem] p-10 space-y-12 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        {/* THEME SECTION */}
                        <div className="space-y-8">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Environment Preferences</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-50 hover:border-sage-500/20 transition-all cursor-pointer group">
                                    <div className="space-y-1">
                                        <span className="text-sm font-black text-slate-900 block tracking-tight group-hover:text-sage-600 transition-colors">Interface Theme</span>
                                        <span className="text-[10px] text-sage-500 uppercase tracking-widest font-black">Light Mode (Default)</span>
                                    </div>
                                    <div className="w-12 h-7 bg-sage-500 rounded-full relative shadow-inner flex items-center px-1">
                                         <div className="w-5 h-5 bg-white rounded-full shadow-lg absolute right-1" />
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-50 opacity-50 grayscale cursor-not-allowed">
                                    <div className="space-y-1">
                                        <span className="text-sm font-black text-slate-900 block tracking-tight">Auto-Cloud Sync</span>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Coming Soon</span>
                                    </div>
                                    <div className="w-12 h-7 bg-slate-200 rounded-full flex items-center px-1">
                                        <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* REGION SECTION */}
                        <div className="space-y-8">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Localization</h3>
                            <div className="space-y-4">
                                <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-50 flex justify-between items-center group cursor-pointer hover:border-sage-500/20 transition-all">
                                    <span className="text-sm font-black text-slate-900 tracking-tight group-hover:text-sage-600">Language</span>
                                    <span className="text-[10px] text-sage-500 font-black uppercase tracking-widest bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-50">English (US)</span>
                                </div>
                                <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-50 flex justify-between items-center group cursor-pointer hover:border-sage-500/20 transition-all">
                                    <span className="text-sm font-black text-slate-900 tracking-tight group-hover:text-sage-600">Time Zone</span>
                                    <span className="text-[10px] text-sage-500 font-black uppercase tracking-widest bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-50">Auto-Detect</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER ACTION */}
                    <div className="pt-10 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <p className="text-xs text-slate-300 font-black uppercase tracking-[0.2em] italic">Precision Protocol Sync: 100%</p>
                        <button className="w-full sm:w-auto bg-gray-accent hover:bg-gray-accent-dark text-white px-12 py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-gray-200 active:scale-95 flex items-center justify-center gap-3">
                            Apply System Changes
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
