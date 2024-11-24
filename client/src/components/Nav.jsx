import { Heart, ImagePlus, Instagram } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <>
      <div className="md:hidden sticky top-0 z-40 bg-white p-4">
        <div className="flex justify-between items-center">
          <NavLink to="/" className="text-2xl font-bold text-logo">
            Instapics
          </NavLink>
          <div className="flex gap-4 items-center">
            <ImagePlus size="28px" />
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
