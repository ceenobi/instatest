import { ImageUp } from "lucide-react";

export function LazySpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <ImageUp size="68px" className="text-accent" />
    </div>
  );
}

export function DataSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-md bg-accent"></span>
    </div>
  );
}
