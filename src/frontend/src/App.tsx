import { Toaster } from "@/components/ui/sonner";
import { useCallback, useState } from "react";
import AnalyticsBar from "./components/AnalyticsBar";
import CityMap from "./components/CityMap";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import TopNav from "./components/TopNav";
import {
  type AIRecommendation,
  type CityZone,
  type CoolingStrategy,
  type SimulationResult,
  cityZones,
  getAIRecommendations,
  predictCooling,
} from "./data/cityData";

let simulationCounter = 0;

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

  // Pre-fill strategy from AI recommendation
  const [prefilledStrategy, setPrefilledStrategy] =
    useState<CoolingStrategy | null>(null);

  const aiRecommendations: AIRecommendation[] = getAIRecommendations(cityZones);

  const handleZoneSelect = useCallback((zone: CityZone) => {
    setSelectedZone(zone);
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

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background grid-bg">
      {/* Top Navigation */}
      <TopNav />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
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

      {/* Bottom Analytics Bar */}
      <AnalyticsBar
        isOpen={isAnalyticsOpen}
        onToggle={() => setIsAnalyticsOpen((v) => !v)}
        zones={cityZones}
        simulationResults={simulationResults}
      />

      <Toaster />
    </div>
  );
}
