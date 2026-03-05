import { ArrowRight, Layers, Satellite } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type CityZone,
  type SimulationResult,
  getTempColor,
  getTempLabel,
} from "../data/cityData";

// Leaflet is loaded via CDN script tag in index.html
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const L = () => (window as any).L as any;

type TileLayer = "dark" | "street" | "satellite";

type Props = {
  zones: CityZone[];
  selectedZone: CityZone | null;
  onZoneSelect: (zone: CityZone) => void;
  onLocationClick?: (lat: number, lng: number) => void;
  simulationResults: SimulationResult[];
  onGoToSimulate?: () => void;
  isMobile?: boolean;
};

export default function CityMap({
  zones,
  selectedZone,
  onZoneSelect,
  onLocationClick,
  simulationResults,
  onGoToSimulate,
  isMobile = false,
}: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<number, any>>(new Map());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tileLayerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clickPinRef = useRef<any>(null);
  const onLocationClickRef = useRef(onLocationClick);
  const [tileMode, setTileMode] = useState<TileLayer>("dark");

  // Keep ref in sync so the map click handler always calls the latest callback
  useEffect(() => {
    onLocationClickRef.current = onLocationClick;
  }, [onLocationClick]);

  const TILE_URLS: Record<TileLayer, { url: string; attr: string }> = {
    dark: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    street: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attr: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    },
  };

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

    // Initial tile layer
    const tile = Leaflet.tileLayer(TILE_URLS.dark.url, {
      attribution: TILE_URLS.dark.attr,
      subdomains: "abcd",
      maxZoom: 20,
    });
    tile.addTo(map);
    tileLayerRef.current = tile;

    // Click anywhere on map
    map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
      const { lat, lng } = e.latlng;

      // Place animated pin at click location
      if (clickPinRef.current) {
        clickPinRef.current.remove();
      }
      const Lf = L();
      if (Lf) {
        const pulseIcon = Lf.divIcon({
          className: "",
          html: `<div style="
            width: 20px; height: 20px;
            border-radius: 50%;
            background: oklch(0.78 0.18 195 / 0.9);
            border: 3px solid white;
            box-shadow: 0 0 0 0 oklch(0.78 0.18 195 / 0.6);
            animation: map-pulse 1.5s ease-out infinite;
          "></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
        const pin = Lf.marker([lat, lng], { icon: pulseIcon });
        pin.addTo(map);
        clickPinRef.current = pin;
      }

      if (onLocationClickRef.current) {
        onLocationClickRef.current(lat, lng);
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
      tileLayerRef.current = null;
      clickPinRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap tile layer when tileMode changes
  useEffect(() => {
    const map = mapRef.current;
    const Leaflet = L();
    if (!map || !Leaflet) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }
    const { url, attr } = TILE_URLS[tileMode];
    const newTile = Leaflet.tileLayer(url, {
      attribution: attr,
      subdomains: tileMode === "dark" ? "abcd" : "abc",
      maxZoom: 20,
    });
    newTile.addTo(map);
    tileLayerRef.current = newTile;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tileMode]);

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
        ? `<div style="min-width:160px;font-family:monospace;">
            <div style="font-weight:700;font-size:13px;margin-bottom:4px;">${zone.name}</div>
            <div style="color:#94a3b8;font-size:11px;margin-bottom:4px;">${zone.district}</div>
            <div style="font-size:12px;">Before: <strong style="color:${getTempColor(zone.baseTemperature)}">${zone.baseTemperature}°C</strong></div>
            <div style="font-size:12px;">After: <strong style="color:#22c55e">${simResult.finalTemperature}°C</strong></div>
            <div style="font-size:11px;color:#22c55e;margin-top:2px;">−${simResult.tempReduction}°C cooling ✓</div>
          </div>`
        : `<div style="min-width:180px;font-family:monospace;">
            <div style="font-weight:700;font-size:13px;margin-bottom:4px;">${zone.name}</div>
            <div style="color:#94a3b8;font-size:11px;margin-bottom:4px;">${zone.district}</div>
            <div style="font-size:12px;">Temperature: <strong style="color:${color}">${zone.baseTemperature}°C</strong></div>
            <div style="font-size:11px;color:#94a3b8;margin-top:2px;">${label} Heat Zone</div>
            <div style="font-size:10px;color:#64748b;margin-top:4px;border-top:1px solid #1e293b;padding-top:4px;">
              🔥 ${zone.heatCauses.slice(0, 2).join(" · ")}
            </div>
            <div style="font-size:10px;color:#4ade80;margin-top:2px;">🌳 ${zone.treeRecommendation.totalNeeded} trees recommended</div>
            <div style="font-size:10px;color:#64748b;margin-top:2px;">Click to analyze →</div>
          </div>`;

      marker.bindTooltip(tooltipContent, {
        permanent: false,
        direction: "top",
        offset: [0, -10],
      });

      marker.on("click", (e: Event) => {
        // Prevent map click from also firing
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (e as any).originalEvent?.stopPropagation?.();
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
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ cursor: "crosshair" }}
      />

      {/* Tile Layer Switcher */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1">
        {(["dark", "street", "satellite"] as TileLayer[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setTileMode(mode)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all"
            style={
              tileMode === mode
                ? {
                    background: "oklch(0.78 0.18 195 / 0.25)",
                    border: "1px solid oklch(0.78 0.18 195 / 0.7)",
                    color: "oklch(0.85 0.14 195)",
                    backdropFilter: "blur(8px)",
                  }
                : {
                    background: "oklch(0.13 0.012 240 / 0.85)",
                    border: "1px solid oklch(0.25 0.02 240 / 0.6)",
                    color: "oklch(0.55 0.01 220)",
                    backdropFilter: "blur(8px)",
                  }
            }
            data-ocid={`map.tile_${mode}_toggle`}
          >
            {mode === "satellite" ? (
              <Satellite className="w-3 h-3" />
            ) : (
              <Layers className="w-3 h-3" />
            )}
            {mode}
          </button>
        ))}
      </div>

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
        New York City · Click anywhere to analyze heat
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
                {selectedZone.district} · {selectedZone.heatCauses[0]}
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
                Analyze
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pulse animation style */}
      <style>{`
        @keyframes map-pulse {
          0% { box-shadow: 0 0 0 0 oklch(0.78 0.18 195 / 0.6); }
          70% { box-shadow: 0 0 0 14px oklch(0.78 0.18 195 / 0); }
          100% { box-shadow: 0 0 0 0 oklch(0.78 0.18 195 / 0); }
        }
      `}</style>
    </div>
  );
}
