import { useAuthStore } from "@/hooks";
import { sidebar } from "@/utils";
import { AlignJustify, Bookmark, Instagram, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import CreatePost from "./CreatePost";

export default function Sidebar() {
  const { user, logout } = useAuthStore() || {};
  return (
    <div className="py-8 px-[8px] flex flex-col h-[100%] justify-between items-center">
      <NavLink to="/" className="tooltip tooltip-right" data-tip="Instapics">
        <Instagram size="28px" />
      </NavLink>
      <div>
        {sidebar.map(({ id, path, name, Icon }) => (
          <NavLink
            key={id}
            className="tooltip tooltip-right flex flex-col justify-center items-center"
            data-tip={name}
            to={path}
          >
            {({ isActive }) => (
              <span className={`mb-2 hover:bg-zinc-100 rounded-lg p-3`}>
                <Icon size="28px" className={isActive ? "text-accent" : ""} />
              </span>
            )}
          </NavLink>
        ))}
        <div
          className="tooltip tooltip-right flex flex-col justify-center items-center mb-2 hover:bg-zinc-100 rounded-lg p-3 cursor-pointer"
          data-tip="New post"
        >
          <CreatePost />
        </div>
        <NavLink
          className="avatar flex flex-col justify-center items-center mb-2 hover:bg-zinc-100 rounded-lg p-3 "
          to={`/${user?.data?.username}`}
        >
          <div className="w-8 rounded-full border-2 border-accent">
            <img
              src={
                user?.data?.profilePicture ||
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              }
            />
          </div>
        </NavLink>
      </div>
      <div className="dropdown dropdown-top hover:bg-zinc-100 rounded-lg p-3 cursor-pointer">
        <div tabIndex={0} role="button" className="m-1">
          <AlignJustify />
        </div>
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
            <button
              onClick={() => {
                logout();
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
