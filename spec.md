# CoolCity AI – Mobile Layout

## Current State
The app is a desktop 3-panel layout:
- Fixed `w-80` left sidebar (AI Recommendations + zone list)
- Full-height center map
- Fixed `w-[360px]` right sidebar (simulation controls + results)
- Collapsible bottom analytics bar
- TopNav header with desktop stats

Everything uses `flex-row` layout, wide fixed widths, and hidden-sm classes — entirely unusable on mobile.

## Requested Changes (Diff)

### Add
- Mobile-first bottom tab navigation (4 tabs: Map, Zones, Simulate, Analytics)
- Swipeable/tappable panel views for each tab
- Mobile-aware TopNav that shows compact title + live badge only
- Full-screen map view on Map tab with overlay controls (legend, zone tooltip)
- Scrollable zones list view (AI Recommendations + zone list combined)
- Simulation panel as a vertically scrolling full-screen view
- Analytics tab with zone temperature chart and history chart stacked vertically
- Floating action button on map view: "Select Zone → Simulate" shortcut
- Mobile-sized touch targets (min 44px) on all interactive elements
- Active zone summary pill pinned above bottom nav on Map tab

### Modify
- `App.tsx` — add tab state management, render correct view per tab, pass mobile context
- `TopNav.tsx` — hide desktop stat row; show only logo + live badge on mobile; use responsive breakpoints
- `LeftPanel.tsx` — repurpose as `ZonesView` (full-screen vertical scroll, no fixed width)
- `RightPanel.tsx` — repurpose as `SimulateView` (full-screen vertical scroll, no fixed width)
- `AnalyticsBar.tsx` — repurpose as `AnalyticsView` (full-screen stacked charts, no bottom bar toggle on mobile)
- `CityMap.tsx` — make map full-screen on mobile, adjust overlays to not conflict with top/bottom bars

### Remove
- Desktop side-by-side 3-column `flex-row` layout (replaced by tab-based layout on mobile, kept on desktop via responsive breakpoints)

## Implementation Plan
1. Update `App.tsx`:
   - Add `activeTab` state (`"map" | "zones" | "simulate" | "analytics"`)
   - On mobile: render tab-based single-screen layout
   - On desktop (md+): keep existing 3-panel layout
   - Pass `onTabChange` to components that need to navigate (e.g., Recommend → Simulate)
2. Create `BottomNav.tsx` — 4 icon+label tabs with active state, fixed to bottom
3. Update `TopNav.tsx` — compact on mobile, full stats on md+
4. Create `ZonesView.tsx` — full-screen scrollable mobile view combining AI recommendations + zone list
5. Create `SimulateView.tsx` — full-screen scrollable mobile simulation panel
6. Create `AnalyticsView.tsx` — full-screen stacked analytics charts for mobile
7. Update `CityMap.tsx` — ensure overlays (legend, zone pill) respect safe areas and nav heights
8. Apply `safe-area` padding for iOS notch/home bar
