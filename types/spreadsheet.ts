export interface SpreadsheetRow {
  id: number
  jobRequest: string
  submitted: string
  status: string
  submitter: string
  url: string
  assignee: string
  priority: string
  dueDate: string
  budget: string
  estValue: string
  createdBy: string
  description: string
}

export interface User {
  email: string
  name: string
  avatar?: string
}

export interface ToolbarProps {
  data: SpreadsheetRow[]
  setData: (data: SpreadsheetRow[]) => void
  hiddenColumns: string[]
  setHiddenColumns: (columns: string[]) => void
  sortConfig: { key: string; direction: "asc" | "desc" } | null
  setSortConfig: (config: { key: string; direction: "asc" | "desc" } | null) => void
  filterText: string
  setFilterText: (text: string) => void
  currentUser: User
  showGridView: boolean
  setShowGridView: (show: boolean) => void
}

export interface GridProps {
  data: SpreadsheetRow[]
  setData: (data: SpreadsheetRow[]) => void
  hiddenColumns: string[]
  sortConfig: { key: string; direction: "asc" | "desc" } | null
  setSortConfig: (config: { key: string; direction: "asc" | "desc" } | null) => void
  filterText: string
  searchText: string
  activeTab: string
  currentUser: User
  showGridView?: boolean
}
