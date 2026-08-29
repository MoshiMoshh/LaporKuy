'use client';

import { X, UserCircle2 } from 'lucide-react';
import { Button } from './button';

interface GoogleAuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: () => void;
}

export function GoogleAuthPopup({ isOpen, onClose, onSelectAccount }: GoogleAuthPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-[#202124] text-white w-full max-w-[400px] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        style={{ fontFamily: '"Google Sans", Roboto, Arial, sans-serif' }}
      >
        {/* Header */}
        <div className="px-6 pt-8 pb-4 flex flex-col items-center border-b border-[#3c4043]/40">
          <svg viewBox="0 0 24 24" className="w-8 h-8 mb-4">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <h1 className="text-xl font-medium tracking-wide">Sign in with Google</h1>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-normal mb-1">Choose an account</h2>
            <p className="text-sm text-[#9aa0a6]">
              to continue to <span className="font-medium text-[#8ab4f8]">LaporKuy</span>
            </p>
          </div>

          <div className="space-y-1">
            {/* Account Option */}
            <button 
              onClick={onSelectAccount}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-full hover:bg-[#3c4043] transition-colors text-left group border border-transparent hover:border-[#5f6368]"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white text-lg font-medium shrink-0">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate group-hover:text-[#e8eaed]">Andi Warga</p>
                <p className="text-[13px] text-[#9aa0a6] truncate group-hover:text-[#bdc1c6]">andi.warga@gmail.com</p>
              </div>
            </button>

            <div className="border-t border-[#3c4043] my-2"></div>

            {/* Use another account Option */}
            <button 
              onClick={onSelectAccount}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-full hover:bg-[#3c4043] transition-colors text-left group"
            >
              <div className="w-9 h-9 flex items-center justify-center text-[#9aa0a6] shrink-0">
                <UserCircle2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white group-hover:text-[#e8eaed]">Use another account</p>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between text-xs text-[#9aa0a6] border-t border-[#3c4043]/40 bg-[#1a1b1e]">
          <select className="bg-transparent border-none outline-none cursor-pointer appearance-none">
            <option>English (United States)</option>
            <option>Bahasa Indonesia</option>
          </select>
          <div className="flex gap-4">
            <button className="hover:text-white transition-colors" onClick={onClose}>Cancel</button>
            <button className="hover:text-white transition-colors">Help</button>
            <button className="hover:text-white transition-colors">Privacy</button>
            <button className="hover:text-white transition-colors">Terms</button>
          </div>
        </div>
      </div>
    </div>
  );
}
