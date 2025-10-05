"use client";

import { useEffect, useState, ChangeEvent, KeyboardEvent } from "react";
import { City } from "country-state-city";

interface Props {
  city: string;
  setCity: (c: string) => void;
  countryCode: string;
  setSelectedCity: (c: string | null) => void;
}

export default function CityInput({
  city,
  setCity,
  countryCode,
  setSelectedCity,
}: Props) {
  const rawCities = countryCode
    ? City.getCitiesOfCountry(countryCode) ?? []
    : [];

  const cities = rawCities.map((c) => c.name);

  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const filtered =
    city === ""
      ? cities
      : cities.filter((c) => c.toLowerCase().startsWith(city.toLowerCase()));

  useEffect(() => {
    setHighlightedIndex(0);
  }, [city]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev === 0 ? filtered.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" && filtered[highlightedIndex]) {
      e.preventDefault();
      setCity(filtered[highlightedIndex]);
      setSelectedCity(filtered[highlightedIndex]);
      setShowDropdown(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <label className="block text-xs font-light text-moreWhite mb-1">
        City
      </label>

      {/* exactly one child here */}
      {!countryCode ? (
        <input
          disabled
          placeholder="Enter a country first"
          className="w-full px-3 py-2 rounded-md bg-secondary/30 text-moreWhite/50 border border-muted/10 text-xs"
        />
      ) : (
        <div className="relative">
          <input
            required
            onBlur={() => {
              setTimeout(() => setShowDropdown(false), 200);
              if (cities.includes(city)) setSelectedCity(city);
            }}
            onFocus={() => setShowDropdown(true)}
            type="text"
            value={city}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setCity(e.target.value);
              if (!cities.includes(e.target.value)) {
                setSelectedCity(null);
              }
              setShowDropdown(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search your City"
            className="w-full px-3 py-2 rounded-md bg-secondary/50 text-moreWhite border border-muted/10 text-xs focus:outline-none focus:bg-blueBg"
          />

          {filtered.length > 0 && showDropdown && (
            <ul className="absolute z-10 mt-1 w-full text-xs bg-background border border-secondary/30 rounded-md shadow-sm max-h-40 overflow-y-auto custom-scrollbar">
              {filtered.map((item, i) => (
                <li
                  key={`${item}-${i}`}
                  onMouseDown={() => {
                    setCity(item);
                    setSelectedCity(item);

                    setShowDropdown(false);
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-secondary transition text-moreWhite ${
                    i === highlightedIndex
                      ? "bg-secondary/80 text-highlight"
                      : ""
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
