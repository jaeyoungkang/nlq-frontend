// components/chat/MessageList.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import { Message } from './Message';
import { useApp } from '@/context/AppContext';

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
      <div className="message">
        <div className="assistant-message-content">
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 bg-claude-accent">
              AI
            </div>
            <div className="flex-1">
            <p className="mb-4 text-claude-text">
              안녕하세요! 저는 GA4 데이터 분석을 도와드리는 AI 어시스턴트입니다. 
              자연어로 질문해주시면 BigQuery에서 데이터를 조회하고 결과를 정리해드리겠습니다.
            </p>

            <div className="claude-result-box">
                <h3 className="font-medium text-claude-text mb-3">💡 예시 질문들</h3>
                <div className="claude-example-grid">
                  <ExampleQuestion 
                    text="총 이벤트 수를 알려주세요"
                    onClick={() => window.setQuestion?.('총 이벤트 수를 알려주세요')}
                  />
                  <ExampleQuestion 
                    text="가장 많이 발생한 이벤트 유형 상위 10개를 보여주세요"
                    onClick={() => window.setQuestion?.('가장 많이 발생한 이벤트 유형 상위 10개를 보여주세요')}
                  />
                  <ExampleQuestion 
                    text="국가별 사용자 수를 보여주세요"
                    onClick={() => window.setQuestion?.('국가별 사용자 수를 보여주세요')}
                  />
                  <ExampleQuestion 
                    text="모바일과 데스크톱 사용자 비율을 보여주세요"
                    onClick={() => window.setQuestion?.('모바일과 데스크톱 사용자 비율을 보여주세요')}
                  />
                  <ExampleQuestion 
                    text="시간대별 이벤트 수를 보여주세요"
                    onClick={() => window.setQuestion?.('시간대별 이벤트 수를 보여주세요')}
                  />
                  <ExampleQuestion 
                    text="운영체제별 사용자 분포를 보여주세요"
                    onClick={() => window.setQuestion?.('운영체제별 사용자 분포를 보여주세요')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

// 예시 질문 컴포넌트
interface ExampleQuestionProps {
  text: string;
  onClick: () => void;
}

function ExampleQuestion({ text, onClick }: ExampleQuestionProps): React.ReactElement {
  return (
    <div 
      className="claude-example-question"
      onClick={onClick}
    >
      &ldquo;{text}&rdquo;
    </div>
  );
}

// 전역 함수 타입 정의
declare global {
  interface Window {
    setQuestion?: (question: string) => void;
  }
}