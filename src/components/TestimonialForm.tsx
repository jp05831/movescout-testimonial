"use client";

import { useState } from "react";
import VideoRecorder from "./VideoRecorder";

interface FormData {
  businessName: string;
  contactName: string;
  email: string;
  videoFile: File | null;
}

export default function TestimonialForm() {
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    contactName: "",
    email: "",
    videoFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleVideoReady = (file: File) => {
    setFormData(prev => ({ ...prev, videoFile: file }));
    setError(null);
  };

  const handleVideoClear = () => {
    setFormData(prev => ({ ...prev, videoFile: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.businessName.trim()) {
      setError("Please enter your business name.");
      return;
    }
    if (!formData.videoFile) {
      setError("Please record or upload a video.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Upload video to Vercel Blob
      setUploadProgress("Uploading video...");
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const safeName = formData.businessName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50);
      const extension = formData.videoFile.name.split(".").pop() || "webm";
      const filename = `${safeName}_${timestamp}.${extension}`;

      const uploadResponse = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
        method: "POST",
        body: formData.videoFile,
      });

      if (!uploadResponse.ok) throw new Error("Failed to upload video");
      
      const blob = await uploadResponse.json();
      
      // Step 2: Submit form with video URL
      setUploadProgress("Finalizing...");
      
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: formData.businessName,
          contactName: formData.contactName,
          email: formData.email,
          videoUrl: blob.url,
          videoFilename: filename,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit");
      setIsSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Thank you!</h2>
        <p className="text-gray-600 leading-relaxed">
          We've received your testimonial. Your <strong>$100 credit</strong><br />will be added within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-5 mb-8">
        <div>
          <label htmlFor="businessName" className="block text-sm font-semibold text-gray-900 mb-1.5">
            Business name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            placeholder="Your Moving Company"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactName" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Your name
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleInputChange}
              placeholder="John Smith"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <VideoRecorder
          onVideoReady={handleVideoReady}
          onClear={handleVideoClear}
          videoFile={formData.videoFile}
        />
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 text-red-600 text-sm font-medium">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gray-900 text-white font-semibold py-4 px-6 rounded-xl hover:bg-gray-800 focus:ring-4 focus:ring-gray-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {uploadProgress || "Submitting..."}
          </span>
        ) : (
          "Submit testimonial"
        )}
      </button>

      <p className="text-center text-xs text-gray-500 mt-4">
        By submitting, you agree that MoveScout may use your testimonial for marketing purposes.
      </p>
    </form>
  );
}
