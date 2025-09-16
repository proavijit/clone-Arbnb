"use client";

import React, { useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { LatLngExpression, Icon, IconOptions, DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import createCustomMarker from "@/components/ui/map/CustomMarkerIcon";

// Dynamically import react-leaflet components to disable SSR
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

// Define Property interface
interface Property {
  _id: string;
  name: string;
  pricePerNight: number;
  location: {
    name: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
}

// Define props interface
interface PropertiesMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property) => void;
}

export default function PropertiesMap({ properties, selectedProperty, setSelectedProperty }: PropertiesMapProps) {
  // Fix default Leaflet marker (runs only on client-side)
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Dynamically import leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => string })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    });
  }, []);

  const defaultMarkerIcon = useMemo(() => createCustomMarker("#4a90e2"), []);
  const selectedMarkerIcon = useMemo(() => createCustomMarker("#e74c3c"), []);

  // Default center if no properties or selected property
  const mapCenter: LatLngExpression =
    selectedProperty?.location.coordinates
      ? [selectedProperty.location.coordinates[1], selectedProperty.location.coordinates[0]]
      : properties[0]?.location.coordinates
      ? [properties[0].location.coordinates[1], properties[0].location.coordinates[0]]
      : [23.7916, 90.4079];

  return (
    <MapContainer
      center={mapCenter}
      zoom={selectedProperty ? 15 : 12}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {properties.map((p) => (
        <Marker
          key={p._id}
          position={[p.location.coordinates[1], p.location.coordinates[0]] as LatLngExpression}
          icon={selectedProperty?._id === p._id ? (selectedMarkerIcon as Icon<IconOptions> | DivIcon) : (defaultMarkerIcon as Icon<IconOptions> | DivIcon)}
          eventHandlers={{ click: () => setSelectedProperty(p) }}
        >
          <Popup>
            <div className="space-y-1">
              <strong className="text-lg font-semibold">{p.name}</strong>
              <p className="text-sm">{p.location.name}</p>
              <p className="font-bold">৳{p.pricePerNight}/night</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
