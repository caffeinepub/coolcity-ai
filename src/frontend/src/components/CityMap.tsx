import L from "leaflet";
import { useCallback, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import {
  type CityZone,
  type SimulationResult,
  getTempColor,
  getTempLabel,
} from "../data/cityData";

// Fix Leaflet default icon issue
(L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl =
  undefined;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Props = {
  zones: CityZone[];
  selectedZone: CityZone | null;
  onZoneSelect: (zone: CityZone) => void;
  simulationResults: SimulationResult[];
};

export default function CityMap({
  zones,
  selectedZone,
  onZoneSelect,
  simulationResults,
}: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<Map<number, L.CircleMarker>>(new Map());

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

    const map = L.map(containerRef.current, {
      center: [40.7128, -74.006],
      zoom: 12,
      zoomControl: true,
    });

    // CartoDB Dark Matter tile
    L.tileLayer(
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
    if (!map) return;

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

      const marker = L.circleMarker([zone.lat, zone.lng], {
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
    </div>
  );
}
