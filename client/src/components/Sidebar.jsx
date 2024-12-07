import { useAuthStore } from "@/hooks";
import { sidebar } from "@/utils";
import { AlignJustify, Bookmark, ImageUp, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import CreatePost from "./CreatePost";
import Search from "./Search";
import { usePostStore } from "@/hooks";

export default function Sidebar() {
  const { user, handleLogout } = useAuthStore() || {};
  const { stories } = usePostStore();

  const getUserStories = stories.filter((story) => {
    return story.user._id === user?.data?._id;
  });

  return (
    <div className="py-8 px-[8px] flex flex-col h-[100%] justify-between items-center">
      <NavLink to="/" className="tooltip tooltip-right" data-tip="Instapics">
        <ImageUp size="28px" />
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
                <Icon size={28} className={isActive ? "text-accent" : ""} />
              </span>
            )}
          </NavLink>
        ))}
        <div
          className="tooltip tooltip-right flex flex-col justify-center items-center mb-2 hover:bg-zinc-100 rounded-lg p-3 cursor-pointer"
          data-tip="Search users"
        >
          <Search />
        </div>
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
          <div className="avatar placeholder">
            <div
              className={`w-12 rounded-full border-2 ${
                getUserStories.length > 0 ? "border-accent" : ""
              }`}
            >
              {user?.data?.profilePicture ? (
                <img
                  src={user?.data?.profilePicture}
                  alt={user?.data?.username}
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <span className="text-2xl">
                  {user?.data?.username?.charAt(0)}
                </span>
              )}
            </div>
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
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
