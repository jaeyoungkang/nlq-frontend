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
    <div className="claude-container">
      {/* 헤더 */}
      <div className="claude-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">GA4 데이터 분석</h1>
            <p className="text-sm text-muted-foreground mt-1">BigQuery GA4 샘플 데이터 (2020.11.21)</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* 모드 전환 버튼 */}
            <Button
              variant={isMockMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsMockMode(!isMockMode)}
              className="text-xs"
            >
              {isMockMode ? <WifiOff className="h-3 w-3 mr-1" /> : <Wifi className="h-3 w-3 mr-1" />}
              {isMockMode ? "목업 모드" : "실제 서버"}
            </Button>
            <div className="text-sm text-muted-foreground">
              📊 nlq-ex.test_dataset.events_20201121
            </div>
          </div>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="claude-messages">
        {/* 모드 안내 */}
        {isMockMode && (
          <Alert className="mb-4">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              <strong>목업 모드</strong>로 실행 중입니다. 서버 연결 없이 샘플 데이터로 테스트할 수 있습니다.
            </AlertDescription>
          </Alert>
        )}

        {/* 에러 표시 */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        <MessageList typingMessageId={typingMessageId} />
      </div>

      {/* 입력 영역 */}
      <div className="claude-input-area">
        <MessageInput 
          onSendMessage={handleSendMessage}
          disabled={isLoading || state.isProcessing}
        />
      </div>
    </div>
  );
}