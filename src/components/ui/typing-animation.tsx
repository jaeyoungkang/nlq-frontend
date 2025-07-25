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
    <div className="typing-indicator">
      <div className="typing-dots">
        <span />
        <span />
        <span />
      </div>
      <span className="text-sm">
        {text}{dots}
      </span>
    </div>
  );
}