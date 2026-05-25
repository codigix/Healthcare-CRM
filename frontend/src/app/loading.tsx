import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-[50vh] text-gray-400 gap-4">
      <Loader2 className="animate-spin text-accent" size={48} />
      <p className="text-lg font-medium animate-pulse">Loading data...</p>
    </div>
  );
}
