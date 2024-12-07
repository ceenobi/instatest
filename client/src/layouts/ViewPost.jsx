import { X } from "lucide-react";
import { Link, Outlet, useMatch, useNavigate } from "react-router-dom";

export default function ViewPost() {
  const navigate = useNavigate();
  const match = useMatch("/stories/:id/:status");
  return (
    <div className="max-w-[1200px] mx-auto py-6">
      <div
        className={`px-4 sticky top-0 z-40 flex justify-between ${
          match ? "bg-black" : "bg-white"
        }`}
      >
        <Link
          to="/"
          className={`text-center text-3xl font-bold mb-8 text-logo ${
            match && "text-zinc-100"
          }`}
        >
          Instapics
        </Link>
        <X
          onClick={() => navigate(-1)}
          className={`cursor-pointer  ${match && "text-zinc-100"}`}
        />
      </div>
      <Outlet />
    </div>
  );
}
