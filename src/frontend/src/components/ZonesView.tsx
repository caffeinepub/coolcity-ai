import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Flame, TrendingDown, Zap } from "lucide-react";
import {
  type AIRecommendation,
  type CityZone,
  STRATEGY_ICONS,
  STRATEGY_LABELS,
  getTempColor,
} from "../data/cityData";

type Props = {
  recommendations: AIRecommendation[];
  zones: CityZone[];
  selectedZone: CityZone | null;
  onZoneSelect: (zone: CityZone) => void;
  onRecommendationSimulate: (rec: AIRecommendation) => void;
  onTabChange: (tab: string) => void;
};

export default function ZonesView({
  recommendations,
  zones,
  selectedZone,
  onZoneSelect,
  onRecommendationSimulate,
  onTabChange,
}: Props) {
  return (
    <div
      className="flex flex-col overflow-y-auto flex-1"
      data-ocid="zones.panel"
    >
      {/* AI Recommendations */}
      <div
        className="p-4 border-b border-border"
        style={{ background: "oklch(0.13 0.012 240)" }}
      >
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.18 195 / 0.2) 0%, oklch(0.78 0.18 195 / 0.05) 100%)",
              border: "1px solid oklch(0.78 0.18 195 / 0.4)",
              boxShadow: "0 0 16px oklch(0.78 0.18 195 / 0.2)",
            }}
          >
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-display font-bold text-foreground leading-none">
              AI Recommendations
            </h2>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
              Top priority cooling targets
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <MobileRecommendationCard
              key={rec.zone.id}
              rec={rec}
              index={index}
              onSimulate={(r) => {
                onRecommendationSimulate(r);
                onTabChange("simulate");
              }}
            />
          ))}
        </div>
      </div>

      {/* Zone List */}
      <div className="flex-1" style={{ background: "oklch(0.13 0.012 240)" }}>
        <div
          className="flex items-center gap-2 px-4 py-3 border-b border-border sticky top-0 z-10"
          style={{ background: "oklch(0.13 0.012 240)" }}
        >
          <Zap className="w-3.5 h-3.5 text-primary" />
          <h3 className="text-xs font-display font-semibold text-foreground">
            All Zones
          </h3>
          <Badge
            variant="outline"
            className="text-[10px] ml-auto border-border text-muted-foreground"
          >
            {zones.length}
          </Badge>
        </div>

        <div className="p-3 space-y-1">
          {zones.map((zone, index) => (
            <MobileZoneListItem
              key={zone.id}
              zone={zone}
              index={index + 1}
              isSelected={selectedZone?.id === zone.id}
              onClick={() => {
                onZoneSelect(zone);
                onTabChange("map");
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Recommendation Card (mobile-optimized)
// ============================================================

const RANK_LABELS = ["#1 CRITICAL", "#2 HIGH", "#3 ELEVATED"];
const RANK_GRADIENTS = [
  "linear-gradient(135deg, oklch(0.62 0.24 27 / 0.18) 0%, oklch(0.15 0.015 240) 60%)",
  "linear-gradient(135deg, oklch(0.72 0.22 50 / 0.14) 0%, oklch(0.15 0.015 240) 60%)",
  "linear-gradient(135deg, oklch(0.78 0.18 70 / 0.10) 0%, oklch(0.15 0.015 240) 60%)",
];
const RANK_BORDER_COLORS = [
  "oklch(0.62 0.24 27 / 0.5)",
  "oklch(0.72 0.22 50 / 0.4)",
  "oklch(0.78 0.18 70 / 0.35)",
];
const RANK_GLOW_COLORS = [
  "oklch(0.62 0.24 27 / 0.2)",
  "oklch(0.72 0.22 50 / 0.15)",
  "oklch(0.78 0.18 70 / 0.12)",
];
const RANK_TEXT_COLORS = [
  "oklch(0.72 0.22 27)",
  "oklch(0.78 0.18 50)",
  "oklch(0.84 0.16 70)",
];

type RecCardProps = {
  rec: AIRecommendation;
  index: number;
  onSimulate: (rec: AIRecommendation) => void;
};

function MobileRecommendationCard({ rec, index, onSimulate }: RecCardProps) {
  const ocidIndex = index + 1;
  const tempColor = getTempColor(rec.zone.baseTemperature);
  const borderColor = RANK_BORDER_COLORS[index] ?? "oklch(0.28 0.025 240)";
  const glowColor = RANK_GLOW_COLORS[index] ?? "transparent";
  const gradient = RANK_GRADIENTS[index] ?? "oklch(0.15 0.015 240)";
  const rankTextColor = RANK_TEXT_COLORS[index] ?? "oklch(0.6 0.05 220)";

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: gradient,
        border: `1px solid ${borderColor}`,
        boxShadow: `0 2px 12px ${glowColor}`,
      }}
      data-ocid={`recommendation.item.${ocidIndex}`}
    >
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-col min-w-0 flex-1">
            <span
              className="text-[9px] font-mono font-bold tracking-widest uppercase mb-1 leading-none"
              style={{ color: rankTextColor }}
            >
              {RANK_LABELS[index] ?? `#${ocidIndex}`}
            </span>
            <span className="text-sm font-display font-bold text-foreground leading-tight">
              {rec.zone.name}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
              {rec.zone.district}
            </span>
          </div>
          <div className="flex-shrink-0 text-right">
            <div
              className="text-2xl font-display font-black leading-none tabular-nums"
              style={{ color: tempColor }}
            >
              {rec.zone.baseTemperature}°
            </div>
            <div
              className="text-[9px] font-mono leading-none mt-0.5"
              style={{ color: tempColor, opacity: 0.7 }}
            >
              CELSIUS
            </div>
          </div>
        </div>

        <div
          className="h-px mb-2"
          style={{
            background: `linear-gradient(90deg, ${borderColor} 0%, transparent 100%)`,
          }}
        />

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-base leading-none">
              {STRATEGY_ICONS[rec.recommendedStrategy]}
            </span>
            <div>
              <div className="text-[10px] font-mono text-muted-foreground leading-none">
                Recommended
              </div>
              <div className="text-[11px] font-semibold text-foreground leading-tight mt-0.5">
                {STRATEGY_LABELS[rec.recommendedStrategy]}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <TrendingDown className="w-3 h-3 text-emerald-400" />
            <span className="text-[12px] font-mono font-bold text-emerald-400">
              −{rec.estimatedCooling.toFixed(1)}°C
            </span>
          </div>
        </div>
      </div>

      <div
        className="px-3 py-2.5 flex items-center justify-between"
        style={{
          background: "oklch(0 0 0 / 0.15)",
          borderTop: `1px solid ${borderColor}`,
        }}
      >
        <div className="flex items-center gap-1.5">
          <Flame className="w-3 h-3" style={{ color: tempColor }} />
          <span
            className="text-[10px] font-mono"
            style={{ color: rankTextColor }}
          >
            High heat stress
          </span>
        </div>
        <Button
          size="sm"
          className="h-8 px-4 text-[11px] font-mono font-bold tracking-wide"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.78 0.18 195 / 0.25) 0%, oklch(0.78 0.18 195 / 0.1) 100%)",
            border: "1px solid oklch(0.78 0.18 195 / 0.5)",
            color: "oklch(0.85 0.12 195)",
          }}
          onClick={() => onSimulate(rec)}
          data-ocid={`recommendation.simulate_button.${ocidIndex}`}
        >
          Simulate →
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// Zone List Item (mobile)
// ============================================================

type ZoneItemProps = {
  zone: CityZone;
  index: number;
  isSelected: boolean;
  onClick: () => void;
};

function MobileZoneListItem({
  zone,
  index,
  isSelected,
  onClick,
}: ZoneItemProps) {
  const color = getTempColor(zone.baseTemperature);
  const ocidAttr = index <= 20 ? `zone.item.${index}` : undefined;

  return (
    <button
      type="button"
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150 ${
        isSelected ? "border" : "border border-transparent"
      }`}
      style={
        isSelected
          ? {
              background:
                "linear-gradient(90deg, oklch(0.78 0.18 195 / 0.1) 0%, transparent 100%)",
              borderColor: "oklch(0.78 0.18 195 / 0.35)",
            }
          : {
              background: "oklch(0.16 0.013 240)",
              borderColor: "oklch(0.22 0.02 240)",
            }
      }
      onClick={onClick}
      data-ocid={ocidAttr}
    >
      <div
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{
          backgroundColor: color,
          boxShadow: isSelected ? `0 0 8px ${color}` : "none",
        }}
      />
      <span
        className={`flex-1 text-sm font-body ${
          isSelected ? "text-primary font-semibold" : "text-foreground/80"
        }`}
      >
        {zone.name}
      </span>
      <span className="text-[10px] text-muted-foreground/60 font-mono">
        {zone.district}
      </span>
      <span
        className="text-[13px] font-mono font-bold flex-shrink-0 tabular-nums"
        style={{ color }}
      >
        {zone.baseTemperature}°
      </span>
    </button>
  );
}
