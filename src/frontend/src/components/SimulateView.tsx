import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  ArrowRight,
  Building2,
  Layers,
  Leaf,
  Loader2,
  MapPin,
  Play,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  type CityZone,
  type CoolingStrategy,
  STRATEGY_ICONS,
  STRATEGY_LABELS,
  type SimulationResult,
  getTempBadgeClass,
  getTempColor,
} from "../data/cityData";

type Props = {
  selectedZone: CityZone | null;
  isSimulating: boolean;
  latestResult: SimulationResult | null;
  prefilledStrategy: CoolingStrategy | null;
  onRunSimulation: (
    strategy: CoolingStrategy,
    treesAdded: number,
    vegetationBoost: number,
  ) => void;
  onGoToZones: () => void;
};

const STRATEGIES: CoolingStrategy[] = [
  "trees",
  "green_roof",
  "water_body",
  "reflective",
];

export default function SimulateView({
  selectedZone,
  isSimulating,
  latestResult,
  prefilledStrategy,
  onRunSimulation,
  onGoToZones,
}: Props) {
  const [strategy, setStrategy] = useState<CoolingStrategy>("trees");
  const [treesAdded, setTreesAdded] = useState(50);
  const [vegetationBoost, setVegetationBoost] = useState(0.3);

  useEffect(() => {
    if (prefilledStrategy) {
      setStrategy(prefilledStrategy);
    }
  }, [prefilledStrategy]);

  return (
    <div
      className="flex flex-col overflow-y-auto flex-1"
      data-ocid="simulate.panel"
    >
      {!selectedZone ? (
        <MobileEmptyState onGoToZones={onGoToZones} />
      ) : (
        <div className="flex flex-col">
          {/* Zone Header */}
          <MobileZoneHeader zone={selectedZone} />

          {/* Controls */}
          <div className="p-4 space-y-5">
            {/* Strategy Selector */}
            <div>
              <h3 className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Cooling Strategy
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {STRATEGIES.map((s, i) => (
                  <MobileStrategyCard
                    key={s}
                    strategy={s}
                    isSelected={strategy === s}
                    index={i + 1}
                    onClick={() => setStrategy(s)}
                  />
                ))}
              </div>
            </div>

            {/* Sliders */}
            <MobileSliderControl
              label="Trees Added"
              value={treesAdded}
              displayValue={`${treesAdded}`}
              displayColor="oklch(0.78 0.18 195)"
              min={0}
              max={200}
              step={1}
              onChange={setTreesAdded}
              ocid="simulation.trees_input"
              minLabel="0"
              maxLabel="200"
            />

            <MobileSliderControl
              label="Vegetation Boost"
              value={vegetationBoost}
              displayValue={`${(vegetationBoost * 100).toFixed(0)}%`}
              displayColor="oklch(0.73 0.18 155)"
              min={0}
              max={1}
              step={0.05}
              onChange={setVegetationBoost}
              ocid="simulation.vegetation_input"
              minLabel="0%"
              maxLabel="100%"
            />

            {/* Run Button */}
            <button
              type="button"
              className="w-full h-14 rounded-2xl font-display font-bold text-base tracking-wide flex items-center justify-center gap-2.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isSimulating
                  ? "oklch(0.20 0.018 240)"
                  : "linear-gradient(135deg, oklch(0.80 0.18 195) 0%, oklch(0.68 0.22 185) 100%)",
                color: "oklch(0.08 0.02 240)",
                boxShadow: isSimulating
                  ? "none"
                  : "0 0 24px oklch(0.78 0.18 195 / 0.35), 0 4px 12px oklch(0 0 0 / 0.3)",
              }}
              disabled={isSimulating}
              onClick={() =>
                onRunSimulation(strategy, treesAdded, vegetationBoost)
              }
              data-ocid="simulation.submit_button"
            >
              {isSimulating ? (
                <>
                  <Loader2
                    className="h-5 w-5 animate-spin"
                    style={{ color: "oklch(0.78 0.18 195)" }}
                  />
                  <span style={{ color: "oklch(0.78 0.18 195)" }}>
                    Processing predictions…
                  </span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  Run AI Simulation
                </>
              )}
            </button>

            {/* Simulating state */}
            {isSimulating && (
              <div
                className="rounded-xl border p-4"
                style={{
                  borderColor: "oklch(0.78 0.18 195 / 0.2)",
                  background: "oklch(0.78 0.18 195 / 0.04)",
                }}
                data-ocid="results.loading_state"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse-cyan" />
                  <span className="text-sm font-mono text-primary">
                    Neural network processing…
                  </span>
                </div>
                <MobileSimulatingBar />
              </div>
            )}
          </div>

          {/* Result Card */}
          {latestResult && !isSimulating && (
            <div className="px-4 pb-4">
              <MobileSimulationResultCard
                result={latestResult}
                baseTemp={selectedZone.baseTemperature}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Empty State
// ============================================================

function MobileEmptyState({ onGoToZones }: { onGoToZones: () => void }) {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center p-8 text-center"
      data-ocid="simulation.zone_empty_state"
    >
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.78 0.18 195 / 0.1) 0%, oklch(0.78 0.18 195 / 0.03) 100%)",
          border: "1px solid oklch(0.78 0.18 195 / 0.2)",
        }}
      >
        <MapPin
          className="w-9 h-9"
          style={{ color: "oklch(0.78 0.18 195 / 0.5)" }}
        />
      </div>
      <h3 className="text-base font-display font-bold text-foreground mb-2">
        No Zone Selected
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px] mb-6">
        Select a zone from the Zones tab first to run AI cooling simulations
      </p>
      <Button
        className="h-12 px-6 text-sm font-semibold gap-2"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.78 0.18 195 / 0.25) 0%, oklch(0.78 0.18 195 / 0.1) 100%)",
          border: "1px solid oklch(0.78 0.18 195 / 0.5)",
          color: "oklch(0.85 0.12 195)",
        }}
        onClick={onGoToZones}
        data-ocid="simulate.zones_link"
      >
        <Layers className="w-4 h-4" />
        Go to Zones
      </Button>
    </div>
  );
}

// ============================================================
// Zone Header (mobile)
// ============================================================

function MobileZoneHeader({ zone }: { zone: CityZone }) {
  const tempColor = getTempColor(zone.baseTemperature);

  return (
    <div
      className="px-4 py-4 border-b border-border relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.16 0.015 240) 0%, oklch(0.13 0.012 240) 100%)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-40 h-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at right center, ${tempColor}18 0%, transparent 70%)`,
        }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-[11px] font-mono text-muted-foreground">
              {zone.district}
            </span>
          </div>
          <h2 className="text-base font-display font-bold text-foreground leading-tight mb-3">
            {zone.name}
          </h2>
          <div className="space-y-2">
            <MobileDensityBar
              icon={<Building2 className="w-3 h-3 text-orange-400" />}
              label="Building"
              value={zone.buildingDensity}
              color="oklch(0.72 0.22 50)"
            />
            <MobileDensityBar
              icon={<Leaf className="w-3 h-3 text-emerald-400" />}
              label="Vegetation"
              value={zone.vegetationDensity}
              color="oklch(0.73 0.18 155)"
            />
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div
            className="font-display font-black leading-none tabular-nums"
            style={{
              fontSize: "48px",
              color: tempColor,
              textShadow: `0 0 30px ${tempColor}80`,
              lineHeight: 1,
            }}
          >
            {zone.baseTemperature}°
          </div>
          <div
            className="text-[10px] font-mono font-semibold tracking-widest mt-1"
            style={{ color: tempColor, opacity: 0.65 }}
          >
            CELSIUS
          </div>
          <Badge
            variant="outline"
            className={`text-[9px] mt-2 ${getTempBadgeClass(zone.baseTemperature)}`}
          >
            Base Temp
          </Badge>
        </div>
      </div>
    </div>
  );
}

function MobileDensityBar({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-[11px] font-mono text-muted-foreground w-16 flex-shrink-0">
        {label}
      </span>
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ background: "oklch(0.20 0.018 240)" }}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${value * 100}%`, background: color }}
        />
      </div>
      <span
        className="text-[11px] font-mono font-bold w-9 text-right"
        style={{ color }}
      >
        {(value * 100).toFixed(0)}%
      </span>
    </div>
  );
}

// ============================================================
// Strategy Card (mobile)
// ============================================================

function MobileStrategyCard({
  strategy,
  isSelected,
  index,
  onClick,
}: {
  strategy: CoolingStrategy;
  isSelected: boolean;
  index: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="flex flex-col items-center gap-2 p-3.5 rounded-xl transition-all duration-150 min-h-[72px] justify-center"
      style={
        isSelected
          ? {
              background:
                "linear-gradient(135deg, oklch(0.78 0.18 195 / 0.2) 0%, oklch(0.78 0.18 195 / 0.06) 100%)",
              border: "1px solid oklch(0.78 0.18 195 / 0.6)",
              boxShadow: "0 0 16px oklch(0.78 0.18 195 / 0.2)",
            }
          : {
              background: "oklch(0.17 0.015 240)",
              border: "1px solid oklch(0.22 0.02 240)",
            }
      }
      onClick={onClick}
      data-ocid={`strategy.item.${index}`}
    >
      <span className="text-xl leading-none">{STRATEGY_ICONS[strategy]}</span>
      <span
        className="text-[11px] font-semibold text-center leading-tight"
        style={{
          color: isSelected ? "oklch(0.85 0.14 195)" : "oklch(0.55 0.01 220)",
        }}
      >
        {STRATEGY_LABELS[strategy]}
      </span>
    </button>
  );
}

// ============================================================
// Slider Control (mobile)
// ============================================================

type SliderControlProps = {
  label: string;
  value: number;
  displayValue: string;
  displayColor: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  ocid: string;
  minLabel: string;
  maxLabel: string;
};

function MobileSliderControl({
  label,
  value,
  displayValue,
  displayColor,
  min,
  max,
  step,
  onChange,
  ocid,
  minLabel,
  maxLabel,
}: SliderControlProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-mono font-semibold text-muted-foreground uppercase tracking-widest">
          {label}
        </span>
        <span
          className="text-base font-display font-black tabular-nums"
          style={{ color: displayColor }}
        >
          {displayValue}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="w-full"
        data-ocid={ocid}
      />
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-muted-foreground/50 font-mono">
          {minLabel}
        </span>
        <span className="text-[10px] text-muted-foreground/50 font-mono">
          {maxLabel}
        </span>
      </div>
    </div>
  );
}

// ============================================================
// Simulating Bar
// ============================================================

function MobileSimulatingBar() {
  return (
    <div
      className="relative h-1.5 rounded-full overflow-hidden"
      style={{ background: "oklch(0.20 0.018 240)" }}
    >
      <div
        className="absolute inset-y-0 left-0 w-1/3 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.78 0.18 195), transparent)",
          animation: "slide-right 1.4s ease-in-out infinite",
        }}
      />
    </div>
  );
}

// ============================================================
// Simulation Result Card (mobile)
// ============================================================

function MobileSimulationResultCard({
  result,
  baseTemp,
}: {
  result: SimulationResult;
  baseTemp: number;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-fade-up"
      style={{
        border: "1px solid oklch(0.73 0.18 155 / 0.3)",
        boxShadow:
          "0 0 32px oklch(0.73 0.18 155 / 0.12), 0 8px 24px oklch(0 0 0 / 0.3)",
      }}
      data-ocid="results.card"
    >
      {/* Header strip */}
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.73 0.18 155 / 0.15) 0%, oklch(0.73 0.18 155 / 0.05) 100%)",
          borderBottom: "1px solid oklch(0.73 0.18 155 / 0.2)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-cyan" />
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
            Simulation Complete
          </span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          {STRATEGY_ICONS[result.strategy]} {STRATEGY_LABELS[result.strategy]}
        </span>
      </div>

      {/* Before / After */}
      <div className="relative" style={{ background: "oklch(0.11 0.010 240)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-y-0 left-0 w-[45%]"
            style={{
              background:
                "radial-gradient(ellipse at left center, oklch(0.62 0.24 27 / 0.12) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute inset-y-0 right-0 w-[45%]"
            style={{
              background:
                "radial-gradient(ellipse at right center, oklch(0.73 0.18 155 / 0.12) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative grid grid-cols-3 items-center py-6 px-3">
          <div className="text-center">
            <div className="text-[9px] font-mono font-semibold tracking-[0.2em] text-muted-foreground/60 mb-2 uppercase">
              Before
            </div>
            <div
              className="font-display font-black tabular-nums leading-none"
              style={{
                fontSize: "42px",
                color: "oklch(0.70 0.23 27)",
                textShadow: "0 0 24px oklch(0.62 0.24 27 / 0.5)",
              }}
            >
              {baseTemp}°
            </div>
            <div
              className="text-[9px] font-mono mt-1"
              style={{ color: "oklch(0.70 0.23 27)", opacity: 0.6 }}
            >
              CELSIUS
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div
              className="px-2.5 py-1.5 rounded-lg text-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.73 0.18 155 / 0.25) 0%, oklch(0.73 0.18 155 / 0.08) 100%)",
                border: "1px solid oklch(0.73 0.18 155 / 0.5)",
                boxShadow: "0 0 16px oklch(0.73 0.18 155 / 0.25)",
              }}
            >
              <div
                className="text-[20px] font-display font-black leading-none tabular-nums"
                style={{ color: "oklch(0.80 0.18 155)" }}
              >
                −{result.tempReduction}°
              </div>
            </div>
            <ArrowRight
              className="w-4 h-4 mt-1"
              style={{ color: "oklch(0.73 0.18 155 / 0.5)" }}
            />
          </div>

          <div className="text-center">
            <div className="text-[9px] font-mono font-semibold tracking-[0.2em] text-muted-foreground/60 mb-2 uppercase">
              After
            </div>
            <div
              className="font-display font-black tabular-nums leading-none"
              style={{
                fontSize: "42px",
                color: "oklch(0.78 0.18 155)",
                textShadow: "0 0 24px oklch(0.73 0.18 155 / 0.5)",
              }}
            >
              {result.finalTemperature}°
            </div>
            <div
              className="text-[9px] font-mono mt-1"
              style={{ color: "oklch(0.78 0.18 155)", opacity: 0.6 }}
            >
              CELSIUS
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div
        className="grid grid-cols-3 divide-x divide-border"
        style={{
          background: "oklch(0.14 0.012 240)",
          borderTop: "1px solid oklch(0.20 0.018 240)",
        }}
      >
        <MobileMetricCell
          label="Sustainability"
          value={`${result.sustainabilityScore}`}
          unit="/100"
          color="oklch(0.78 0.18 195)"
          bar={result.sustainabilityScore}
        />
        <MobileMetricCell
          label="Carbon Saved"
          value={
            result.carbonAbsorption >= 1000
              ? `${(result.carbonAbsorption / 1000).toFixed(1)}k`
              : `${result.carbonAbsorption}`
          }
          unit="kg CO₂/yr"
          color="oklch(0.73 0.18 155)"
        />
        <MobileMetricCell
          label="Cooling"
          value={`${result.tempReduction}`}
          unit="°C"
          color="oklch(0.82 0.2 80)"
        />
      </div>

      <div
        className="px-4 py-2.5 text-center"
        style={{
          background: "oklch(0.12 0.010 240)",
          borderTop: "1px solid oklch(0.18 0.016 240)",
        }}
      >
        <span className="text-[10px] font-mono text-muted-foreground/60">
          {result.treesAdded} trees ·{" "}
          {(result.vegetationBoost * 100).toFixed(0)}% vegetation ·{" "}
          {STRATEGY_LABELS[result.strategy]}
        </span>
      </div>
    </div>
  );
}

function MobileMetricCell({
  label,
  value,
  unit,
  color,
  bar,
}: {
  label: string;
  value: string;
  unit: string;
  color: string;
  bar?: number;
}) {
  return (
    <div className="px-3 py-3">
      <div className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-widest mb-1.5 leading-none">
        {label}
      </div>
      <div className="flex items-baseline gap-0.5">
        <span
          className="text-[17px] font-display font-black leading-none tabular-nums"
          style={{ color }}
        >
          {value}
        </span>
        <span
          className="text-[9px] font-mono leading-none"
          style={{ color, opacity: 0.55 }}
        >
          {unit}
        </span>
      </div>
      {bar !== undefined && (
        <div
          className="mt-1.5 h-0.5 rounded-full overflow-hidden"
          style={{ background: "oklch(0.20 0.018 240)" }}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${bar}%`, background: color }}
          />
        </div>
      )}
    </div>
  );
}
