import { Nav, Sidebar } from "@/components";
import { Outlet, ScrollRestoration } from "react-router-dom";

export default function Root() {
  return (
    <main className="min-h-dvh md:flex">
      <Nav />
      <div className="hidden md:block fixed top-0 w-[80px] h-full z-40 border-r-2 bg-white">
        <Sidebar />
      </div>
      <div className="w-full md:w-[calc(100%-80px)] mx-auto">
        <div className="md:ml-[80px]">
          <Outlet />
          <ScrollRestoration
            getKey={(location) => {
              return location.key;
            }}
          />
        </div>
      </div>
    </main>
  );
}
