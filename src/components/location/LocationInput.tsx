"use client";

import { useEffect, useState } from "react";
import CountryInput from "./CountryInput";
import { City, Country } from "country-state-city";
import CityInput from "./CityInput";
import SaveButton from "./SaveButton";
import AddressCard from "./AddressArea";
import { SelPoint } from "@/app/page";

const rawCountries = Country.getAllCountries();

const countryMap: Record<string, string> = {};

let countries = rawCountries
  .map((c) => {
    const displayName = c.name;

    if (displayName === "Israel") return null;

    countryMap[displayName] = c.isoCode;

    const cities = City.getCitiesOfCountry(c.isoCode) ?? [];

    const hasCities = cities.length > 0;
    if (!hasCities) return null;

    return displayName;
  })
  .filter(Boolean) as string[];

countries = countries.filter(Boolean) as string[];

interface Props {
  selectedPoint: SelPoint;
  selectedCity: string | null;
  setSelectedCity: (s: string | null) => void;
}

export default function LocationInput({
  selectedPoint,
  selectedCity,
  setSelectedCity,
}: Props) {
  const [country, setCountry] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    setSelectedCity(null);
    setCity(null);
  }, [country]);

  return (
    <div>
      <h2 className="text-lg font-semibold text-highlight mb-4">
        Enter a country and city
      </h2>

      <div className="flex flex-col gap-4">
        {/* Country Dropdown */}
        <div>
          <CountryInput
            country={country ?? ""}
            setCountry={setCountry}
            countries={countries}
          />
        </div>

        {/* City Dropdown */}
        <div>
          <CityInput
            city={city ?? ""}
            setSelectedCity={setSelectedCity}
            setCity={setCity}
            countryCode={countryMap[country ?? ""]}
          />
        </div>

        {/* Save Button */}

        <SaveButton selectedCity={selectedCity} />

        <AddressCard selectedPoint={selectedPoint} />
      </div>
    </div>
  );
}
