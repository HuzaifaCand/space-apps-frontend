export function getBoundingBox(lat: number, lon: number) {
  const latRes = 0.5;
  const lonRes = 0.625;

  const west = Math.floor(lon / lonRes) * lonRes;
  const south = Math.floor(lat / latRes) * latRes;
  const east = west + lonRes;
  const north = south + latRes;

  return {
    type: "Feature",
    properties: {
      resolution: `${latRes}° x ${lonRes}°`,
      info: "NASA POWER grid cell",
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [west, south],
          [east, south],
          [east, north],
          [west, north],
          [west, south],
        ],
      ],
    },
  } as GeoJSON.Feature;
}
