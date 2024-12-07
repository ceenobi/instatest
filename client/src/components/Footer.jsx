import { sidebar } from "@/utils";
import { NavLink } from "react-router-dom";
import Search from "./Search";
import { useAuthStore, usePostStore } from "@/hooks";
import Menu from "./Menu";

export default function Footer() {
  const { user } = useAuthStore() || {};
  const { stories } = usePostStore();

  const getUserStories = stories.filter((story) => {
    return story.user._id === user?.data?._id;
  });
  const links = ["Home", "Explore"];

  return (
    <div className="md:hidden sticky bottom-0 z-20 bg-white p-3 border-t-2 border-t-gray-200">
      <div className="max-w-[350px] mx-auto rounded-xl flex justify-around gap-4 items-center ">
        {sidebar
          .filter(({ name }) => links.includes(name))
          .map(({ id, path, Icon }) => (
            <NavLink key={id} to={path}>
              {({ isActive }) => (
                <span className={`hover:bg-zinc-100 rounded-lg`}>
                  <Icon size={28} className={isActive ? "text-accent" : ""} />
                </span>
              )}
            </NavLink>
          ))}
        <Search />
        <NavLink to={`/${user?.data?.username}`}>
          <div className="avatar placeholder">
            <div
              className={`w-8 rounded-full border-2 ${
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
        <Menu />
      </div>
    </div>
  );
}
