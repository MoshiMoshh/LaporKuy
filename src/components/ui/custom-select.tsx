'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, type LucideIcon } from 'lucide-react';

export interface CustomSelectOption {
  id: string;
  name: string;
  badge?: string;
}

interface CustomSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  disabledPlaceholder?: string;
  icon?: LucideIcon;
  searchable?: boolean;
  customAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function CustomSelect({
  id,
  value,
  onChange,
  options,
  placeholder = '-- Pilih --',
  disabled = false,
  disabledPlaceholder = '-- Pilih Opsi Sebelumnya --',
  icon: Icon,
  searchable = true,
  customAction,
  className = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, searchable]);

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchQuery('');
  };

  const currentPlaceholder = disabled ? disabledPlaceholder : placeholder;

  return (
    <div ref={containerRef} className={`relative w-full select-none ${className}`}>
      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all duration-200 outline-none ${
          disabled
            ? 'opacity-55 cursor-not-allowed bg-slate-100/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
            : isOpen
            ? 'bg-white dark:bg-slate-900 border-[#0057B8] dark:border-blue-500 ring-2 ring-[#0057B8]/20 dark:ring-blue-500/20 shadow-sm'
            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-slate-400 dark:hover:border-slate-600 shadow-xs active:scale-[0.99]'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          {Icon && (
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-md shrink-0 transition-colors ${
                disabled
                  ? 'bg-slate-200/60 dark:bg-slate-800 text-slate-400'
                  : selectedOption
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0057B8] dark:text-blue-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
            </div>
          )}
          <span
            className={`truncate ${
              selectedOption
                ? 'font-bold text-slate-900 dark:text-slate-100'
                : 'font-medium text-slate-400 dark:text-slate-500'
            }`}
          >
            {selectedOption ? selectedOption.name : currentPlaceholder}
          </span>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#0057B8] dark:text-blue-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl border border-slate-200/90 dark:border-slate-800 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Search Bar (if searchable & options > 4) */}
          {searchable && options.length > 4 && (
            <div className="p-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Cari wilayah..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0057B8] dark:focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5 overscroll-contain">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.id === value;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(opt.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-left transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0057B8] dark:text-blue-400 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-2">{opt.name}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-[#0057B8] dark:text-blue-400 shrink-0 ml-1.5" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-slate-400 font-medium">
                Tidak ditemukan hasil untuk &quot;{searchQuery}&quot;
              </div>
            )}

            {/* Custom Action (e.g. + Tulis Nama Kecamatan Lainnya) */}
            {customAction && (
              <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    customAction.onClick();
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#0057B8] dark:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-blue-950/50 transition-colors text-left"
                >
                  <span>{customAction.label}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
