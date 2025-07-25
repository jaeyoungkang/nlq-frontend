// components/chat/Message.tsx
'use client';

import React from 'react';
import { Message as MessageType } from '@/lib/types';
import { Bot } from 'lucide-react';
import { TypingAnimation } from '@/components/ui/typing-animation';
import { DataTable } from '@/components/data/DataTable';

interface MessageProps {
  message: MessageType;
  isTyping?: boolean;
}

export function Message({ message, isTyping = false }: MessageProps): React.ReactElement {
  const isUser = message.type === 'user';

  if (isUser) {
    return (
      <div className="message">
        <div className="user-message-bubble">
          <div className="text-sm text-foreground whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="message">
      <div className="assistant-message-content">
        <div className="flex items-start">
          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
            <Bot className="h-3 w-3" />
          </div>
          <div className="flex-1">
            {isTyping ? (
              <TypingAnimation />
            ) : (
              <>
                {/* 메시지 내용 */}
                <div className="text-sm text-foreground whitespace-pre-wrap break-words mb-4">
                  {message.analysisResult 
                    ? `쿼리가 성공적으로 실행되었습니다. ${message.analysisResult.row_count.toLocaleString()}개의 레코드가 조회되었습니다.`
                    : message.content
                  }
                </div>

                {/* 분석 결과 표시 */}
                {message.analysisResult && (
                  <div className="space-y-4">
                    {/* SQL 쿼리 정보 - Claude 스타일 */}
                    <div className="claude-result-box">
                      <div className="flex items-center justify-between mb-3">
                        <span className="claude-badge">
                          실행된 SQL
                        </span>
                        <span className="claude-badge claude-badge-secondary">
                          {message.analysisResult.row_count.toLocaleString()}개 결과
                        </span>
                      </div>
                      <pre className="claude-sql-block">
                        <code>{message.analysisResult.generated_sql}</code>
                      </pre>
                    </div>

                    {/* 데이터 테이블 */}
                    {message.analysisResult.data.length > 0 && (
                      <DataTable 
                        data={message.analysisResult.data} 
                        title="조회 결과"
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}