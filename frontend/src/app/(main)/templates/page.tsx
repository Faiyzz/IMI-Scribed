"use client";

import { FileCode, Plus, LayoutGrid } from "lucide-react";
import { useState } from "react";

export default function TemplatesPage() {
    const [templates] = useState([]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Clinical Templates</h1>
                    <p className="text-white/50 mt-2">Manage and customize documentation templates for different session types.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95">
                    <Plus size={18} />
                    New Template
                </button>
            </div>

            {templates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Template list logic here */}
                </div>
            ) : (
                <div className="bg-[#101522]/50 border-2 border-dashed border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
                        <LayoutGrid size={32} strokeWidth={1.5} />
                    </div>
                    <div className="max-w-md space-y-2">
                        <h3 className="text-xl font-semibold text-white/90">Template Library Empty</h3>
                        <p className="text-sm text-white/40 leading-relaxed">
                            Structured templates help you maintain consistent documentation standards. Start by creating a template or duplicating a pre-set clinical framework.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-2 rounded-xl text-sm font-bold transition">
                           Browse Examples
                        </button>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition">
                            Create First Template
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
