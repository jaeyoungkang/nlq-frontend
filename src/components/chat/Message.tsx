// components/chat/Message.tsx
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Message as MessageType } from '@/lib/types';
import { User, Bot } from 'lucide-react';
import { TypingAnimation } from '@/components/ui/typing-animation';
import { DataTable } from '@/components/data/DataTable';
import { cn } from '@/lib/utils';

interface MessageProps {
  message: MessageType;
  isTyping?: boolean;
}

export function Message({ message, isTyping = false }: MessageProps): React.ReactElement {
  const isUser = message.type === 'user';
  const timestamp = message.timestamp.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      {/* 아바타 */}
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={cn(
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      {/* 메시지 내용 */}
      <div className={cn("flex flex-col space-y-2 max-w-[80%]", isUser && "items-end")}>
        {/* 메시지 카드 */}
        <Card className={cn(
          "p-3",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted"
        )}>
          {isTyping ? (
            <TypingAnimation />
          ) : (
            <div className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </div>
          )}
        </Card>

        {/* 분석 결과 표시 */}
        {message.analysisResult && !isTyping && (
          <div className="w-full space-y-3">
            {/* 쿼리 정보 */}
            <Card className="p-3 bg-background border-l-4 border-l-primary">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    SQL 쿼리
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {message.analysisResult.row_count.toLocaleString()}개 결과
                  </Badge>
                </div>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                  <code>{message.analysisResult.generated_sql}</code>
                </pre>
              </div>
            </Card>

            {/* 데이터 테이블 */}
            {message.analysisResult.data.length > 0 && (
              <DataTable data={message.analysisResult.data} />
            )}
          </div>
        )}

        {/* 타임스탬프 */}
        <div className={cn(
          "text-xs text-muted-foreground px-1",
          isUser && "text-right"
        )}>
          {timestamp}
        </div>
      </div>
    </div>
  );
}