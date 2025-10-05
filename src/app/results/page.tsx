"use client";

import Stars from "@/components/Stars";
import { useEffect, useState } from "react";
import clsx from "clsx";
import WeatherCard from "@/components/results/WeatherCard";
import { getLocal } from "@/utils/storage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
type tabs = "Summary" | "Recommendation" | "Data";

const tabsList = ["Summary", "Recommendation", "Data"] as tabs[];
const baseClass = "py-2 rounded-lg text-xs sm:text-sm font-medium";

type stuff =
  | "Temperature"
  | "Relative_Humidity"
  | "Precipitation"
  | "Heat_Index"
  | "Wind_Speed";

export interface WeatherResults {
  finalStats: {
    Predictions: {
      [key in stuff]: {
        Probability: number;
        Status: string;
        Distribution: Record<string, number>;
      };
    };
  };
}

export default function ResultsPage() {
  const [results, setResults] = useState<WeatherResults>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<tabs>("Summary");

  useEffect(() => {
    const loadResults = () => {
      const data = getLocal("results");

      if (!data) {
        toast.error(
          "No results found. Please select your date and activity again."
        );
        router.replace("/date-and-activity");
        return null;
      }

      if (typeof data.finalStats === "string") {
        try {
          data.finalStats = JSON.parse(data.finalStats);
          console.log("Parsed finalStats:", data.finalStats);
          console.log("Please be json", typeof data.finalStats);
        } catch (err) {
          console.error("Failed to parse finalStats:", err);
          return null;
        }
      }

      return data;
    };

    const storedData = loadResults();
    if (storedData) setResults(storedData);
  }, [router]);

  if (!results) return null;

  const predictions = results.finalStats.Predictions;
  const temperatureStatus = predictions.Temperature.Status;
  const showHeatIndex =
    temperatureStatus === "Hot" ||
    temperatureStatus === "Warm" ||
    temperatureStatus === "Very Hot";

  return (
    <>
      <Stars />
      <section className="flex flex-col gap-4 max-w-7xl mx-auto py-12 px-4">
        <div className=" w-full pb-2 pt-3 rounded-t-2xl px-6 no-scrollbar overflow-x-auto bg-background/80">
          <div className="flex gap-6 sm:gap-10 whitespace-nowrap">
            {tabsList.map((t) => {
              return (
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
              );
            })}
          </div>
        </div>

        <div className="w-full py-12 bg-background/80 min-h-120 px-12 rounded-b-2xl">
          {activeTab === "Summary" && (
            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
              <WeatherCard
                title="Temperature"
                status={predictions.Temperature.Status}
                probability={predictions.Temperature.Probability}
              />
              <WeatherCard
                title="Humidity"
                status={predictions.Relative_Humidity.Status}
                probability={predictions.Heat_Index.Probability}
              />
              <WeatherCard
                title="Rainfall"
                status={predictions.Precipitation.Status}
                probability={predictions.Precipitation.Probability}
              />
              <WeatherCard
                title="Wind Speed"
                status={predictions.Wind_Speed.Status}
                probability={predictions.Wind_Speed.Probability}
              />
              {showHeatIndex && (
                <WeatherCard
                  title="Heat Index"
                  status={predictions.Heat_Index.Status}
                  probability={predictions.Heat_Index.Probability}
                />
              )}
            </div>
          )}
          {/* {activeTab === "Recommendation" && <RecommendationPage />} */}
        </div>
      </section>
    </>
  );
}
