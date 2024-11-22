import { Instagram } from "lucide-react";

export function LazySpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Instagram size="64px" className="text-accent" />
    </div>
  );
}

export function DataSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-md bg-accent"></span>;
    </div>
  );
}
