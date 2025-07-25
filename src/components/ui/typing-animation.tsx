// components/ui/typing-animation.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  text?: string;
}

export function TypingAnimation({ 
  text = "생각하는 중"
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
    <div className="flex items-center text-muted-foreground">
      <div className="flex space-x-1 mr-2">
        <div className="h-1 w-1 bg-current rounded-full animate-pulse" />
        <div className="h-1 w-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="h-1 w-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
      <span className="text-sm">
        {text}{dots}
      </span>
    </div>
  );
}