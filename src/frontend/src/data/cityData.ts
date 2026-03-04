// ============================================================
// CoolCity AI – City Zone Data & Types
// ============================================================

export type CityZone = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  baseTemperature: number; // °C
  vegetationDensity: number; // 0.0–1.0
  buildingDensity: number; // 0.0–1.0
  district: string;
};

export type CoolingStrategy =
  | "trees"
  | "green_roof"
  | "water_body"
  | "reflective";

export type SimulationResult = {
  id: number;
  zoneId: number;
  zoneName: string;
  strategy: CoolingStrategy;
  treesAdded: number;
  vegetationBoost: number;
  tempReduction: number;
  finalTemperature: number;
  sustainabilityScore: number;
  carbonAbsorption: number;
  timestamp: Date;
};

// ============================================================
// 20 NYC Area City Zones — Heat Island Data
// ============================================================

export const cityZones: CityZone[] = [
  // === HOT ZONES (38–42°C) — Dense Manhattan ===
  {
    id: 1,
    name: "Midtown Manhattan",
    lat: 40.7549,
    lng: -73.984,
    baseTemperature: 42,
    vegetationDensity: 0.05,
    buildingDensity: 0.95,
    district: "Manhattan",
  },
  {
    id: 2,
    name: "Downtown Financial District",
    lat: 40.7074,
    lng: -74.0113,
    baseTemperature: 40,
    vegetationDensity: 0.07,
    buildingDensity: 0.92,
    district: "Manhattan",
  },
  {
    id: 3,
    name: "East Harlem",
    lat: 40.7957,
    lng: -73.9377,
    baseTemperature: 39,
    vegetationDensity: 0.1,
    buildingDensity: 0.88,
    district: "Manhattan",
  },
  {
    id: 4,
    name: "Mott Haven South Bronx",
    lat: 40.8082,
    lng: -73.9255,
    baseTemperature: 41,
    vegetationDensity: 0.08,
    buildingDensity: 0.9,
    district: "Bronx",
  },
  {
    id: 5,
    name: "Hunts Point",
    lat: 40.8154,
    lng: -73.8894,
    baseTemperature: 38,
    vegetationDensity: 0.12,
    buildingDensity: 0.85,
    district: "Bronx",
  },
  {
    id: 6,
    name: "Williamsburg",
    lat: 40.7081,
    lng: -73.9571,
    baseTemperature: 38,
    vegetationDensity: 0.13,
    buildingDensity: 0.87,
    district: "Brooklyn",
  },
  // === MEDIUM ZONES (33–37°C) — Brooklyn & Queens ===
  {
    id: 7,
    name: "Bushwick",
    lat: 40.6944,
    lng: -73.9213,
    baseTemperature: 37,
    vegetationDensity: 0.2,
    buildingDensity: 0.72,
    district: "Brooklyn",
  },
  {
    id: 8,
    name: "Crown Heights",
    lat: 40.6694,
    lng: -73.9429,
    baseTemperature: 36,
    vegetationDensity: 0.22,
    buildingDensity: 0.68,
    district: "Brooklyn",
  },
  {
    id: 9,
    name: "Flatbush",
    lat: 40.6501,
    lng: -73.9496,
    baseTemperature: 35,
    vegetationDensity: 0.25,
    buildingDensity: 0.65,
    district: "Brooklyn",
  },
  {
    id: 10,
    name: "Long Island City",
    lat: 40.7448,
    lng: -73.9484,
    baseTemperature: 37,
    vegetationDensity: 0.18,
    buildingDensity: 0.75,
    district: "Queens",
  },
  {
    id: 11,
    name: "Jackson Heights",
    lat: 40.7557,
    lng: -73.8831,
    baseTemperature: 35,
    vegetationDensity: 0.28,
    buildingDensity: 0.62,
    district: "Queens",
  },
  {
    id: 12,
    name: "Flushing",
    lat: 40.7675,
    lng: -73.833,
    baseTemperature: 34,
    vegetationDensity: 0.3,
    buildingDensity: 0.6,
    district: "Queens",
  },
  {
    id: 13,
    name: "Jamaica",
    lat: 40.7022,
    lng: -73.7955,
    baseTemperature: 33,
    vegetationDensity: 0.32,
    buildingDensity: 0.58,
    district: "Queens",
  },
  {
    id: 14,
    name: "Bay Ridge",
    lat: 40.6358,
    lng: -74.0199,
    baseTemperature: 34,
    vegetationDensity: 0.28,
    buildingDensity: 0.63,
    district: "Brooklyn",
  },
  // === COOLER ZONES (28–32°C) — Green Areas ===
  {
    id: 15,
    name: "Central Park",
    lat: 40.7851,
    lng: -73.9683,
    baseTemperature: 28,
    vegetationDensity: 0.82,
    buildingDensity: 0.08,
    district: "Manhattan",
  },
  {
    id: 16,
    name: "Prospect Park",
    lat: 40.6602,
    lng: -73.969,
    baseTemperature: 29,
    vegetationDensity: 0.78,
    buildingDensity: 0.12,
    district: "Brooklyn",
  },
  {
    id: 17,
    name: "Pelham Bay Park",
    lat: 40.8676,
    lng: -73.8081,
    baseTemperature: 30,
    vegetationDensity: 0.75,
    buildingDensity: 0.1,
    district: "Bronx",
  },
  {
    id: 18,
    name: "St. George Staten Island",
    lat: 40.6437,
    lng: -74.0739,
    baseTemperature: 31,
    vegetationDensity: 0.55,
    buildingDensity: 0.28,
    district: "Staten Island",
  },
  {
    id: 19,
    name: "Tottenville",
    lat: 40.5122,
    lng: -74.2499,
    baseTemperature: 29,
    vegetationDensity: 0.65,
    buildingDensity: 0.18,
    district: "Staten Island",
  },
  {
    id: 20,
    name: "Ridgewood",
    lat: 40.7042,
    lng: -73.9026,
    baseTemperature: 32,
    vegetationDensity: 0.38,
    buildingDensity: 0.52,
    district: "Queens",
  },
];

// ============================================================
// AI Prediction Engine
// ============================================================

export const STRATEGY_BONUSES: Record<CoolingStrategy, number> = {
  trees: 0.5,
  green_roof: 1.2,
  water_body: 2.0,
  reflective: 0.8,
};

export const STRATEGY_SCORE_BONUSES: Record<CoolingStrategy, number> = {
  trees: 10,
  green_roof: 15,
  water_body: 20,
  reflective: 5,
};

export const STRATEGY_LABELS: Record<CoolingStrategy, string> = {
  trees: "Plant Trees",
  green_roof: "Green Roofs",
  water_body: "Water Bodies",
  reflective: "Reflective Surfaces",
};

export const STRATEGY_ICONS: Record<CoolingStrategy, string> = {
  trees: "🌳",
  green_roof: "🏡",
  water_body: "💧",
  reflective: "⬜",
};

export function predictCooling(
  zone: CityZone,
  strategy: CoolingStrategy,
  treesAdded: number,
  vegetationBoost: number,
): Omit<SimulationResult, "id" | "timestamp"> {
  const strategyBonus = STRATEGY_BONUSES[strategy];
  const scoreBonus = STRATEGY_SCORE_BONUSES[strategy];

  const tempReduction =
    treesAdded * 0.15 + vegetationBoost * 8.0 + strategyBonus;

  const sustainabilityScore = Math.min(
    100,
    treesAdded * 0.8 + vegetationBoost * 60 + scoreBonus,
  );

  const carbonAbsorption = treesAdded * 21.0 + vegetationBoost * 500;

  const finalTemperature = Math.max(
    zone.baseTemperature - tempReduction,
    15, // physical minimum
  );

  return {
    zoneId: zone.id,
    zoneName: zone.name,
    strategy,
    treesAdded,
    vegetationBoost,
    tempReduction: Number(tempReduction.toFixed(1)),
    finalTemperature: Number(finalTemperature.toFixed(1)),
    sustainabilityScore: Number(sustainabilityScore.toFixed(0)),
    carbonAbsorption: Number(carbonAbsorption.toFixed(0)),
  };
}

// ============================================================
// AI Recommendation Engine
// ============================================================

export type AIRecommendation = {
  zone: CityZone;
  score: number;
  recommendedStrategy: CoolingStrategy;
  estimatedCooling: number;
};

export function getAIRecommendations(zones: CityZone[]): AIRecommendation[] {
  return zones
    .map((zone) => {
      // Score = high temp + high building density - low vegetation = heat stress
      const score =
        zone.baseTemperature * 0.6 +
        zone.buildingDensity * 30 -
        zone.vegetationDensity * 20;

      // Best strategy based on zone characteristics
      let recommendedStrategy: CoolingStrategy;
      if (zone.vegetationDensity < 0.15) {
        recommendedStrategy = "water_body";
      } else if (zone.buildingDensity > 0.85) {
        recommendedStrategy = "green_roof";
      } else if (zone.buildingDensity > 0.6) {
        recommendedStrategy = "trees";
      } else {
        recommendedStrategy = "trees";
      }

      const estimatedCooling =
        50 * 0.15 + 0.6 * 8.0 + STRATEGY_BONUSES[recommendedStrategy];

      return { zone, score, recommendedStrategy, estimatedCooling };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

// ============================================================
// Temperature Color Utilities
// ============================================================

export function getTempColor(temp: number): string {
  if (temp >= 38) return "#ef4444";
  if (temp >= 33) return "#f97316";
  if (temp >= 30) return "#eab308";
  return "#22c55e";
}

export function getTempLabel(temp: number): string {
  if (temp >= 38) return "Critical";
  if (temp >= 33) return "High";
  if (temp >= 30) return "Moderate";
  return "Cool";
}

export function getTempBadgeClass(temp: number): string {
  if (temp >= 38) return "bg-red-500/20 text-red-400 border-red-500/30";
  if (temp >= 33)
    return "bg-orange-500/20 text-orange-400 border-orange-500/30";
  if (temp >= 30)
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
}
