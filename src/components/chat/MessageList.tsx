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
          <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
            <div style={{
              width: '1.5rem',
              height: '1.5rem',
              borderRadius: '50%',
              background: 'rgb(217, 119, 6)',
              color: 'white',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.75rem',
              marginTop: '0.125rem',
              flexShrink: 0
            }}>
              AI
            </div>
            <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
              <p style={{
                marginBottom: '1rem',
                color: 'rgb(47, 47, 47)',
                fontSize: '0.875rem',
                lineHeight: '1.6'
              }}>
                안녕하세요! 저는 GA4 데이터 분석을 도와드리는 AI 어시스턴트입니다. 
                자연어로 질문해주시면 BigQuery에서 데이터를 조회하고 결과를 정리해드리겠습니다.
              </p>

              <div className="result-box">
                <h3 style={{
                  fontWeight: '500',
                  color: 'rgb(47, 47, 47)',
                  marginBottom: '0.75rem',
                  fontSize: '0.875rem'
                }}>
                  💡 예시 질문들
                </h3>
                <div className="example-grid">
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
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1.5rem',
      width: '100%'
    }}>
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
      className="example-question"
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