import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function SearchInput({ placeholder = 'Search...', value: controlledValue, onChange, onSearch, className = '' }) {
  const [value, setValue] = useState(controlledValue ?? '');
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (controlledValue !== undefined) setValue(controlledValue);
  }, [controlledValue]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = wrapperRef.current;
    if (!el || prefersReduced) return;

    const inputEl = inputRef.current;
    const onFocus = () => gsap.to(el, { boxShadow: '0 6px 20px rgba(0,0,0,0.08)', scale: 1.01, duration: 0.18, ease: 'power1.out' });
    const onBlur = () => gsap.to(el, { boxShadow: '0 1px 4px rgba(0,0,0,0.04)', scale: 1, duration: 0.28, ease: 'power2.out' });

    inputEl?.addEventListener('focus', onFocus);
    inputEl?.addEventListener('blur', onBlur);

    return () => {
      inputEl?.removeEventListener('focus', onFocus);
      inputEl?.removeEventListener('blur', onBlur);
    };
  }, []);

  const handleChange = (e) => {
    const v = e.target.value;
    if (controlledValue === undefined) setValue(v);
    onChange?.(v);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch?.(value);
    }
  };

  const clear = () => {
    setValue('');
    onChange?.('');
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className={cn('relative w-full', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full pl-10 pr-10 py-2 bg-white/90 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-shadow shadow-sm"
      />
      {value && (
        <button onClick={clear} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black p-1">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
