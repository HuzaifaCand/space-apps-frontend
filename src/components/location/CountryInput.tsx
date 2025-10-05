"use client";

import { useEffect, useState, ChangeEvent, KeyboardEvent } from "react";

interface Props {
  country: string;
  setCountry: (c: string) => void;
  countries: (string | null)[];
}

export default function CountryInput({
  country,
  setCountry,
  countries,
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const filtered: string[] =
    country === ""
      ? countries.filter((c): c is string => c !== null) // remove null
      : countries.filter(
          (c): c is string =>
            c !== null && c.toLowerCase().startsWith(country.toLowerCase())
        );

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
      setCountry(filtered[highlightedIndex]);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    setHighlightedIndex(0);
  }, [country]);

  return (
    <div className="flex flex-col flex-1">
      <label className="block text-xs font-light text-lessWhite mb-1">
        Country
      </label>

      <div className="relative">
        <input
          required
          onBlur={() => {
            setTimeout(() => setShowDropdown(false), 200);
          }}
          onFocus={() => setShowDropdown(true)}
          onMouseDown={() => {
            setCountry(country);
            setShowDropdown(false);
          }}
          onInvalid={(e) => e.preventDefault()}
          type="text"
          value={country}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setCountry(e.target.value);
            setShowDropdown(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search your Country"
          className="w-full px-3 py-2 rounded-md bg-secondary/50 text-moreWhite border border-muted/10 text-xs focus:outline-none focus:bg-blueBg"
        />

        {filtered.length > 0 && showDropdown && (
          <ul className="absolute z-10 mt-1 w-full text-xs bg-background border border-secondary/30 rounded-md shadow-sm max-h-40 overflow-y-auto custom-scrollbar">
            {filtered.map((item, i) => (
              <li
                key={`${item}-${i}`}
                onBlur={() => {
                  setTimeout(() => setShowDropdown(false), 200);
                }}
                onClick={() => {
                  setCountry(item ? item : "");
                  setShowDropdown(false);
                }}
                onMouseDown={() => {
                  setCountry(item ? item : "");
                  setShowDropdown(false);
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-secondary transition text-moreWhite ${
                  i === highlightedIndex ? "bg-secondary/80 text-highlight" : ""
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
