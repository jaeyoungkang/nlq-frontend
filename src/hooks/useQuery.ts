// hooks/useQuery.ts
'use client';

import { useState, useCallback } from 'react';
import { api, ApiError } from '@/lib/api';
import { QuickQueryResponse } from '@/lib/types';
import { useApp } from '@/context/AppContext';

interface UseQueryReturn {
  executeQuery: (question: string) => Promise<QuickQueryResponse | null>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useQuery(): UseQueryReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setProcessing } = useApp();

  const executeQuery = useCallback(async (question: string): Promise<QuickQueryResponse | null> => {
    if (!question.trim()) {
      setError('질문을 입력해주세요.');
      return null;
    }

    setIsLoading(true);
    setProcessing(true);
    setError(null);

    try {
      const result = await api.quickQuery(question);
      return result;
    } catch (err) {
      let errorMessage = '알 수 없는 오류가 발생했습니다.';
      
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
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
    executeQuery,
    isLoading,
    error,
    clearError,
  };
}