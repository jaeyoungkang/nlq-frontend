// components/layout/Header.tsx
'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useHealthCheck } from '@/hooks/useHealthCheck';

export function Header(): React.ReactElement {
  const { state } = useApp();
  const { isHealthy } = useHealthCheck();

  return (
    <div className="header">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">GA4 데이터 분석</h1>
          <p className="text-sm text-muted-foreground mt-1">BigQuery GA4 샘플 데이터 (2020.11.21)</p>
        </div>
        <div className="text-sm text-muted-foreground">
          📊 nlq-ex.test_dataset.events_20201121
        </div>
      </div>
    </div>
  );
}