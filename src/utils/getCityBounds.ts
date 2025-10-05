// utils/getCityBounds.ts
import { City } from "country-state-city";
import { LngLatBoundsLike } from "react-map-gl/mapbox";

export function getCityBounds(
  cityName: string | null
): LngLatBoundsLike | null {
  if (!cityName) return null;

  const city = City.getAllCities().find(
    (c) => c.name.toLowerCase() === cityName.toLowerCase()
  );

  if (!city) return null;

  const lat = parseFloat(city.latitude ?? "");
  const lng = parseFloat(city.longitude ?? "");

  // Return a tiny bounding box around the city
  const offset = 0.1; // ~5 km radius
  const bounds: LngLatBoundsLike = [
    [lng - offset, lat - offset],
    [lng + offset, lat + offset],
  ];

  return bounds;
}
