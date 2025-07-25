// context/AppContext.tsx
'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, Message, QuickQueryResponse } from '@/lib/types';

// 액션 타입 정의
type AppAction =
  | { type: 'ADD_USER_MESSAGE'; payload: { content: string } }
  | { type: 'ADD_ASSISTANT_MESSAGE'; payload: { content: string; id: string } }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; content: string } }
  | { type: 'SET_ANALYSIS_RESULT'; payload: { messageId: string; result: QuickQueryResponse } }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_CURRENT_QUESTION'; payload: string }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'REMOVE_MESSAGE'; payload: string };

// 초기 상태
const initialState: AppState = {
  messages: [],
  isProcessing: false,
  currentQuestion: '',
};

// ID 생성 함수
function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 리듀서 함수
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_USER_MESSAGE': {
      const newMessage: Message = {
        id: generateId(),
        type: 'user',
        content: action.payload.content,
        timestamp: new Date(),
      };
      
      return {
        ...state,
        messages: [...state.messages, newMessage],
      };
    }

    case 'ADD_ASSISTANT_MESSAGE': {
      const newMessage: Message = {
        id: action.payload.id,
        type: 'assistant',
        content: action.payload.content,
        timestamp: new Date(),
      };
      
      return {
        ...state,
        messages: [...state.messages, newMessage],
      };
    }

    case 'UPDATE_MESSAGE': {
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload.id
            ? { ...message, content: action.payload.content }
            : message
        ),
      };
    }

    case 'SET_ANALYSIS_RESULT': {
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload.messageId
            ? { ...message, analysisResult: action.payload.result }
            : message
        ),
      };
    }

    case 'SET_PROCESSING': {
      return {
        ...state,
        isProcessing: action.payload,
      };
    }

    case 'SET_CURRENT_QUESTION': {
      return {
        ...state,
        currentQuestion: action.payload,
      };
    }

    case 'CLEAR_MESSAGES': {
      return {
        ...state,
        messages: [],
        currentQuestion: '',
      };
    }

    case 'REMOVE_MESSAGE': {
      return {
        ...state,
        messages: state.messages.filter(message => message.id !== action.payload),
      };
    }

    default:
      return state;
  }
}

// Context 인터페이스
interface AppContextType {
  state: AppState;
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => string;
  updateMessage: (id: string, content: string) => void;
  setAnalysisResult: (messageId: string, result: QuickQueryResponse) => void;
  setProcessing: (isProcessing: boolean) => void;
  setCurrentQuestion: (question: string) => void;
  clearMessages: () => void;
  removeMessage: (id: string) => void;
}

// Context 생성
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider 컴포넌트
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps): React.ReactElement {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 액션 생성자들
  const addUserMessage = (content: string): void => {
    dispatch({ type: 'ADD_USER_MESSAGE', payload: { content } });
  };

  const addAssistantMessage = (content: string): string => {
    const id = generateId();
    dispatch({ type: 'ADD_ASSISTANT_MESSAGE', payload: { content, id } });
    return id;
  };

  const updateMessage = (id: string, content: string): void => {
    dispatch({ type: 'UPDATE_MESSAGE', payload: { id, content } });
  };

  const setAnalysisResult = (messageId: string, result: QuickQueryResponse): void => {
    dispatch({ type: 'SET_ANALYSIS_RESULT', payload: { messageId, result } });
  };

  const setProcessing = (isProcessing: boolean): void => {
    dispatch({ type: 'SET_PROCESSING', payload: isProcessing });
  };

  const setCurrentQuestion = (question: string): void => {
    dispatch({ type: 'SET_CURRENT_QUESTION', payload: question });
  };

  const clearMessages = (): void => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  };

  const removeMessage = (id: string): void => {
    dispatch({ type: 'REMOVE_MESSAGE', payload: id });
  };

  const contextValue: AppContextType = {
    state,
    addUserMessage,
    addAssistantMessage,
    updateMessage,
    setAnalysisResult,
    setProcessing,
    setCurrentQuestion,
    clearMessages,
    removeMessage,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}