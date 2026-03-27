"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Square, Pause, Play, ChevronLeft, Shield, Clock, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import logger from "@/utils/logger";
import { io, Socket } from "socket.io-client";

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
    const [audioLevels, setAudioLevels] = useState<number[]>(new Array(30).fill(5));
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        fetchSession();

        // 👇 INITIALIZE SOCKET & START SESSION
        const socket = io("http://localhost:5000");
        socketRef.current = socket;

        socket.on("connect", () => {
            logger.info("🟢 Socket connected:", socket.id);

            socket.emit("start-session", { sessionId: id });

            startRecording();
            startTimer();
        });

        socket.on("disconnect", () => {
            logger.info("🔴 Socket disconnected");
        });

        socket.on("transcript", (data: { text: string; isFinal: boolean }) => {
            if (data.isFinal) {
                setTranscripts(prev => [...prev, data.text]);
                setInterimTranscript("");
            } else {
                setInterimTranscript(data.text);
            }
        });

        socket.on("error", (err) => {
            logger.error("Socket error", err);
        });

        return () => {
            cleanupSession();
        };
    }, [id]);

    useEffect(() => {
        // Auto-scroll to bottom of transcripts
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcripts, interimTranscript]);

    const cleanupSession = () => {
        logger.info("🧹 Cleaning up session resources...");
        stopTimer();

        // 👇 STOP RECORDER
        if (mediaRecorderRef.current) {
            if (mediaRecorderRef.current.state !== "inactive") {
                try {
                    mediaRecorderRef.current.stop();
                } catch (e) {
                    logger.error("Error stopping media recorder", e);
                }
            }
            mediaRecorderRef.current = null;
        }

        // 👇 STOP STREAM TRACKS (CRITICAL FOR MIC LED)
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => {
                track.stop();
                logger.info(`Track stopped: ${track.kind} - ${track.label}`);
            });
            streamRef.current = null;
        }

        // 👇 DISCONNECT SOCKET
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }

        // 👇 CLEANUP VISUALIZER
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        if (audioContextRef.current) {
            if (audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(err => logger.error("Error closing AudioContext", err));
            }
            audioContextRef.current = null;
        }

        setIsRecording(false);
    };

    const startRecording = async () => {
        if (streamRef.current || mediaRecorderRef.current) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });

            streamRef.current = stream;

            // Setup Web Audio API for visualization
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 64;

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            const updateVisualizer = () => {
                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(dataArray);

                // Map frequency data to audio levels
                const levels = Array.from(dataArray).slice(0, 30).map(v => (v / 255) * 100);
                setAudioLevels(levels);

                animationFrameRef.current = requestAnimationFrame(updateVisualizer);
            };
            updateVisualizer();

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: "audio/webm;codecs=opus",
            });
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.onstart = () => {
                logger.info("🎤 Recording started");
                setIsRecording(true);
            };

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0 && socketRef.current?.connected) {
                    event.data.arrayBuffer().then((buffer) => {
                        socketRef.current?.emit("audio-chunk", buffer);
                    });
                }
            };

            mediaRecorder.onerror = (err) => {
                logger.error("Recorder error", err);
                toast.error("Recording error occurred.");
            };

            mediaRecorder.start(250); // 250ms chunks for real-time feel
        } catch (error) {
            logger.error("Mic access denied", error);
            toast.error("Microphone access is required for real-time transcription.");
        }
    };

    const stopRecording = () => {
        cleanupSession();
        logger.info("🛑 Recording stopped via stopRecording");
    };

    // Removed separate socket useEffect as it's now combined with session effect

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
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const formatDuration = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleFinish = async () => {
        cleanupSession();
        toast.success("Recording saved. Processing transcript...");
        router.push("/history");
    };

    if (isLoading) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-[#0B0F19] flex flex-col items-center p-6 sm:p-12 overflow-hidden">
            {/* Background Grain/Glow */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* TOP BAR */}
            <div className="w-full max-w-5xl flex justify-between items-center z-10 mb-12">
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
                    {isRecording && (
                        <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Live Recording</span>
                        </div>
                    )}
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-4xl w-full flex-1 flex flex-col gap-8 z-10 overflow-hidden">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-3 bg-white/5 px-6 py-2 rounded-2xl border border-white/10 mb-2">
                        <User size={18} className="text-blue-400" />
                        <span className="text-lg font-bold text-white uppercase tracking-wide">{session?.patientName}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{session?.patientGender}</span>
                    </div>
                    <h1 className="text-4xl font-black text-white leading-tight">
                        Real-time Transcription
                    </h1>
                </div>

                {/* TRANSCRIPT AREA */}
                <div
                    ref={scrollRef}
                    className="flex-1 bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-8 overflow-y-auto custom-scrollbar relative"
                >
                    <div className="space-y-6">
                        {transcripts.length === 0 && !interimTranscript && (
                            <div className="flex flex-col items-center justify-center h-full text-white/20 py-12 space-y-4">
                                <Mic size={48} className="animate-pulse" />
                                <p className="font-medium">Waiting for speech...</p>
                            </div>
                        )}
                        {transcripts.map((text, i) => (
                            <div key={i} className="text-white/80 text-xl leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {text}
                            </div>
                        ))}
                        {interimTranscript && (
                            <div className="text-white/30 text-xl leading-relaxed font-medium italic">
                                {interimTranscript}
                                <span className="inline-block w-1.5 h-5 bg-blue-500/40 ml-1 animate-pulse" />
                            </div>
                        )}
                    </div>
                </div>

                {/* VISUALIZER & CONTROLS CONTAINER */}
                <div className="bg-white/5 rounded-[3rem] border border-white/10 p-8 space-y-8">
                    {/* VISUALIZER */}
                    <div className="flex items-end justify-center gap-1 h-16 sm:h-24 px-4">
                        {audioLevels.map((level, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-blue-700 via-blue-400 to-white rounded-full transition-all duration-75 ease-out"
                                style={{
                                    height: isRecording ? `${Math.max(level, 10)}%` : '4px',
                                    opacity: isRecording ? 0.3 + (level / 150) : 0.1,
                                    maxWidth: '8px'
                                }}
                            />
                        ))}
                    </div>

                    {/* CONTROLS */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
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
                            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 border-2 active:scale-90 ${isRecording
                                ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                                : "bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20"
                                }`}
                        >
                            {isRecording ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} />}
                        </button>

                        <button
                            onClick={handleFinish}
                            className="group bg-white text-[#0B0F19] px-12 py-5 rounded-[2rem] font-black text-xl uppercase tracking-wider flex items-center gap-4 hover:scale-105 transition-all active:scale-95 shadow-2xl shadow-white/10"
                        >
                            <Square fill="currentColor" size={22} />
                            Finish Session
                        </button>
                    </div>
                </div>
            </div>

            {/* BOTTOM INFO */}
            <div className="mt-8 flex items-center gap-3 text-white/20 z-10">
                <Shield size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Clinical Precision • Data Privacy Secured</span>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}
