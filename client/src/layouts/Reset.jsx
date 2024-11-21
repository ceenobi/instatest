import { Lock } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export default function Reset() {
  return (
    <div className="max-w-[1200px] mx-auto py-6 px-4">
      <div className="sticky top-0 ">
        <Link to="/" className="text-center text-3xl font-bold mb-8 text-logo">
          Instapics
        </Link>
      </div>
      <div className="max-w-[350px] mx-auto flex flex-col justify-center">
        <div className="mt-6 py-8 bg-white border-[1.5px] border-gray-200 w-full">
          <div className="mx-auto h-[100px] w-[100px] rounded-full border-[1.5px] border-gray-900 flex justify-center items-center">
            <Lock size="60px" />
          </div>
          <Outlet />
        </div>
      </div>
      <div className="max-w-[350px] mx-auto border-2 p-4 flex justify-center items-center bg-gray-100">
        <Link to="/auth/login" className="text-sm font-semibold">
          Back to login
        </Link>
      </div>
      <div className="my-12 max-w-[350px] mx-auto">
        <h1 className="text-center text-sm">
          &copy; {new Date().getFullYear()} Instapics
        </h1>
      </div>
    </div>
  );
}
