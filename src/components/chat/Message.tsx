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
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="message">
      <div className="assistant-message-content">
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start',
          width: '100%',
          boxSizing: 'border-box'
        }}>
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
            <Bot style={{ height: '0.75rem', width: '0.75rem' }} />
          </div>
          <div style={{ 
            flex: 1,
            minWidth: 0,
            width: '100%'
          }}>
            {isTyping ? (
              <TypingAnimation />
            ) : (
              <>
                {/* 메시지 내용 */}
                <div style={{
                  fontSize: '0.875rem',
                  color: 'rgb(47, 47, 47)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  marginBottom: '1rem',
                  width: '100%'
                }}>
                  {message.analysisResult 
                    ? `쿼리가 성공적으로 실행되었습니다. ${message.analysisResult.row_count.toLocaleString()}개의 레코드가 조회되었습니다.`
                    : message.content
                  }
                </div>

                {/* 분석 결과 표시 */}
                {message.analysisResult && (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1rem',
                    width: '100%'
                  }}>
                    {/* SQL 쿼리 정보 - 앱 스타일 */}
                    <div className="result-box" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1rem'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <span className="app-badge" style={{
                            background: 'rgb(217, 119, 6)',
                            color: 'white',
                            border: '1px solid rgb(217, 119, 6)'
                          }}>
                            📝 실행된 SQL
                          </span>
                        </div>
                        <span className="app-badge app-badge-secondary" style={{
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          📊 {message.analysisResult.row_count.toLocaleString()}개 결과
                        </span>
                      </div>
                      
                      {/* SQL 코드 블록 */}
                      <div style={{
                        background: 'rgb(15, 23, 42)', // slate-900
                        border: '1px solid rgb(30, 41, 59)', // slate-800
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {/* 코드 블록 헤더 */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.75rem',
                          paddingBottom: '0.5rem',
                          borderBottom: '1px solid rgb(51, 65, 85)' // slate-600
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <div style={{
                              display: 'flex',
                              gap: '0.25rem'
                            }}>
                              <div style={{
                                width: '0.75rem',
                                height: '0.75rem',
                                borderRadius: '50%',
                                background: 'rgb(239, 68, 68)' // red-500
                              }}></div>
                              <div style={{
                                width: '0.75rem',
                                height: '0.75rem',
                                borderRadius: '50%',
                                background: 'rgb(245, 158, 11)' // amber-500
                              }}></div>
                              <div style={{
                                width: '0.75rem',
                                height: '0.75rem',
                                borderRadius: '50%',
                                background: 'rgb(34, 197, 94)' // green-500
                              }}></div>
                            </div>
                            <span style={{
                              color: 'rgb(148, 163, 184)', // slate-400
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              marginLeft: '0.5rem'
                            }}>
                              BigQuery SQL
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(message.analysisResult!.generated_sql);
                            }}
                            style={{
                              background: 'rgb(51, 65, 85)', // slate-600
                              color: 'rgb(203, 213, 225)', // slate-300
                              border: '1px solid rgb(71, 85, 105)', // slate-500
                              borderRadius: '0.375rem',
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgb(71, 85, 105)'; // slate-500
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgb(51, 65, 85)'; // slate-600
                            }}
                          >
                            📋 복사
                          </button>
                        </div>
                        
                        {/* SQL 코드 */}
                        <pre style={{
                          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                          fontSize: '0.875rem',
                          lineHeight: '1.6',
                          color: 'rgb(226, 232, 240)', // slate-200
                          overflowX: 'auto',
                          margin: 0,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}>
                          <code style={{
                            color: 'rgb(226, 232, 240)' // slate-200
                          }}>
                            {message.analysisResult.generated_sql}
                          </code>
                        </pre>
                      </div>
                      
                      {/* 쿼리 실행 정보 */}
                      <div style={{
                        marginTop: '0.75rem',
                        padding: '0.75rem',
                        background: 'rgb(248, 250, 252)', // slate-50
                        border: '1px solid rgb(226, 232, 240)', // slate-200
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          color: 'rgb(71, 85, 105)' // slate-600
                        }}>
                          <span>⚡ 쿼리 실행 완료</span>
                          <span>{new Date().toLocaleTimeString('ko-KR')}</span>
                        </div>
                      </div>
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