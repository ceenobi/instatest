import { Instagram } from "lucide-react";

export function LazySpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <Instagram size="64px"/>
        {/* <span className="loading loading-ball loading-lg"></span> */}
      </div>
    </div>
  );
}
