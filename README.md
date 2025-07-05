# Job Request Spreadsheet

A modern, responsive spreadsheet application built for managing job requests and tasks. Think Google Sheets but specifically designed for project management workflows.

## What This Does

This app helps teams track job requests from submission to completion. Each row represents a task with details like assignee, priority, budget, and status. Users can filter, sort, and manage tasks through an intuitive spreadsheet interface.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone or download this project
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open http://localhost:3000 in your browser

### First Time Setup

When you first open the app, you'll see a login screen. You can either:
- Enter your name and email to create a profile
- Use the quick login buttons (John Doe or Jane Smith) for testing

All data is stored locally in your browser, so you won't lose your work between sessions.

## Key Features

**Spreadsheet Interface**
- Click any cell to select it
- Double-click to edit values
- Drag to scroll horizontally on large datasets
- Mobile-responsive design that switches to card view on phones

**Task Management**
- Create new job requests with detailed forms
- Update task status (Submitted → In Progress → Complete)
- Assign tasks to team members
- Set priorities and due dates

**Data Operations**
- Sort by any column (A-Z or Z-A)
- Filter across all fields with live search
- Export data to CSV files
- Import existing CSV data
- Hide/show specific columns

**Views & Organization**
- Table view for detailed data entry
- Grid view for quick overview
- Tab-based filtering (All, Pending, Reviewed, Arrived)
- Cell view mode for enhanced grid visibility

## How to Use

### Adding New Tasks
1. Click the green "New Action" button in the toolbar
2. Fill out the job request form
3. Task appears immediately in the spreadsheet

### Managing Existing Tasks
- Click any job title to see full task details
- Double-click status or priority cells to change values
- Use the toolbar buttons to sort, filter, or hide columns

### Data Management
- Export: Downloads current data as CSV
- Import: Upload CSV files to add bulk data
- Share: Copies current page URL to clipboard

## Technical Details

Built with:
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library for consistent UI
- **Local Storage** - Data persistence without backend

### Architecture Decisions

**Why Local Storage?**
Keeps things simple for demo purposes. In production, you'd want a proper database, but this lets you test immediately without setup.

**Component Structure**
- Each major section (header, toolbar, grid, tabs) is a separate component
- Shared types in `/types` folder for consistency
- Props drilling instead of context - easier to debug for this scale

**Mobile Strategy**
Rather than cramming a desktop table onto mobile, we switch to a card-based layout. Much better user experience on phones.

## Known Limitations

**Data Scale**
Currently optimized for ~100-500 rows. For thousands of rows, you'd want virtual scrolling and server-side filtering.

**Collaboration**
This is single-user only. Real-time collaboration would need WebSockets or similar.

**Data Validation**
Basic validation exists, but production apps would need more robust error handling and data sanitization.

**Browser Compatibility**
Tested on modern browsers. IE support would need polyfills.

## Customization

### Adding New Columns
1. Update the \`SpreadsheetRow\` interface in \`types/spreadsheet.ts\`
2. Add column definition in both toolbar and grid components
3. Update the new task dialog form

### Changing Styles
All styling uses Tailwind classes. Key files:
- \`app/globals.css\` - Global styles and custom scrollbar
- Component files - Individual component styling

### Data Structure
The main data structure is defined in \`types/spreadsheet.ts\`. Each row has:
- Basic info (id, jobRequest, description)
- People (submitter, assignee, createdBy)
- Status tracking (status, priority, submitted, dueDate)
- Financial (budget, estValue)
- Metadata (url)

## Deployment

For production deployment:

1. Build the project:
   \`\`\`bash
   npm run build
   \`\`\`

2. Deploy to Vercel (recommended):
   \`\`\`bash
   npx vercel
   \`\`\`

Or deploy the \`out\` folder to any static hosting service.

## Future Improvements

If I were to extend this:
- Add user authentication and multi-tenancy
- Implement real-time collaboration
- Add more chart/visualization options
- Include file attachments for tasks
- Add email notifications for status changes
- Implement proper database with API layer

The current version prioritizes simplicity and immediate usability over enterprise features.
