"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath } from "lucide-react";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import Image from "next/image";
import type { Icon, IconOptions, DivIcon } from "leaflet";

// Define the Property type to match your property data structure
interface Property {
  _id: string;
  name: string;
  images: string[];
  pricePerNight: number;
  location: {
    name: string;
    coordinates: [number, number];
  };
  details?: {
    beds?: number;
    baths?: number;
  };
}

// Dynamically import react-leaflet components (SSR safe)
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

// Custom SVG icons for Leaflet markers
const defaultMarkerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a90e2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2"/></svg>`;
const selectedMarkerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2"/></svg>`;

export default function SearchResultsWithMap() {
  const router = useRouter();
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Store marker icons in state
  const [defaultMarkerIcon, setDefaultMarkerIcon] = useState<Icon<IconOptions> | DivIcon | null>(null);
  const [selectedMarkerIcon, setSelectedMarkerIcon] = useState<Icon<IconOptions> | DivIcon | null>(null);

  useEffect(() => setMounted(true), []);

  // Dynamically create marker icons on client only
  useEffect(() => {
    let isMounted = true;
    if (typeof window === "undefined") return;

    Promise.all([import("leaflet"), import("buffer")]).then(([L, { Buffer }]) => {
      if (!isMounted) return;
      const createCustomMarker = (svg: string) => {
        return new L.Icon({
          iconUrl: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          shadowSize: [41, 41],
        });
      };
      setDefaultMarkerIcon(createCustomMarker(defaultMarkerSvg));
      setSelectedMarkerIcon(createCustomMarker(selectedMarkerSvg));
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://arbnb-rest-api-e9ve-a1o0s1g7e-avijit-ghoshs-projects.vercel.app"

  useEffect(() => {
    if (!mounted) return;
    const params = new URLSearchParams(window.location.search);
    const location = params.get("location") || "";
    const checkIn = params.get("checkIn") || "";
    const checkOut = params.get("checkOut") || "";
    const adults = Number(params.get("adults")) || 0;
    const children = Number(params.get("children")) || 0;
    const infants = Number(params.get("infants")) || 0;
    const pets = Number(params.get("pets")) || 0;

    if (!location) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const payload = {
          location,
          checkIn: checkIn ? new Date(checkIn) : undefined,
          checkOut: checkOut ? new Date(checkOut) : undefined,
          guests: { adults, children, infants, pets },
        };
        const res = await axios.post(`${apiUrl}/api/properties/search`, payload);
        setResults(res.data);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [mounted, apiUrl]);

  // Fixes the default marker icon issue with Webpack
  useEffect(() => {
    if (typeof window === "undefined") return;
    import("leaflet").then((L) => {
      (L.Icon.Default.prototype as unknown as { _getIconUrl: () => string })._getIconUrl = function (this: Icon<IconOptions>) {
        return this.options.iconUrl ?? "";
      };
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    });
  }, []);

  if (!mounted) return null;
  if (loading) return <p className="text-center mt-20 text-gray-600">Loading search results...</p>;
  if (!results.length) return <p className="text-center mt-20 text-gray-600">No properties found.</p>;

  const mapCenter: LatLngExpression =
    selectedProperty?.location.coordinates
      ? [selectedProperty.location.coordinates[1], selectedProperty.location.coordinates[0]]
      : results[0]?.location.coordinates
      ? [results[0].location.coordinates[1], results[0].location.coordinates[0]]
      : [23.7916, 90.4079];

  // Only render map if marker icons are ready
  if (!defaultMarkerIcon || !selectedMarkerIcon) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen font-sans">
      <div className="md:w-1/2 overflow-y-auto p-4 space-y-4 bg-gray-50 border-r border-gray-200">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 px-2">Search Results</h1>
        {results.map((property) => (
          <Card
            key={property._id}
            className={`cursor-pointer transition-all duration-300 transform hover:scale-[1.01] ${
              selectedProperty?._id === property._id ? "border-2 border-primary shadow-lg" : ""
            }`}
            onMouseEnter={() => setSelectedProperty(property)}
            onClick={() => {
              setSelectedProperty(property);
              router.push(`/properties/${property._id}`);
            }}
          >
            <CardContent className="p-0 flex">
              <Image
                src={property.images[0] || "https://placehold.co/600x400.png"}
                alt={property.name}
                width={160} // w-40 = 160px
                height={128} // h-32 = 128px
                className="object-cover rounded-l-lg"
              />
              <div className="flex-1 p-4">
                <CardTitle className="text-base md:text-lg font-semibold truncate">{property.name}</CardTitle>
                <CardDescription className="text-sm text-gray-500 flex items-center mt-1 space-x-2">
                  <MapPin size={14} className="text-gray-400" />
                  <span>{property.location.name}</span>
                  <span className="mx-1">•</span>
                  <Bed size={14} className="text-gray-400" />
                  <span>{property.details?.beds ?? "-"} beds</span>
                  <span className="mx-1">•</span>
                  <Bath size={14} className="text-gray-400" />
                  <span>{property.details?.baths ?? "-"} baths</span>
                </CardDescription>
                <p className="font-bold text-lg md:text-xl text-primary mt-2">
                  ৳{property.pricePerNight} <span className="text-sm text-gray-500 font-normal">/ night</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="md:w-1/2">
        {mounted && (
          <MapContainer
            center={mapCenter}
            zoom={selectedProperty ? 15 : 12}
            key={selectedProperty?._id}
            scrollWheelZoom={true}
            className="h-full w-full z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {results.map((property) => (
              <Marker
                key={property._id}
                position={[property.location.coordinates[1], property.location.coordinates[0]]}
                icon={selectedProperty?._id === property._id ? selectedMarkerIcon : defaultMarkerIcon}
                eventHandlers={{ click: () => setSelectedProperty(property) }}
              >
                <Popup>
                  <div className="space-y-1">
                    <strong className="text-lg font-semibold">{property.name}</strong>
                    <p className="flex items-center text-sm text-gray-600">
                      <MapPin size={14} className="mr-1" />
                      {property.location.name}
                    </p>
                    <p className="font-bold text-primary">৳{property.pricePerNight}/night</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => router.push(`/properties/${property._id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
