"use client";

import LocationInput from "@/components/location/LocationInput";
import Stars from "@/components/Stars";
import { useEffect, useState } from "react";
import Globe from "@/components/location/Map";
import ContinueButton from "@/components/location/ContinueButton";

export type SelPoint = {
  lat: number;
  lng: number;
} | null;

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<SelPoint>(null);

  useEffect(() => {
    const savedPoint = localStorage.getItem("coordinates");
    if (savedPoint) {
      localStorage.removeItem("coordinates");
    }
  }, []);

  return (
    <section>
      <Stars />
      <div className="max-w-6xl flex flex-col md:flex-row gap-8 md:items-stretch justify-center mx-auto py-12 md:py-24 px-8">
        <div className="md:w-1/3 w-full">
          <div className="bg-background/80 ring-1 ring-blueBg text-white shadow-xl rounded-2xl h-full py-8 px-10 sm:py-12">
            <LocationInput
              selectedPoint={selectedPoint}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
            />
          </div>
        </div>
        <div className="md:w-2/3 w-full">
          <div className="bg-background/80 ring-1 ring-blueBg text-white shadow-xl w-full rounded-xl h-full flex flex-col gap-4 px-10 sm:px-10 md:py-10 pb-16 pt-12">
            <div className="flex flex-col gap-1 md:flex-row md:items-center justify-between">
              <h2 className="text-lg font-semibold text-highlight">
                Select a location
              </h2>
              {selectedPoint && (
                <p className="text-[10px] text-muted mt-0 md:mt-1">
                  The blue region represents the resolution of NASA Power APIs
                  data (55km x 69km).
                </p>
              )}
            </div>

            <div className="w-full p-4 h-60 bg-background border rounded-xl border-blueBg">
              <Globe
                selectedCity={selectedCity}
                setSelectedPoint={setSelectedPoint}
                selectedPoint={selectedPoint}
                onMark={(event) => setSelectedPoint(event?.lngLat ?? null)}
              />
            </div>
            <ContinueButton selectedPoint={selectedPoint} />
          </div>
        </div>
      </div>
    </section>
  );
}
