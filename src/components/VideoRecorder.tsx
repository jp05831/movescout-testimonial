"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import GoogleDrivePicker from "./GoogleDrivePicker";

interface VideoRecorderProps {
  onVideoReady: (file: File) => void;
  onClear: () => void;
  videoFile: File | null;
}

export default function VideoRecorder({ onVideoReady, onClear, videoFile }: VideoRecorderProps) {
  const [mode, setMode] = useState<"select" | "record" | "drive" | "preview">("select");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach(track => track.stop());
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stream, previewUrl]);

  useEffect(() => {
    if (videoFile && mode !== "preview") {
      const url = URL.createObjectURL(videoFile);
      setPreviewUrl(url);
      setMode("preview");
    }
  }, [videoFile, mode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setMode("record");
    } catch {
      alert("Could not access camera. Please check your permissions.");
    }
  };

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
    if (videoRef.current) videoRef.current.srcObject = null;
  }, [stream]);

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9") 
        ? "video/webm;codecs=vp9" 
        : "video/webm",
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const file = new File([blob], `testimonial-${Date.now()}.webm`, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      onVideoReady(file);
      stopCamera();
      setMode("preview");
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        alert("Please select a video file.");
        return;
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onVideoReady(file);
      setMode("preview");
    }
  };

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    stopCamera();
    onClear();
    setMode("select");
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (mode === "select") {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Video testimonial <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={startCamera}
            className="group relative flex flex-col items-center justify-center gap-2 py-6 px-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-3.5 h-3.5 rounded-full bg-red-500" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900 text-sm">Record</p>
              <p className="text-xs text-gray-500">Use camera</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex flex-col items-center justify-center gap-2 py-6 px-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900 text-sm">Upload</p>
              <p className="text-xs text-gray-500">From device</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMode("drive")}
            className="group relative flex flex-col items-center justify-center gap-2 py-6 px-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#FBBC04" d="M7.71 3.5L1.15 15l2.86 4.95 6.56-11.35z" />
                <path fill="#34A853" d="M14.29 3.5H7.71l6.56 11.35h6.58z" />
                <path fill="#4285F4" d="M1.15 15l2.86 4.95h13.98l2.86-4.95z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900 text-sm">Drive</p>
              <p className="text-xs text-gray-500">Google Drive</p>
            </div>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    );
  }

  if (mode === "drive") {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-gray-900">
            Import from Google Drive
          </label>
          <button
            type="button"
            onClick={() => setMode("select")}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
          <GoogleDrivePicker
            onFilePicked={(file) => {
              const url = URL.createObjectURL(file);
              setPreviewUrl(url);
              onVideoReady(file);
              setMode("preview");
            }}
            onCancel={() => setMode("select")}
            onError={(err) => {
              alert(err);
              setMode("select");
            }}
          />
        </div>
      </div>
    );
  }

  if (mode === "record") {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Recording
        </label>
        <div className="relative rounded-xl overflow-hidden bg-gray-900 shadow-lg">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full aspect-video object-cover"
          />
          
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              {formatTime(recordingTime)}
            </div>
          )}

          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => { stopCamera(); setMode("select"); }}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="w-16 h-16 flex items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-white" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="w-16 h-16 flex items-center justify-center rounded-full bg-red-500 text-white shadow-lg animate-pulse-record"
                >
                  <div className="w-6 h-6 rounded bg-white" />
                </button>
              )}
              
              <div className="w-11" />
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-3 text-center">
          {isRecording ? "Tap the stop button when you're done" : "Tap the red button to start recording"}
        </p>
      </div>
    );
  }

  if (mode === "preview" && previewUrl) {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-gray-900">
            Your video
          </label>
          <button
            type="button"
            onClick={handleClear}
            className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
        <div className="rounded-xl overflow-hidden bg-gray-900 shadow-lg">
          <video
            src={previewUrl}
            controls
            className="w-full aspect-video object-cover"
          />
        </div>
        <div className="flex items-center gap-2 mt-3 text-sm font-medium text-emerald-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Video ready to submit
        </div>
      </div>
    );
  }

  return null;
}
