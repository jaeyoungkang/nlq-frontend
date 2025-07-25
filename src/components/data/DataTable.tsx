// components/data/DataTable.tsx
'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DataRow, DataValue } from '@/lib/types';
import { ChevronLeft, ChevronRight, Download, Eye, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataTableProps {
  data: DataRow[];
  title?: string;
  maxRows?: number;
  showPagination?: boolean;
}

const ROWS_PER_PAGE = 10;

function formatCellValue(value: DataValue): React.ReactNode {
  if (value === null || value === undefined) {
    return (
      <span className="text-app-secondary italic bg-app-bg px-2 py-1 rounded text-xs">
        NULL
      </span>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <Badge 
        variant={value ? "default" : "secondary"} 
        className={cn(
          "text-xs font-medium",
          value 
            ? "bg-app-accent text-white" 
            : "bg-app-bg text-app-secondary border-app-border"
        )}
      >
        {value ? 'TRUE' : 'FALSE'}
      </Badge>
    );
  }

  if (typeof value === 'number') {
    // 큰 숫자는 천 단위 구분자 추가
    if (Math.abs(value) >= 1000) {
      return (
        <span className="font-mono text-app-text">
          {value.toLocaleString('ko-KR')}
        </span>
      );
    }
    // 소수점이 있는 경우 적절히 반올림
    if (value % 1 !== 0) {
      return (
        <span className="font-mono text-app-text">
          {parseFloat(value.toFixed(4)).toString()}
        </span>
      );
    }
    return (
      <span className="font-mono text-app-text">
        {value.toString()}
      </span>
    );
  }

  if (typeof value === 'string') {
    // 날짜 형식 감지
    if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
      try {
        const date = new Date(value);
        return (
          <span className="text-app-text bg-app-bg px-2 py-1 rounded text-sm">
            {date.toLocaleDateString('ko-KR')}
          </span>
        );
      } catch {
        return <span className="text-app-text">{value}</span>;
      }
    }

    // URL 감지
    if (value.match(/^https?:\/\//)) {
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-app-accent hover:bg-app-accent-hover underline transition-colors"
        >
          {value.length > 30 ? `${value.substring(0, 30)}...` : value}
        </a>
      );
    }

    // 긴 텍스트는 잘라서 표시
    if (value.length > 50) {
      return (
        <span 
          title={value} 
          className="cursor-help text-app-text"
        >
          {value.substring(0, 50)}
          <span className="text-app-secondary">...</span>
        </span>
      );
    }
  }

  return <span className="text-app-text">{String(value)}</span>;
}

export function DataTable({ 
  data, 
  title,
  maxRows = 100,
  showPagination = true 
}: DataTableProps): React.ReactElement {
  const [currentPage, setCurrentPage] = useState(1);

  const { columns, displayData, totalPages, hasMoreData } = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        columns: [],
        displayData: [],
        totalPages: 0,
        hasMoreData: false,
      };
    }

    const cols = Object.keys(data[0]);
    const limitedData = data.slice(0, maxRows);
    const totalPgs = showPagination ? Math.ceil(limitedData.length / ROWS_PER_PAGE) : 1;
    
    let pageData = limitedData;
    if (showPagination && totalPgs > 1) {
      const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
      const endIndex = startIndex + ROWS_PER_PAGE;
      pageData = limitedData.slice(startIndex, endIndex);
    }

    return {
      columns: cols,
      displayData: pageData,
      totalPages: totalPgs,
      hasMoreData: data.length > maxRows,
    };
  }, [data, currentPage, maxRows, showPagination]);

  const handleDownload = (): void => {
    if (!data || data.length === 0) return;

    const csvContent = [
      columns.join(','),
      ...data.map(row => 
        columns.map(col => {
          const value = row[col];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return String(value);
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ga4-data-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!data || data.length === 0) {
    return (
      <div className="result-box">
        <div className="text-center py-8">
          <Database className="h-12 w-12 mx-auto mb-4 text-app-secondary" />
          <h3 className="text-lg font-medium text-app-text mb-2">데이터가 없습니다</h3>
          <p className="text-sm text-app-secondary">
            표시할 데이터가 없습니다. 다른 조건으로 검색해보세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="result-box overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-app-border">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-app-accent" />
            <h3 className="text-lg font-semibold text-app-text">
              {title || '쿼리 결과'}
            </h3>
          </div>
          <div className="flex items-center space-x-3 text-sm text-app-secondary">
            <span>총 {data.length.toLocaleString()}개 레코드</span>
            {hasMoreData && (
              <span className="app-badge app-badge-secondary">
                상위 {maxRows}개만 표시
              </span>
            )}
            <span className="app-badge">
              {columns.length}개 컬럼
            </span>
          </div>
        </div>
        
        <button
          onClick={handleDownload}
          className="flex items-center space-x-1 px-3 py-2 text-sm border border-app-border rounded-lg bg-white text-app-text hover:bg-app-bg hover:border-app-accent transition-all duration-200"
        >
          <Download className="h-4 w-4" />
          <span>CSV 다운로드</span>
        </button>
      </div>

      {/* 테이블 */}
      <div className="border border-app-border rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-app-bg border-b border-app-border hover:bg-app-bg">
                {columns.map((column) => (
                  <TableHead 
                    key={column} 
                    className="font-semibold text-app-text bg-app-bg border-r border-app-border last:border-r-0 py-4 px-4 text-left min-w-[120px] max-w-[250px]"
                  >
                    <div className="truncate" title={column}>
                      {column}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((row, index) => (
                <TableRow 
                  key={index} 
                  className="hover:bg-app-bg/50 border-b border-app-border/50 transition-colors"
                >
                  {columns.map((column) => (
                    <TableCell 
                      key={column} 
                      className="py-3 px-4 border-r border-app-border/30 last:border-r-0 align-top min-w-[120px] max-w-[250px]"
                    >
                      <div className="break-words">
                        {formatCellValue(row[column])}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 페이지네이션 */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-app-border">
          <div className="text-sm text-app-secondary">
            페이지 {currentPage} / {totalPages} ({((currentPage - 1) * ROWS_PER_PAGE + 1)}-{Math.min(currentPage * ROWS_PER_PAGE, data.length)}번째 표시)
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={cn(
                "flex items-center justify-center w-8 h-8 border border-app-border rounded-md transition-all duration-200",
                currentPage === 1
                  ? "bg-app-bg text-app-secondary cursor-not-allowed"
                  : "bg-white text-app-text hover:bg-app-bg hover:border-app-accent"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={cn(
                "flex items-center justify-center w-8 h-8 border border-app-border rounded-md transition-all duration-200",
                currentPage === totalPages
                  ? "bg-app-bg text-app-secondary cursor-not-allowed"
                  : "bg-white text-app-text hover:bg-app-bg hover:border-app-accent"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}