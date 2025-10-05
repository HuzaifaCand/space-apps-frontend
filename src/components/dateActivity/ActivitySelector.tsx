"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { activities } from "@/data/activities";
import { setLocal, getLocal, removeLocal } from "@/utils/storage";
import { toast } from "sonner";

interface ActivitySelectorProps {
  onSave?: () => void; // optional callback
}

export default function ActivitySelector({ onSave }: ActivitySelectorProps) {
  const [saved, setSaved] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [extraActivity, setExtraActivity] = useState("");
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Load saved activities on mount ---
  useEffect(() => {
    const savedActivities = getLocal("activities");
    const savedExtra = getLocal("activities_detail");

    if (Array.isArray(savedActivities)) setSelected(savedActivities);
    if (typeof savedExtra === "string") setExtraActivity(savedExtra);
    if (savedActivities || savedExtra) setSaved(true);
  }, []);

  const handleConfirm = () => {
    setLocal("activities", selected);
    setLocal("activities_detail", extraActivity.trim());
    toast.success("Activities saved!");
    setSaved(true);

    if (onSave) onSave(); // <--- trigger callback
  };

  // --- Clear storage when there’s a change (unsaved edits) ---
  const markUnsaved = useCallback(() => {
    if (saved) {
      removeLocal("activities");
      removeLocal("activitiesDetail");
      setSaved(false);
    }
  }, [saved]);

  // --- Toggle selection ---
  const toggleActivity = useCallback(
    (name: string) => {
      setSelected((prev) => {
        const newSelection = prev.includes(name)
          ? prev.filter((a) => a !== name)
          : [...prev, name];
        markUnsaved();
        return newSelection;
      });
    },
    [markUnsaved]
  );

  // --- Handle extra activity changes ---
  const handleExtraChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    markUnsaved();
    setExtraActivity(e.target.value);
  };

  // --- Responsive item count ---
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    const updateItemsPerPage = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth < 640) setItemsPerPage(9);
        else if (window.innerWidth < 768) setItemsPerPage(12);
        else setItemsPerPage(10);
        setPage(0);
      }, 200);
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const start = page * itemsPerPage;
  const currentActivities = activities.slice(start, start + itemsPerPage);

  const nextPage = useCallback(
    () => setPage((p) => Math.min(p + 1, totalPages - 1)),
    [totalPages]
  );
  const prevPage = useCallback(() => setPage((p) => Math.max(p - 1, 0)), []);

  return (
    <div className="bg-background ring ring-blueBg py-8 px-6 rounded-2xl relative h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-3 pt-2 gap-2">
        <h2 className="text-highlight font-semibold text-md sm:text-lg md:text-xl">
          Select any activities you are planning to do
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevPage}
            disabled={page === 0}
            className={`p-2 rounded-full transition ${
              page === 0
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-blueBg/20 hover:bg-blueBg/40 text-blue-300"
            }`}
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={nextPage}
            disabled={page >= totalPages - 1}
            className={`p-2 rounded-full transition ${
              page >= totalPages - 1
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-blueBg/20 hover:bg-blueBg/40 text-blue-300"
            }`}
          >
            <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Activities Grid */}
      <div
        ref={scrollRef}
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 md:gap-6 p-2 transition-all duration-300"
      >
        {currentActivities.map(({ name, icon }) => {
          const isActive = selected.includes(name);
          return (
            <button
              key={name}
              onClick={() => toggleActivity(name)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border shadow-sm transition-all
                ${
                  isActive
                    ? "bg-blueBg text-white border-blueBg scale-105"
                    : "bg-background/50 border-blueBg/30 text-gray-200 hover:bg-secondary/30 hover:scale-[1.02]"
                }`}
            >
              <Icon icon={icon} width="28" height="28" />
              <span className="mt-2 text-xs sm:text-sm font-medium text-center line-clamp-1">
                {name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Pagination Info */}
      <div className="flex justify-between items-center mt-4 px-3 text-sm text-gray-400">
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <span>{selected.length} selected</span>
      </div>

      {/* Extra Input */}
      <div className="mt-6 px-3 py-1">
        <label className="block text-xs sm:text-sm text-highlight mb-2">
          Add any other activities or notes for your day out
        </label>
        <textarea
          value={extraActivity}
          onChange={handleExtraChange}
          rows={3}
          placeholder="e.g., BBQ with family, visiting waterfall"
          className="w-full bg-background/60 border border-blueBg/30 placeholder-muted rounded-md p-3 text-gray-200 text-xs sm:text-sm focus:ring-1 focus:ring-blueBg outline-none resize-none"
        />
      </div>

      {/* Confirm Button */}
      <div className="w-full mt-6 px-3">
        <button
          onClick={handleConfirm}
          disabled={selected.length === 0 && !extraActivity.trim()}
          className={`w-full py-2.5 rounded-sm text-sm font-medium transition-all
      ${
        selected.length === 0 && !extraActivity.trim()
          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
          : saved
          ? "bg-blue-500 text-white"
          : "bg-blue-600 text-white hover:bg-blue-600/90"
      }`}
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
