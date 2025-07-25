// components/layout/Header.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { useHealthCheck } from '@/hooks/useHealthCheck';
import { RefreshCw, Database, Trash2 } from 'lucide-react';

export function Header(): React.ReactElement {
  const { clearMessages, state } = useApp();
  const { isHealthy, isLoading, checkHealth, error } = useHealthCheck();

  const handleClearMessages = (): void => {
    if (state.messages.length > 0) {
      clearMessages();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* 로고 및 제목 */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold">GA4 자연어 분석</h1>
          </div>
          
          {/* 상태 배지 */}
          <div className="flex items-center space-x-2">
            <Badge 
              variant={isHealthy ? "default" : "destructive"}
              className="text-xs"
            >
              {isLoading ? "확인중..." : isHealthy ? "정상" : "오류"}
            </Badge>
            
            {state.isProcessing && (
              <Badge variant="secondary" className="text-xs">
                처리중...
              </Badge>
            )}
          </div>
        </div>

        {/* 우측 버튼들 */}
        <div className="flex items-center space-x-2">
          {/* 상태 새로고침 버튼 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={checkHealth}
            disabled={isLoading}
            className="h-8 w-8 p-0"
            title="서버 상태 확인"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

          {/* 대화 초기화 버튼 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearMessages}
            disabled={state.messages.length === 0 || state.isProcessing}
            className="h-8 w-8 p-0"
            title="대화 초기화"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* 메시지 카운트 */}
          <div className="text-sm text-muted-foreground">
            {state.messages.length}개 메시지
          </div>
        </div>
      </div>

      {/* 에러 표시 */}
      {error && (
        <div className="border-b bg-destructive/10 px-4 py-2">
          <p className="text-sm text-destructive">
            ⚠️ {error}
          </p>
        </div>
      )}
    </header>
  );
}