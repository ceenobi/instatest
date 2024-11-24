import { Nav, Sidebar } from "@/components";
import { Outlet, ScrollRestoration } from "react-router-dom";

export default function Root() {
  return (
    <main className="min-h-dvh flex">
      <Nav />
      <div className="hidden md:block fixed top-0 w-[80px] h-full z-40 border-r-2 bg-white">
        <Sidebar />
      </div>
      <div className="max-w-full mx-auto">
        <Outlet />
      </div>
      <ScrollRestoration
        getKey={(location) => {
          return location.key;
        }}
      />
    </main>
  );
}
