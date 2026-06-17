"use client";

import { useEffect, useState } from 'react';

export function NewFeaturePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if already shown in this session
    const hasShown = sessionStorage.getItem('featurePopupShown');
    
    if (!hasShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('featurePopupShown', 'true');
      }, 8000); // 8 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const handleTryItNow = () => {
    setIsOpen(false);
    // Smooth scroll to the ingredient discovery section
    setTimeout(() => {
      document.getElementById('ingredient-discovery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md rounded-[2rem] bg-white p-8 shadow-[0_24px_50px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
      >
        <button 
          onClick={handleClose}
          className="absolute right-6 top-6 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          aria-label="Close popup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>

        <div className="space-y-4">
          <div className="inline-flex items-center justify-center rounded-full bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            New
          </div>
          
          <div className="space-y-2">
            <h2 id="popup-title" className="text-2xl font-semibold tracking-[-0.03em] text-[var(--text)]">
              New Feature Available
            </h2>
            <p className="text-base font-medium text-[var(--text)] leading-tight">
              Tell us what ingredients you have and discover recipes you can make instantly.
            </p>
          </div>

          <p className="text-sm leading-relaxed text-[var(--muted)]">
            Find complete recipes or see what extra ingredients you need to cook something delicious.
          </p>

          <div className="pt-4 flex flex-col gap-3 sm:flex-row">
            <button 
              onClick={handleTryItNow}
              className="flex-1 rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-medium text-white shadow-[0_14px_26px_rgba(217,119,6,0.18)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(217,119,6,0.24)] text-center"
            >
              Try It Now
            </button>
            <button 
              onClick={handleClose}
              className="flex-1 rounded-full bg-[var(--surface)] px-6 py-3.5 text-sm font-medium text-[var(--text)] shadow-[0_10px_20px_rgba(31,31,31,0.05)] transition hover:-translate-y-0.5 text-center"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
