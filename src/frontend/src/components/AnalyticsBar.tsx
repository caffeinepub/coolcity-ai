import { Button } from "@/components/ui/button";
import {
  Activity,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Leaf,
  Thermometer,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  type CityZone,
  STRATEGY_LABELS,
  type SimulationResult,
  getTempColor,
} from "../data/cityData";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  zones: CityZone[];
  simulationResults: SimulationResult[];
};

export default function AnalyticsBar({
  isOpen,
  onToggle,
  zones,
  simulationResults,
}: Props) {
  const totalSims = simulationResults.length;
  const avgCooling =
    totalSims > 0
      ? simulationResults.reduce((s, r) => s + r.tempReduction, 0) / totalSims
      : 0;
  const totalCarbon = simulationResults.reduce(
    (s, r) => s + r.carbonAbsorption,
    0,
  );
  const hottestZone = zones.reduce(
    (max, z) => (z.baseTemperature > max.baseTemperature ? z : max),
    zones[0],
  );

  // Chart data: all 20 zones
  const tempChartData = zones.map((z) => ({
    name: z.name.split(" ")[0],
    fullName: z.name,
    temp: z.baseTemperature,
    fill: getTempColor(z.baseTemperature),
  }));

  // History chart: last 10 simulations
  const historyChartData = simulationResults
    .slice(0, 10)
    .reverse()
    .map((r, i) => ({
      name: `#${i + 1}`,
      cooling: r.tempReduction,
      zone: r.zoneName.split(" ")[0],
      strategy: STRATEGY_LABELS[r.strategy],
      fill:
        r.tempReduction >= 5
          ? "#22c55e"
          : r.tempReduction >= 3
            ? "#78c2ad"
            : "#0ea5e9",
    }));

  return (
    <div
      className="border-t border-border bg-card transition-all duration-300"
      style={{ height: isOpen ? "220px" : "36px" }}
      data-ocid="analytics.panel"
    >
      {/* Toggle Header */}
      <div className="flex items-center justify-between px-4 h-9">
        {/* Summary stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-primary" />
            <span className="text-[11px] font-mono text-muted-foreground">
              Simulations:{" "}
              <span className="text-primary font-semibold">{totalSims}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Thermometer className="w-3 h-3 text-emerald-400" />
            <span className="text-[11px] font-mono text-muted-foreground">
              Avg Cooling:{" "}
              <span className="text-emerald-400 font-semibold">
                {avgCooling > 0 ? `−${avgCooling.toFixed(1)}°C` : "—"}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 hidden sm:flex">
            <Leaf className="w-3 h-3 text-emerald-400" />
            <span className="text-[11px] font-mono text-muted-foreground">
              CO₂ Saved:{" "}
              <span className="text-emerald-400 font-semibold">
                {totalCarbon > 0
                  ? `${(totalCarbon / 1000).toFixed(1)}t/yr`
                  : "—"}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 hidden md:flex">
            <Thermometer className="w-3 h-3 text-red-400" />
            <span className="text-[11px] font-mono text-muted-foreground">
              Hottest:{" "}
              <span className="text-red-400 font-semibold">
                {hottestZone.name.split(" ")[0]} ({hottestZone.baseTemperature}
                °C)
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Caffeine attribution */}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-mono text-muted-foreground/50 hover:text-muted-foreground transition-colors hidden lg:block"
          >
            © {new Date().getFullYear()} Built with ♥ using caffeine.ai
          </a>

          {/* Toggle button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs font-mono text-muted-foreground hover:text-foreground gap-1"
            onClick={onToggle}
            data-ocid="analytics.toggle"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Analytics
            {isOpen ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronUp className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Charts (visible when open) */}
      {isOpen && (
        <div className="flex gap-4 px-4 pb-3" style={{ height: "176px" }}>
          {/* Temperature by Zone */}
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
              Temperature by Zone
            </div>
            <ResponsiveContainer
              width="100%"
              height={140}
              data-ocid="analytics.temperature_chart"
            >
              <BarChart
                data={tempChartData}
                margin={{ top: 4, right: 4, bottom: 20, left: -20 }}
                barSize={10}
              >
                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 8,
                    fill: "#64748b",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={28}
                />
                <YAxis
                  tick={{
                    fontSize: 8,
                    fill: "#64748b",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                  domain={[0, 50]}
                  tickCount={4}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as (typeof tempChartData)[0];
                    return (
                      <div className="panel-glass rounded-md px-2 py-1.5 text-xs font-mono">
                        <div className="font-semibold text-foreground">
                          {d.fullName}
                        </div>
                        <div style={{ color: d.fill }}>{d.temp}°C</div>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="temp" radius={[2, 2, 0, 0]}>
                  {tempChartData.map((entry) => (
                    <Cell
                      key={`temp-${entry.fullName}`}
                      fill={entry.fill}
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Divider */}
          <div className="w-px bg-border" />

          {/* Simulation History */}
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
              Simulation History (Cooling °C)
            </div>
            {historyChartData.length === 0 ? (
              <div className="flex items-center justify-center h-[140px]">
                <p className="text-[11px] text-muted-foreground font-mono">
                  Run simulations to see history
                </p>
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={140}
                data-ocid="analytics.history_chart"
              >
                <BarChart
                  data={historyChartData}
                  margin={{ top: 4, right: 4, bottom: 4, left: -20 }}
                  barSize={14}
                >
                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 8,
                      fill: "#64748b",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                    interval={0}
                  />
                  <YAxis
                    tick={{
                      fontSize: 8,
                      fill: "#64748b",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                    tickCount={4}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]
                        .payload as (typeof historyChartData)[0];
                      return (
                        <div className="panel-glass rounded-md px-2 py-1.5 text-xs font-mono">
                          <div className="text-foreground font-semibold">
                            {d.zone}
                          </div>
                          <div className="text-muted-foreground">
                            {d.strategy}
                          </div>
                          <div style={{ color: d.fill }}>
                            −{d.cooling}°C cooling
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="cooling" radius={[2, 2, 0, 0]}>
                    {historyChartData.map((entry) => (
                      <Cell
                        key={`history-${entry.name}`}
                        fill={entry.fill}
                        fillOpacity={0.85}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
