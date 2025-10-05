"use client";

import {
  Sun,
  Snowflake,
  Droplet,
  CloudRain,
  Wind,
  ShieldCheck,
  AlertTriangle,
  Cloud,
  Flower,
  TriangleAlertIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import {
  temperatureMap,
  humidityMap,
  precipitationMap,
  windMap,
  heatIndexMap,
} from "@/data/classification"; // adjust import

interface WeatherCardProps {
  title: string;
  status: string;
  probability: number;
}

const statusIcons: Record<string, React.JSX.Element> = {
  // Temperature
  "Very Hot": <Sun size={56} className="text-white drop-shadow-lg" />,
  Hot: <Sun size={56} className="text-white" />,
  Warm: <Sun size={56} className="text-yellow-200" />,
  Mild: <Sun size={56} className="text-green-200" />,
  Cool: <Sun size={56} className="text-white/50" />, // light sun for cool
  Cold: <Snowflake size={56} className="text-white" />,
  "Very Cold": <Snowflake size={56} className="text-white" />,

  // Humidity
  Comfortable: <Droplet size={56} className="text-teal-300" />,
  Humid: <Droplet size={56} className="text-white" />,
  "Very Uncomfortable": <Droplet size={56} className="text-white" />,

  // Precipitation
  None: <Flower size={56} className="text-white/50" />,
  Low: <Cloud size={56} className="text-white" />,
  Moderate: <CloudRain size={56} className="text-white" />,
  High: <CloudRain size={56} className="text-white" />,

  // Wind
  Calm: <Wind size={56} className="text-white" />,
  Breezy: <Wind size={56} className="text-white" />,
  Windy: <Wind size={56} className="text-white" />,
  "Very Windy": <Wind size={56} className="text-white" />,

  // Heat Index
  Safe: <ShieldCheck size={56} className="text-white" />,
  Caution: <TriangleAlertIcon size={56} className="text-yellow-300" />,
  "Extreme Caution": <AlertTriangle size={56} className="text-orange-400" />,
  Danger: <AlertTriangle size={56} className="text-white" />,
  "Extreme Danger": <AlertTriangle size={56} className="text-white" />,
};

const statusBackgrounds: Record<string, string> = {
  // Temperature
  "Very Hot": "from-orange-500/90 via-red-500/80 to-red-700/90",
  Hot: "from-yellow-400/90 via-orange-400/80 to-orange-600/90",
  Warm: "from-yellow-200/90 via-yellow-300/80 to-orange-300/90",
  Mild: "from-green-200/90 via-green-300/80 to-emerald-300/90",
  Cool: "from-sky-200/90 via-sky-300/80 to-blue-400/90",
  Cold: "from-sky-300/90 via-blue-400/80 to-blue-600/90",
  "Very Cold": "from-slate-100/90 via-slate-200/80 to-sky-200/90",

  // Humidity
  Comfortable: "from-teal-200/90 via-teal-300/80 to-teal-400/90",
  Humid: "from-teal-300/90 via-sky-400/80 to-blue-500/90",
  "Very Uncomfortable": "from-indigo-400/90 via-indigo-500/80 to-indigo-700/90",

  // Precipitation
  None: "from-gray-200/90 via-gray-300/80 to-gray-400/90",
  Low: "from-sky-200/90 via-sky-300/80 to-blue-400/90",
  Moderate: "from-blue-300/90 via-blue-500/80 to-blue-700/90",
  High: "from-sky-500/90 via-blue-600/80 to-indigo-800/90",

  // Wind
  Calm: "from-emerald-200/90 via-emerald-300/80 to-emerald-500/90",
  Breezy: "from-sky-200/90 via-sky-300/80 to-sky-400/90",
  Windy: "from-sky-400/90 via-sky-500/80 to-blue-600/90",
  "Very Windy": "from-indigo-400/90 via-indigo-500/80 to-indigo-700/90",

  // Heat Index
  Safe: "from-green-400/90 via-emerald-500/80 to-green-700/90",
  Caution: "from-yellow-300/90 via-yellow-400/80 to-orange-500/90",
  "Extreme Caution": "from-orange-400/90 via-orange-500/80 to-red-600/90",
  Danger: "from-red-500/90 via-red-600/80 to-red-800/90",
  "Extreme Danger": "from-purple-600/90 via-purple-700/80 to-purple-900/90",
};

// Utility: find correct category info dynamically
const findCategory = (status: string) => {
  const maps = [
    temperatureMap,
    humidityMap,
    precipitationMap,
    windMap,
    heatIndexMap,
  ];
  for (const map of maps) {
    if (map[status]) return map[status];
  }
  return null;
};

export default function WeatherCard({
  title,
  status,
  probability,
}: WeatherCardProps) {
  const category = useMemo(() => findCategory(status), [status]);

  return (
    <motion.div
      className={`relative rounded-3xl p-6 sm:p-8 text-center shadow-xl text-white overflow-hidden flex flex-col items-center justify-start 
              bg-gradient-to-br ${
                statusBackgrounds[status] || "from-slate-700 to-slate-900"
              }`}
    >
      {/* Background Animation for Hot or Rain */}
      {status.includes("Hot") && (
        <motion.div
          className="absolute w-40 h-40 rounded-full bg-red-400/30 blur-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
      )}

      {status === "High" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(60)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-0 w-0.5 h-3 bg-blue-300/70"
              style={{ left: `${i * 24}px` }}
              initial={{ y: -20 }}
              animate={{ y: 300 }}
              transition={{ repeat: Infinity, duration: 1 + Math.random() }}
            />
          ))}
        </div>
      )}

      {/* Icon */}
      <div className="z-10 mb-4 mt-2">
        {statusIcons[status] || <ShieldCheck size={56} />}
      </div>

      {/* Title */}
      <h3 className="text-sm uppercase tracking-wide font-medium opacity-80 z-10 mb-1">
        {title}
      </h3>

      {/* Status */}
      <p className="text-xl sm:text-2xl md:text-3xl font-extrabold z-10 mb-2 drop-shadow-lg">
        {status}
      </p>

      {/* Quantity + Description */}
      {category && (
        <div className="z-10 text-center mb-3">
          <p className="text-md sm:text-lg font-semibold">
            {category.quantity}
          </p>
          <p className="text-xs sm:text-sm opacity-85 leading-snug max-w-[200px] mx-auto">
            {category.description}
          </p>
        </div>
      )}

      {/* Probability */}
      <div className="z-10 mt-auto">
        <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-sm font-medium backdrop-blur-md">
          {(probability * 100).toFixed(1)}%
        </span>
      </div>
    </motion.div>
  );
}
