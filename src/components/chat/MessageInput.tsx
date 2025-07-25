// components/chat/MessageInput.tsx
'use client';

import React, { useState, useRef, useCallback, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { Send, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const EXAMPLE_QUESTIONS = [
  "오늘 총 이벤트 수를 알려주세요",
  "가장 많이 발생한 이벤트 유형을 보여주세요", 
  "국가별 사용자 수를 보여주세요",
  "모바일과 데스크톱 사용자 비율을 보여주세요",
  "page_view 이벤트가 가장 많은 시간대를 보여주세요"
] as const;

export function MessageInput({ 
  onSendMessage, 
  disabled = false 
}: MessageInputProps): React.ReactElement {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { state } = useApp();

  const maxLength = 1000;
  const isMessageValid = message.trim().length > 0 && message.length <= maxLength;
  const canSend = isMessageValid && !disabled && !state.isProcessing;

  // 자동 리사이즈
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
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

  const handleExampleClick = (example: string): void => {
    if (disabled || state.isProcessing) return;
    setMessage(example);
    setTimeout(adjustHeight, 0);
  };

  const handleClear = (): void => {
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  return (
    <div className="space-y-4">
      {/* 예시 질문들 */}
      {state.messages.length === 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">
            💡 예시 질문을 클릭해보세요
          </h3>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUESTIONS.map((example, index) => (
              <Badge
                key={index}
                variant="outline"
                className={cn(
                  "cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground",
                  disabled && "cursor-not-allowed opacity-50"
                )}
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* 메시지 입력 영역 */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="GA4 데이터에 대한 질문을 입력하세요... (Shift+Enter로 줄바꿈)"
              disabled={disabled || state.isProcessing}
              className="min-h-[60px] max-h-[120px] resize-none pr-20"
              maxLength={maxLength}
            />
            
            {/* 문자 수 카운터 */}
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              {message.length}/{maxLength}
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* 상태 표시 */}
            <div className="flex items-center space-x-2">
              {state.isProcessing && (
                <Badge variant="secondary" className="text-xs">
                  처리 중...
                </Badge>
              )}
              
              {message.length > maxLength && (
                <Badge variant="destructive" className="text-xs">
                  글자 수 초과
                </Badge>
              )}
            </div>

            {/* 버튼들 */}
            <div className="flex items-center space-x-2">
              {message.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  disabled={disabled || state.isProcessing}
                  className="h-8 w-8 p-0"
                  title="입력 초기화"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
              
              <Button
                onClick={handleSend}
                disabled={!canSend}
                size="sm"
                className="h-8 px-3"
              >
                <Send className="h-4 w-4 mr-1" />
                전송
              </Button>
            </div>
          </div>

          {/* 도움말 */}
          <div className="text-xs text-muted-foreground">
            💡 팁: Enter로 전송, Shift+Enter로 줄바꿈
          </div>
        </div>
      </Card>
    </div>
  );
}