"use client"

import { useState, useEffect } from "react"
import { SpreadsheetHeader } from "@/components/spreadsheet-header"
import { SpreadsheetToolbar } from "@/components/spreadsheet-toolbar"
import { SpreadsheetGrid } from "@/components/spreadsheet-grid"
import { SpreadsheetTabs } from "@/components/spreadsheet-tabs"
import { LoginDialog } from "@/components/login-dialog"
import type { SpreadsheetRow, User } from "@/types/spreadsheet"

const initialData: SpreadsheetRow[] = [
  {
    id: 1,
    jobRequest: "Q3 Financial Overview",
    submitted: "30-11-2024",
    status: "In-progress",
    submitter: "Asha Patel",
    url: "www.ashapatel.com",
    assignee: "Sophie Choudhury",
    priority: "Medium",
    dueDate: "20-11-2024",
    budget: "6,200,000",
    estValue: "5,800,000",
    createdBy: "asha@company.com",
    description: "Complete quarterly financial analysis and reporting",
  },
  {
    id: 2,
    jobRequest: "Launch marketing campaign for product",
    submitted: "28-10-2024",
    status: "Need to start",
    submitter: "Irfan Khan",
    url: "www.irfankhan.com",
    assignee: "Nisha Pandey",
    priority: "High",
    dueDate: "30-10-2024",
    budget: "3,500,000",
    estValue: "4,200,000",
    createdBy: "irfan@company.com",
    description: "Design and execute comprehensive marketing strategy",
  },
  {
    id: 3,
    jobRequest: "Update user interface feedback for app",
    submitted: "26-10-2024",
    status: "Submitted",
    submitter: "Maria Martinez",
    url: "www.mariamartinez.com",
    assignee: "Rachel Lee",
    priority: "Medium",
    dueDate: "10-12-2024",
    budget: "4,750,000",
    estValue: "4,500,000",
    createdBy: "maria@company.com",
    description: "Collect and implement user feedback for UI improvements",
  },
  {
    id: 4,
    jobRequest: "Update news list for company redesign",
    submitted: "01-01-2025",
    status: "Complete",
    submitter: "Emily Green",
    url: "www.emilygreen.com",
    assignee: "Tom Wright",
    priority: "Low",
    dueDate: "15-01-2025",
    budget: "6,200,000",
    estValue: "6,000,000",
    createdBy: "emily@company.com",
    description: "Redesign company news section with modern layout",
  },
  {
    id: 5,
    jobRequest: "Design new features for the website",
    submitted: "25-01-2025",
    status: "Blocked",
    submitter: "Jessica Brown",
    url: "www.jessicabrown.com",
    assignee: "Kevin Smith",
    priority: "Low",
    dueDate: "30-01-2025",
    budget: "2,800,000",
    estValue: "3,100,000",
    createdBy: "jessica@company.com",
    description: "Create wireframes and prototypes for new website features",
  },
]

export default function SpreadsheetApp() {
  const [activeTab, setActiveTab] = useState("All Orders")
  const [data, setData] = useState<SpreadsheetRow[]>([])
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [filterText, setFilterText] = useState("")
  const [searchText, setSearchText] = useState("")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showGridView, setShowGridView] = useState(false)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("spreadsheet-data")
    const savedUser = localStorage.getItem("current-user")

    if (savedData) {
      setData(JSON.parse(savedData))
    } else {
      setData(initialData)
      localStorage.setItem("spreadsheet-data", JSON.stringify(initialData))
    }

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    } else {
      setShowLoginDialog(true)
    }
  }, [])

  // Save data to localStorage whenever data changes
  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem("spreadsheet-data", JSON.stringify(data))
    }
  }, [data])

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    localStorage.setItem("current-user", JSON.stringify(user))
    setShowLoginDialog(false)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem("current-user")
    setShowLoginDialog(true)
  }

  if (!currentUser) {
    return <LoginDialog open={showLoginDialog} onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SpreadsheetHeader
        searchText={searchText}
        onSearchChange={setSearchText}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <div className="px-2 sm:px-4 py-2">
        <SpreadsheetToolbar
          data={data}
          setData={setData}
          hiddenColumns={hiddenColumns}
          setHiddenColumns={setHiddenColumns}
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
          filterText={filterText}
          setFilterText={setFilterText}
          currentUser={currentUser}
          showGridView={showGridView}
          setShowGridView={setShowGridView}
        />
        <SpreadsheetGrid
          data={data}
          setData={setData}
          hiddenColumns={hiddenColumns}
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
          filterText={filterText}
          searchText={searchText}
          activeTab={activeTab}
          currentUser={currentUser}
          showGridView={showGridView}
        />
        <SpreadsheetTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}
