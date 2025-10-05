"use client";

import { useEffect, useState } from "react";
import { getLocal } from "@/utils/storage";
import { toast } from "sonner";
import { Loader2, Brain } from "lucide-react";

export default function RecommendationPage() {
  const [recommendation, setRecommendation] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const predictions = getLocal("predictions");
        const activities = getLocal("activities");
        const details = getLocal("activitiesDetail") || "No additional details";

        if (!predictions || !activities) {
          toast.error("Missing required data for recommendation.");
          return;
        }

        setLoading(true);

        const response = await fetch("/api/rec", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activities,
            data: predictions,
            details,
          }),
        });

        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "Failed request");

        setRecommendation(result.message);
      } catch (error) {
        console.error(error);
        toast.error("Failed to get recommendation. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, []);

  return (
    <div className="flex flex-col w-full p-4 text-left text-white">
      {loading ? (
        <div className="flex items-center gap-2 animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin text-highlight" />
          <p className="text-sm text-muted">
            Generating your recommendation...
          </p>
        </div>
      ) : recommendation ? (
        <div className="bg-background/60 border border-highlight/30 p-6 rounded-2xl shadow-md">
          <div className="flex items-center mb-4 gap-2">
            <Brain className="w-5 h-5 text-highlight" />
            <h2 className="font-semibold text-lg text-highlight">
              AI Recommendation
            </h2>
          </div>
          <p className="text-muted mb-3">
            Assessment for your activity on your chosen date based on the
            calculated data.
          </p>
          <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {recommendation}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted">
          No recommendation yet. Please check your inputs.
        </p>
      )}
    </div>
  );
}
