import { SelPoint } from "@/app/page";
import { setLocal } from "@/app/utils/storage";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

interface Props {
  selectedPoint: SelPoint;
}

export default function ContinueButton({ selectedPoint }: Props) {
  const router = useRouter();

  const handleContinue = () => {
    if (selectedPoint) {
      setLocal("coordinates", selectedPoint);
      router.replace("/date-and-activity");
      toast.success("Coordinates saved!");
    }
  };
  return (
    <div className="py-1 flex justify-end">
      <button
        disabled={Boolean(!selectedPoint)}
        onClick={handleContinue}
        className={`${
          selectedPoint
            ? "bg-blue-900 text-white font-medium hover:cursor-pointer"
            : "bg-blue-900/20 cursor-not-allowed font-medium text-white"
        } px-4 py-2 w-full text-xs rounded-sm shadow-md`}
      >
        Continue
      </button>
    </div>
  );
}
