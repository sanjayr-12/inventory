'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  label,
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-black uppercase text-[#44403c] dark:text-[#d6cec2] mb-1.5">
          {label}
        </label>
      )}

      {/* Main Select Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#fbf8f2] dark:bg-[#28231e] border rounded-2xl text-left flex items-center justify-between gap-2.5 transition-all cursor-pointer select-none shadow-2xs ${
          isOpen
            ? 'border-[#d96528] ring-2 ring-[#d96528]/20 bg-white dark:bg-[#302a24]'
            : 'border-[#e0d3c1] dark:border-[#3d3731] hover:border-[#d96528]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <div className="min-w-0 flex-1">
            {selectedOption ? (
              <div>
                <div className="font-bold text-xs sm:text-sm text-[#1c1917] dark:text-[#f5eee3] truncate">
                  {selectedOption.label}
                </div>
                {selectedOption.sublabel && (
                  <div className="text-[10px] sm:text-[11px] text-[#78716c] dark:text-[#a89f91] truncate">
                    {selectedOption.sublabel}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-xs sm:text-sm text-[#8c827a] dark:text-[#6b6257] font-medium">
                {placeholder}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {selectedOption?.badge && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#faeedf] dark:bg-[#3d2415] text-[#c45418] dark:text-[#ea7637] border border-[#eed6c0] dark:border-[#52301c]">
              {selectedOption.badge}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-[#8c827a] dark:text-[#a89f91] transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#d96528]' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#28231e] border border-[#e8dfd1] dark:border-[#3d3731] rounded-2xl shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto divide-y divide-[#f5eee3] dark:divide-[#38322b]"
          >
            {options.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#8c827a] dark:text-[#a89f91]">No options available</div>
            ) : (
              options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`p-3 sm:p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#faeedf] dark:bg-[#3d2415] text-[#c45418] dark:text-[#ea7637]'
                        : 'hover:bg-[#fbf8f2] dark:hover:bg-[#332c25] text-[#1c1917] dark:text-[#f5eee3]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <div className="min-w-0 flex-1">
                        <div className={`text-xs sm:text-sm ${isSelected ? 'font-black' : 'font-bold'} truncate`}>
                          {opt.label}
                        </div>
                        {opt.sublabel && (
                          <div className="text-[11px] text-[#78716c] dark:text-[#a89f91] truncate">
                            {opt.sublabel}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {opt.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f5eee3] dark:bg-[#383129] text-[#57534e] dark:text-[#d6cec2]">
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check className="w-4 h-4 text-[#d96528] shrink-0" />}
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
