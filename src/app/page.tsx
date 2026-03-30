"use client";

import { useState, useEffect } from "react";
import CreditPopup from "@/components/CreditPopup";
import TestimonialForm from "@/components/TestimonialForm";

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("testimonial-popup-seen");
    if (!seen) {
      const timer = setTimeout(() => setShowPopup(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handlePopupClose = () => {
    setShowPopup(false);
    localStorage.setItem("testimonial-popup-seen", "true");
  };

  const handlePopupClaim = () => {
    setShowPopup(false);
    localStorage.setItem("testimonial-popup-seen", "true");
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {showPopup && (
        <CreditPopup onClose={handlePopupClose} onClaim={handlePopupClaim} />
      )}

      {/* Subtle background pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:32px_32px] opacity-30" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-100/50 via-purple-50/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-50/40 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">MoveScout</span>
          </div>
          <a href="https://movescout.net" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            ← Back to site
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative max-w-3xl mx-auto px-6 pt-12 pb-16 md:pt-16 md:pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-semibold text-emerald-800">Limited time offer</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-[1.15] mb-5">
          Share your story,{" "}
          <span className="gradient-text">earn $100</span>
        </h1>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-xl mx-auto">
          Record a quick video about your experience with MoveScout. 
          We'll add <strong>$100 in ad credits</strong> to your next campaign as a thank you.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium text-gray-600">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Quick and easy
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Record or upload
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Credits in 48hrs
          </div>
        </div>
      </header>

      {/* Form Section */}
      <main id="form" className="relative max-w-3xl mx-auto px-6 pb-16">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8 md:p-10">
            <TestimonialForm />
          </div>
        </div>
      </main>

      {/* Tips */}
      <section className="relative border-t border-gray-200 bg-gray-50/80">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Tips for a great testimonial
          </h2>
          <p className="text-gray-600 mb-10">
            Don't overthink it — just share what's worked for you.
          </p>
          
          <div className="grid gap-8 md:grid-cols-3 text-left">
            <div>
              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Share real results</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Mention specific numbers if you can — leads, bookings, revenue growth.
              </p>
            </div>
            
            <div>
              <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Be yourself</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                No script needed. Talk naturally like you're telling a friend.
              </p>
            </div>
            
            <div>
              <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Good lighting</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Face a window or lamp. Avoid having bright lights behind you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} MoveScout. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-800 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-800 transition-colors">Terms</a>
            <a href="mailto:support@movescout.net" className="hover:text-gray-800 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
