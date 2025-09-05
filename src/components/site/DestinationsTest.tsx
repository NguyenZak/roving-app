"use client";

import { useEffect, useState } from "react";

interface Destination {
  id: string;
  slug: string;
  nameVi: string;
  nameEn: string;
  image: string;
  alt: string;
  isFeatured: boolean;
  order: number;
  region: string;
  Region?: {
    key: string;
    nameEn: string;
    nameVi: string;
  };
}

export default function DestinationsTest() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        console.log("🔄 Fetching destinations...");
        const res = await fetch("/api/destinations");
        console.log("📡 Response status:", res.status);
        console.log("📡 Response ok:", res.ok);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("📦 Response data:", data);
        
        if (data.items && Array.isArray(data.items)) {
          setDestinations(data.items);
          console.log("✅ Destinations loaded:", data.items.length);
        } else {
          console.error("❌ Invalid data structure:", data);
          setError("Invalid data structure");
        }
      } catch (error) {
        console.error("❌ Failed to fetch destinations:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Loading Destinations...</h2>
        <div className="animate-pulse">
          <div className="bg-gray-200 h-4 rounded mb-2"></div>
          <div className="bg-gray-200 h-4 rounded mb-2"></div>
          <div className="bg-gray-200 h-4 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Error Loading Destinations</h2>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Destinations Test ({destinations.length})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <div key={destination.id} className="border rounded-lg p-4 bg-white shadow">
            <div className="mb-4">
              <img
                src={destination.image}
                alt={destination.alt || destination.nameVi}
                className="w-full h-32 object-cover rounded"
                onError={(e) => {
                  console.error("❌ Image failed to load:", destination.image);
                  e.currentTarget.src = "https://via.placeholder.com/300x200?text=Image+Error";
                }}
                onLoad={() => {
                  console.log("✅ Image loaded successfully:", destination.image);
                }}
              />
            </div>
            
            <h3 className="font-bold text-lg mb-2">{destination.nameVi}</h3>
            <p className="text-gray-600 mb-2">{destination.nameEn}</p>
            <p className="text-sm text-gray-500 mb-2">
              Region: {destination.Region?.nameVi || "N/A"}
            </p>
            <p className="text-xs text-gray-400">
              Featured: {destination.isFeatured ? "Yes" : "No"}
            </p>
            
            <div className="mt-2">
              <p className="text-xs text-gray-500 break-all">
                Image URL: {destination.image}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(destinations, null, 2)}
        </pre>
      </div>
    </div>
  );
}
