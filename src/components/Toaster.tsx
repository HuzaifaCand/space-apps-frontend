import { Toaster } from "sonner";

export default function SpaceToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      toastOptions={{
        style: {
          background: "linear-gradient(135deg, #0b1d33, #14273d)", // deep space blues
          border: "1px solid #1f3a5c", // subtle edge
          color: "#e0e6f0", // soft light-gray text
          boxShadow: "0 0 12px rgba(0, 50, 120, 0.6)", // glowing spacey shadow
        },
        classNames: {
          title: "text-sky-200 font-semibold",
          description: "text-sky-300",
          actionButton: "bg-sky-600 hover:bg-sky-500 text-white",
          cancelButton: "bg-slate-700 hover:bg-slate-600 text-slate-200",
        },
      }}
    />
  );
}
