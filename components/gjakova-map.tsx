"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
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

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], 16, { duration: 0.75 });
  }, [lat, lng, map]);

  return null;
}

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
  const selected = issues.find((issue) => issue.id === selectedId) ?? issues[0];
  const tiles = TILES[style];
  const icons = useMemo(
    () =>
      Object.fromEntries(
        issues.map((issue) => [
          issue.id,
          markerIcon(issue.color, issue.reports, issue.id === selectedId),
        ]),
      ),
    [issues, selectedId],
  );

  return (
    <MapContainer
      center={[selected.coords.lat, selected.coords.lng]}
      zoom={15}
      className="absolute inset-0 z-0 h-full w-full"
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer url={tiles.url} attribution={tiles.attribution} />
      <Recenter lat={selected.coords.lat} lng={selected.coords.lng} />
      {issues.map((issue) => (
        <Marker
          key={`${issue.id}-${issue.reports}`}
          position={[issue.coords.lat, issue.coords.lng]}
          icon={icons[issue.id]}
          eventHandlers={{ click: () => onSelect(issue.id) }}
        />
      ))}
    </MapContainer>
  );
}
