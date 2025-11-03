"use client";
import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import useApi from "@/hooks/useApi";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Mic, MicOff, Send } from "lucide-react";
import { toast } from "sonner";

const Dictaphone = () => {
    const silenceTimerRef = useRef(null);
    const prevTranscriptRef = useRef("");
    const api  = useApi();

    const [language, setLanguage] = useState("en-US"); // 🌐 default English
    const [aiResponse, setAiResponse] = useState("");
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    // 🕒 Auto-stop after 4s of silence
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
            <div className="text-center text-red-600 font-medium mt-6">
                Browser doesn’t support speech recognition.
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
            const { message, success, data } = await api.post("/api/interpret", {
                transcript: transcript,
            });

            if (success) {
                console.log("✅ AI Response:", data);
                setAiResponse(data?.response || "No response");
                toast.success(message || "AI response received");
            } else {
                toast.error(message || "Something went wrong while interpreting.");
            }
        } catch (err) {
            console.error("⚠️ Error sending request:", err);
            toast.error(err?.message || "Unexpected error occurred.");
        }
    };

    return (
        <div className="flex justify-center mt-10">
            <Card className="w-full max-w-md shadow-xl border border-border/40">
                <CardHeader className="text-center">
                    <h2 className="text-xl font-semibold">Voice to Text AI Assistant</h2>
                    <p className="text-sm text-muted-foreground">
                        {listening ? (
                            <span className="text-green-600">🎤 Listening...</span>
                        ) : (
                            <span className="text-red-500">🔇 Not Listening</span>
                        )}
                    </p>
                </CardHeader>

                <CardContent className="flex flex-col gap-4 items-center">

                    <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en-US">English (US)</SelectItem>
                            <SelectItem value="hi-IN">Hindi (IN)</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        size="icon"
                        onClick={toggleListening}
                        className={`rounded-full w-14 h-14 ${
                            listening ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/80"
                        }`}
                    >
                        {listening ? (
                            <MicOff className="w-6 h-6 text-white" />
                        ) : (
                            <Mic className="w-6 h-6 text-white" />
                        )}
                    </Button>

                    <div className="w-full border rounded-lg p-3 bg-muted text-sm min-h-[70px] whitespace-pre-wrap">
                        {transcript || "🎙️ Start speaking..."}
                    </div>

                    {aiResponse && (
                        <div className="w-full border rounded-lg p-3 bg-secondary/30 text-sm min-h-[70px] whitespace-pre-wrap">
                            <strong>AI:</strong> {aiResponse}
                        </div>
                    )}
                    <div className="flex justify-center gap-3 mt-2">
                        <Button onClick={handleSend} disabled={!transcript.trim()}>
                            <Send className="w-4 h-4 mr-2" /> Send
                        </Button>
                        <Button onClick={() => { resetTranscript(); setAiResponse(""); }} variant="outline">
                            Reset
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dictaphone;
