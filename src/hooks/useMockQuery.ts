// hooks/useMockQuery.ts
'use client';

import { useState, useCallback } from 'react';
import { QuickQueryResponse } from '@/lib/types';
import { findMockData } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';

interface UseMockQueryReturn {
  executeMockQuery: (question: string) => Promise<QuickQueryResponse | null>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useMockQuery(): UseMockQueryReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setProcessing } = useApp();

  const executeMockQuery = useCallback(async (question: string): Promise<QuickQueryResponse | null> => {
    if (!question.trim()) {
      setError('질문을 입력해주세요.');
      return null;
    }

    setIsLoading(true);
    setProcessing(true);
    setError(null);

    try {
      // 실제 API 호출을 시뮬레이션 (1-2초 지연)
      const delay = Math.random() * 1000 + 1000; // 1-2초 랜덤 지연
      await new Promise(resolve => setTimeout(resolve, delay));

      const result = findMockData(question);
      return result;
    } catch (err) {
      let errorMessage = '알 수 없는 오류가 발생했습니다.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
      setProcessing(false);
    }
  }, [setProcessing]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    executeMockQuery,
    isLoading,
    error,
    clearError,
  };
}