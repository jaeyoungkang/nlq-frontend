// app/api/quick/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface QuickQueryRequest {
  question: string;
}

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as QuickQueryRequest;
    
    // 요청 검증
    if (!body.question || typeof body.question !== 'string') {
      return NextResponse.json(
        { success: false, error: '질문이 필요합니다.' },
        { status: 400 }
      );
    }

    if (body.question.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: '질문이 비어있습니다.' },
        { status: 400 }
      );
    }

    // 백엔드 API 호출
    const backendResponse = await fetch(`${BACKEND_URL}/quick`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('Backend API Error:', backendResponse.status, errorText);
      
      return NextResponse.json(
        { 
          success: false, 
          error: `백엔드 서버 오류: ${backendResponse.status}` 
        },
        { status: backendResponse.status }
      );
    }

    const data: unknown = await backendResponse.json();
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('API Route Error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { success: false, error: '백엔드 서버에 연결할 수 없습니다.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}