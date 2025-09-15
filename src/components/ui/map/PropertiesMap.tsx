"use client";

import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import createCustomMarker from "@/components/ui/map/CustomMarkerIcon";

// Fix default leaflet marker
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function PropertiesMap({ properties, selectedProperty, setSelectedProperty }) {
  const defaultMarkerIcon = useMemo(() => createCustomMarker("#4a90e2"), []);
  const selectedMarkerIcon = useMemo(() => createCustomMarker("#e74c3c"), []);

  return (
    <MapContainer
      center={selectedProperty?.location.coordinates || [23.7916, 90.4079]}
      zoom={selectedProperty ? 15 : 12}
      key={selectedProperty?._id}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {properties.map((p) => (
        <Marker
          key={p._id}
          position={p.location.coordinates}
          icon={selectedProperty?._id === p._id ? selectedMarkerIcon : defaultMarkerIcon}
          eventHandlers={{ click: () => setSelectedProperty(p) }}
        >
          <Popup>
            <strong>{p.name}</strong>
            <p>{p.location.name}</p>
            <p>৳{p.pricePerNight}/night</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
