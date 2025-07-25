// components/chat/MessageList.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import { Message } from './Message';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface MessageListProps {
  typingMessageId?: string;
}

export function MessageList({ typingMessageId }: MessageListProps): React.ReactElement {
  const { state } = useApp();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, typingMessageId]);

  if (state.messages.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center space-y-3">
          <MessageSquare className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">GA4 데이터 분석을 시작해보세요</h3>
          <p className="text-muted-foreground max-w-md">
            아래 예시 질문을 클릭하거나 직접 질문을 입력해서 
            자연어로 GA4 데이터를 조회할 수 있습니다.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {state.messages.map((message) => (
        <Message 
          key={message.id} 
          message={message}
          isTyping={message.id === typingMessageId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}