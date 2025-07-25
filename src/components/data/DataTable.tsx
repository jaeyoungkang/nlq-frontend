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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataRow, DataValue } from '@/lib/types';
import { ChevronLeft, ChevronRight, Download, Eye } from 'lucide-react';
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
    return <span className="text-muted-foreground italic">NULL</span>;
  }

  if (typeof value === 'boolean') {
    return (
      <Badge variant={value ? "default" : "secondary"} className="text-xs">
        {value ? 'TRUE' : 'FALSE'}
      </Badge>
    );
  }

  if (typeof value === 'number') {
    // 큰 숫자는 천 단위 구분자 추가
    if (Math.abs(value) >= 1000) {
      return value.toLocaleString('ko-KR');
    }
    // 소수점이 있는 경우 적절히 반올림
    if (value % 1 !== 0) {
      return parseFloat(value.toFixed(4)).toString();
    }
    return value.toString();
  }

  if (typeof value === 'string') {
    // 날짜 형식 감지
    if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
      try {
        const date = new Date(value);
        return date.toLocaleDateString('ko-KR');
      } catch {
        return value;
      }
    }

    // URL 감지
    if (value.match(/^https?:\/\//)) {
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline"
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
          className="cursor-help"
        >
          {value.substring(0, 50)}...
        </span>
      );
    }
  }

  return String(value);
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
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Eye className="h-8 w-8 mx-auto mb-2" />
            <p>표시할 데이터가 없습니다.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              {title || '쿼리 결과'}
            </CardTitle>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>총 {data.length.toLocaleString()}개</span>
              {hasMoreData && (
                <Badge variant="outline" className="text-xs">
                  상위 {maxRows}개만 표시
                </Badge>
              )}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="h-8"
          >
            <Download className="h-4 w-4 mr-1" />
            CSV
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column} className="whitespace-nowrap">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    {columns.map((column) => (
                      <TableCell key={column} className="max-w-xs">
                        {formatCellValue(row[column])}
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
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              페이지 {currentPage} / {totalPages}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}