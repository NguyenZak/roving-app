"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type Props = {
  coordinates: [number, number];
  zoom?: number;
  height?: number | string;
};

export default function Mapbox({ coordinates, zoom = 10, height = 320 }: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: coordinates,
      zoom,
    });
    new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [coordinates, zoom]);

  return <div ref={mapContainerRef} style={{ height }} className="rounded-lg overflow-hidden border w-full" />;
}


