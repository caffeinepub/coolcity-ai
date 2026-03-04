import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import {
  type CityZone,
  type SimulationResult,
  getTempColor,
  getTempLabel,
} from "../data/cityData";

// Leaflet is loaded via CDN script tag in index.html
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const L = () => (window as any).L as any;

type Props = {
  zones: CityZone[];
  selectedZone: CityZone | null;
  onZoneSelect: (zone: CityZone) => void;
  simulationResults: SimulationResult[];
  onGoToSimulate?: () => void;
  isMobile?: boolean;
};

export default function CityMap({
  zones,
  selectedZone,
  onZoneSelect,
  simulationResults,
  onGoToSimulate,
  isMobile = false,
}: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<number, any>>(new Map());

  // Find latest simulated temperature for a zone
  const getZoneDisplayTemp = useCallback(
    (zone: CityZone): number => {
      const latest = simulationResults.find((r) => r.zoneId === zone.id);
      return latest ? latest.finalTemperature : zone.baseTemperature;
    },
    [simulationResults],
  );

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const Leaflet = L();
    if (!Leaflet) return;

    const map = Leaflet.map(containerRef.current, {
      center: [40.7128, -74.006],
      zoom: 12,
      zoomControl: true,
    });

    // CartoDB Dark Matter tile
    Leaflet.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      },
    ).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  // Update markers when zones, selection, or results change
  useEffect(() => {
    const map = mapRef.current;
    const Leaflet = L();
    if (!map || !Leaflet) return;

    // Remove old markers
    for (const m of markersRef.current.values()) {
      m.remove();
    }
    markersRef.current.clear();

    for (const zone of zones) {
      const displayTemp = getZoneDisplayTemp(zone);
      const color = getTempColor(displayTemp);
      const isSelected = selectedZone?.id === zone.id;
      const hasResult = simulationResults.some((r) => r.zoneId === zone.id);

      const marker = Leaflet.circleMarker([zone.lat, zone.lng], {
        radius: isSelected ? 22 : 18,
        fillColor: color,
        color: isSelected ? "#ffffff" : hasResult ? "#00ffcc" : color,
        weight: isSelected ? 3 : hasResult ? 2 : 1.5,
        opacity: 1,
        fillOpacity: isSelected ? 0.9 : 0.75,
      });

      const label = getTempLabel(displayTemp);
      const simResult = simulationResults.find((r) => r.zoneId === zone.id);

      const tooltipContent = simResult
        ? `<div style="min-width:140px">
            <div style="font-weight:700;font-size:13px;margin-bottom:4px;">${zone.name}</div>
            <div style="color:#94a3b8;font-size:11px;margin-bottom:4px;">${zone.district}</div>
            <div style="font-size:12px;">Before: <strong style="color:${getTempColor(zone.baseTemperature)}">${zone.baseTemperature}°C</strong></div>
            <div style="font-size:12px;">After: <strong style="color:#22c55e">${simResult.finalTemperature}°C</strong></div>
            <div style="font-size:11px;color:#22c55e;margin-top:2px;">−${simResult.tempReduction}°C cooling ✓</div>
          </div>`
        : `<div style="min-width:120px">
            <div style="font-weight:700;font-size:13px;margin-bottom:4px;">${zone.name}</div>
            <div style="color:#94a3b8;font-size:11px;margin-bottom:4px;">${zone.district}</div>
            <div style="font-size:12px;">Temperature: <strong style="color:${color}">${zone.baseTemperature}°C</strong></div>
            <div style="font-size:11px;color:#94a3b8;margin-top:2px;">${label} Heat Zone</div>
            <div style="font-size:10px;color:#64748b;margin-top:2px;">Click to simulate</div>
          </div>`;

      marker.bindTooltip(tooltipContent, {
        permanent: false,
        direction: "top",
        offset: [0, -10],
      });

      marker.on("click", () => {
        onZoneSelect(zone);
      });

      marker.addTo(map);
      markersRef.current.set(zone.id, marker);
    }
  }, [
    zones,
    selectedZone,
    simulationResults,
    onZoneSelect,
    getZoneDisplayTemp,
  ]);

  // Pan to selected zone
  useEffect(() => {
    if (!selectedZone || !mapRef.current) return;
    mapRef.current.panTo([selectedZone.lat, selectedZone.lng], {
      animate: true,
      duration: 0.8,
    });
  }, [selectedZone]);

  return (
    <div className="relative w-full h-full" data-ocid="map.canvas_target">
      <div ref={containerRef} className="w-full h-full" />

      {/* Temperature Legend */}
      <div className="absolute bottom-8 left-3 z-[1000] panel-glass rounded-lg p-3 text-xs font-mono">
        <div className="text-muted-foreground text-[10px] uppercase tracking-widest mb-2 font-semibold">
          Heat Index
        </div>
        {[
          { color: "#ef4444", label: "Critical", range: "≥38°C" },
          { color: "#f97316", label: "High", range: "33–37°C" },
          { color: "#eab308", label: "Moderate", range: "30–32°C" },
          { color: "#22c55e", label: "Cool", range: "<30°C" },
        ].map(({ color, label, range }) => (
          <div key={label} className="flex items-center gap-2 mb-1 last:mb-0">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-foreground text-[11px]">{label}</span>
            <span className="text-muted-foreground text-[10px] ml-auto pl-2">
              {range}
            </span>
          </div>
        ))}
      </div>

      {/* Map overlay info */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] panel-glass rounded-full px-4 py-1.5 text-xs font-mono text-muted-foreground pointer-events-none">
        New York City Metropolitan Area · {zones.length} zones monitored
      </div>

      {/* Mobile: floating selected zone pill */}
      {isMobile && selectedZone && (
        <div
          className="absolute bottom-4 left-4 right-4 z-[1000] flex items-center justify-between px-4 py-3 rounded-2xl"
          style={{
            background: "oklch(0.13 0.012 240 / 0.95)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid oklch(0.78 0.18 195 / 0.3)",
            boxShadow:
              "0 4px 24px oklch(0 0 0 / 0.5), 0 0 20px oklch(0.78 0.18 195 / 0.1)",
          }}
          data-ocid="map.zone_pill"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{
                backgroundColor: getTempColor(selectedZone.baseTemperature),
                boxShadow: `0 0 8px ${getTempColor(selectedZone.baseTemperature)}`,
              }}
            />
            <div className="min-w-0">
              <div className="text-sm font-display font-bold text-foreground truncate">
                {selectedZone.name}
              </div>
              <div className="text-[10px] font-mono text-muted-foreground">
                {selectedZone.district}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span
              className="text-lg font-display font-black tabular-nums"
              style={{ color: getTempColor(selectedZone.baseTemperature) }}
            >
              {selectedZone.baseTemperature}°C
            </span>
            {onGoToSimulate && (
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.78 0.18 195 / 0.25) 0%, oklch(0.78 0.18 195 / 0.1) 100%)",
                  border: "1px solid oklch(0.78 0.18 195 / 0.5)",
                  color: "oklch(0.85 0.12 195)",
                }}
                onClick={onGoToSimulate}
                data-ocid="map.simulate_button"
              >
                Simulate
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
