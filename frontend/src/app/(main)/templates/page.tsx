"use client";

import { FileCode, Plus, LayoutGrid, Search, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function TemplatesPage() {
    const [templates] = useState([]);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Clinical Templates.</h1>
                    <p className="text-slate-400 font-medium mt-3 max-w-xl leading-relaxed">
                        Precision-engineered documentation frameworks. Standardize your clinical terminology and session structure.
                    </p>
                </div>
                <button className="bg-gray-accent hover:bg-gray-accent-dark text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl shadow-gray-200 active:scale-95 group">
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    New Framework
                </button>
            </div>

            {templates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Template list logic here */}
                </div>
            ) : (
                <div className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center space-y-8 min-h-[500px] shadow-sm">
                    <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200 border border-slate-100">
                        <LayoutGrid size={40} strokeWidth={1} />
                    </div>
                    <div className="max-w-md space-y-3">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Vault is Empty.</h3>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            Structured templates help you maintain consistent documentation standards. Create your first clinical framework to automate your note-taking.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button className="bg-white border border-slate-200 hover:border-sage-500 hover:text-sage-600 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm">
                           Explore Library
                        </button>
                        <button className="bg-sage-500 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-sage-500/20 hover:bg-sage-600 transition-all flex items-center justify-center gap-2">
                             Build Framework
                             <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
