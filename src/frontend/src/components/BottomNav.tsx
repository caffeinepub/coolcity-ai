import { BarChart3, Globe, Layers, Play } from "lucide-react";

type Tab = "map" | "zones" | "simulate" | "analytics";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

const TABS: {
  id: Tab;
  label: string;
  icon: React.ReactNode;
  ocid: string;
}[] = [
  {
    id: "map",
    label: "Map",
    icon: <Globe className="w-5 h-5" />,
    ocid: "nav.map_tab",
  },
  {
    id: "zones",
    label: "Zones",
    icon: <Layers className="w-5 h-5" />,
    ocid: "nav.zones_tab",
  },
  {
    id: "simulate",
    label: "Simulate",
    icon: <Play className="w-5 h-5" />,
    ocid: "nav.simulate_tab",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    ocid: "nav.analytics_tab",
  },
];

export default function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden pb-safe"
      style={{
        background: "oklch(0.10 0.008 240 / 0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid oklch(0.28 0.025 240 / 0.6)",
        boxShadow: "0 -4px 24px oklch(0 0 0 / 0.4)",
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className="relative flex flex-1 flex-col items-center justify-center gap-1 min-h-14 transition-all duration-200"
            style={{
              color: isActive
                ? "oklch(0.78 0.18 195)"
                : "oklch(0.55 0.015 230)",
            }}
            onClick={() => onTabChange(tab.id)}
            data-ocid={tab.ocid}
          >
            {/* Active indicator dot */}
            {isActive && (
              <div
                className="absolute top-1 w-1 h-1 rounded-full"
                style={{
                  background: "oklch(0.78 0.18 195)",
                  boxShadow: "0 0 8px oklch(0.78 0.18 195 / 0.8)",
                }}
              />
            )}

            {/* Icon with glow when active */}
            <div
              style={
                isActive
                  ? {
                      filter: "drop-shadow(0 0 6px oklch(0.78 0.18 195 / 0.6))",
                    }
                  : undefined
              }
            >
              {tab.icon}
            </div>

            <span
              className="text-[10px] font-mono font-semibold tracking-wide"
              style={{
                color: isActive
                  ? "oklch(0.85 0.12 195)"
                  : "oklch(0.50 0.01 230)",
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
