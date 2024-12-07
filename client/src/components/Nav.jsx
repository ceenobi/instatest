import { Heart } from "lucide-react";
import { NavLink } from "react-router-dom";
import CreatePost from "./CreatePost";

export default function Nav() {
  return (
    <>
      <div className="md:hidden sticky top-0 z-40 bg-white p-2">
        <div className="flex justify-between items-center">
          <NavLink to="/" className="text-2xl font-bold text-logo">
            Instapics
          </NavLink>
          <div className="flex gap-4 items-center">
            <CreatePost />
            <NavLink to="/favorites">
              <Heart size="28px" />
            </NavLink>
          </div>
        </div>
      </div>
      <div className="divider m-0"></div>
    </>
  );
}
