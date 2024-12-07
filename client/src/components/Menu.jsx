import { useAuthStore } from "@/hooks";
import { AlignJustify, Bookmark, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Menu() {
  const { user, handleLogout } = useAuthStore() || {};
  return (
    <div className="dropdown dropdown-top dropdown-end">
      <div tabIndex={0} role="button" className="m-1">
        <AlignJustify />
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <li>
            <NavLink
              className="flex items-center gap-2"
              to="/settings/update-password"
            >
              <Settings />
              Settings
            </NavLink>
          </li>
          <li>
            <NavLink
              className="flex items-center gap-2"
              to={`/${user?.data?.username}/saved`}
            >
              <Bookmark />
              Saved
            </NavLink>
          </li>
          <div className="w-full h-[1px] bg-gray-300 my-1"></div>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
