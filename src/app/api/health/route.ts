// app/api/health/route.ts
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

interface BackendHealthResponse {
  status: string;
  timestamp: string;
  project_id: string;
  table: string;
  bigquery_client_project: string;
  services: {
    anthropic: string;
    bigquery: string;
  };
  supported_modes: string[];
}

interface FrontendHealthResponse {
  success: boolean;
  frontend_status: 'healthy' | 'unhealthy';
  backend_status: 'healthy' | 'unhealthy' | 'unreachable';
  backend_data?: BackendHealthResponse;
  error?: string;
  timestamp: string;
}

export async function GET(): Promise<NextResponse<FrontendHealthResponse>> {
  const timestamp = new Date().toISOString();
  
  try {
    const backendResponse = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // 5초 타임아웃 설정
      signal: AbortSignal.timeout(5000),
    });

    if (!backendResponse.ok) {
      return NextResponse.json(
        { 
          success: false,
          frontend_status: 'healthy',
          backend_status: 'unhealthy',
          error: `백엔드 서버 응답 오류: ${backendResponse.status} ${backendResponse.statusText}`,
          timestamp,
        },
        { status: 503 }
      );
    }

    const backendData = await backendResponse.json() as BackendHealthResponse;
    
    // 백엔드 응답 검증
    if (!backendData.status || backendData.status !== 'healthy') {
      return NextResponse.json(
        { 
          success: false,
          frontend_status: 'healthy',
          backend_status: 'unhealthy',
          backend_data: backendData,
          error: '백엔드 서버가 정상 상태가 아닙니다.',
          timestamp,
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json({
      success: true,
      frontend_status: 'healthy',
      backend_status: 'healthy',
      backend_data: backendData,
      timestamp,
    });
    
  } catch (error) {
    console.error('Health Check Error:', error);
    
    let errorMessage = '백엔드 서버에 연결할 수 없습니다.';
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = '백엔드 서버 응답 시간 초과 (5초)';
      } else if (error.message.includes('fetch')) {
        errorMessage = '네트워크 연결 오류';
      }
    }
    
    return NextResponse.json(
      { 
        success: false,
        frontend_status: 'healthy',
        backend_status: 'unreachable',
        error: errorMessage,
        timestamp,
      },
      { status: 503 }
    );
  }
}

// CORS 처리
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}