"use client";

import { useEffect, useRef } from "react";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";

export type MapIssue = {
  id: string;
  title: string;
  reports: number;
  color: string;
  coords: { lat: number; lng: number };
};

type MapStyle = "streets" | "satellite";

function pinSvg(color: string, count: number, selected: boolean) {
  const ring = selected ? `<circle cx="21" cy="21" r="20" fill="none" stroke="${color}" stroke-width="3" opacity="0.45"/>` : "";
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42">
      ${ring}
      <circle cx="21" cy="21" r="16" fill="${color}" stroke="white" stroke-width="4"/>
      <text x="21" y="26" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="800" fill="#07110f">${count}</text>
    </svg>
  `)}`;
}

function IssueMarkers({
  issues,
  selectedId,
  onSelect,
}: {
  issues: MapIssue[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const map = useMap();
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!map) return;

    const markers = issues.map((issue) => {
      const marker = new google.maps.Marker({
        map,
        position: issue.coords,
        title: issue.title,
        zIndex: issue.id === selectedId ? 20 : 1,
        icon: {
          url: pinSvg(issue.color, issue.reports, issue.id === selectedId),
          scaledSize: new google.maps.Size(42, 42),
          anchor: new google.maps.Point(21, 21),
        },
      });

      marker.addListener("click", () => onSelectRef.current(issue.id));
      return marker;
    });

    const selected = issues.find((issue) => issue.id === selectedId) ?? issues[0];
    if (selected) {
      map.panTo(selected.coords);
      map.setZoom(16);
    }

    return () => {
      markers.forEach((marker) => marker.setMap(null));
    };
  }, [issues, map, selectedId]);

  return null;
}

export default function GjakovaMap({
  issues,
  selectedId,
  style,
  onSelect,
  emptyMessage = "Shto NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
}: {
  issues: MapIssue[];
  selectedId: string;
  style: MapStyle;
  onSelect: (id: string) => void;
  emptyMessage?: string;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const selected = issues.find((issue) => issue.id === selectedId) ?? issues[0];

  if (!apiKey) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-[#e8eaed] text-sm text-[#5f6368]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        className="absolute inset-0 z-0 h-full w-full"
        defaultCenter={selected.coords}
        defaultZoom={15}
        disableDefaultUI
        clickableIcons={false}
        gestureHandling="greedy"
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        mapTypeId={style === "satellite" ? "hybrid" : "roadmap"}
        styles={[
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
        ]}
      >
        <IssueMarkers issues={issues} selectedId={selectedId} onSelect={onSelect} />
      </Map>
    </APIProvider>
  );
}
