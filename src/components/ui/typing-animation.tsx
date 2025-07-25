// components/ui/typing-animation.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypingAnimationProps {
  text?: string;
  className?: string;
}

export function TypingAnimation({ 
  text = "생각하는 중",
  className 
}: TypingAnimationProps): React.ReactElement {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("flex items-center space-x-2 text-muted-foreground", className)}>
      <div className="flex space-x-1">
        <div className="h-2 w-2 bg-current rounded-full animate-pulse" />
        <div className="h-2 w-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="h-2 w-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
      <span className="text-sm">
        {text}{dots}
      </span>
    </div>
  );
}