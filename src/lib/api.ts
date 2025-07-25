// lib/api.ts

import { 
    QuickQueryResponse,
    BaseApiResponse
  } from './types';
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  
  class ApiError extends Error {
    constructor(
      message: string, 
      public readonly status?: number,
      public readonly response?: unknown
    ) {
      super(message);
      this.name = 'ApiError';
    }
  }
  
  interface RequestOptions extends Omit<RequestInit, 'body'> {
    body?: Record<string, unknown>;
  }
  
  async function apiRequest<TResponse extends BaseApiResponse>(
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<TResponse> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const { body, headers, ...restOptions } = options;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        ...restOptions,
      });
  
      if (!response.ok) {
        throw new ApiError(
          `API 요청 실패: ${response.status} ${response.statusText}`,
          response.status
        );
      }
  
      const data: unknown = await response.json();
      
      // 타입 가드 함수
      if (!isValidApiResponse(data)) {
        throw new ApiError('잘못된 API 응답 형식입니다.', response.status, data);
      }
  
      if (!data.success) {
        throw new ApiError(data.error || '알 수 없는 오류가 발생했습니다.', response.status, data);
      }
  
      return data as TResponse;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof TypeError) {
        throw new ApiError('네트워크 연결 오류가 발생했습니다.');
      }
      
      throw new ApiError('예상치 못한 오류가 발생했습니다.');
    }
  }
  
  // 타입 가드 함수
  function isValidApiResponse(data: unknown): data is BaseApiResponse {
    return (
      typeof data === 'object' &&
      data !== null &&
      'success' in data &&
      typeof (data as Record<string, unknown>).success === 'boolean'
    );
  }
  
  function isQuickQueryResponse(data: BaseApiResponse): data is QuickQueryResponse {
    return (
      'mode' in data &&
      data.mode === 'quick' &&
      'data' in data &&
      'generated_sql' in data &&
      'original_question' in data &&
      'row_count' in data
    );
  }
  
  // API 요청 파라미터 타입
  interface QueryRequest extends Record<string, unknown> {
    question: string;
  }
  
  // API 함수들 (빠른 조회만)
  export const api = {
    // 빠른 조회
    quickQuery: async (question: string): Promise<QuickQueryResponse> => {
      if (!question.trim()) {
        throw new ApiError('질문이 비어있습니다.');
      }
      
      const request: QueryRequest = { question: question.trim() };
      const response = await apiRequest<QuickQueryResponse>('/api/quick', {
        method: 'POST',
        body: request,
      });
      
      if (!isQuickQueryResponse(response)) {
        throw new ApiError('빠른 조회 응답 형식이 올바르지 않습니다.');
      }
      
      return response;
    },
  
    // 헬스체크
    healthCheck: async (): Promise<BaseApiResponse> => {
      return apiRequest<BaseApiResponse>('/api/health', {
        method: 'GET',
      });
    },
  } as const;
  
  export { ApiError };
  export type { RequestOptions };