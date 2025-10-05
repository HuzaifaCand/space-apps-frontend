import { SelPoint } from "@/app/page";

// utils/storage.ts
export const setLocal = (
  key: string,
  value: SelPoint | string | string[] | JSON
) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export function getLocal(key: string) {
  if (typeof window === "undefined") return null;
  const item = localStorage.getItem(key);
  try {
    return item ? JSON.parse(item) : null;
  } catch {
    return item;
  }
}

export const removeLocal = (key: string) => {
  localStorage.removeItem(key);
};

// For convenience
export const clearActivityData = () => {
  ["coordinates", "date"].forEach(removeLocal);
};
