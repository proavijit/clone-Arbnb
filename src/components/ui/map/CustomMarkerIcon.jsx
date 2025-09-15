// components/map/CustomMarkerIcon.jsx
import L from "leaflet";
import { renderToString } from "react-dom/server";
import { MapPin } from "lucide-react";

const createCustomMarker = (color) => {
  const iconHtml = renderToString(
    <div style={{ color, filter: `drop-shadow(0 1px 2px rgba(0,0,0,0.5))` }}>
      <MapPin size={32} />
    </div>
  );

  return new L.DivIcon({
    html: iconHtml,
    className: "bg-transparent border-none",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export default createCustomMarker;
