"use client";

import { useState } from "react";
import { X, User, ChevronRight, ChevronDown, Activity, Info } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface StartSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function StartSessionModal({ isOpen, onClose }: StartSessionModalProps) {
    const [patientName, setPatientName] = useState("");
    const [patientAge, setPatientAge] = useState("");
    const [gender, setGender] = useState<"male" | "female" | "other" | "prefer_not_to_say" | "">("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gender) {
            toast.error("Please select patient gender");
            return;
        }

        setIsLoading(true);
        try {
            const authStorage = localStorage.getItem("auth-storage");
            const token = authStorage ? JSON.parse(authStorage).state?.token : null;

            if (!token) {
                toast.error("You are not authorized. Please log in again.");
                router.push("/login");
                return;
            }

            const response = await fetch("http://localhost:5000/api/sessions", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    patientName, 
                    patientAge: parseInt(patientAge, 10),
                    patientGender: gender 
                }),
            });

            const result = await response.json();
            if (!result.success) throw new Error(result.message || "Failed to start session");

            toast.success("Session initialized");
            onClose();
            router.push(`/session/${result.data.session.id}`);
        } catch (error: any) {
            toast.error(error.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={onClose} />
            
            {/* Modal */}
            <div className="relative bg-white border border-slate-100 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-500">
                
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-sage-500/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />

                <div className="p-10">
                    <div className="flex justify-between items-start mb-10">
                        <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-sage-50 text-sage-600 rounded-2xl flex items-center justify-center shadow-sm">
                                <Activity size={24} />
                             </div>
                             <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Initialize Session.</h2>
                                <p className="text-[10px] text-sage-500 uppercase tracking-widest font-black mt-2">Clinical Documentation Protocol</p>
                             </div>
                        </div>
                        <button onClick={onClose} className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-90">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3 col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Patient Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sage-500 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        required
                                        value={patientName}
                                        onChange={(e) => setPatientName(e.target.value)}
                                        placeholder="e.g. Alexander Hamilton"
                                        className="w-full bg-slate-50 border border-slate-100 focus:border-sage-500/30 outline-none py-5 pl-14 pr-6 rounded-2xl text-slate-900 font-bold placeholder:text-slate-200 transition-all duration-300 focus:bg-white focus:shadow-lg focus:shadow-sage-500/5"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Age</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    max="150"
                                    value={patientAge}
                                    onChange={(e) => setPatientAge(e.target.value)}
                                    placeholder="Yrs"
                                    className="w-full bg-slate-50 border border-slate-100 focus:border-sage-500/30 outline-none py-5 px-6 rounded-2xl text-slate-900 font-bold placeholder:text-slate-200 transition-all duration-300 focus:bg-white focus:shadow-lg focus:shadow-sage-500/5"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Biological Gender</label>
                                <div className="relative group">
                                    <select
                                        required
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value as any)}
                                        className="w-full bg-slate-50 border border-slate-100 focus:border-sage-500/30 outline-none py-5 px-6 rounded-2xl text-slate-900 font-bold appearance-none transition-all duration-300 focus:bg-white focus:shadow-lg focus:shadow-sage-500/5 cursor-pointer"
                                        disabled={isLoading}
                                    >
                                        <option value="" disabled>Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer_not_to_say">Private</option>
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-sage-500 transition-colors" size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-sage-500 hover:bg-sage-600 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-sage-500/20 group"
                            >
                                {isLoading ? "Synchronizing..." : "Initialize Transcript Stream"}
                                {!isLoading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-slate-50 p-6 flex items-center justify-center gap-3 border-t border-slate-100">
                    <Info size={14} className="text-slate-400" />
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em]">
                        Precision Logic • End-to-End HIPAA Encryption
                    </p>
                </div>
            </div>
        </div>
    );
}
