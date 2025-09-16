"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

// Shadcn UI
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Local fallback images
import property1 from "@/assets/property1.jpg";
import property2 from "@/assets/property2.jpg";
import property3 from "@/assets/property3.jpg";

interface Property {
  _id: string;
  name: string;
  description?: string;
  location?: { name?: string; coordinates?: [number, number] };
  pricePerNight?: number;
  images?: string[];
  amenities?: string[];
  guestCapacity?: number;
}

export default function PropertyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        setLoading(true);
        if (!apiUrl) {
          throw new Error("NEXT_PUBLIC_API_URL is not defined");
        }
        const res = await axios.get(`${apiUrl}/api/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load property.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, apiUrl]);

  if (loading)
    return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;

  if (error || !property)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error || "Property not found."}
      </div>
    );

  // Fallback images, extracting src from imported objects
  const fallbackImages = [property1.src, property2.src, property3.src];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(property.images && property.images.length > 0
          ? property.images
          : fallbackImages
        ).map((img, idx) => (
          <Image
            key={idx}
            src={img}
            alt={`${property.name} ${idx + 1}`}
            className="w-full h-48 object-cover rounded-lg"
            width={500}
            height={300}
          />
        ))}
      </div>

      {/* Property Info */}
      <Card className="p-4">
        <h1 className="text-3xl font-bold">{property.name}</h1>
        <p className="text-gray-600 mt-2">{property.description || "No description available."}</p>
        <p className="mt-2 font-semibold text-lg text-primary">
          ৳{property.pricePerNight ?? "-"} / night
        </p>
        <p className="mt-1">Guests: {property.guestCapacity ?? "-"}</p>
        <p className="mt-1">Location: {property.location?.name ?? "-"}</p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mt-3">
          {property.amenities && property.amenities.length > 0 ? (
            property.amenities.map((amenity) => (
              <span key={amenity} className="px-2 py-1 bg-gray-100 rounded text-sm">
                {amenity}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">No amenities listed</span>
          )}
        </div>

        <Button
          className="mt-4"
          variant="outline"
          onClick={() => router.push(`/booking/${property._id}`)}
        >
          Book Now
        </Button>
      </Card>
    </div>
  );
}
