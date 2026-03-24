"use client";

import { useState } from "react";
import { X, User, ChevronRight, ChevronDown } from "lucide-react";
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

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/30 uppercase tracking-[0.1em] ml-1">Patient Gender</label>
                            <div className="relative">
                                <select
                                    required
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value as any)}
                                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 outline-none py-4 px-4 rounded-2xl text-white font-medium appearance-none transition duration-200 cursor-pointer"
                                    disabled={isLoading}
                                >
                                    <option value="" disabled className="bg-[#101522]">Select Gender</option>
                                    <option value="male" className="bg-[#101522]">Male</option>
                                    <option value="female" className="bg-[#101522]">Female</option>
                                    <option value="other" className="bg-[#101522]">Other</option>
                                    <option value="prefer_not_to_say" className="bg-[#101522]">Prefer not to say</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={18} />
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
