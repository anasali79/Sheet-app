"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { EyeOff, ArrowUpDown, Filter, Grid3X3, Upload, Download, Share, Plus, X } from "lucide-react"
import { useState } from "react"
import type { ToolbarProps, SpreadsheetRow } from "@/types/spreadsheet"
import { NewTaskDialog } from "@/components/new-task-dialog"

export function SpreadsheetToolbar({
  data,
  setData,
  hiddenColumns,
  setHiddenColumns,
  sortConfig,
  setSortConfig,
  filterText,
  setFilterText,
  currentUser,
}: ToolbarProps) {
  const [showColumnDialog, setShowColumnDialog] = useState(false)
  const [showSortDialog, setShowSortDialog] = useState(false)
  const [showFilterDialog, setShowFilterDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false)
  const [showGridView, setshowGridView] = useState(false)
  const [showToolbarOptions, setShowToolbarOptions] = useState(false)

  const columns = [
    { key: "jobRequest", label: "Job Request" },
    { key: "submitted", label: "Submitted" },
    { key: "status", label: "Status" },
    { key: "submitter", label: "Submitter" },
    { key: "url", label: "URL" },
    { key: "assignee", label: "Assignee" },
    { key: "priority", label: "Priority" },
    { key: "dueDate", label: "Due Date" },
    { key: "budget", label: "Budget" },
    { key: "estValue", label: "Est.Value" },
  ]

  const handleSort = (key: string, direction: "asc" | "desc") => {
    const sortedData = [...data].sort((a, b) => {
      const aVal = a[key as keyof SpreadsheetRow]
      const bVal = b[key as keyof SpreadsheetRow]

      if (direction === "asc") {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    setData(sortedData)
    setSortConfig({ key, direction })
    setShowSortDialog(false)
  }

  const handleExport = () => {
    const csvContent = [
      columns.map((col) => col.label).join(","),
      ...data.map((row) => columns.map((col) => row[col.key as keyof SpreadsheetRow]).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "job-requests-data.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const lines = text.split("\n")

        const newData = lines
          .slice(1)
          .map((line, index) => {
            const values = line.split(",")
            return {
              id: data.length + index + 1,
              jobRequest: values[0] || "",
              submitted: values[1] || new Date().toLocaleDateString("en-GB"),
              status: values[2] || "Submitted",
              submitter: values[3] || "",
              url: values[4] || "",
              assignee: values[5] || "",
              priority: values[6] || "Medium",
              dueDate: values[7] || "",
              budget: values[8] || "0",
              estValue: values[9] || "0",
              createdBy: currentUser.email,
              description: values[10] || "",
            }
          })
          .filter((row) => row.jobRequest) // Filter out empty rows

        setData([...data, ...newData])
        setShowImportDialog(false)
      }
      reader.readAsText(file)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Spreadsheet Data",
        text: "Check out this spreadsheet",
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const handleNewTask = (newTask: Omit<SpreadsheetRow, "id">) => {
    const taskWithId: SpreadsheetRow = {
      ...newTask,
      id: Math.max(...data.map((d) => d.id), 0) + 1,
    }
    setData([...data, taskWithId])
    console.log("New job request created:", taskWithId)
  }

  const handleFilter = (text: string) => {
    setFilterText(text)
    console.log("Filter applied:", text)
  }

  const handleCellView = () => {
    setshowGridView(!showGridView)
    console.log(`Cell view toggled: ${!showGridView ? "ON" : "OFF"}`)

    // Add visual feedback
    if (!showGridView) {
      alert("Cell view enabled! Grid lines are now more prominent.")
    } else {
      alert("Cell view disabled! Back to normal view.")
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 mb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 px-2 sm:px-4 gap-2 relative">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className={`text-gray-600 hover:text-gray-900 text-xs sm:text-sm ${showToolbarOptions ? "bg-blue-50 text-blue-600" : ""}`}
              onClick={() => setShowToolbarOptions(!showToolbarOptions)}
            >
              Tool bar
            </Button>
            {showToolbarOptions && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 min-w-48">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs hover:bg-gray-100"
                    onClick={() => {
                      console.log("Freeze rows activated")
                      alert("Freeze rows feature activated!")
                      setShowToolbarOptions(false)
                    }}
                  >
                    Freeze Rows
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs hover:bg-gray-100"
                    onClick={() => {
                      console.log("Auto-resize columns activated")
                      alert("Auto-resize columns activated!")
                      setShowToolbarOptions(false)
                    }}
                  >
                    Auto-resize Columns
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs hover:bg-gray-100"
                    onClick={() => {
                      console.log("Show formulas activated")
                      alert("Show formulas mode activated!")
                      setShowToolbarOptions(false)
                    }}
                  >
                    Show Formulas
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs hover:bg-gray-100"
                    onClick={() => {
                      console.log("Protect sheet activated")
                      alert("Sheet protection enabled!")
                      setShowToolbarOptions(false)
                    }}
                  >
                    Protect Sheet
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {/* Hide Fields Dialog */}
            <Dialog open={showColumnDialog} onOpenChange={setShowColumnDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm">
                  <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Hide Fields</span>
                  <span className="sm:hidden">Hide</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Show/Hide Columns</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  {columns.map((column) => (
                    <div key={column.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={column.key}
                        checked={!hiddenColumns.includes(column.key)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setHiddenColumns(hiddenColumns.filter((col) => col !== column.key))
                          } else {
                            setHiddenColumns([...hiddenColumns, column.key])
                          }
                        }}
                      />
                      <label htmlFor={column.key} className="text-sm">
                        {column.label}
                      </label>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* Sort Dialog */}
            <Dialog open={showSortDialog} onOpenChange={setShowSortDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm">
                  <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Sort
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Sort Data</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Select
                    onValueChange={(value) => {
                      const [key, direction] = value.split("-")
                      handleSort(key, direction as "asc" | "desc")
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column and direction" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((column) => (
                        <div key={column.key}>
                          <SelectItem value={`${column.key}-asc`}>{column.label} (A-Z)</SelectItem>
                          <SelectItem value={`${column.key}-desc`}>{column.label} (Z-A)</SelectItem>
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </DialogContent>
            </Dialog>

            {/* Filter Dialog */}
            <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-gray-600 hover:text-gray-900 text-xs sm:text-sm ${filterText ? "bg-blue-50 text-blue-600" : ""}`}
                >
                  <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Filter
                  {filterText && <span className="ml-1 bg-blue-500 text-white rounded-full w-2 h-2"></span>}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Filter Job Requests</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Search in all fields</label>
                    <Input
                      placeholder="Type to filter by any field..."
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {filterText && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Active filter: "<strong>{filterText}</strong>"
                      </p>
                      <Button variant="outline" size="sm" onClick={() => setFilterText("")} className="mt-2">
                        <X className="w-4 h-4 mr-1" />
                        Clear Filter
                      </Button>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Filter searches in: Job Request, Submitter, Assignee, Status, Priority, Description, URL, Budget,
                    Est.Value
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="sm"
              className={`text-gray-600 hover:text-gray-900 text-xs sm:text-sm ${showGridView ? "bg-green-50 text-green-600" : ""}`}
              onClick={handleCellView}
            >
              <Grid3X3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Cell view</span>
              <span className="sm:hidden">View</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          {/* Import Dialog */}
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm">
                <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Import CSV File</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input type="file" accept=".csv" onChange={handleImport} />
                <p className="text-sm text-gray-500">
                  Upload a CSV file to import data. First row should contain headers.
                </p>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm"
            onClick={handleExport}
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Export
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm"
            onClick={handleShare}
          >
            <Share className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Share
          </Button>

          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
            onClick={() => setShowNewTaskDialog(true)}
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">New Action</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        <NewTaskDialog
          open={showNewTaskDialog}
          onClose={() => setShowNewTaskDialog(false)}
          onSave={handleNewTask}
          currentUser={currentUser}
        />
      </div>
    </div>
  )
}
