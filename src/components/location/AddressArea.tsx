"use client";

import { useEffect, useState } from "react";

interface SelectedPoint {
  lat: number;
  lng: number;
}

interface AddressCardProps {
  selectedPoint: SelectedPoint | null;
}

export default function AddressCard({ selectedPoint }: AddressCardProps) {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedPoint) return;

    const fetchAddress = async () => {
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${selectedPoint.lng},${selectedPoint.lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&language=en`
        );

        const data = await res.json();

        if (data.features && data.features.length > 0) {
          setAddress(data.features[0].place_name);
        } else {
          setAddress("Address not found");
        }
      } catch (err) {
        console.error(err);
        setAddress("Error fetching address");
      }
    };

    fetchAddress();
  }, [selectedPoint]);

  return (
    <div className="mt-4 p-4 bg-background ring ring-blueBg  rounded-sm">
      <h3 className="font-medium text-sm text-lessWhite mb-1">
        Selected Location
      </h3>
      {!selectedPoint ? (
        <div className="text-xs text-muted truncate pb-3">
          No location selected
        </div>
      ) : (
        <div>
          <p
            className={`text-[11px] ${
              address ? "text-highlight" : "text-muted"
            } truncate`}
          >
            {address ?? "Loading address..."}
          </p>
          <p className="text-[10px] text-highlight mt-1">
            <span className="text-muted">Coordinates --</span> (
            {selectedPoint.lat.toFixed(3)}, {selectedPoint.lng.toFixed(3)})
          </p>
        </div>
      )}
    </div>
  );
}
