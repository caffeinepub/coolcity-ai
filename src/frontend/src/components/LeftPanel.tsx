import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
};

export default function LeftPanel({
  recommendations,
  zones,
  selectedZone,
  onZoneSelect,
  onRecommendationSimulate,
}: Props) {
  return (
    <aside
      className="w-80 flex flex-col border-r border-border overflow-hidden"
      style={{ background: "oklch(0.13 0.012 240)" }}
    >
      {/* AI Recommendations Header */}
      <div className="p-3 border-b border-border">
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

        {/* Recommendation Cards */}
        <div className="space-y-2">
          {recommendations.map((rec, index) => (
            <RecommendationCard
              key={rec.zone.id}
              rec={rec}
              index={index}
              onSimulate={onRecommendationSimulate}
            />
          ))}
        </div>
      </div>

      {/* Zone List */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
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

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
          {zones.map((zone, index) => (
            <ZoneListItem
              key={zone.id}
              zone={zone}
              index={index + 1}
              isSelected={selectedZone?.id === zone.id}
              onClick={() => onZoneSelect(zone)}
            />
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}

// ============================================================
// Recommendation Card — Elevated, gradient, heat-ranked
// ============================================================

const RANK_LABELS = ["#1 CRITICAL", "#2 HIGH", "#3 ELEVATED"];
const RANK_GRADIENTS = [
  // #1 — red heat gradient
  "linear-gradient(135deg, oklch(0.62 0.24 27 / 0.18) 0%, oklch(0.15 0.015 240) 60%)",
  // #2 — orange
  "linear-gradient(135deg, oklch(0.72 0.22 50 / 0.14) 0%, oklch(0.15 0.015 240) 60%)",
  // #3 — amber
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

function RecommendationCard({ rec, index, onSimulate }: RecCardProps) {
  const ocidIndex = index + 1;
  const tempColor = getTempColor(rec.zone.baseTemperature);
  const borderColor = RANK_BORDER_COLORS[index] ?? "oklch(0.28 0.025 240)";
  const glowColor = RANK_GLOW_COLORS[index] ?? "transparent";
  const gradient = RANK_GRADIENTS[index] ?? "oklch(0.15 0.015 240)";
  const rankTextColor = RANK_TEXT_COLORS[index] ?? "oklch(0.6 0.05 220)";

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-250 group cursor-default"
      style={{
        background: gradient,
        border: `1px solid ${borderColor}`,
        boxShadow: `0 0 0 0 ${glowColor}`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          `0 0 20px ${glowColor}, inset 0 1px 0 oklch(1 0 0 / 0.05)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 0 0 0 transparent";
      }}
      data-ocid={`recommendation.item.${ocidIndex}`}
    >
      {/* Rank stripe + zone name row */}
      <div className="px-3 pt-2.5 pb-1.5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex flex-col min-w-0">
            {/* Rank label */}
            <span
              className="text-[9px] font-mono font-bold tracking-widest uppercase mb-1 leading-none"
              style={{ color: rankTextColor }}
            >
              {RANK_LABELS[index] ?? `#${ocidIndex}`}
            </span>
            {/* Zone name */}
            <span className="text-[13px] font-display font-bold text-foreground leading-tight truncate">
              {rec.zone.name}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
              {rec.zone.district}
            </span>
          </div>

          {/* Temperature badge — large, commanding */}
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

        {/* Divider */}
        <div
          className="h-px mb-2"
          style={{
            background: `linear-gradient(90deg, ${borderColor} 0%, transparent 100%)`,
          }}
        />

        {/* Strategy + cooling row */}
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

      {/* Action footer */}
      <div
        className="px-3 py-2 flex items-center justify-between"
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
          className="h-6 px-3 text-[10px] font-mono font-bold tracking-wide"
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
// Zone List Item
// ============================================================

type ZoneItemProps = {
  zone: CityZone;
  index: number;
  isSelected: boolean;
  onClick: () => void;
};

function ZoneListItem({ zone, index, isSelected, onClick }: ZoneItemProps) {
  const color = getTempColor(zone.baseTemperature);
  const ocidAttr = index <= 20 ? `zone.item.${index}` : undefined;

  return (
    <button
      type="button"
      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-all duration-150 ${
        isSelected
          ? "border"
          : "border border-transparent hover:border-border hover:bg-secondary/30"
      }`}
      style={
        isSelected
          ? {
              background:
                "linear-gradient(90deg, oklch(0.78 0.18 195 / 0.1) 0%, transparent 100%)",
              borderColor: "oklch(0.78 0.18 195 / 0.35)",
            }
          : undefined
      }
      onClick={onClick}
      data-ocid={ocidAttr}
    >
      {/* Temp indicator dot — slightly larger, with subtle glow on selected */}
      <div
        className="w-2 h-2 rounded-full flex-shrink-0 transition-all"
        style={{
          backgroundColor: color,
          boxShadow: isSelected ? `0 0 6px ${color}` : "none",
        }}
      />

      <span
        className={`flex-1 text-xs truncate font-body ${
          isSelected ? "text-primary font-semibold" : "text-foreground/80"
        }`}
      >
        {zone.name}
      </span>

      <span className="text-[10px] text-muted-foreground/60 truncate max-w-[52px] font-mono hidden">
        {zone.district}
      </span>

      <span
        className="text-[11px] font-mono font-bold flex-shrink-0 tabular-nums"
        style={{ color }}
      >
        {zone.baseTemperature}°
      </span>
    </button>
  );
}
