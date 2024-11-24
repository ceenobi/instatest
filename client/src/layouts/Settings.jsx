import { settingsLinks } from "@/utils";
import { NavLink, Outlet } from "react-router-dom";

export default function Settings() {
  return (
    <div className="flex min-h-dvh ml-[30px] w-[1200px]">
      <div className="hidden md:block fixed top-0 w-[240px] h-full z-30 border-2 bg-white">
        <div className="py-8 text-center">
          <h1 className="text-2xl font-bold mb-8">Settings</h1>
          {settingsLinks.map(({ id, path, name, Icon }) => (
            <NavLink
              key={id}
              className="flex flex-col justify-center items-center"
              to={`/settings${path}`}
            >
              {({ isActive }) => (
                <span className={`mb-2 hover:bg-zinc-100 rounded-lg p-3 flex gap-2 items-center ${isActive ? "text-white font-semibold bg-secondary hover:text-neutral" : ""}`}>
                  <Icon size="24px" />
                  {name}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="max-w-full mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
