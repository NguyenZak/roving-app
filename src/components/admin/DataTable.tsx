"use client";

import { useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

type Column<T> = {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
};

type ServerPagingProps = {
  total?: number;
  serverPaging?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
};

export default function DataTable<T extends Record<string, unknown>>({
  rows,
  columns,
  initialSortKey,
  pageSize: initialPageSize = 10,
  total,
  serverPaging = false,
  onPageChange,
  onPageSizeChange,
}: {
  rows: T[];
  columns: Column<T>[];
  initialSortKey?: string;
  pageSize?: number;
} & ServerPagingProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortKey, setSortKey] = useState<string | undefined>(initialSortKey);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    if (serverPaging) return rows;
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q));
  }, [rows, query, serverPaging]);

  const sorted = useMemo(() => {
    if (serverPaging) return filtered;
    if (!sortKey) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = String(a[sortKey as keyof typeof a] ?? "").toLowerCase();
      const bv = String(b[sortKey as keyof typeof b] ?? "").toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filtered, sortKey, sortDir, serverPaging]);

  const totalItems = serverPaging && typeof total === "number" ? total : sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pageRows = useMemo(() => {
    if (serverPaging) return rows;
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize, serverPaging, rows]);

  function toggleSort(key: string, sortable?: boolean) {
    if (serverPaging) return;
    if (!sortable) return;
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  }

  function goToPage(next: number) {
    const clamped = Math.min(Math.max(1, next), totalPages);
    setPage(clamped);
    onPageChange?.(clamped);
  }

  function changePageSize(next: number) {
    const value = Math.min(100, Math.max(5, next));
    setPageSize(value);
    setPage(1);
    onPageSizeChange?.(value);
  }

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="p-0">
        {/* Search and Actions Bar */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search records..."
                  className="pl-10 h-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm"
                  disabled={serverPaging}
                />
              </div>
              <Button variant="outline" size="sm" className="h-10 px-4 border-gray-200 hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600 font-medium">
                {totalItems.toLocaleString()} results
              </div>
              <Button variant="outline" size="sm" className="h-10 px-4 border-gray-200 hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                {columns.map((c) => (
                  <th
                    key={String(c.key)}
                    className={`text-left p-4 font-semibold text-gray-700 text-sm ${c.className ?? ""} ${
                      c.sortable && !serverPaging 
                        ? "cursor-pointer select-none hover:bg-gray-100 transition-colors" 
                        : ""
                    }`}
                    onClick={() => toggleSort(String(c.key), c.sortable)}
                  >
                    <div className="inline-flex items-center gap-2">
                      {c.header}
                      {!serverPaging && sortKey === c.key && (
                        <span className="text-blue-600 font-bold text-xs">
                          {sortDir === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageRows.map((r, i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                  {columns.map((c) => (
                    <td key={String(c.key)} className={`p-4 ${c.className ?? ""}`}>
                      {c.render ? c.render(r) : String(r[c.key as keyof typeof r] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td className="p-12 text-center text-gray-500" colSpan={columns.length}>
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="text-sm font-medium">No data found</div>
                      <div className="text-xs text-gray-400">Try adjusting your search or filters</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-gray-600 font-medium">
              Page {page} of {totalPages}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => goToPage(1)}
                className="h-8 px-3 border-gray-200 hover:bg-gray-50"
              >
                <ChevronsLeft className="h-3.5 w-3.5 mr-1" />
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                className="h-8 px-3 border-gray-200 hover:bg-gray-50"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                Prev
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className="h-8 w-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
                className="h-8 px-3 border-gray-200 hover:bg-gray-50"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => goToPage(totalPages)}
                className="h-8 px-3 border-gray-200 hover:bg-gray-50"
              >
                Last
                <ChevronsRight className="h-3.5 w-3.5 ml-1" />
              </Button>
              
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-600 font-medium">Show:</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => changePageSize(Number(value))}
                >
                  <SelectTrigger className="w-20 h-8 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 50, 100].map((v) => (
                      <SelectItem key={v} value={v.toString()}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


