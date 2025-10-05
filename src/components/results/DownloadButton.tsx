"use client";

import { WeatherResults } from "@/app/results/page";
import React from "react";

interface DownloadButtonProps {
  predictions: WeatherResults["finalStats"]["Predictions"];
}

export default function DownloadButton({ predictions }: DownloadButtonProps) {
  const handleDownload = () => {
    const dataStr = JSON.stringify(predictions, null, 2); // pretty print
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "weather_predictions.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="w-full py-3 bg-blue-800 text-xs sm:text-base rounded-lg text-white font-medium rounded-lg sm:mt-6 hover:bg-blue-600 transition-colors"
    >
      Download Relevant Data
    </button>
  );
}
