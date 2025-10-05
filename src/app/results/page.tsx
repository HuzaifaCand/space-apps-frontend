"use client";

import Stars from "@/components/Stars";
import { useState } from "react";
import clsx from "clsx";
import WeatherCard from "@/components/results/WeatherCard";
import { useRouter } from "next/navigation";
import { InfoIcon } from "lucide-react";
import RecommendationPage from "@/components/results/RecommendationPage";
import FinalPage from "@/components/results/FinalPage";

type tabs = "Summary" | "Recommendation" | "Data" | "Trends";
const tabsList = ["Summary", "Recommendation", "Data", "Trends"] as tabs[];
const baseClass = "py-2 rounded-lg text-xs sm:text-sm font-medium";

type WeatherType =
  | "Temperature"
  | "Relative_Humidity"
  | "Precipitation"
  | "Heat_Index"
  | "Wind_Speed";

export interface WeatherResults {
  Predictions: {
    [key in WeatherType]: {
      Probability: number;
      Status: string;
      Distribution: Record<string, number>;
    };
  };
}

export default function ResultsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<tabs>("Summary");

  const predictions: WeatherResults = {
    Predictions: {
      Precipitation: {
        Probability: 0.12,
        Status: "Low",
        Distribution: { Low: 0.12, Moderate: 0.01, High: 0.01 },
      },
      Temperature: {
        Probability: 0.82,
        Status: "Mild",
        Distribution: {
          "Very Hot": 0.0,
          Hot: 0.0,
          Warm: 0.07,
          Mild: 0.82,
          Cool: 0.0,
          Cold: 0.0,
          "Very Cold": 0.0,
        },
      },
      Wind_Speed: {
        Probability: 0.66,
        Status: "Calm",
        Distribution: {
          Calm: 0.66,
          Breezy: 0.34,
          Windy: 0.0,
          "Very Windy": 0.0,
        },
      },
      Relative_Humidity: {
        Probability: 0.84,
        Status: "Humid",
        Distribution: {
          Comfortable: 0.13,
          Humid: 0.84,
          "Very Uncomfortable": 0.03,
        },
      },
      Heat_Index: {
        Probability: 0.75,
        Status: "Caution",
        Distribution: {
          Safe: 0.01,
          Caution: 0.75,
          "Extreme Caution": 0.23,
          Danger: 0.0,
          "Extreme Danger": 0.0,
        },
      },
    },
  };

  const temperatureStatus = predictions.Predictions.Temperature.Status;
  const showHeatIndex =
    temperatureStatus === "Hot" ||
    temperatureStatus === "Warm" ||
    temperatureStatus === "Very Hot";

  return (
    <>
      <Stars />
      <section className="flex flex-col gap-4 max-w-7xl mx-auto py-12 px-4">
        {/* Tabs */}
        <div className="w-full pb-2 pt-3 rounded-t-2xl px-6 no-scrollbar overflow-x-auto bg-background/80">
          <div className="flex gap-6 sm:gap-10 whitespace-nowrap">
            {tabsList.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={clsx(
                  baseClass,
                  "relative hover:text-white",
                  "after:absolute after:left-0 after:text-white after:-bottom-1.5 after:h-[0.5px] after:w-full after:bg-highlight after:scale-x-0 after:origin-center after:transition-transform after:duration-300",
                  activeTab === t
                    ? "text-white after:scale-x-100"
                    : "text-white/70"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="w-full py-12 bg-background/80 min-h-120 px-12 rounded-b-2xl">
          {activeTab === "Summary" && (
            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
              <WeatherCard
                title="Temperature"
                status={predictions.Predictions.Temperature.Status}
                probability={predictions.Predictions.Temperature.Probability}
              />
              <WeatherCard
                title="Humidity"
                status={predictions.Predictions.Relative_Humidity.Status}
                probability={
                  predictions.Predictions.Relative_Humidity.Probability
                }
              />
              <WeatherCard
                title="Rainfall"
                status={predictions.Predictions.Precipitation.Status}
                probability={predictions.Predictions.Precipitation.Probability}
              />
              <WeatherCard
                title="Wind Speed"
                status={predictions.Predictions.Wind_Speed.Status}
                probability={predictions.Predictions.Wind_Speed.Probability}
              />
              {showHeatIndex && (
                <WeatherCard
                  title="Heat Index"
                  status={predictions.Predictions.Heat_Index.Status}
                  probability={predictions.Predictions.Heat_Index.Probability}
                />
              )}

              {/* Info Card */}
              <div className="relative rounded-3xl p-6 sm:p-8 text-center text-white flex flex-col items-center justify-start bg-bg-background border-2 border-blue-500/50">
                <div className="mb-4 mt-2">
                  <InfoIcon size={48} className="text-blue-400/80" />
                </div>
                <h3 className="text-sm sm:text-md uppercase tracking-wide font-medium opacity-70 mb-2">
                  About These Cards
                </h3>
                <p className="text-center text-[10px] sm:text-xs text-muted leading-snug max-w-[220px] mx-auto">
                  Each card shows a weather condition with its likely status
                  based on historical trends. The probability shows how often
                  this condition has occurred on this date over the years. Use
                  this to understand typical patterns and see what’s most likely
                  on this day.
                </p>
              </div>
            </div>
          )}
          {activeTab === "Recommendation" && <RecommendationPage />}
          {activeTab === "Data" && <FinalPage />}
        </div>
      </section>
    </>
  );
}
