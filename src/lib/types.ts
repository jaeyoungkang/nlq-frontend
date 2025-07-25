// lib/types.ts

// 기본 데이터 타입
export type DataValue = string | number | boolean | null;
export type DataRow = Record<string, DataValue>;

// 기본 API 응답 타입
export interface BaseApiResponse {
  success: boolean;
  error?: string;
}

// 빠른 조회 응답만 유지
export interface QuickQueryResponse extends BaseApiResponse {
  mode: 'quick';
  original_question: string;
  generated_sql: string;
  data: DataRow[];
  row_count: number;
}

// 메시지 타입
export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  analysisResult?: QuickQueryResponse;
}

// 컨텍스트 상태
export interface AppState {
  messages: Message[];
  isProcessing: boolean;
  currentQuestion: string;
}

// 프로세스 단계
export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  timestamp?: Date;
}

// 에러 타입
export interface ApiErrorResponse {
  success: false;
  error: string;
  mode?: string;
  original_question?: string;
  generated_sql?: string;
}

// API 응답 타입 (빠른 조회만)
export type ApiResponse = QuickQueryResponse | ApiErrorResponse;