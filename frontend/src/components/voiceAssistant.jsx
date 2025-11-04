"use client";
import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import useApi from "@/hooks/useApi";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Mic, MicOff, Send, RotateCcw, MessageSquare, Sparkles } from "lucide-react";
import { toast } from "sonner";
import TextToSpeech from "@/components/textToSpeech.jsx"

// Heartbeat ECG Animation Component
function HeartbeatAnimation() {
  return (
    <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 60"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <polyline
          fill="none"
          stroke="#4AD2CC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="400"
          strokeDashoffset="400"
          points="
            0,30
            30,30
            35,20
            40,40
            50,30
            80,30
            85,10
            90,50
            95,30
            120,30
            125,20
            135,30
            200,30
          "
        >
          <animate
            attributeName="stroke-dashoffset"
            values="400;0"
            dur="2s"
            repeatCount="indefinite"
          />
        </polyline>
      </svg>
    </div>
  );
}

const Dictaphone = () => {
    const silenceTimerRef = useRef(null);
    const prevTranscriptRef = useRef("");
    const api  = useApi();

    const [msg, setMsg] = useState('');
    const [language, setLanguage] = useState("en-US");
    const [aiResponse, setAiResponse] = useState("");
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    // Auto-stop after 4s of silence
    useEffect(() => {
        if (listening) {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

            if (transcript !== prevTranscriptRef.current) {
                prevTranscriptRef.current = transcript;

                silenceTimerRef.current = setTimeout(() => {
                    console.log("4 seconds of silence, stopping...");
                    SpeechRecognition.stopListening();
                }, 4000);
            }
        }

        return () => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };
    }, [transcript, listening]);

    if (!browserSupportsSpeechRecognition) {
        return (
            <div className="text-center text-red-600 font-medium py-8 px-4 bg-red-50 rounded-2xl border border-red-200">
                ⚠️ Browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.
            </div>
        );
    }

    const toggleListening = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            prevTranscriptRef.current = "";
            SpeechRecognition.startListening({
                continuous: true,
                language,
            });
        }
    };

    const handleSend = async () => {
        if (!transcript.trim()) return toast.error("Please say something first.");

        try {
            const { message, success, data } = await api.post("/ai/interpret", {
                transcript: transcript,
                language: language
            });

            if (success) {
                console.log("✅ AI Response:", data);
                setAiResponse(data?.response || "No response");
                toast.success(message || "AI response received", {
                    duration: 10000
                });

                    setMsg(data?.message);


            } else {
                toast.error(message || "Something went wrong while interpreting.");
            }
        } catch (err) {
            console.error("⚠️ Error sending request:", err);
            toast.error(err?.message || "Unexpected error occurred.");
        }
    };

    const handleReset = () => {
        resetTranscript();
        setAiResponse("");
        if (listening) {
            SpeechRecognition.stopListening();
        }
    };

    return (
        <div className="relative">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none rounded-3xl overflow-hidden">
                <div className="h-full w-full" style={{
                    backgroundImage: `linear-gradient(#4AD2CC 1px, transparent 1px), linear-gradient(90deg, #4AD2CC 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            <Card className="relative shadow-2xl rounded-3xl bg-white border-2 border-transparent hover:border-[#4AD2CC] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(74,210,204,0.3)] transform hover:scale-[1.02] overflow-hidden">
                {/* Heartbeat Background Animation */}
                

                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-[#4AD2CC]/5 to-[#4A90E2]/5 relative">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="relative">
                            <MessageSquare className="h-7 w-7" style={{ color: '#4AD2CC' }} />
                            <Sparkles className="h-4 w-4 absolute -top-1 -right-1 animate-pulse" style={{ color: '#4A90E2' }} />
                        </div>
                        <h3 className="text-2xl font-bold" style={{ color: '#4AD2CC' }}>
                            AI Voice Assistant
                        </h3>
                    </div>
                    <p className="text-center text-sm" style={{ color: '#333333', opacity: 0.7 }}>
                        Speak naturally to book your appointment
                    </p>
                </CardHeader>

                <CardContent className="p-6 md:p-8 space-y-6 relative">
                    {/* Language Selection & Status Row */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold" style={{ color: '#333333' }}>
                                Language:
                            </span>
                            <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger className="w-40 border-2 border-gray-200 rounded-xl h-10 focus:ring-2 focus:ring-[#4AD2CC] focus:border-[#4AD2CC] transition-all hover:border-[#4AD2CC]">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en-US" className="cursor-pointer hover:bg-[#4AD2CC]/10">English (US)</SelectItem>
                                    <SelectItem value="hi-IN" className="cursor-pointer hover:bg-[#4AD2CC]/10">Hindi (IN)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                            listening 
                                ? "bg-green-100 border-2 border-green-400 shadow-lg shadow-green-200" 
                                : "bg-gray-100 border-2 border-gray-300"
                        }`}>
                            <div className={`w-3 h-3 rounded-full ${listening ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></div>
                            <span className={`text-sm font-semibold ${listening ? "text-green-700" : "text-gray-600"}`}>
                                {listening ? "Listening..." : "Not Listening"}
                            </span>
                        </div>
                    </div>

                    {/* Microphone Button - ChatGPT Style */}
                    <div className="flex justify-center py-4">
                        <Button
                            size="icon"
                            onClick={toggleListening}
                            className={`rounded-full w-20 h-20 transition-all duration-500 transform hover:scale-110 ${
                                listening 
                                    ? "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-2xl shadow-green-300 animate-pulse" 
                                    : "bg-gradient-to-br from-[#4AD2CC] to-[#4A90E2] hover:from-[#4A90E2] hover:to-[#4AD2CC] shadow-2xl hover:shadow-[#4AD2CC]/50"
                            }`}
                        >
                            {listening ? (
                                <Mic className="w-9 h-9 text-white" />
                            ) : (
                                <MicOff className="w-9 h-9 text-white" />
                            )}
                        </Button>
                    </div>

                    {/* Transcript Display - Horizontal ChatGPT-like Bar */}
                    <div className="relative">
                        <div className="absolute -top-3 left-4 px-2 bg-white">
                            <span className="text-xs font-semibold" style={{ color: '#4AD2CC' }}>
                                Your Message
                            </span>
                        </div>
                        <div className="border-2 border-gray-200 rounded-2xl p-6 min-h-[100px] bg-gradient-to-br from-gray-50 to-white transition-all hover:border-[#4AD2CC] hover:shadow-lg">
                            {transcript ? (
                                <p className="text-base leading-relaxed" style={{ color: '#333333' }}>
                                    {transcript}
                                </p>
                            ) : (
                                <p className="text-gray-400 text-base flex items-center gap-2">
                                    <Mic className="w-5 h-5 opacity-50" />
                                    Click the microphone and start speaking...
                                </p>
                            )}
                        </div>
                    </div>

                    {/* AI Response Display */}
                    {aiResponse && (
                        <div className="relative animate-fadeIn">
                            <div className="absolute -top-3 left-4 px-2 bg-white">
                                <span className="text-xs font-semibold" style={{ color: '#4A90E2' }}>
                                    AI Response
                                </span>
                            </div>
                            <div className="border-2 rounded-2xl p-6 min-h-[100px] bg-gradient-to-br transition-all" style={{ 
                                borderColor: '#4A90E2',
                                backgroundColor: 'rgba(74, 144, 226, 0.05)'
                            }}>
                                <div className="flex items-start gap-3">
                                    <Sparkles className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#4A90E2' }} />
                                    <p className="text-base leading-relaxed" style={{ color: '#333333' }}>
                                        {aiResponse}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {msg && <TextToSpeech text={msg} language={language}/>}
                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-2">
                        <Button 
                            onClick={handleSend} 
                            disabled={!transcript.trim()}
                            className="flex-1 h-12 text-white font-semibold text-base rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            style={{ backgroundColor: '#4A90E2' }}
                        >
                            <Send className="w-5 h-5 mr-2" />
                            Send to AI
                        </Button>
                        
                        <Button 
                            onClick={handleReset}
                            variant="outline"
                            className="flex-1 h-12 font-semibold text-base rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-[#4AD2CC]"
                            style={{ color: '#4AD2CC', borderColor: '#4AD2CC' }}
                        >
                            <RotateCcw className="w-5 h-5 mr-2" />
                            Reset
                        </Button>
                    </div>

                    {/* Helper Text */}
                    <div className="text-center pt-2">
                        <p className="text-xs" style={{ color: '#333333', opacity: 0.6 }}>
                            💡 Tip: Speak clearly and naturally. The AI will automatically stop listening after 4 seconds of silence.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Dictaphone;