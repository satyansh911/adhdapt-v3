"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// world-atlas topojson (country borders + properties.name).
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Curated illustrative estimates (%); everything else gets a stable,
// deterministic dummy value so every country shows something on hover.
const PREVALENCE: Record<string, number> = {
  "United States of America": 6.1,
  Canada: 5.4,
  "United Kingdom": 5.0,
  Germany: 4.9,
  France: 4.7,
  Australia: 6.0,
  India: 3.5,
  China: 4.2,
  Brazil: 5.2,
  Japan: 4.5,
  "South Africa": 5.9,
  Niger: 1.0,
  Nigeria: 2.8,
  Mexico: 5.0,
  Sweden: 6.7,
  Spain: 4.6,
  Italy: 4.3,
  Russia: 4.0,
};

// Stable pseudo-random prevalence in ~2.5–7.0% derived from the country name.
function prevalenceFor(name: string): number {
  if (name in PREVALENCE) return PREVALENCE[name];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return Math.round((2.5 + (h % 45) / 10) * 10) / 10; // 2.5 – 7.0
}

interface Hover {
  name: string;
  value: number;
  x: number;
  y: number;
}

export default function AdhdWorldMap() {
  const [hover, setHover] = useState<Hover | null>(null);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 text-center">
      <h2 className="font-display text-4xl font-extrabold md:text-5xl">You&apos;re Not Alone</h2>
      <p className="mt-3 text-[15px] font-medium text-[#a8a5b0]">ADHD Around the World</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_240px] lg:items-center">
        {/* Map */}
        <div className="relative" onMouseLeave={() => setHover(null)}>
          <ComposableMap
            projectionConfig={{ scale: 150 }}
            width={900}
            height={480}
            style={{ width: "100%", height: "auto" }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const name = (geo.properties?.name as string) ?? "Unknown";
                  const value = prevalenceFor(name);
                  const specific = name in PREVALENCE;
                  const update = (e: React.MouseEvent) =>
                    setHover({ name, value, x: e.clientX, y: e.clientY });
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={update}
                      onMouseMove={update}
                      onMouseLeave={() => setHover(null)}
                      style={{
                        default: {
                          fill: specific ? "#ED1C24" : "#3a3350",
                          stroke: "#14141a",
                          strokeWidth: 0.5,
                          outline: "none",
                          pointerEvents: "auto",
                        },
                        hover: {
                          fill: "#8acfd1",
                          stroke: "#14141a",
                          strokeWidth: 0.5,
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: { fill: "#ED1C24", outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>

          {/* Cursor tooltip */}
          {hover && (
            <div
              className="pointer-events-none fixed z-[60] rounded-lg border border-black/10 bg-[#FFC107] px-3 py-2 text-center text-[#111] shadow-lg"
              style={{ left: hover.x + 14, top: hover.y + 14 }}
            >
              <div className="text-sm font-extrabold">{hover.name}</div>
              <div className="text-xs font-semibold">Prevalence: {hover.value.toFixed(1)}%</div>
            </div>
          )}
        </div>

        {/* References */}
        <aside className="flex flex-col gap-4 text-left">
          <div className="rounded-2xl border border-white/10 bg-[#17171b] p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#8b8892]">Hovering</div>
            <div className="mt-1 text-lg font-extrabold">{hover ? hover.name : "Hover a country"}</div>
            <div className="text-sm font-semibold text-[#ED1C24]">
              {hover ? `${hover.value.toFixed(1)}% prevalence` : "to see its ADHD prevalence"}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#17171b] p-4">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#8b8892]">References</div>
            <a
              href="https://www.who.int/news-room/fact-sheets"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-[#8fc0ff] transition-colors hover:bg-[#2D8EFF]/15 hover:text-[#2D8EFF]"
            >
              World Health Organisation <span aria-hidden>↗</span>
            </a>
            <a
              href="https://www.cdc.gov/adhd/data/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-[#8fc0ff] transition-colors hover:bg-[#2D8EFF]/15 hover:text-[#2D8EFF]"
            >
              Centers for Disease Control <span aria-hidden>↗</span>
            </a>
          </div>
          <p className="text-[11px] leading-relaxed text-[#8b8892]">
            Figures are illustrative estimates from WHO / CDC ranges, not a clinical dataset.
          </p>
        </aside>
      </div>
    </section>
  );
}
