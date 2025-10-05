"use client";

import Stars from "@/components/Stars";
import { useEffect, useState } from "react";
import clsx from "clsx";
import WeatherCard from "@/components/results/WeatherCard";
import { getLocal, setLocal } from "@/utils/storage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FinalPage from "@/components/results/FinalPage";
import DownloadButton from "@/components/results/DownloadButton";
import { InfoIcon } from "lucide-react";
import RecommendationPage from "@/components/results/RecommendationPage";
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
  const [city, setCity] = useState<string>();
  const [date, setDate] = useState<string>();
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
        } catch (err) {
          console.error("Failed to parse finalStats:", err);
          return null;
        }
      }

      if (data?.finalStats?.Predictions) {
        setLocal("predictions", data.finalStats.Predictions);
        console.log("Predictions saved to localStorage ✅");
      }

      return data;
    };

    const storedData = loadResults();
    if (storedData) setResults(storedData);
  }, [router]);

  useEffect(() => {
    const loadDetails = () => {
      const city = getLocal("city");
      const dateStr = getLocal("date");

      return { city, dateStr };
    };

    const { city, dateStr } = loadDetails();
    if (city) setCity(city);
    if (dateStr) {
      const parsedDate = new Date(dateStr);
      // Format date like "October 5, 2025"
      const formattedDate = parsedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setDate(formattedDate);
    }
  });

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
        <div className=" w-full pb-2 pt-3 rounded-t-2xl text-xs sm:text-sm px-8 no-scrollbar overflow-x-auto bg-background/80">
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
            <div className="flex flex-col gap-4">
              <div className="text-left mb-2">
                <h2 className="text-white font-semibold text-xl sm:text-2xl">
                  Results near{" "}
                  <span className="text-highlight">
                    {city || "your selected city"}
                  </span>{" "}
                  on <span className="text-highlight">{date}</span>
                </h2>
              </div>
              <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
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
                    this to understand typical patterns and see what’s most
                    likely on this day.
                  </p>
                </div>
              </div>
              <DownloadButton predictions={predictions} />
            </div>
          )}
          {activeTab === "Recommendation" && <RecommendationPage />}
          {activeTab === "Data" && <FinalPage />}
        </div>
      </section>
    </>
  );
}
