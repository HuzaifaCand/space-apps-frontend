import { getCityBounds } from "@/utils/getCityBounds";
import { useRef, useEffect, useMemo } from "react";
import Map, {
  AttributionControl,
  MapRef,
  Marker,
  Source,
  Layer,
} from "react-map-gl/mapbox";
import { MapMouseEvent } from "mapbox-gl";
import { getBoundingBox } from "@/utils/getBoundingBox";

interface Props {
  selectedPoint: { lat: number; lng: number } | null;
  selectedCity: string | null;
  onMark?: (event: MapMouseEvent | null) => void;
  setSelectedPoint: (point: { lat: number; lng: number } | null) => void;
}

function playSound() {
  const pinAudio = new Audio("/assets/pin.mp3");
  pinAudio.play().catch(() => {
    console.error("dint play lol");
  });
}

export default function Globe({
  selectedCity,
  onMark,
  selectedPoint,
  setSelectedPoint,
}: Props) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const bounds = getCityBounds(selectedCity);

    if (selectedCity && bounds) {
      mapRef.current.fitBounds(bounds, {
        padding: 20,
        duration: 3000,
      });
    } else {
      mapRef.current.flyTo({
        center: [0, 0],
        zoom: 0,
        duration: 2000,
      });

      setSelectedPoint(null);
    }
  }, [selectedCity]);

  // Compute the bounding box feature only when point changes, useMemo prevents unnecessary recalcs
  const bboxFeature = useMemo(() => {
    if (!selectedPoint) return null;
    return getBoundingBox(selectedPoint.lat, selectedPoint.lng);
  }, [selectedPoint]);

  return (
    <div className="rounded-2xl h-full w-full">
      <Map
        ref={mapRef}
        mapboxAccessToken={token}
        initialViewState={{ zoom: 0 }}
        mapStyle="mapbox://styles/mapbox/standard"
        projection="globe"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "0.5rem",
        }}
        onClick={(event) => {
          if (onMark) {
            onMark(event);
            playSound();
          }
        }}
        attributionControl={false}
      >
        <AttributionControl position="top-left" />

        {/* Marker for the clicked point */}
        {selectedPoint && (
          <Marker
            longitude={selectedPoint.lng}
            latitude={selectedPoint.lat}
            color="red"
          />
        )}

        {/* Bounding box overlay */}
        {bboxFeature && (
          <Source id="bbox" type="geojson" data={bboxFeature}>
            <Layer
              id="bbox-line"
              type="line"
              paint={{
                "line-color": "#91bfff",
                "line-width": 1,
              }}
            />
            <Layer
              id="bbox-fill"
              type="fill"
              paint={{
                "fill-color": "#3388ff",
                "fill-opacity": 0.2,
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}
