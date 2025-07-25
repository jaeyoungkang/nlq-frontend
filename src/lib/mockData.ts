// lib/mockData.ts
import { QuickQueryResponse } from './types';

// GA4 샘플 데이터
export const mockQueries: Record<string, QuickQueryResponse> = {
  // 총 이벤트 수
  "총 이벤트 수": {
    success: true,
    mode: 'quick',
    original_question: "총 이벤트 수를 알려주세요",
    generated_sql: "SELECT COUNT(*) as total_events FROM `nlq-ex.test_dataset.events_20201121`;",
    data: [{ total_events: 41980 }],
    row_count: 1
  },

  // 이벤트 유형별 통계
  "이벤트 유형": {
    success: true,
    mode: 'quick',
    original_question: "가장 많이 발생한 이벤트 유형 상위 10개를 보여주세요",
    generated_sql: "SELECT event_name, COUNT(*) as event_count FROM `nlq-ex.test_dataset.events_20201121` GROUP BY event_name ORDER BY event_count DESC LIMIT 10;",
    data: [
      { event_name: "page_view", event_count: 15487 },
      { event_name: "user_engagement", event_count: 8932 },
      { event_name: "scroll", event_count: 7321 },
      { event_name: "click", event_count: 4985 },
      { event_name: "session_start", event_count: 3442 },
      { event_name: "first_visit", event_count: 1813 },
      { event_name: "purchase", event_count: 892 },
      { event_name: "add_to_cart", event_count: 634 },
      { event_name: "view_item", event_count: 421 },
      { event_name: "begin_checkout", event_count: 263 }
    ],
    row_count: 10
  },

  // 국가별 사용자 수
  "국가별 사용자": {
    success: true,
    mode: 'quick',
    original_question: "국가별 사용자 수를 보여주세요",
    generated_sql: "SELECT geo.country, COUNT(DISTINCT user_pseudo_id) as unique_users FROM `nlq-ex.test_dataset.events_20201121` GROUP BY geo.country ORDER BY unique_users DESC;",
    data: [
      { country: "United States", unique_users: 8934 },
      { country: "United Kingdom", unique_users: 3421 },
      { country: "Canada", unique_users: 2876 },
      { country: "Germany", unique_users: 2453 },
      { country: "France", unique_users: 1987 },
      { country: "Australia", unique_users: 1654 },
      { country: "Japan", unique_users: 1432 },
      { country: "South Korea", unique_users: 1298 },
      { country: "Netherlands", unique_users: 987 },
      { country: "Brazil", unique_users: 876 }
    ],
    row_count: 10
  },

  // 기기별 사용자 비율
  "기기별 사용자": {
    success: true,
    mode: 'quick',
    original_question: "모바일과 데스크톱 사용자 비율을 보여주세요",
    generated_sql: "SELECT device.category, COUNT(DISTINCT user_pseudo_id) as users, ROUND(COUNT(DISTINCT user_pseudo_id) * 100.0 / (SELECT COUNT(DISTINCT user_pseudo_id) FROM `nlq-ex.test_dataset.events_20201121`), 2) as percentage FROM `nlq-ex.test_dataset.events_20201121` GROUP BY device.category ORDER BY users DESC;",
    data: [
      { category: "mobile", users: 18456, percentage: 62.34 },
      { category: "desktop", users: 9823, percentage: 33.21 },
      { category: "tablet", users: 1321, percentage: 4.45 }
    ],
    row_count: 3
  },

  // 시간대별 이벤트
  "시간대별 이벤트": {
    success: true,
    mode: 'quick',
    original_question: "시간대별 이벤트 수를 보여주세요",
    generated_sql: "SELECT EXTRACT(HOUR FROM TIMESTAMP_MICROS(event_timestamp)) as hour, COUNT(*) as event_count FROM `nlq-ex.test_dataset.events_20201121` GROUP BY hour ORDER BY hour;",
    data: [
      { hour: 0, event_count: 1234 },
      { hour: 1, event_count: 987 },
      { hour: 2, event_count: 743 },
      { hour: 3, event_count: 654 },
      { hour: 4, event_count: 789 },
      { hour: 5, event_count: 1123 },
      { hour: 6, event_count: 1567 },
      { hour: 7, event_count: 2134 },
      { hour: 8, event_count: 2987 },
      { hour: 9, event_count: 3456 },
      { hour: 10, event_count: 3789 },
      { hour: 11, event_count: 3923 },
      { hour: 12, event_count: 4123 },
      { hour: 13, event_count: 3987 },
      { hour: 14, event_count: 3654 },
      { hour: 15, event_count: 3234 },
      { hour: 16, event_count: 2987 },
      { hour: 17, event_count: 2654 },
      { hour: 18, event_count: 2321 },
      { hour: 19, event_count: 2134 },
      { hour: 20, event_count: 1987 },
      { hour: 21, event_count: 1654 },
      { hour: 22, event_count: 1432 },
      { hour: 23, event_count: 1234 }
    ],
    row_count: 24
  },

  // 운영체제별 분포
  "운영체제별 분포": {
    success: true,
    mode: 'quick',
    original_question: "운영체제별 사용자 분포를 보여주세요",
    generated_sql: "SELECT device.operating_system, COUNT(DISTINCT user_pseudo_id) as users FROM `nlq-ex.test_dataset.events_20201121` GROUP BY device.operating_system ORDER BY users DESC;",
    data: [
      { operating_system: "Android", users: 12456 },
      { operating_system: "iOS", users: 8934 },
      { operating_system: "Windows", users: 6789 },
      { operating_system: "Macintosh", users: 2345 },
      { operating_system: "Linux", users: 876 },
      { operating_system: "Chrome OS", users: 234 }
    ],
    row_count: 6
  }
};

// 키워드 매칭 함수
export function findMockData(question: string): QuickQueryResponse | null {
  const normalizedQuestion = question.toLowerCase();
  
  // 키워드 매칭
  const keywords = {
    "총 이벤트 수": ["총", "전체", "이벤트", "수", "개수"],
    "이벤트 유형": ["이벤트", "유형", "타입", "상위", "많이"],
    "국가별 사용자": ["국가", "사용자", "지역"],
    "기기별 사용자": ["기기", "디바이스", "모바일", "데스크톱", "비율"],
    "시간대별 이벤트": ["시간", "시간대", "hour"],
    "운영체제별 분포": ["운영체제", "os", "분포", "시스템"]
  };

  for (const [key, keywordList] of Object.entries(keywords)) {
    const matchCount = keywordList.filter(keyword => 
      normalizedQuestion.includes(keyword)
    ).length;
    
    if (matchCount >= 2) { // 2개 이상 키워드 매칭
      return mockQueries[key];
    }
  }

  // 기본 응답
  return {
    success: true,
    mode: 'quick',
    original_question: question,
    generated_sql: "SELECT 'Mock Data' as message, 42 as answer;",
    data: [{ message: "목업 데이터입니다", answer: 42 }],
    row_count: 1
  };
}