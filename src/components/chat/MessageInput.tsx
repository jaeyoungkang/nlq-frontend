// components/chat/MessageInput.tsx
'use client';

import React, { useState, useRef, useCallback, KeyboardEvent, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({ 
  onSendMessage, 
  disabled = false 
}: MessageInputProps): React.ReactElement {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { state } = useApp();

  const maxLength = 2000;
  const isMessageValid = message.trim().length > 0 && message.length <= maxLength;
  const canSend = isMessageValid && !disabled && !state.isProcessing;

  // 자동 리사이즈
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setMessage(e.target.value);
    adjustHeight();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend) {
        handleSend();
      }
    }
  };

  const handleSend = (): void => {
    if (!canSend) return;
    
    const trimmedMessage = message.trim();
    onSendMessage(trimmedMessage);
    setMessage('');
    
    // 높이 초기화
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // 전역 함수로 예시 질문 설정
  useEffect(() => {
    window.setQuestion = (question: string) => {
      if (disabled || state.isProcessing) return;
      setMessage(question);
      setTimeout(adjustHeight, 0);
    };

    return () => {
      window.setQuestion = undefined;
    };
  }, [disabled, state.isProcessing, adjustHeight]);

  return (
    <div>
      <div className="input-wrapper">
        <textarea 
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="GA4 데이터에 대해 질문해보세요..."
          disabled={disabled || state.isProcessing}
          className="input-textarea"
          maxLength={maxLength}
        />
        
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="send-button"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '0.5rem',
        fontSize: '0.75rem',
        color: 'rgb(102, 102, 102)'
      }}>
        <span>Enter로 전송, Shift+Enter로 줄바꿈</span>
        <span>{message.length}/{maxLength}</span>
      </div>
    </div>
  );
}