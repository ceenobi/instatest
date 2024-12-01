import { getUser } from "@/api/user";
import { Alert, DataSpinner } from "@/components";
import { useAuthStore, useFetch } from "@/hooks";
import { Helmet } from "react-helmet-async";
import { NavLink, Outlet, useMatch, useParams } from "react-router-dom";
import ChangeProfileImg from "./components/ChangeProfileImg";
import UpdateProfile from "./components/UpdateProfile";
import { Bookmark, Grid3x3 } from "lucide-react";
import { lazy, Suspense } from "react";

const Posts = lazy(() => import("./components/Posts"));

export default function Profile() {
  const { profile } = useParams();
  const match = useMatch(`/${profile}`);
  const { error, loading, data, setData } = useFetch(getUser, profile);
  const { accessToken, setUser, user } = useAuthStore();
  const { data: loggedInUser } = user || {};

  const profileLinks = [
    {
      path: `/${profile}`,
      Icon: Grid3x3,
      name: "Posts",
    },
    {
      path: `/${loggedInUser?.username}/saved`,
      Icon: Bookmark,
      name: "Saved",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Your Instapics profile - (@{profile}) </title>
        <meta name="description" content="Get access to Instashot" />
      </Helmet>
      <div className="py-4 md:py-8 max-w-[900px] mx-auto">
        {error && <Alert error={error} classname="my-4" />}
        {loading ? (
          <DataSpinner />
        ) : (
          <>
            <div className="grid md:grid-cols-12 gap-4 md:gap-8 max-w-[700px] justify-center mx-auto px-4">
              <div className="md:col-span-4">
                <div className="flex gap-6">
                  <ChangeProfileImg
                    accessToken={accessToken}
                    setUser={setUser}
                    setData={setData}
                    data={data}
                  />
                  <div className="md:hidden">
                    <h1 className="text-xl font-bold">{profile}</h1>
                    <div className="mt-2 flex items-center gap-4">
                      <UpdateProfile
                        accessToken={accessToken}
                        setUser={setUser}
                        setData={setData}
                      />
                      <button className="btn btn-neutral btn-sm w-[100px]">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-8">
                <div className="hidden md:flex items-center gap-4">
                  <h1 className="text-xl font-bold flex-1">{profile}</h1>
                  <div className="flex items-center gap-4">
                    <UpdateProfile
                      accessToken={accessToken}
                      setData={setData}
                      data={data}
                    />
                    <button className="btn btn-accent btn-sm text-white">
                      Follow
                    </button>
                  </div>
                </div>
                <div className="hidden mt-6 md:flex items-center gap-4">
                  <h1 className="text-lg flex-1">
                    <span className="font-bold">4</span> posts
                  </h1>
                  <div className="flex items-center gap-4">
                    <h1 className="text-lg">
                      <span className="font-bold">4</span> followers
                    </h1>
                    <h1 className="text-lg">
                      <span className="font-bold">4</span> following
                    </h1>
                  </div>
                </div>
                <h1 className="mt-3 text-md font-bold">{data?.fullname}</h1>
                <p className="text-sm">
                  {data?.bio ||
                    "Tech lover, web developer, arts lover. #RealMadrid White"}
                </p>
              </div>
            </div>
            <div className="divider m-0 md:hidden mt-4"></div>
            <div className="flex justify-between items-center md:hidden px-12 md:px-4">
              <div className="text-center">
                <p className="font-bold">4</p>
                <span className="text-neutral text-sm">posts</span>
              </div>
              <div className="text-center">
                <p className="font-bold">4</p>
                <span className="text-neutral text-sm">followers</span>
              </div>
              <div className="text-center">
                <p className="font-bold">4</p>
                <span className="text-neutral text-sm">following</span>
              </div>
            </div>
            <div className="divider m-0 md:hidden"></div>
          </>
        )}
        <>
          <div className="divider mt-8 mb-0"></div>
          <div className="flex justify-center items-center gap-6 px-4 md:px-0">
            {profileLinks.map(({ path, name, Icon }) => (
              <NavLink
                key={path}
                className="flex flex-col justify-center items-center"
                to={path}
                end
              >
                {({ isActive }) => (
                  <span
                    className={`mb-2 mt-0 p-3 flex gap-2 items-center ${
                      isActive
                        ? "font-semibold hover:text-neutral mt-6 border-t-2 border-accent"
                        : ""
                    }`}
                  >
                    <Icon size="20px" />
                    {name}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
          {match ? (
            <Suspense fallback={<div>Fetching posts..</div>}>
              <Posts accessToken={accessToken} profileId={data._id} />
            </Suspense>
          ) : (
            <Outlet />
          )}
        </>
      </div>
    </>
  );
}
