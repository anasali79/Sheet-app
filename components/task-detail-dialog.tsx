"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, User, DollarSign, Link, Clock, AlertCircle } from "lucide-react"
import type { SpreadsheetRow, User as UserType } from "@/types/spreadsheet"

interface TaskDetailDialogProps {
  open: boolean
  onClose: () => void
  task: SpreadsheetRow | null
  onUpdateStatus: (taskId: number, newStatus: string) => void
  currentUser: UserType
}

export function TaskDetailDialog({ open, onClose, task, onUpdateStatus, currentUser }: TaskDetailDialogProps) {
  const [newStatus, setNewStatus] = useState("")

  if (!task) return null

  const canEditStatus = task.createdBy === currentUser.email
  const isTaskCreator = task.createdBy === currentUser.email

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

  const handleStatusUpdate = () => {
    if (newStatus && newStatus !== task.status) {
      onUpdateStatus(task.id, newStatus)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{task.jobRequest}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={`${getStatusBadge(task.status)}`}>{task.status}</Badge>
            <Badge className={`${getPriorityBadge(task.priority)}`}>{task.priority} Priority</Badge>
            {isTaskCreator && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Your Task
              </Badge>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Description</h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{task.description}</p>
            </div>
          )}

          {/* Task Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Created by</p>
                  <p className="font-medium">{task.submitter}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Assigned to</p>
                  <p className="font-medium">{task.assignee}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium">{task.dueDate}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="font-medium">{task.submitted}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-medium">₹{task.budget}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Est.Value</p>
                  <p className="font-medium">₹{task.estValue}</p>
                </div>
              </div>

              {task.url && (
                <div className="flex items-center space-x-2">
                  <Link className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">URL</p>
                    <a
                      href={task.url.startsWith("http") ? task.url : `https://${task.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {task.url}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Update Section */}
          {canEditStatus ? (
            <div className="border-t pt-4 space-y-3">
              <h3 className="font-medium text-gray-900">Update Status</h3>
              <div className="flex items-center space-x-3">
                <Select value={newStatus || task.status} onValueChange={setNewStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="Need to start">Need to start</SelectItem>
                    <SelectItem value="In-progress">In-progress</SelectItem>
                    <SelectItem value="Complete">Complete</SelectItem>
                    <SelectItem value="Blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleStatusUpdate} disabled={!newStatus || newStatus === task.status} size="sm">
                  Update Status
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-t pt-4">
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm">Only the task creator can change the status of this task.</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
