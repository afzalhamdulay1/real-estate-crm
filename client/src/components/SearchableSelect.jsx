import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

const SearchableSelect = ({ options, value, onChange, placeholder = "Select an option...", searchPlaceholder = "Search...", icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);
  
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <button
        type="button"
        className="w-full bg-[#1a1a1a] hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-xl py-2 px-4 text-white outline-none transition-all focus:ring-2 focus:ring-primary/30 flex items-center justify-between group h-9"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setSearchTerm('');
        }}
      >
        <div className="flex items-center gap-2 overflow-hidden w-[90%]">
          {icon && <span className="opacity-70 shrink-0">{icon}</span>}
          <span className="text-xs truncate font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animation-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-white/5 bg-black/20">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 w-3.5 h-3.5 text-white/30" />
              <input
                type="text"
                className="w-full bg-white/5 border border-transparent rounded-lg py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>
          
          <div className="max-h-56 overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-0.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                    value === option.value 
                      ? 'bg-primary/20 text-primary font-bold' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <span className="truncate">{option.label}</span>
                  {value === option.value && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-xs text-white/30 font-medium">
                No matches found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
