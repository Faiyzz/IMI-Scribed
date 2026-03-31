"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Square, Pause, Play, ChevronLeft, Shield, Clock, User, Activity } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import logger from "@/utils/logger";
import { io, Socket } from "socket.io-client";
import { getApiUrl } from "@/utils/api";

export default function RecordingSessionPage() {
    const { id } = useParams();
    const router = useRouter();
    const [session, setSession] = useState<any>(null);
    const [isRecording, setIsRecording] = useState(true);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Transcripts state
    const [transcripts, setTranscripts] = useState<string[]>([]);
    const [interimTranscript, setInterimTranscript] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const socketRef = useRef<Socket | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Audio visualization state
    const [audioLevels, setAudioLevels] = useState<number[]>(new Array(40).fill(5));
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        fetchSession();

        const socket = io(getApiUrl());
        socketRef.current = socket;

        socket.on("connect", () => {
            logger.info("🟢 Socket connected:", socket.id);
            socket.emit("start-session", { sessionId: id });
            startRecording();
            startTimer();
        });

        socket.on("transcript", (data: { text: string; isFinal: boolean }) => {
            if (data.isFinal) {
                setTranscripts(prev => [...prev, data.text]);
                setInterimTranscript("");
            } else {
                setInterimTranscript(data.text);
            }
        });

        return () => {
            cleanupSession();
        };
    }, [id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcripts, interimTranscript]);

    const cleanupSession = () => {
        stopTimer();
        if (mediaRecorderRef.current?.state !== "inactive") {
            try { mediaRecorderRef.current?.stop(); } catch (e) {}
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (socketRef.current) socketRef.current.disconnect();
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current?.state !== 'closed') audioContextRef.current?.close();
        
        setIsRecording(false);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
            });
            streamRef.current = stream;

            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 128;

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            const updateVisualizer = () => {
                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(dataArray);
                const levels = Array.from(dataArray).slice(0, 40).map(v => (v / 255) * 100);
                setAudioLevels(levels);
                animationFrameRef.current = requestAnimationFrame(updateVisualizer);
            };
            updateVisualizer();

            const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0 && socketRef.current?.connected) {
                    event.data.arrayBuffer().then(buffer => socketRef.current?.emit("audio-chunk", buffer));
                }
            };
            mediaRecorder.start(250);
            setIsRecording(true);
        } catch (error) {
            toast.error("Microphone access is required.");
        }
    };

    const fetchSession = async () => {
        try {
            const token = localStorage.getItem("auth-storage") ? JSON.parse(localStorage.getItem("auth-storage")!).state.token : null;
            const response = await fetch(`${getApiUrl()}/api/sessions/${id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) setSession(result.data.session);
        } catch (error) {
            toast.error("Failed to load session");
        } finally {
            setIsLoading(false);
        }
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => setDuration(prev => prev + 1), 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const formatDuration = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleFinish = async () => {
        cleanupSession();
        toast.success("Processing clinical summary...");
        router.push("/history");
    };

    if (isLoading) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col items-center p-4 sm:p-10 overflow-hidden font-sans">
            {/* Background Decorative Gradient */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-sage-500/10 to-transparent pointer-events-none" />

            {/* TOP HEADER */}
            <div className="w-full max-w-6xl flex justify-between items-center z-10 mb-8 px-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-all border border-slate-200 bg-white px-5 py-2.5 rounded-2xl shadow-sm hover:shadow-md group"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Abort Logic</span>
                </button>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
                        <Clock size={16} className="text-sage-500" />
                        <span className="text-sm font-black font-mono text-slate-800 tracking-tighter">{formatDuration(duration)}</span>
                    </div>
                    {isRecording && (
                        <div className="flex items-center gap-2.5 bg-sage-50 text-sage-600 px-5 py-2.5 rounded-full border border-sage-100 shadow-sm shadow-sage-500/5">
                            <div className="w-2.5 h-2.5 rounded-full bg-sage-500 animate-pulse ring-4 ring-sage-500/20" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Clinical Feed</span>
                        </div>
                    )}
                </div>
            </div>

            {/* MAIN INTERFACE */}
            <div className="w-full max-w-5xl flex-1 flex flex-col gap-10 z-10 overflow-hidden px-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                       <div className="w-16 h-16 rounded-[1.5rem] bg-sage-500 text-white flex items-center justify-center shadow-2xl shadow-sage-500/30">
                            <Activity size={32} />
                       </div>
                       <div>
                            <h2 className="text-[10px] font-black text-sage-500 uppercase tracking-[0.3em] mb-1">Active Patient Encounter</h2>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                {session?.patientName}
                                <span className="text-slate-300 font-medium">|</span>
                                <span className="text-lg text-slate-400 font-bold uppercase tracking-widest">{session?.patientGender?.charAt(0)} • {session?.patientAge}Y</span>
                            </h1>
                       </div>
                    </div>
                </div>

                {/* TRANSCRIPT CARD */}
                <div
                    ref={scrollRef}
                    className="flex-1 bg-white rounded-[3rem] border border-slate-100 p-10 overflow-y-auto custom-scrollbar shadow-2xl shadow-black/5 relative group"
                >
                    {transcripts.length === 0 && !interimTranscript && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-200 py-12 space-y-6">
                            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 group-hover:scale-110 transition-transform duration-700">
                                <Mic size={40} className="animate-pulse" strokeWidth={1.5} />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Awaiting Signal</p>
                                <p className="text-[10px] text-slate-300 font-medium italic">"System is synchronized and ready for capture..."</p>
                            </div>
                        </div>
                    )}
                    <div className="max-w-3xl mx-auto space-y-8">
                        {transcripts.map((text, i) => (
                            <div key={i} className="text-slate-800 text-2xl leading-relaxed font-bold animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {text}
                            </div>
                        ))}
                        {interimTranscript && (
                            <div className="text-slate-400 text-2xl leading-relaxed font-bold italic transition-opacity duration-300">
                                {interimTranscript}
                                <span className="inline-block w-2.5 h-8 bg-sage-500/30 ml-2 animate-pulse rounded-full align-middle" />
                            </div>
                        )}
                    </div>
                </div>

                {/* VISUALIZER & SYSTEM CONTROLS */}
                <div className="bg-white rounded-[3rem] border border-slate-100 p-10 space-y-10 shadow-2xl shadow-black/5">
                    {/* CENTERED VISUALIZER */}
                    <div className="flex items-end justify-center gap-1.5 h-20 sm:h-24 w-full px-2 max-w-2xl mx-auto">
                        {audioLevels.map((level, i) => (
                            <div
                                key={i}
                                className="flex-1 min-w-[2px] sm:min-w-[4px] bg-gradient-to-t from-sage-600 via-sage-400 to-sage-200 rounded-full transition-all duration-75 ease-out"
                                style={{
                                    height: isRecording ? `${Math.max(level, 8)}%` : '6px',
                                    opacity: isRecording ? 0.4 + (level / 120) : 0.15,
                                }}
                            />
                        ))}
                    </div>

                    {/* ACTION TRIGGERS */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                        <button
                            onClick={() => {
                                if (!mediaRecorderRef.current) return;
                                if (isRecording) {
                                    mediaRecorderRef.current.pause();
                                    setIsRecording(false);
                                } else {
                                    mediaRecorderRef.current.resume();
                                    setIsRecording(true);
                                }
                            }}
                            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 border-4 active:scale-95 group shadow-xl ${isRecording
                                ? "bg-slate-50 border-slate-100 text-slate-800 hover:bg-slate-100"
                                : "bg-sage-500 border-sage-600 text-white shadow-sage-500/40"
                                }`}
                        >
                            {isRecording ? (
                                <Pause fill="currentColor" size={32} className="group-hover:scale-110 transition-transform" />
                            ) : (
                                <Play fill="currentColor" size={32} className="group-hover:scale-110 transition-transform" />
                            )}
                        </button>

                        <button
                            onClick={handleFinish}
                            className="bg-gray-accent hover:bg-gray-accent-dark text-white px-16 py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] flex items-center gap-5 hover:scale-105 transition-all active:scale-95 shadow-2xl shadow-gray-300 group"
                        >
                            <Square fill="currentColor" size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                            Seal Clinical Record
                        </button>
                    </div>
                </div>
            </div>

            {/* COMPLIANCE FOOTER */}
            <div className="mt-10 flex items-center gap-4 text-slate-300 z-10 bg-white/50 px-6 py-2 rounded-full border border-slate-200/50 backdrop-blur-sm">
                <Shield size={16} className="text-sage-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">Precision Protocol • End-to-End HIPAA Cryptography</span>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #f1f5f9;
                    border-radius: 20px;
                    border: 2px solid white;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #e2e8f0;
                }
            `}</style>
        </div>
    );
}
