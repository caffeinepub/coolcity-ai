import { Badge } from "@/components/ui/badge";
import { Activity, Globe, Leaf, Thermometer } from "lucide-react";
import { cityZones } from "../data/cityData";

export default function TopNav() {
  const avgTemp =
    cityZones.reduce((sum, z) => sum + z.baseTemperature, 0) / cityZones.length;
  const hotZones = cityZones.filter((z) => z.baseTemperature >= 38).length;

  return (
    <header
      className="flex items-center justify-between px-4 py-2.5 border-b border-border"
      style={{
        background:
          "linear-gradient(90deg, oklch(0.10 0.015 240) 0%, oklch(0.12 0.02 230) 50%, oklch(0.10 0.015 240) 100%)",
      }}
    >
      {/* Logo + Title */}
      <div
        className="flex items-center gap-3"
        data-ocid="nav.logo_link"
        role="banner"
      >
        <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 glow-cyan">
          <Globe className="w-5 h-5 text-primary" />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse-cyan" />
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <h1 className="font-display text-base font-bold tracking-tight text-foreground leading-none">
              CoolCity AI
            </h1>
            <span className="text-xs text-muted-foreground font-body">–</span>
            <span className="text-xs text-primary font-body font-medium tracking-wide">
              Into Fresh Urban
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground font-mono leading-none mt-0.5">
            Smart City Climate Planning Dashboard
          </p>
        </div>
      </div>

      {/* Center Stats */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse-cyan" />
          <span className="text-xs font-mono text-muted-foreground">
            NYC Metro Area
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Thermometer className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs font-mono text-foreground">
            Avg{" "}
            <span className="text-orange-400 font-semibold">
              {avgTemp.toFixed(1)}°C
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-red-400" />
          <span className="text-xs font-mono text-foreground">
            <span className="text-red-400 font-semibold">{hotZones}</span>{" "}
            Critical Zones
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-mono text-foreground">
            <span className="text-emerald-400 font-semibold">20</span> Zones
            Monitored
          </span>
        </div>
      </div>

      {/* Right Badges */}
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="text-[10px] border-primary/30 text-primary bg-primary/10 font-mono hidden sm:flex"
        >
          AI-Powered
        </Badge>
        <Badge
          variant="outline"
          className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-mono hidden sm:flex"
        >
          GIS Active
        </Badge>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse-cyan" />
          <span className="text-[10px] font-mono text-emerald-400">LIVE</span>
        </div>
      </div>
    </header>
  );
}
