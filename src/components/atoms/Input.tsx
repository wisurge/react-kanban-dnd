import React, { useRef, useEffect } from 'react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  multiline?: boolean;
  rows?: number;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onBlur?: () => void;
  id?: string;
}

export function Input({ 
  value, 
  onChange, 
  placeholder, 
  autoFocus = false,
  className = '',
  multiline = false,
  rows = 3,
  onKeyDown: customOnKeyDown,
  onBlur: customOnBlur,
  id
}: InputProps) {
  // const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleBlur = () => {
    customOnBlur?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleBlur();
    }
    if (e.key === 'Escape') {
      handleBlur();
    }
    customOnKeyDown?.(e);
  };

  if (multiline) {
    return (
      <textarea
        id={id}
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${className}`}
      />
    );
  }

  return (
    <input
      id={id}
      ref={inputRef as React.RefObject<HTMLInputElement>}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    />
  );
}
