"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLocal, setLocal } from "@/utils/storage";
import { toast } from "sonner";
import { SelPoint } from "@/app/page";
import Stars from "@/components/Stars";

export default function Posting() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const coordinates: SelPoint = getLocal("coordinates");
    const dateStr = getLocal("date");

    // Check if data exists
    if (!coordinates) {
      toast.error("Please select a location first!");
      router.push("/");
      return;
    }

    if (!dateStr) {
      toast.error("Please select a date and activity first!");
      router.push("/date-and-activity");
      return;
    }

    // Convert date
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      toast.error("Invalid date format. Please reselect your date.");
      router.push("/date-and-activity");
      return;
    }

    const formattedDate = `${date.getFullYear()}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;

    handleSend(coordinates, formattedDate);
  }, []);

  // POST request
  const handleSend = async (coordinates: SelPoint, formattedDate: string) => {
    if (!coordinates) return;
    const { lat, lng: lon } = coordinates;

    setLoading(true);
    try {
      const res = await fetch("https://web-production-ba201.up.railway.app/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_date: formattedDate,
          lat,
          lon,
          days: 2,
          years: 40,
        }),
      });

      if (!res.ok) throw new Error("Server error");

      const data: JSON = await res.json();
      console.log("response:", data);

      setLocal("results", data);

      router.replace("/results");
    } catch (err) {
      console.error("Request failed:", err);
      toast.error("Failed to fetch results. Try again later.");
      router.push("/date-and-activity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stars />
      <div className="flex items-center justify-center h-screen w-full text-white">
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-300">Fetching your data...</p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Preparing...</p>
        )}
      </div>
    </>
  );
}
