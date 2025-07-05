"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SpreadsheetRow, User } from "@/types/spreadsheet"

interface NewTaskDialogProps {
  open: boolean
  onClose: () => void
  onSave: (task: Omit<SpreadsheetRow, "id">) => void
  currentUser: User
}

export function NewTaskDialog({ open, onClose, onSave, currentUser }: NewTaskDialogProps) {
  const [formData, setFormData] = useState({
    jobRequest: "",
    description: "",
    assignee: "",
    priority: "Medium",
    dueDate: "",
    budget: "",
    estValue: "",
    url: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.jobRequest.trim()) {
      alert("Job request is required!")
      return
    }

    const newTask: Omit<SpreadsheetRow, "id"> = {
      jobRequest: formData.jobRequest.trim(),
      description: formData.description.trim(),
      submitted: new Date().toLocaleDateString("en-GB"),
      status: "Submitted",
      submitter: currentUser.name,
      url: formData.url.trim() || "www.example.com",
      assignee: formData.assignee.trim() || "Unassigned",
      priority: formData.priority,
      dueDate: formData.dueDate || new Date().toLocaleDateString("en-GB"),
      budget: formData.budget || "0",
      estValue: formData.estValue || "0",
      createdBy: currentUser.email,
    }

    onSave(newTask)

    // Reset form
    setFormData({
      jobRequest: "",
      description: "",
      assignee: "",
      priority: "Medium",
      dueDate: "",
      budget: "",
      estValue: "",
      url: "",
    })

    onClose()
  }

  const handleCancel = () => {
    setFormData({
      jobRequest: "",
      description: "",
      assignee: "",
      priority: "Medium",
      dueDate: "",
      budget: "",
      estValue: "",
      url: "",
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job Request</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobRequest">Job Request *</Label>
            <Input
              id="jobRequest"
              placeholder="Enter job request..."
              value={formData.jobRequest}
              onChange={(e) => setFormData((prev) => ({ ...prev, jobRequest: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the task in detail..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                placeholder="Assign to..."
                value={formData.assignee}
                onChange={(e) => setFormData((prev) => ({ ...prev, assignee: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                placeholder="0"
                value={formData.budget}
                onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estValue">Est.Value</Label>
            <Input
              id="estValue"
              type="number"
              placeholder="0"
              value={formData.estValue}
              onChange={(e) => setFormData((prev) => ({ ...prev, estValue: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL/Link</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
