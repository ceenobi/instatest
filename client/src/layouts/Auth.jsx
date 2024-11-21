import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

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
        <div className="max-w-[350px] mx-auto flex justify-center">
          <div className="mt-6 py-8 bg-white border-[1.5px] border-gray-200 w-full">
            <h1
              className="text-center text-3xl font-bold mb-8 text-logo"
              onClick={redirect}
              role="button"
            >
              Instapics
            </h1>
            <Outlet />
          </div>
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
      <div className="my-12 max-w-[350px] mx-auto">
        <h1 className="text-center text-sm">
          &copy; {new Date().getFullYear()} Instapics
        </h1>
      </div>
    </div>
  );
}
