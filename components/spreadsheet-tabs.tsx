"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"

interface SpreadsheetTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function SpreadsheetTabs({ activeTab, onTabChange }: SpreadsheetTabsProps) {
  const [tabs, setTabs] = useState(["All Orders", "Pending", "Reviewed", "Arrived"])

  const addNewTab = () => {
    const newTabName = `Tab ${tabs.length + 1}`
    setTabs([...tabs, newTabName])
    onTabChange(newTabName)
    console.log(`New tab added: ${newTabName}`)
  }

  return (
    <div className="flex items-center space-x-1 mt-4 border-t border-gray-200 pt-2 overflow-x-auto">
      <div className="flex items-center space-x-1 min-w-max">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "ghost"}
            size="sm"
            className={`text-xs sm:text-sm whitespace-nowrap ${
              activeTab === tab
                ? "bg-white border border-gray-300 text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => {
              onTabChange(tab)
              console.log(`Tab changed to: ${tab}`)
            }}
          >
            {tab}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          onClick={addNewTab}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
