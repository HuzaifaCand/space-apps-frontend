"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { toast } from "sonner";
import { setLocal, getLocal } from "@/app/utils/storage";

export default function Calendar() {
  const [selected, setSelected] = useState<Date | undefined>();
  const [saved, setSaved] = useState(false);

  // --- Load saved date on mount ---
  useEffect(() => {
    const savedDate = getLocal("date");
    if (savedDate) {
      try {
        const parsed = new Date(savedDate);
        if (!isNaN(parsed.getTime())) {
          setSelected(parsed);
          setSaved(true);
        }
      } catch {
        console.error("Invalid date in localStorage");
      }
    }
  }, []);

  // --- Handle date change ---
  const handleDateSelect = (date: Date | undefined) => {
    setSelected(date);
    setSaved(false); // mark unsaved on change
    if (date) localStorage.removeItem("date"); // clear old saved date
  };

  // --- Handle saving ---
  const handleConfirm = () => {
    if (!selected) return;
    setLocal("date", selected.toISOString());
    toast.success("Date saved!");
    setSaved(true);
  };

  return (
    <div className="bg-background relative ring ring-blueBg py-8 px-6 rounded-2xl shadow-lg flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-highlight font-semibold text-lg sm:text-xl">
          Select your date
        </h2>
      </div>

      {/* Calendar */}
      <div className="flex px-3">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={handleDateSelect}
          className="custom-day-picker"
          styles={{
            caption: {
              fontSize: "1.2rem",
              fontWeight: "600",
              textAlign: "center",
              marginBottom: "0.75rem",
            },
            head_cell: {
              textTransform: "uppercase",
              fontSize: "0.85rem",
              fontWeight: "500",
              textAlign: "center",
            },
            day: {
              fontSize: "1rem",
              borderRadius: "2rem",
              transition: "all 0.2s ease-in-out",
            },
          }}
        />
      </div>

      {/* Selected date */}
      {selected && (
        <p className="text-left text-blue-100 mt-6 px-4 text-sm sm:text-base">
          You selected:{" "}
          <span className="font-semibold text-blue-300">
            {format(selected, "PPP")}
          </span>
        </p>
      )}

      {/* Confirm Button */}
      <div className="w-full  mt-6 md:mt-12 px-4">
        <button
          onClick={handleConfirm}
          disabled={!selected}
          className={`w-full py-2.5 rounded-md text-sm font-medium transition-all
            ${
              !selected
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : saved
                ? "bg-blue-500 text-white"
                : "bg-blue-700 hover:bg-blue-600 text-white"
            }`}
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
