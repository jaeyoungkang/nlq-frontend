// app/page.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';
import { useApp } from '@/context/AppContext';
import { useQuery } from '@/hooks/useQuery';
import { useMockQuery } from '@/hooks/useMockQuery';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

export default function HomePage(): React.ReactElement {
  const [typingMessageId, setTypingMessageId] = useState<string | undefined>();
  const [isMockMode, setIsMockMode] = useState(false); // 목업 모드 상태
  
  const { 
    addUserMessage, 
    addAssistantMessage, 
    updateMessage, 
    setAnalysisResult,
    state 
  } = useApp();
  
  const { executeQuery, isLoading: realLoading, error: realError, clearError: clearRealError } = useQuery();
  const { executeMockQuery, isLoading: mockLoading, error: mockError, clearError: clearMockError } = useMockQuery();

  // 현재 모드에 따른 값들
  const isLoading = isMockMode ? mockLoading : realLoading;
  const error = isMockMode ? mockError : realError;
  const clearError = isMockMode ? clearMockError : clearRealError;

  const handleSendMessage = useCallback(async (message: string): Promise<void> => {
    try {
      clearError();
      
      // 사용자 메시지 추가
      addUserMessage(message);
      
      // AI 응답 메시지 추가 (타이핑 상태)
      const assistantMessageId = addAssistantMessage('');
      setTypingMessageId(assistantMessageId);

      // 모드에 따른 API 호출
      const result = isMockMode 
        ? await executeMockQuery(message)
        : await executeQuery(message);
      
      if (result) {
        // 성공 시 메시지 업데이트
        const modeLabel = isMockMode ? " (목업 데이터)" : "";
          updateMessage(
            assistantMessageId, 
            `✅ 쿼리가 성공적으로 실행되었습니다${modeLabel}.`
          );
          
          // 분석 결과 설정
          setAnalysisResult(assistantMessageId, result);
      } else {
        // 실패 시 오류 메시지
        updateMessage(
          assistantMessageId,
          '❌ 쿼리 실행에 실패했습니다. 다시 시도해주세요.'
        );
      }
    } catch (err) {
      console.error('Message handling error:', err);
      
      // 예상치 못한 오류 처리
      addAssistantMessage(
        '❌ 예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setTypingMessageId(undefined);
    }
  }, [
    addUserMessage, 
    addAssistantMessage, 
    updateMessage, 
    setAnalysisResult, 
    executeQuery,
    executeMockQuery,
    clearError,
    isMockMode
  ]);

  return (
    <div className="main-container">
      {/* 헤더 - 앱 스타일 적용 */}
      <div className="app-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-app-text">GA4 데이터 분석</h1>
            <p className="text-sm text-app-secondary mt-1">BigQuery GA4 샘플 데이터 (2020.11.21)</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* 모드 전환 버튼 - 앱 스타일 적용 */}
            <Button
              variant={isMockMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsMockMode(!isMockMode)}
              className={`text-xs transition-all duration-200 ${
                isMockMode 
                  ? 'bg-app-accent text-white hover:bg-app-accent-hover' 
                  : 'border-app-border text-app-text hover:bg-app-bg hover:border-app-accent'
              }`}
            >
              {isMockMode ? <WifiOff className="h-3 w-3 mr-1" /> : <Wifi className="h-3 w-3 mr-1" />}
              {isMockMode ? "목업 모드" : "실제 서버"}
            </Button>
            <div className="text-sm text-app-secondary">
              📊 nlq-ex.test_dataset.events_20201121
            </div>
          </div>
        </div>
      </div>

      {/* 메시지 영역 - 앱 스타일 적용 */}
      <div className="app-messages">
        {/* 모드 안내 - 앱 스타일 알럿 */}
        {isMockMode && (
          <div className="result-box mb-4 border-l-4" style={{ borderLeftColor: 'rgb(217, 119, 6)' }}>
            <div className="flex items-start">
              <WifiOff className="h-4 w-4 mr-2 mt-0.5 text-app-accent flex-shrink-0" />
              <div>
                <div className="font-medium text-app-text mb-1">목업 모드</div>
                <div className="text-sm text-app-secondary">
                  서버 연결 없이 샘플 데이터로 테스트할 수 있습니다.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 에러 표시 - 앱 스타일 에러 박스 */}
        {error && (
          <div className="result-box mb-4 border-l-4 border-l-red-500">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-red-500 flex-shrink-0" />
              <div>
                <div className="font-medium text-red-700 mb-1">오류 발생</div>
                <div className="text-sm text-red-600">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        <MessageList typingMessageId={typingMessageId} />
      </div>

      {/* 입력 영역 - 앱 스타일 적용 */}
      <div className="app-input-area">
        <MessageInput 
          onSendMessage={handleSendMessage}
          disabled={isLoading || state.isProcessing}
        />
      </div>
    </div>
  );
}