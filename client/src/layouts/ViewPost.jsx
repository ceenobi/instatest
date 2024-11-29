import { X } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function ViewPost() {
  const navigate = useNavigate();
  return (
    <div className="max-w-[1200px] mx-auto py-6">
      <div className="px-4 sticky top-0 z-40 flex justify-between bg-white">
        <Link to="/" className="text-center text-3xl font-bold mb-8 text-logo">
          Instapics
        </Link>
        <X onClick={() => navigate(-1)} className="cursor-pointer" />
      </div>
      <Outlet />
    </div>
  );
}
