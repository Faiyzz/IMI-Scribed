"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Square, Pause, Play, ChevronLeft, Shield, Clock, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RecordingSessionPage() {
    const { id } = useParams();
    const router = useRouter();
    const [session, setSession] = useState<any>(null);
    const [isRecording, setIsRecording] = useState(true);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    
    // Audio visualization state
    const [audioLevels, setAudioLevels] = useState<number[]>(new Array(20).fill(10));
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchSession();
        startTimer();
        simulateAudioInput();
        return () => stopTimer();
    }, [id]);

    const fetchSession = async () => {
        try {
            const token = localStorage.getItem("auth-storage") 
                ? JSON.parse(localStorage.getItem("auth-storage")!).state.token 
                : null;

            const response = await fetch(`http://localhost:5000/api/sessions/${id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                setSession(result.data.session);
            } else {
                toast.error("Session not found");
                router.push("/dashboard");
            }
        } catch (error) {
            toast.error("Failed to load session");
        } finally {
            setIsLoading(false);
        }
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setDuration(prev => prev + 1);
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const simulateAudioInput = () => {
        if (!isRecording) return;
        const interval = setInterval(() => {
            setAudioLevels(prev => prev.map(() => Math.floor(Math.random() * 60) + 10));
        }, 150);
        return () => clearInterval(interval);
    };

    const formatDuration = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleFinish = async () => {
        stopTimer();
        setIsRecording(false);
        toast.success("Recording saved. Processing transcript...");
        
        // In a real app, we'd call an API to end the session
        router.push("/history");
    };

    if (isLoading) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-[#0B0F19] flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden">
            {/* Background Grain/Glow */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* TOP BAR */}
            <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-10">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-white/40 hover:text-white transition group bg-white/5 px-4 py-2 rounded-xl border border-white/5"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition" />
                    <span className="text-xs font-bold uppercase tracking-wider">Cancel Session</span>
                </button>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                        <Clock size={16} className="text-blue-400" />
                        <span className="text-sm font-bold font-mono text-white/90">{formatDuration(duration)}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Live Recording</span>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-2xl w-full text-center space-y-12 z-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 bg-white/5 px-6 py-2 rounded-2xl border border-white/10 mb-2">
                        <User size={18} className="text-blue-400" />
                        <span className="text-lg font-bold text-white uppercase tracking-wide">{session?.patientName}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{session?.patientGender}</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                        Listening to the conversation...
                    </h1>
                    <p className="text-white/40 text-lg max-w-lg mx-auto">
                        Speak naturally. I'm transcribing everything and identifying clinical measurements automatically.
                    </p>
                </div>

                {/* VISUALIZER */}
                <div className="flex items-end justify-center gap-1.5 h-32 sm:h-48 mb-8">
                    {audioLevels.map((level, i) => (
                        <div 
                            key={i}
                            className="w-1 sm:w-2 bg-gradient-to-t from-blue-700 via-blue-400 to-white rounded-full transition-all duration-150 ease-out"
                            style={{ height: isRecording ? `${level}%` : '5px', opacity: isRecording ? 1 : 0.2 }}
                        />
                    ))}
                </div>

                {/* CONTROLS */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <button 
                        onClick={() => setIsRecording(!isRecording)}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 border-2 active:scale-90 ${
                            isRecording 
                            ? "bg-white/5 border-white/10 text-white hover:bg-white/10" 
                            : "bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20"
                        }`}
                    >
                        {isRecording ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} />}
                    </button>

                    <button 
                        onClick={handleFinish}
                        className="group bg-white text-[#0B0F19] px-10 py-5 rounded-[2rem] font-black text-lg uppercase tracking-wider flex items-center gap-3 hover:scale-105 transition-all active:scale-95 shadow-2xl shadow-white/10"
                    >
                        <Square fill="currentColor" size={20} />
                        Finish & Transcribe
                    </button>
                </div>
            </div>

            {/* BOTTOM INFO */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 text-white/20">
                <Shield size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">End-to-End Encrypted Clinical Interface</span>
            </div>
        </div>
    );
}
