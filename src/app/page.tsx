// app/page.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';
import { useApp } from '@/context/AppContext';
import { useQuery } from '@/hooks/useQuery';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function HomePage(): React.ReactElement {
  const [typingMessageId, setTypingMessageId] = useState<string | undefined>();
  const { 
    addUserMessage, 
    addAssistantMessage, 
    updateMessage, 
    setAnalysisResult,
    state 
  } = useApp();
  const { executeQuery, isLoading, error, clearError } = useQuery();

  const handleSendMessage = useCallback(async (message: string): Promise<void> => {
    try {
      clearError();
      
      // 사용자 메시지 추가
      addUserMessage(message);
      
      // AI 응답 메시지 추가 (타이핑 상태)
      const assistantMessageId = addAssistantMessage('');
      setTypingMessageId(assistantMessageId);

      // API 호출
      const result = await executeQuery(message);
      
      if (result) {
        // 성공 시 메시지 업데이트
        updateMessage(
          assistantMessageId, 
          `✅ 쿼리가 성공적으로 실행되었습니다.\n\n**실행된 SQL:**\n\`\`\`sql\n${result.generated_sql}\n\`\`\`\n\n**결과:** ${result.row_count.toLocaleString()}개의 레코드가 조회되었습니다.`
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
    clearError
  ]);

  return (
    <>
      {/* 헤더 */}
      <Header />

      {/* 메시지 영역 */}
      <div className="claude-messages">
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
    </>
  );
}