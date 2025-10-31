# Design Guidelines: MongoDB Dashboard Enhancements

## Design Approach
**System-Based Enhancement**: Building upon the existing shadcn/ui + Tailwind design system. This is a utility-focused data dashboard requiring clarity, efficiency, and professional aesthetics. The enhancements maintain the current design language while adding new functional components.

## Core Design Principles

### 1. Status Visual System
**Three-Status Color Coding**
- **LOADED (Success)**: Use `bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200` for badges
- **OPEN (In Progress)**: Use `bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200` for badges
- **FAILED (Error)**: Use `bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200` for badges

Badge Design:
- Rounded pills: `rounded-full px-2.5 py-0.5`
- Small text: `text-xs font-medium`
- Consistent positioning in table cells

### 2. Typography Hierarchy
Maintain existing system:
- Page titles: `text-2xl font-semibold`
- Section headings: `text-base font-medium`
- Body text: `text-sm`
- Labels: `text-sm font-medium`
- Muted text: `text-sm text-muted-foreground`

### 3. Layout & Spacing
**Spacing Units**: Primarily use Tailwind units of 2, 4, 6, and 8
- Component padding: `p-4` or `p-6`
- Section gaps: `gap-4` or `gap-6`
- Card spacing: `space-y-4`
- Form fields: `space-y-2`

**Container Structure**:
- Page wrapper: `space-y-6`
- Filter sidebar: `w-64` fixed width
- Main content: `flex-1 min-w-0`

### 4. Component Library Enhancements

**Date Filter Component**:
- Card container with border
- Three quick-select buttons in horizontal layout: `flex gap-2`
- Buttons: `variant="outline"` with active state using `variant="default"`
- Date range picker using Popover + Calendar components
- Filter section includes: `CardHeader` with title "Date Range" and `CardContent` with controls

**Payload Editor Modal**:
- Dialog component with `max-w-4xl` width
- Two-column layout for large screens: Original (read-only) | Editable
- Monaco-style JSON editor with syntax highlighting
- Validation indicator: Small badge showing "Valid JSON" (green) or "Invalid JSON" (red)
- Action buttons at bottom: Cancel (outline) + Save (primary with loading state)

**Confirmation Dialog**:
- Compact dialog: `max-w-md`
- Clear warning message with icon
- Two-button layout: Cancel (outline) + Confirm (destructive variant)
- Show validation status in dialog content

**Enhanced Documents Table**:
- Add "Last Updated" column displaying timestamp
- Add "Actions" column with Edit icon button
- Status column displays color-coded badges
- Hover state on rows: `hover:bg-muted/50`
- Compact row height: `py-2`

### 5. Interactive States
**Buttons**:
- Default buttons use elevation system (already in CSS)
- Loading states: Spinner + disabled appearance
- Icon buttons in tables: `h-8 w-8` with `variant="ghost"`

**Form Inputs**:
- Use existing shadcn Input, Select, and Popover components
- Focus rings maintain design system values
- Error states: Red border with small error text below

**Modals & Dialogs**:
- Overlay: `backdrop-blur-sm`
- Smooth transitions (handled by shadcn defaults)
- Close on outside click enabled for filters, disabled for edit confirmations

### 6. Data Visualization
**Tables**:
- Zebra striping: None (keep clean)
- Cell padding: `px-4 py-3`
- Header styling: `font-medium text-muted-foreground`
- Borders: `border-b` on rows

**Statistics Cards**:
- Maintain existing StatsCard design
- Use chart colors from CSS variables for consistency
- Progress bars: `h-2 bg-muted rounded-full` with colored fill

### 7. No Images Required
This dashboard is purely functional with no marketing elements. All visuals are data-driven (charts, tables, statistics).

### 8. Accessibility
- Maintain ARIA labels on all interactive elements
- Keyboard navigation for modals and filters
- Color is not the only indicator (use icons + text with status badges)
- Focus indicators on all form fields and buttons

### 9. Responsive Behavior
- Sidebar collapses on mobile (existing behavior)
- Filter sidebar moves to top on mobile: `flex-col` instead of `flex-row`
- Date picker adapts to smaller screens
- Payload editor stacks vertically on mobile: Single column view
- Table becomes horizontally scrollable: `overflow-x-auto`

### 10. Animation Principles
**Minimal & Purposeful**:
- Loading spinners only
- Modal fade-in (shadcn defaults)
- No decorative animations
- Smooth transitions for state changes: `transition-colors duration-200`

This enhancement maintains the professional, utility-focused aesthetic while adding sophisticated data management capabilities through carefully designed UI components.