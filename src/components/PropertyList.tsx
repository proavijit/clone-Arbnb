"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";

// Define TypeScript interface for property
interface Property {
  _id: string;
  name: string;
  images: string[];
  location: { name: string };
  pricePerNight: number;
  isGuestFavorite?: boolean;
}

const PropertyList = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://arbnb-rest-api-e9ve-a1o0s1g7e-avijit-ghoshs-projects.vercel.app";
        const response = await fetch(`${baseUrl}/api/properties`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Property[] = await response.json();
        setProperties(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-500">
        Loading properties...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {properties.map((property) => (
          <Card
            key={property._id}
            className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            role="article"
            aria-labelledby={`property-title-${property._id}`}
          >
            <div className="relative">
              <Image
                src={property.images[0] || "/placeholder-image.jpg"}
                alt={property.name || "Property image"}
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full bg-white/70 backdrop-blur-sm hover:bg-white ${
                    favorites.has(property._id) ? "text-red-500" : ""
                  }`}
                  onClick={() => toggleFavorite(property._id)}
                  aria-label={
                    favorites.has(property._id)
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  <Heart
                    className={`h-4 w-4 ${
                      favorites.has(property._id) ? "fill-current" : ""
                    }`}
                  />
                </Button>
              </div>
              {property.isGuestFavorite && (
                <Badge className="absolute top-2 left-2 bg-blue-500 text-white">
                  Guest Favorite
                </Badge>
              )}
            </div>
            <CardHeader className="p-4">
              <CardTitle
                id={`property-title-${property._id}`}
                className="text-lg font-semibold truncate"
              >
                {property.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                {property.location.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-base font-bold">
                ${property.pricePerNight}{" "}
                <span className="font-normal text-gray-500">per night</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
