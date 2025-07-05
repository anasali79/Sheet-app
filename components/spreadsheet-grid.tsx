"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { GridProps, SpreadsheetRow } from "@/types/spreadsheet"
import { ArrowUpDown, Grid, List, Filter, X, ChevronLeft, ChevronRight } from "lucide-react"
import { TaskDetailDialog } from "@/components/task-detail-dialog"

export function SpreadsheetGrid({
  data,
  setData,
  hiddenColumns,
  sortConfig,
  setSortConfig,
  filterText,
  setFilterText,
  searchText,
  activeTab,
  currentUser,
  showGridView,
}: GridProps) {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: string } | null>(null)
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null)
  const [editValue, setEditValue] = useState("")
  const [selectedTask, setSelectedTask] = useState<SpreadsheetRow | null>(null)
  const [showTaskDetail, setShowTaskDetail] = useState(false)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [scrollPosition, setScrollPosition] = useState(0)

  const columns = [
    { key: "jobRequest", label: "Job Request", icon: "ABC", color: "blue", width: "200px", minWidth: "150px" },
    { key: "submitted", label: "Submitted", icon: "", color: "", width: "100px", minWidth: "90px" },
    { key: "status", label: "Status", icon: "S", color: "orange", width: "120px", minWidth: "100px" },
    { key: "submitter", label: "Submitter", width: "130px", minWidth: "110px" },
    { key: "assignee", label: "Assignee", width: "130px", minWidth: "110px" },
    { key: "priority", label: "Priority", width: "100px", minWidth: "80px" },
    { key: "dueDate", label: "Due Date", width: "100px", minWidth: "90px" },
    { key: "budget", label: "Budget", width: "120px", minWidth: "100px" },
    { key: "estValue", label: "Est.Value", width: "120px", minWidth: "100px" },
    { key: "url", label: "URL", width: "150px", minWidth: "120px" },
  ]

  // Safe string conversion helper
  const safeString = (value: any): string => {
    if (value === null || value === undefined) return ""
    return String(value)
  }

  // Enhanced filtering logic with null checks
  const filteredData = data.filter((row) => {
    if (!row) return false

    // Search filter (from header search)
    if (searchText && searchText.trim()) {
      const searchLower = searchText.toLowerCase()
      const searchableFields = [
        safeString(row.jobRequest),
        safeString(row.submitter),
        safeString(row.assignee),
        safeString(row.status),
        safeString(row.priority),
        safeString(row.description),
        safeString(row.url),
        safeString(row.budget),
        safeString(row.estValue),
      ]
      const matchesSearch = searchableFields.some((field) => field.toLowerCase().includes(searchLower))
      if (!matchesSearch) return false
    }

    // Text filter (from filter dialog)
    if (filterText && filterText.trim()) {
      const filterLower = filterText.toLowerCase()
      const filterableFields = [
        safeString(row.jobRequest),
        safeString(row.submitter),
        safeString(row.assignee),
        safeString(row.status),
        safeString(row.priority),
        safeString(row.description),
        safeString(row.url),
        safeString(row.budget),
        safeString(row.estValue),
      ]
      const matchesFilter = filterableFields.some((field) => field.toLowerCase().includes(filterLower))
      if (!matchesFilter) return false
    }

    // Tab filter
    switch (activeTab) {
      case "Pending":
        return row.status === "Need to start" || row.status === "In-progress"
      case "Reviewed":
        return row.status === "Complete"
      case "Arrived":
        return row.status === "Submitted"
      default:
        return true
    }
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "In-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Need to start": "bg-blue-100 text-blue-800 border-blue-200",
      Submitted: "bg-gray-100 text-gray-800 border-gray-200",
      Complete: "bg-green-100 text-green-800 border-green-200",
      Blocked: "bg-red-100 text-red-800 border-red-200",
    }
    return statusConfig[status as keyof typeof statusConfig] || "bg-gray-100 text-gray-800"
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      High: "bg-red-100 text-red-800 border-red-200",
      Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Low: "bg-green-100 text-green-800 border-green-200",
    }
    return priorityConfig[priority as keyof typeof priorityConfig] || "bg-gray-100 text-gray-800"
  }

  const handleCellClick = (row: number, col: string) => {
    setSelectedCell({ row, col })
    console.log(`Cell clicked: Row ${row}, Col ${col}`)
  }

  const handleCellDoubleClick = (row: number, col: string) => {
    if (filteredData[row]) {
      setEditingCell({ row, col })
      const currentValue = filteredData[row][col as keyof SpreadsheetRow]
      setEditValue(safeString(currentValue))
    }
  }

  const handleCellEdit = (value: string) => {
    if (editingCell && filteredData[editingCell.row]) {
      const updatedData = [...data]
      const originalIndex = data.findIndex((item) => item.id === filteredData[editingCell.row].id)
      if (originalIndex !== -1) {
        updatedData[originalIndex] = {
          ...updatedData[originalIndex],
          [editingCell.col]: value,
        }
        setData(updatedData)
      }
      setEditingCell(null)
      setEditValue("")
    }
  }

  const handleSort = (columnKey: string) => {
    const direction = sortConfig?.key === columnKey && sortConfig.direction === "asc" ? "desc" : "asc"
    setSortConfig({ key: columnKey, direction })
  }

  const visibleColumns = columns.filter((col) => !hiddenColumns.includes(col.key))

  const handleTaskClick = (task: SpreadsheetRow) => {
    setSelectedTask(task)
    setShowTaskDetail(true)
  }

  const handleStatusUpdate = (taskId: number, newStatus: string) => {
    const updatedData = data.map((item) => (item.id === taskId ? { ...item, status: newStatus } : item))
    setData(updatedData)
    console.log(`Status updated for task ${taskId}: ${newStatus}`)
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === "table" ? "grid" : "table")
    console.log(`View mode changed to: ${viewMode === "table" ? "grid" : "table"}`)
  }

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("table-container")
    if (container) {
      const scrollAmount = 300
      const newPosition =
        direction === "left" ? Math.max(0, container.scrollLeft - scrollAmount) : container.scrollLeft + scrollAmount

      container.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  // Truncate text helper
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Grid View Component - Mobile Optimized
  const GridView = () => (
    <div className="grid grid-cols-1 gap-3 p-3">
      {filteredData.map((row) => (
        <div
          key={row.id}
          className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleTaskClick(row)}
        >
          <div className="space-y-2">
            {/* Header with status */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-gray-900 text-sm leading-tight flex-1">
                {truncateText(safeString(row.jobRequest), 35)}
              </h3>
              <Badge className={`text-xs flex-shrink-0 ${getStatusBadge(safeString(row.status))}`}>
                {safeString(row.status)}
              </Badge>
            </div>

            {/* Key info in compact format */}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>
                <span className="text-gray-500">By:</span>
                <span className="font-medium ml-1">{truncateText(safeString(row.submitter), 12)}</span>
              </div>
              <div>
                <span className="text-gray-500">To:</span>
                <span className="font-medium ml-1">{truncateText(safeString(row.assignee), 12)}</span>
              </div>
              <div>
                <span className="text-gray-500">Due:</span>
                <span className="font-medium ml-1">{safeString(row.dueDate)}</span>
              </div>
              <div className="flex items-center">
                <Badge className={`text-xs ${getPriorityBadge(safeString(row.priority))}`}>
                  {safeString(row.priority)}
                </Badge>
              </div>
            </div>

            {/* Budget info */}
            <div className="flex justify-between items-center text-xs pt-1 border-t border-gray-100">
              <div>
                <span className="text-gray-500">Budget:</span>
                <span className="font-medium text-green-600 ml-1">₹{safeString(row.budget)}</span>
              </div>
              <div>
                <span className="text-gray-500">Est:</span>
                <span className="font-medium text-blue-600 ml-1">₹{safeString(row.estValue)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* View Toggle */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-600">
          <span className="hidden sm:inline">
            Showing {filteredData.length} of {data.length} job requests
          </span>
          <span className="sm:hidden">
            {filteredData.length}/{data.length} items
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {viewMode === "table" && (
            <div className="hidden md:flex items-center space-x-1">
              <Button variant="outline" size="sm" onClick={() => handleScroll("left")} className="p-2">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleScroll("right")} className="p-2">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleViewMode}
            className="flex items-center space-x-2 bg-transparent"
          >
            {viewMode === "table" ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
            <span className="hidden sm:inline">{viewMode === "table" ? "Grid View" : "Table View"}</span>
            <span className="sm:hidden">{viewMode === "table" ? "Grid" : "Table"}</span>
          </Button>
        </div>
      </div>

      {(filterText || searchText) && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800">
                {filterText && `Filter: "${filterText}"`}
                {filterText && searchText && " | "}
                {searchText && `Search: "${searchText}"`}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterText("")
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      )}

      {viewMode === "grid" ? (
        <GridView />
      ) : (
        <div
          id="table-container"
          className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{ maxHeight: "75vh" }}
        >
          {/* Mobile Table View - Spreadsheet Style */}
          <div className="block md:hidden">
            <div
              className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
              style={{ maxHeight: "75vh" }}
            >
              <table className="w-full border-collapse min-w-max bg-white">
                <thead className="sticky top-0 bg-gray-50 z-10">
                  <tr className="border-b border-gray-200">
                    <th className="w-8 px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 bg-gray-50">
                      #
                    </th>
                    {visibleColumns.map((column) => (
                      <th
                        key={column.key}
                        className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-gray-100 bg-gray-50 min-w-24"
                        onClick={() => handleSort(column.key)}
                      >
                        <div className="flex items-center space-x-1">
                          <span className="truncate">{column.label}</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((row, rowIndex) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-1 py-2 text-xs text-gray-500 border-r border-gray-200 bg-gray-50 font-medium">
                        {row.id}
                      </td>
                      {visibleColumns.map((column) => (
                        <td
                          key={column.key}
                          className={`px-2 py-2 text-xs border-r border-gray-200 cursor-pointer min-w-24 ${
                            selectedCell?.row === rowIndex && selectedCell?.col === column.key
                              ? "bg-blue-50 ring-2 ring-blue-500"
                              : ""
                          }`}
                          onClick={() => handleCellClick(rowIndex, column.key)}
                          onDoubleClick={() => handleCellDoubleClick(rowIndex, column.key)}
                        >
                          {editingCell?.row === rowIndex && editingCell?.col === column.key ? (
                            column.key === "status" ? (
                              <Select value={editValue} onValueChange={handleCellEdit}>
                                <SelectTrigger className="h-6 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Submitted">Submitted</SelectItem>
                                  <SelectItem value="In-progress">In-progress</SelectItem>
                                  <SelectItem value="Need to start">Need to start</SelectItem>
                                  <SelectItem value="Complete">Complete</SelectItem>
                                  <SelectItem value="Blocked">Blocked</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : column.key === "priority" ? (
                              <Select value={editValue} onValueChange={handleCellEdit}>
                                <SelectTrigger className="h-6 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="High">High</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                  <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={() => handleCellEdit(editValue)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleCellEdit(editValue)
                                  } else if (e.key === "Escape") {
                                    setEditingCell(null)
                                    setEditValue("")
                                  }
                                }}
                                className="h-6 text-xs border-0 bg-transparent p-1"
                                autoFocus
                              />
                            )
                          ) : (
                            <div className="truncate">
                              {column.key === "submitted" ? (
                                <span className="text-gray-600">{safeString(row.submitted)}</span>
                              ) : column.key === "status" ? (
                                <Badge className={`text-xs ${getStatusBadge(safeString(row.status))}`}>
                                  {safeString(row.status)}
                                </Badge>
                              ) : column.key === "priority" ? (
                                <Badge className={`text-xs ${getPriorityBadge(safeString(row.priority))}`}>
                                  {safeString(row.priority)}
                                </Badge>
                              ) : column.key === "url" ? (
                                <span className="text-blue-600 hover:underline cursor-pointer">
                                  {truncateText(safeString(row.url), 15)}
                                </span>
                              ) : column.key === "jobRequest" ? (
                                <button
                                  onClick={() => handleTaskClick(row)}
                                  className="text-left hover:text-blue-600 hover:underline w-full text-xs"
                                  title={safeString(row.jobRequest)}
                                >
                                  {truncateText(safeString(row.jobRequest), 20)}
                                </button>
                              ) : column.key === "budget" || column.key === "estValue" ? (
                                <span className="font-medium text-green-600">
                                  ₹{safeString(row[column.key as keyof SpreadsheetRow])}
                                </span>
                              ) : (
                                <span title={safeString(row[column.key as keyof SpreadsheetRow])}>
                                  {truncateText(safeString(row[column.key as keyof SpreadsheetRow]), 12)}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Empty rows for mobile too */}
                  {Array.from({ length: Math.max(0, 11 - filteredData.length) }, (_, i) => (
                    <tr key={`empty-mobile-${i}`} className="hover:bg-gray-50">
                      <td className="px-1 py-2 text-xs text-gray-500 border-r border-gray-200 bg-gray-50 font-medium">
                        {filteredData.length + i + 1}
                      </td>
                      {visibleColumns.map((column) => (
                        <td
                          key={column.key}
                          className={`px-2 py-2 text-xs border-r border-gray-200 cursor-pointer min-w-24 ${
                            selectedCell?.row === filteredData.length + i && selectedCell?.col === column.key
                              ? "bg-blue-50 ring-2 ring-blue-500"
                              : ""
                          }`}
                          onClick={() => handleCellClick(filteredData.length + i, column.key)}
                        >
                          {selectedCell?.row === filteredData.length + i && selectedCell?.col === column.key && (
                            <Input
                              className="w-full h-full border-none outline-none bg-transparent text-xs"
                              autoFocus
                              placeholder="Enter value..."
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block min-w-max">
            <table className={`w-full border-collapse ${showGridView ? "border-2 border-blue-300" : ""}`}>
              <thead className="sticky top-0 bg-gray-50 z-10">
                <tr className="border-b border-gray-200">
                  <th className="w-12 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 bg-gray-50">
                    #
                  </th>
                  {visibleColumns.map((column) => (
                    <th
                      key={column.key}
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-gray-100 bg-gray-50"
                      style={{ width: column.width, minWidth: column.minWidth }}
                      onClick={() => handleSort(column.key)}
                    >
                      <div className="flex items-center space-x-2">
                        {column.icon && (
                          <div
                            className={`w-5 h-5 bg-${column.color}-100 rounded flex items-center justify-center text-xs font-medium text-${column.color}-600`}
                          >
                            {column.icon}
                          </div>
                        )}
                        <span className="truncate">{column.label}</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((row, rowIndex) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-2 py-3 text-xs text-gray-500 border-r border-gray-200 bg-gray-50 font-medium">
                      {row.id}
                    </td>
                    {visibleColumns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-3 py-3 text-xs border-r border-gray-200 cursor-pointer ${
                          showGridView ? "border-2 border-blue-200 bg-blue-50/30" : "border border-gray-200"
                        } ${
                          selectedCell?.row === rowIndex && selectedCell?.col === column.key
                            ? "bg-blue-50 ring-2 ring-blue-500"
                            : ""
                        }`}
                        style={{ width: column.width, minWidth: column.minWidth }}
                        onClick={() => handleCellClick(rowIndex, column.key)}
                        onDoubleClick={() => handleCellDoubleClick(rowIndex, column.key)}
                      >
                        {editingCell?.row === rowIndex && editingCell?.col === column.key ? (
                          column.key === "status" ? (
                            <Select value={editValue} onValueChange={handleCellEdit}>
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Submitted">Submitted</SelectItem>
                                <SelectItem value="In-progress">In-progress</SelectItem>
                                <SelectItem value="Need to start">Need to start</SelectItem>
                                <SelectItem value="Complete">Complete</SelectItem>
                                <SelectItem value="Blocked">Blocked</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : column.key === "priority" ? (
                            <Select value={editValue} onValueChange={handleCellEdit}>
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={() => handleCellEdit(editValue)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleCellEdit(editValue)
                                } else if (e.key === "Escape") {
                                  setEditingCell(null)
                                  setEditValue("")
                                }
                              }}
                              className="h-7 text-xs border-0 bg-transparent p-1"
                              autoFocus
                            />
                          )
                        ) : (
                          <div className="truncate">
                            {column.key === "submitted" ? (
                              <span className="text-gray-600">{safeString(row.submitted)}</span>
                            ) : column.key === "status" ? (
                              <Badge className={`text-xs ${getStatusBadge(safeString(row.status))}`}>
                                {safeString(row.status)}
                              </Badge>
                            ) : column.key === "priority" ? (
                              <Badge className={`text-xs ${getPriorityBadge(safeString(row.priority))}`}>
                                {safeString(row.priority)}
                              </Badge>
                            ) : column.key === "url" ? (
                              <span className="text-blue-600 hover:underline cursor-pointer">
                                {truncateText(safeString(row.url), 20)}
                              </span>
                            ) : column.key === "jobRequest" ? (
                              <button
                                onClick={() => handleTaskClick(row)}
                                className="text-left hover:text-blue-600 hover:underline w-full text-xs"
                                title={safeString(row.jobRequest)}
                              >
                                {truncateText(safeString(row.jobRequest), 25)}
                              </button>
                            ) : column.key === "budget" || column.key === "estValue" ? (
                              <span className="font-medium text-green-600">
                                ₹{safeString(row[column.key as keyof SpreadsheetRow])}
                              </span>
                            ) : (
                              <span title={safeString(row[column.key as keyof SpreadsheetRow])}>
                                {truncateText(safeString(row[column.key as keyof SpreadsheetRow]), 15)}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Empty rows for spreadsheet feel - limited to 11 total rows */}
                {Array.from({ length: Math.max(0, 11 - filteredData.length) }, (_, i) => (
                  <tr key={`empty-${i}`} className="hover:bg-gray-50">
                    <td className="px-2 py-3 text-xs text-gray-500 border-r border-gray-200 bg-gray-50 font-medium">
                      {filteredData.length + i + 1}
                    </td>
                    {visibleColumns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-3 py-3 text-xs border-r border-gray-200 cursor-pointer ${
                          selectedCell?.row === filteredData.length + i && selectedCell?.col === column.key
                            ? "bg-blue-50 ring-2 ring-blue-500"
                            : ""
                        }`}
                        style={{ width: column.width, minWidth: column.minWidth }}
                        onClick={() => handleCellClick(filteredData.length + i, column.key)}
                      >
                        {selectedCell?.row === filteredData.length + i && selectedCell?.col === column.key && (
                          <Input
                            className="w-full h-full border-none outline-none bg-transparent text-xs"
                            autoFocus
                            placeholder="Enter value..."
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <TaskDetailDialog
        open={showTaskDetail}
        onClose={() => setShowTaskDetail(false)}
        task={selectedTask}
        onUpdateStatus={handleStatusUpdate}
        currentUser={currentUser}
      />
    </div>
  )
}
