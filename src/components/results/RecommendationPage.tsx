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
    <div className="flex flex-col items-center justify-center text-center min-h-[300px] text-white">
      {loading ? (
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin text-highlight" />
          <p className="text-sm text-muted">
            Generating your recommendation...
          </p>
        </div>
      ) : recommendation ? (
        <div className="bg-background/70 border border-highlight/30 p-6 rounded-2xl max-w-2xl shadow-md">
          <div className="flex items-center justify-center mb-3 gap-2">
            <Brain className="w-5 h-5 text-highlight" />
            <div className="flex flex-col-1">
              <h2 className="font-semibold text-lg text-highlight">
                AI Recommendation
              </h2>
              <p className="text-muted">
                Assessment for your activity on your chosen date based on the
                calculated data
              </p>
            </div>
          </div>
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
