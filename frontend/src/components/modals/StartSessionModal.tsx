"use client";

import { useState } from "react";
import { X, User, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface StartSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function StartSessionModal({ isOpen, onClose }: StartSessionModalProps) {
    const [patientName, setPatientName] = useState("");
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
            const token = localStorage.getItem("auth-storage") 
                ? JSON.parse(localStorage.getItem("auth-storage")!).state.token 
                : null;

            const response = await fetch("http://localhost:5000/api/sessions", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ patientName, patientGender: gender }),
            });

            const result = await response.json();
            if (!result.success) throw new Error(result.message || "Failed to start session");

            toast.success("Session initialized");
            onClose();
            // Redirect to the recording page
            router.push(`/session/${result.data.session.id}`);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            {/* Modal */}
            <div className="relative bg-[#101522] border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white">New Clinical Session</h2>
                            <p className="text-sm text-white/40 mt-1">Enter patient details to begin recording.</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition text-white/40 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/30 uppercase tracking-[0.1em] ml-1">Patient Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={patientName}
                                    onChange={(e) => setPatientName(e.target.value)}
                                    placeholder="e.g. John Smith"
                                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 outline-none py-4 pl-12 pr-4 rounded-2xl text-white font-medium transition duration-200"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-white/30 uppercase tracking-[0.1em] ml-1">Patient Gender</label>
                            <div className="grid grid-cols-2 gap-3">
                                {["male", "female", "other", "prefer_not_to_say"].map((g) => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setGender(g as any)}
                                        className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                                            gender === g 
                                            ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20" 
                                            : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"
                                        }`}
                                    >
                                        {g.replace(/_/g, " ")}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-blue-900/10"
                            >
                                {isLoading ? "Initializing..." : "Confirm & Start Recording"}
                                {!isLoading && <ChevronRight size={18} />}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-blue-500/5 border-t border-white/5 p-4 text-center">
                    <p className="text-[10px] text-white/20 font-medium uppercase tracking-[0.1em]">
                        🔒 Secure Session • HIPAA Aligned Encryption
                    </p>
                </div>
            </div>
        </div>
    );
}
