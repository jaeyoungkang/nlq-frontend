// hooks/useHealthCheck.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, ApiError } from '@/lib/api';

interface HealthStatus {
  isHealthy: boolean;
  isLoading: boolean;
  error: string | null;
  lastChecked: Date | null;
}

interface UseHealthCheckReturn extends HealthStatus {
  checkHealth: () => Promise<void>;
}

export function useHealthCheck(autoCheck = true): UseHealthCheckReturn {
  const [status, setStatus] = useState<HealthStatus>({
    isHealthy: false,
    isLoading: false,
    error: null,
    lastChecked: null,
  });

  const checkHealth = useCallback(async (): Promise<void> => {
    setStatus(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await api.healthCheck();
      setStatus({
        isHealthy: true,
        isLoading: false,
        error: null,
        lastChecked: new Date(),
      });
    } catch (err) {
      let errorMessage = '서버 상태를 확인할 수 없습니다.';
      
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setStatus({
        isHealthy: false,
        isLoading: false,
        error: errorMessage,
        lastChecked: new Date(),
      });
    }
  }, []);

  // 자동 헬스체크 (컴포넌트 마운트 시)
  useEffect(() => {
    if (autoCheck) {
      checkHealth();
    }
  }, [autoCheck, checkHealth]);

  return {
    ...status,
    checkHealth,
  };
}