import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', padding = 'md', style }, ref) => {
    const paddingClasses = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    return (
      <div 
        ref={ref}
        style={style}
        className={`bg-white rounded-lg shadow-sm border border-gray-200 ${paddingClasses[padding]} ${className}`}
      >
        {children}
      </div>
    );
  }
);
