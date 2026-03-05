import { Toaster } from "@/components/ui/sonner";
import { useCallback, useState } from "react";
import AnalyticsBar from "./components/AnalyticsBar";
import AnalyticsView from "./components/AnalyticsView";
import BottomNav from "./components/BottomNav";
import CityMap from "./components/CityMap";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import SimulateView from "./components/SimulateView";
import TopNav from "./components/TopNav";
import ZonesView from "./components/ZonesView";
import {
  type AIRecommendation,
  type CityZone,
  type CoolingStrategy,
  type SimulationResult,
  cityZones,
  findNearestZone,
  getAIRecommendations,
  predictCooling,
} from "./data/cityData";

let simulationCounter = 0;

type MobileTab = "map" | "zones" | "simulate" | "analytics";

export default function App() {
  const [selectedZone, setSelectedZone] = useState<CityZone | null>(null);
  const [simulationResults, setSimulationResults] = useState<
    SimulationResult[]
  >([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [latestResult, setLatestResult] = useState<SimulationResult | null>(
    null,
  );
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<MobileTab>("map");

  // Pre-fill strategy from AI recommendation
  const [prefilledStrategy, setPrefilledStrategy] =
    useState<CoolingStrategy | null>(null);

  const aiRecommendations: AIRecommendation[] = getAIRecommendations(cityZones);

  const handleZoneSelect = useCallback((zone: CityZone) => {
    setSelectedZone(zone);
    setLatestResult(null);
    setPrefilledStrategy(null);
  }, []);

  // Handle click anywhere on map — find nearest zone
  const handleLocationClick = useCallback((lat: number, lng: number) => {
    const nearest = findNearestZone(lat, lng);
    setSelectedZone(nearest);
    setLatestResult(null);
    setPrefilledStrategy(null);
  }, []);

  const handleRecommendationSimulate = useCallback((rec: AIRecommendation) => {
    setSelectedZone(rec.zone);
    setPrefilledStrategy(rec.recommendedStrategy);
    setLatestResult(null);
  }, []);

  const handleRunSimulation = useCallback(
    (
      strategy: CoolingStrategy,
      treesAdded: number,
      vegetationBoost: number,
    ) => {
      if (!selectedZone) return;

      setIsSimulating(true);

      // Simulate async AI processing
      setTimeout(() => {
        simulationCounter += 1;
        const prediction = predictCooling(
          selectedZone,
          strategy,
          treesAdded,
          vegetationBoost,
        );

        const result: SimulationResult = {
          ...prediction,
          id: simulationCounter,
          timestamp: new Date(),
        };

        setLatestResult(result);
        setSimulationResults((prev) => [result, ...prev].slice(0, 50));
        setIsSimulating(false);
      }, 1200);
    },
    [selectedZone],
  );

  // Mobile: when zone is tapped on map, switch to simulate tab
  const handleMapZoneSelect = useCallback(
    (zone: CityZone) => {
      handleZoneSelect(zone);
    },
    [handleZoneSelect],
  );

  // Mobile: click anywhere on map → nearest zone
  const handleMobileLocationClick = useCallback(
    (lat: number, lng: number) => {
      handleLocationClick(lat, lng);
    },
    [handleLocationClick],
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background grid-bg">
      {/* Top Navigation */}
      <TopNav />

      {/* ================================================================
          DESKTOP LAYOUT (md+): original 3-panel layout
          ================================================================ */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <LeftPanel
          recommendations={aiRecommendations}
          zones={cityZones}
          selectedZone={selectedZone}
          onZoneSelect={handleZoneSelect}
          onRecommendationSimulate={handleRecommendationSimulate}
        />

        {/* Center Map */}
        <main className="flex-1 relative overflow-hidden">
          <CityMap
            zones={cityZones}
            selectedZone={selectedZone}
            onZoneSelect={handleZoneSelect}
            onLocationClick={handleLocationClick}
            simulationResults={simulationResults}
          />
        </main>

        {/* Right Panel */}
        <RightPanel
          selectedZone={selectedZone}
          isSimulating={isSimulating}
          latestResult={latestResult}
          prefilledStrategy={prefilledStrategy}
          onRunSimulation={handleRunSimulation}
        />
      </div>

      {/* Desktop Analytics Bar */}
      <div className="hidden md:block">
        <AnalyticsBar
          isOpen={isAnalyticsOpen}
          onToggle={() => setIsAnalyticsOpen((v) => !v)}
          zones={cityZones}
          simulationResults={simulationResults}
        />
      </div>

      {/* ================================================================
          MOBILE LAYOUT (< md): tab-based single view + BottomNav
          ================================================================ */}
      <div
        className="flex md:hidden flex-1 flex-col overflow-hidden"
        style={{
          paddingBottom: "calc(3.5rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {/* Map tab */}
        <div
          className={`flex-1 overflow-hidden ${activeTab === "map" ? "flex" : "hidden"}`}
        >
          <CityMap
            zones={cityZones}
            selectedZone={selectedZone}
            onZoneSelect={handleMapZoneSelect}
            onLocationClick={handleMobileLocationClick}
            simulationResults={simulationResults}
            onGoToSimulate={() => setActiveTab("simulate")}
            isMobile={true}
          />
        </div>

        {/* Zones tab */}
        <div
          className={`flex-1 overflow-hidden ${activeTab === "zones" ? "flex flex-col" : "hidden"}`}
        >
          <ZonesView
            recommendations={aiRecommendations}
            zones={cityZones}
            selectedZone={selectedZone}
            onZoneSelect={handleZoneSelect}
            onRecommendationSimulate={handleRecommendationSimulate}
            onTabChange={(tab) => setActiveTab(tab as MobileTab)}
          />
        </div>

        {/* Simulate tab */}
        <div
          className={`flex-1 overflow-hidden ${activeTab === "simulate" ? "flex flex-col" : "hidden"}`}
        >
          <SimulateView
            selectedZone={selectedZone}
            isSimulating={isSimulating}
            latestResult={latestResult}
            prefilledStrategy={prefilledStrategy}
            onRunSimulation={handleRunSimulation}
            onGoToZones={() => setActiveTab("zones")}
          />
        </div>

        {/* Analytics tab */}
        <div
          className={`flex-1 overflow-hidden ${activeTab === "analytics" ? "flex flex-col" : "hidden"}`}
        >
          <AnalyticsView
            zones={cityZones}
            simulationResults={simulationResults}
          />
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <Toaster />
    </div>
  );
}
