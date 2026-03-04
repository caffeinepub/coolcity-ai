# CoolCity AI – Into Fresh Urban

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Interactive city heatmap using Leaflet.js with color-coded zones (red/yellow/green) representing heat intensity
- Urban cooling simulator: users click a map location and apply strategies (plant trees, green roofs, water bodies, reflective surfaces)
- AI cooling prediction: formula-based model simulating ML output — predicts temperature reduction based on number of trees, vegetation density, building density, and land surface temperature
- Smart recommendation system: analyzes heat zones and surfaces top 3 hottest areas with recommended interventions
- Visualization dashboard: charts for predicted temperature reduction, sustainability score, and carbon absorption impact
- Metrics panel: displays before/after temperature, cooling effect delta, sustainability score
- Full-width smart city dashboard layout with sidebar navigation, map panel, analytics panel, and cooling impact graphs
- Simulated city heat data (grid-based lat/lng points with temperature values for a sample city)

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend (Motoko)
- `CityZone` type: id, name, lat, lng, baseTemperature, vegetationDensity, buildingDensity
- `SimulationResult` type: zoneId, strategy, treesAdded, predictedTempReduction, sustainabilityScore, carbonAbsorption, timestamp
- Store zones as stable array of pre-seeded city heat zone data (20+ zones across a sample city grid)
- `getZones()` -> returns all city zones with heat data
- `simulateCooling(zoneId, strategy, treesAdded, vegetationDensity)` -> runs prediction formula, stores and returns SimulationResult
- `getSimulationHistory()` -> returns past simulations
- `getRecommendations()` -> returns top 3 zones with highest heat reduction potential
- `getAnalytics()` -> returns aggregated stats (avg temp, total carbon saved, avg sustainability score)
- Prediction formula: tempReduction = (treesAdded * 0.15) + (vegetationDensity * 0.8) + (strategy bonus) — simulates ML regression output

### Frontend
- Dashboard layout: top nav bar, left sidebar with zone list and recommendations, main content area
- Map panel: Leaflet map centered on sample city, heatmap overlay using circle markers colored by temperature, clickable markers to select zones
- Simulation panel: selected zone info, strategy selector (4 options), sliders for tree count and vegetation density, "Run Simulation" CTA
- Results card: shows current temp, predicted temp after intervention, cooling effect delta, sustainability score, carbon absorption
- Analytics panel: line/bar charts for temperature trends across zones, sustainability scores per strategy
- AI Recommendation panel: top 3 hottest zones with recommended actions and estimated cooling effect
- Responsive layout optimized for desktop dashboard use
