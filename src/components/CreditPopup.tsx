"use client";

import { useState, useEffect } from "react";

interface CreditPopupProps {
  onClose: () => void;
  onClaim: () => void;
}

export default function CreditPopup({ onClose, onClaim }: CreditPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleClaim = () => {
    setIsVisible(false);
    setTimeout(onClaim, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" 
        onClick={handleClose} 
      />

      <div
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Decorative top gradient */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-t-3xl" />
        
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative pt-16 pb-8 px-8">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white shadow-lg flex items-center justify-center -mt-10 border-4 border-white">
            <span className="text-4xl">🎬</span>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Get $100 in credits
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Share a quick video testimonial about your experience and receive $100 in credits as a thank you.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleClaim}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                Record my testimonial
              </button>
              <button
                onClick={handleClose}
                className="w-full py-2 text-gray-400 hover:text-gray-600 transition-colors text-sm"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
