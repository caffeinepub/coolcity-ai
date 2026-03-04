import { Activity, Leaf, Thermometer } from "lucide-react";
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
  zones: CityZone[];
  simulationResults: SimulationResult[];
};

export default function AnalyticsView({ zones, simulationResults }: Props) {
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

  const tempChartData = zones.map((z) => ({
    name: z.name.split(" ")[0],
    fullName: z.name,
    temp: z.baseTemperature,
    fill: getTempColor(z.baseTemperature),
  }));

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
      className="flex flex-col overflow-y-auto flex-1"
      data-ocid="analytics.view"
    >
      {/* Summary Stats Grid */}
      <div
        className="p-4 border-b border-border"
        style={{ background: "oklch(0.13 0.012 240)" }}
      >
        <h2 className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Session Overview
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Activity className="w-4 h-4 text-primary" />}
            label="Simulations"
            value={`${totalSims}`}
            color="oklch(0.78 0.18 195)"
          />
          <StatCard
            icon={<Thermometer className="w-4 h-4 text-emerald-400" />}
            label="Avg Cooling"
            value={avgCooling > 0 ? `−${avgCooling.toFixed(1)}°C` : "—"}
            color="oklch(0.73 0.18 155)"
          />
          <StatCard
            icon={<Leaf className="w-4 h-4 text-emerald-400" />}
            label="CO₂ Saved"
            value={
              totalCarbon > 0 ? `${(totalCarbon / 1000).toFixed(1)}t/yr` : "—"
            }
            color="oklch(0.73 0.18 155)"
          />
          <StatCard
            icon={<Thermometer className="w-4 h-4 text-red-400" />}
            label="Hottest Zone"
            value={`${hottestZone.baseTemperature}°C`}
            sublabel={hottestZone.name.split(" ")[0]}
            color="oklch(0.62 0.24 27)"
          />
        </div>
      </div>

      {/* Temperature by Zone Chart */}
      <div
        className="p-4 border-b border-border"
        style={{ background: "oklch(0.11 0.010 240)" }}
      >
        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">
          Temperature by Zone
        </div>
        <ResponsiveContainer
          width="100%"
          height={200}
          data-ocid="analytics.temperature_chart"
        >
          <BarChart
            data={tempChartData}
            margin={{ top: 4, right: 4, bottom: 24, left: -22 }}
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
              height={32}
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

      {/* Simulation History Chart */}
      <div className="p-4" style={{ background: "oklch(0.11 0.010 240)" }}>
        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">
          Simulation History (Cooling °C)
        </div>
        {historyChartData.length === 0 ? (
          <div
            className="flex items-center justify-center rounded-xl border"
            style={{
              height: "200px",
              borderColor: "oklch(0.28 0.025 240 / 0.4)",
              background: "oklch(0.13 0.012 240)",
            }}
            data-ocid="analytics.history_empty_state"
          >
            <p className="text-[11px] text-muted-foreground font-mono text-center px-4">
              Run simulations to see history
            </p>
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={200}
            data-ocid="analytics.history_chart"
          >
            <BarChart
              data={historyChartData}
              margin={{ top: 4, right: 4, bottom: 4, left: -22 }}
              barSize={18}
            >
              <XAxis
                dataKey="name"
                tick={{
                  fontSize: 9,
                  fill: "#64748b",
                  fontFamily: "JetBrains Mono, monospace",
                }}
                interval={0}
              />
              <YAxis
                tick={{
                  fontSize: 9,
                  fill: "#64748b",
                  fontFamily: "JetBrains Mono, monospace",
                }}
                tickCount={4}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as (typeof historyChartData)[0];
                  return (
                    <div className="panel-glass rounded-md px-2 py-1.5 text-xs font-mono">
                      <div className="text-foreground font-semibold">
                        {d.zone}
                      </div>
                      <div className="text-muted-foreground">{d.strategy}</div>
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

      {/* Footer */}
      <div
        className="px-4 py-4 border-t border-border text-center"
        style={{ background: "oklch(0.10 0.008 240)" }}
      >
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-mono text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          © {new Date().getFullYear()} Built with ♥ using caffeine.ai
        </a>
      </div>
    </div>
  );
}

// ============================================================
// Stat Card
// ============================================================

function StatCard({
  icon,
  label,
  value,
  sublabel,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  color: string;
}) {
  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: "oklch(0.16 0.013 240)",
        border: "1px solid oklch(0.22 0.02 240)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div
        className="text-xl font-display font-black tabular-nums leading-none"
        style={{ color }}
      >
        {value}
      </div>
      {sublabel && (
        <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
          {sublabel}
        </div>
      )}
    </div>
  );
}
