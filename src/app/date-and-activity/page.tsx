"use client";

import Stars from "@/components/Stars";
import ActivitySelector from "@/components/dateActivity/ActivitySelector";
import Calendar from "@/components/dateActivity/Calendar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DateActivityPage() {
  const [isChecking, setIsChecking] = useState(true);
  const [canContinue, setCanContinue] = useState(false);
  const router = useRouter();

  // --- Function to check if we can continue ---
  const updateCanContinue = () => {
    const date = localStorage.getItem("date");
    const activities = localStorage.getItem("activities");
    try {
      const parsedActivities = activities ? JSON.parse(activities) : [];
      setCanContinue(!!date && parsedActivities.length > 0);
    } catch {
      setCanContinue(false);
    }
  };

  // --- Check for coordinates, date, and activities on mount ---
  useEffect(() => {
    const coords = localStorage.getItem("coordinates");
    if (!coords) {
      toast.error("Please enter your location first");
      router.replace("/");
      return;
    }

    updateCanContinue();
    setIsChecking(false);
  }, [router]);

  const handleContinue = () => {
    if (!canContinue) return;
    router.replace("/analyzing");
  };

  if (isChecking) {
    return (
      <section>
        <Stars />
      </section>
    );
  }

  return (
    <>
      <Stars />
      <section className="max-w-7xl flex flex-col gap-4 justify-center py-12 md:py-24 px-8 mx-auto">
        <div className="flex flex-col md:flex-row gap-4 md:items-stretch">
          <div className="md:w-1/3 w-full">
            {/* Pass callback to update canContinue after saving */}
            <Calendar onSave={updateCanContinue} />
          </div>
          <div className="md:w-2/3 w-full">
            <ActivitySelector onSave={updateCanContinue} />
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center px-6 mt-4">
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`w-full py-3 px-6 md:px-0 rounded-md text-sm font-semibold transition
            ${
              canContinue
                ? "bg-blue-700 hover:bg-blue-600 text-white shadow-md"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </section>
    </>
  );
}
