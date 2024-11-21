import { Sidebar } from "@/components";
import { Outlet, ScrollRestoration } from "react-router-dom";

export default function Root() {
  return (
    <main className="w-full flex min-h-dvh">
      <div className="hidden md:block fixed top-0 w-[80px] h-full z-40 border-r-2">
        <Sidebar />
      </div>
      <div className="max-w-screen-2xl mx-auto">
        <Outlet />
        <ScrollRestoration
          getKey={(location) => {
            return location.key;
          }}
        />
      </div>
    </main>
  );
}
