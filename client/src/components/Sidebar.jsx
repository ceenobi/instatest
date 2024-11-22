import { useAuthStore } from "@/hooks";
import { sidebar } from "@/utils";
import { AlignJustify, Bookmark, ImagePlus, Instagram } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const { user } = useAuthStore() || {};
  return (
    <div className="py-6 px-[8px] flex flex-col h-[100%] justify-between items-center">
      <NavLink to="/" className="tooltip tooltip-right" data-tip="Home">
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
          <ImagePlus size="28px" />
        </div>
        <NavLink
          className="avatar flex flex-col justify-center items-center mb-2 hover:bg-zinc-100 rounded-lg p-3 "
          to={`/profile/${user?.data?.username}`}
        >
          <div className="w-8 rounded-xl">
            <img
              src={
                user?.data?.profilePicture ||
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              }
            />
          </div>
        </NavLink>
      </div>
      <div className="dropdown dropdown-top hover:bg-zinc-100 rounded-lg p-3 ">
        <div tabIndex={0} role="button" className="m-1">
          <AlignJustify />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <li>
            <>
              <NavLink className="btn w-[30x]">
                <Bookmark />
                Saved
              </NavLink>
            </>
          </li>
          <div className="divider"></div>
          <li>
            <a href="#">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
