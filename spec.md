# CoolCity AI – Real-World Click-to-Analyze Map

## Current State
The app has a Leaflet map using CartoDB dark matter tiles centered on NYC. Users can only click pre-defined circular zone markers (20 fixed NYC zones). Each zone has static temperature, building density, and vegetation data. The simulation panel shows cooling strategy results, but does not explain WHY a location is hot or give specific tree-count recommendations with real-world context.

## Requested Changes (Diff)

### Add
- **Click-anywhere map interaction**: User can click any point on the real map (not just pre-defined markers). Clicking reveals lat/lng coordinates and reverse-geocodes to a real address/neighborhood name.
- **AI Heat Diagnosis panel**: After clicking a location, the AI analyzes: (1) current estimated temperature for that area, (2) specific causes of high heat (e.g. concrete coverage, building density, lack of green space, industrial activity), (3) real-world context (e.g. "This area is similar to Midtown Manhattan which records 42°C in summer").
- **AI Tree Recommendation**: After analysis, the AI recommends a specific number of trees to plant, broken down by type (shade trees, fruit trees, ornamental) with expected cooling effect per tree type.
- **Satellite/Street tile toggle**: Allow switching between dark city map and OpenStreetMap/satellite view for real-world visual context.
- **Heat cause badges**: Visual tags explaining WHY the selected area is hot (e.g. "High Asphalt Coverage", "No Tree Canopy", "Industrial Zone", "Dense Building Grid").
- **Real-world examples**: Show real city examples of successful urban greening (e.g. "Singapore's 'City in a Garden' reduced urban temps by 4°C with 7 million trees").
- **Expanded CityZone type**: Add fields for `heatCauses`, `realWorldExample`, `treeRecommendation` (count by type), and `causeDescription`.

### Modify
- **CityMap**: Replace click-only-on-marker with also click-on-map behavior. Add tile layer switcher (dark / street / satellite). Show a crosshair cursor over the map. Display a pulsing pin at the last clicked location.
- **CityZone data**: Enrich all 20 NYC zones with detailed heat cause tags, real-world comparison examples, and AI tree breakdown recommendations.
- **RightPanel**: Show new AI Diagnosis section above the cooling strategy controls. Include heat cause badges, cause description, real-world example box, and tree recommendation breakdown.
- **SimulateView (mobile)**: Same AI Diagnosis section added at top.

### Remove
- Nothing removed.

## Implementation Plan
1. Extend `CityZone` type with: `heatCauses: string[]`, `causeDescription: string`, `realWorldExample: string`, `treeRecommendation: { shade: number; fruit: number; ornamental: number; totalNeeded: number; coolingPerTree: number }`.
2. Enrich all 20 NYC zones in `cityData.ts` with the new fields using real-world data references.
3. Add `getLocationAnalysis(lat, lng)` function that finds nearest zone or interpolates data for arbitrary map clicks.
4. Update `CityMap.tsx`:
   - Add map click handler (`map.on('click', ...)`) that triggers `onLocationClick(lat, lng)`
   - Add tile layer switcher (3 options: dark, street, satellite)
   - Show animated pin marker at clicked arbitrary location
   - Keep existing zone circle markers
5. Update `App.tsx` to handle `onLocationClick` — finds nearest zone or generates synthetic zone data for the clicked point.
6. Update `RightPanel.tsx` and `SimulateView.tsx`:
   - Add `AIDiagnosis` component showing: heat cause badges, cause description paragraph, real-world example card, and tree recommendation table (shade/fruit/ornamental counts)
   - Place it above the existing strategy controls
7. Update `LeftPanel.tsx` AI Recommendations to also show cause tags inline.
