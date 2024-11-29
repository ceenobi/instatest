import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import authHeroPic from "@/assets/collabstr-9qD8AbQyj5w-unsplash.jpg";

export default function Auth() {
  const location = useLocation();
  const paths = ["/auth/login", "/auth/signup"];
  const match = paths.includes(location.pathname);
  const navigate = useNavigate();

  const redirect = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col justify-between min-h-dvh">
      <div>
        <div className="max-w-[800px] py-8 mx-auto md:flex justify-center">
          {location.pathname === "/auth/login" && (
            <div className="hidden lg:block max-w-[400px] mx-auto">
              <img
                src={authHeroPic}
                className="w-full h-[600px] object-cover"
                alt="auth"
                loading="eager"
              />
            </div>
          )}
          <div className="max-w-[350px] mx-auto w-full">
            <div className="border-[1.5px] border-gray-200 py-6">
              <h1
                className="text-center text-3xl font-bold mb-8 text-logo"
                onClick={redirect}
                role="button"
              >
                Instapics
              </h1>
              <Outlet />
            </div>

            {match && (
              <div className="mt-6 max-w-[350px] mx-auto border-[1.5px] p-6">
                {paths[0] === location.pathname && (
                  <p className="text-center text-sm font-semibold">
                    Don&apos;t have an account?{" "}
                    <Link to="/auth/signup" className="text-accent font-bold">
                      Sign up
                    </Link>
                  </p>
                )}
                {paths[1] === location.pathname && (
                  <p className="text-center text-sm font-semibold">
                    Already have an account?{" "}
                    <Link to="/auth/login" className="text-accent font-bold">
                      Log in
                    </Link>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="my-12 max-w-[350px] mx-auto">
        <h1 className="text-center text-sm">
          &copy; {new Date().getFullYear()} Instapics
        </h1>
      </div>
    </div>
  );
}
