"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapIssue = {
  id: string;
  title: string;
  reports: number;
  color: string;
  coords: { lat: number; lng: number };
};

type MapStyle = "streets" | "satellite";

const TILES: Record<MapStyle, { url: string; attribution: string }> = {
  streets: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap &copy; CARTO",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
};

function markerIcon(color: string, count: number, selected: boolean) {
  return L.divIcon({
    className: "pulse-pin",
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    html: `<div class="pulse-pin-inner ${selected ? "is-selected" : ""}" style="--pin:${color}">
      <span>${count}</span>
    </div>`,
  });
}

export default function GjakovaMap({
  issues,
  selectedId,
  style,
  onSelect,
}: {
  issues: MapIssue[];
  selectedId: string;
  style: MapStyle;
  onSelect: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tilesRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const node = containerRef.current;
    if (!node || mapRef.current) return;

    const map = L.map(node, {
      zoomControl: false,
      attributionControl: false,
      center: [42.3803, 20.4308],
      zoom: 15,
    });

    const tiles = L.tileLayer(TILES.streets.url, {
      attribution: TILES.streets.attribution,
    }).addTo(map);

    const markers = L.layerGroup().addTo(map);
    mapRef.current = map;
    tilesRef.current = tiles;
    markersRef.current = markers;

    const resize = window.setTimeout(() => map.invalidateSize(), 80);

    return () => {
      window.clearTimeout(resize);
      map.remove();
      mapRef.current = null;
      tilesRef.current = null;
      markersRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    tilesRef.current?.remove();
    const tiles = L.tileLayer(TILES[style].url, {
      attribution: TILES[style].attribution,
    }).addTo(map);
    tilesRef.current = tiles;
  }, [style]);

  useEffect(() => {
    const map = mapRef.current;
    const group = markersRef.current;
    if (!map || !group) return;

    group.clearLayers();
    issues.forEach((issue) => {
      L.marker([issue.coords.lat, issue.coords.lng], {
        icon: markerIcon(issue.color, issue.reports, issue.id === selectedId),
      })
        .on("click", () => onSelectRef.current(issue.id))
        .addTo(group);
    });

    const selected = issues.find((issue) => issue.id === selectedId) ?? issues[0];
    if (selected) {
      map.flyTo([selected.coords.lat, selected.coords.lng], 16, { duration: 0.7 });
    }
  }, [issues, selectedId]);

  return <div ref={containerRef} className="absolute inset-0 z-0 h-full w-full" />;
}
