import { followUser, getUser } from "@/api/user";
import { Alert, DataSpinner } from "@/components";
import { useAuthStore, useFetch } from "@/hooks";
import { Helmet } from "react-helmet-async";
import { NavLink, Outlet, useMatch, useParams } from "react-router-dom";
import ChangeProfileImg from "./components/ChangeProfileImg";
import UpdateProfile from "./components/UpdateProfile";
import { Bookmark, CheckCheck, Grid3x3 } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { toast } from "sonner";
import { handleError } from "@/utils";
import { sendVerifyEmailLink } from "@/api";
import Followers from "./components/Followers";
import Following from "./components/Following";
import CreateStory from "./components/CreateStory";

const Posts = lazy(() => import("./components/Posts"));

export default function Profile() {
  const { profile } = useParams();
  const [followText, setFollowText] = useState("");
  const match = useMatch(`/${profile}`);
  const { accessToken, setUser, user } = useAuthStore();
  const { error, loading, data, setData } = useFetch(
    getUser,
    profile,
    accessToken
  );
  const { data: loggedInUser } = user || {};
  const userProfile = data?.user;

  const profileLinks = [
    {
      path: `/${profile}`,
      Icon: Grid3x3,
      name: "Posts",
    },
    {
      path: `/${profile}/saved`,
      Icon: Bookmark,
      name: "Saved",
    },
  ];

  const toggleFollowUser = async () => {
    try {
      setFollowText("loading...");
      const res = await followUser(userProfile?._id, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message);
        setUser((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            ...res.data.user,
          },
        }));
      }
    } catch (error) {
      handleError(toast.error, error);
    } finally {
      setFollowText("");
    }
  };

  const resendVerification = async () => {
    setFollowText("Resending...");
    try {
      const res = await sendVerifyEmailLink(loggedInUser?._id);
      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      handleError(toast.error, error);
    } finally {
      setFollowText("");
    }
  };

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
            <div className="grid md:grid-cols-12 gap-4 md:gap-8 max-w-[600px] justify-center mx-auto px-4">
              <div className="md:col-span-4">
                <div className="flex gap-6">
                  <ChangeProfileImg
                    accessToken={accessToken}
                    setUser={setUser}
                    setData={setData}
                    data={userProfile}
                    loggedInUser={loggedInUser}
                  />
                  <div className="md:hidden">
                    <h1 className="text-xl font-bold">{profile}</h1>
                    <div className="mt-2 flex items-center gap-4">
                      {loggedInUser?.username === profile && (
                        <UpdateProfile
                          accessToken={accessToken}
                          setData={setData}
                          data={userProfile}
                        />
                      )}
                      {loggedInUser?._id !== userProfile?._id && (
                        <button
                          className="btn btn-accent btn-sm text-white focus:outline-none"
                          onClick={toggleFollowUser}
                        >
                          {loggedInUser?.following?.includes(userProfile?._id)
                            ? followText
                              ? followText
                              : "Following"
                            : followText
                            ? followText
                            : "Follow"}
                        </button>
                      )}
                      <button className="btn btn-accent btn-sm text-white">
                        Verified
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-8">
                <div className="hidden md:flex items-center gap-4">
                  <h1 className="text-xl font-bold flex-1">{profile}</h1>
                  <div className="flex items-center gap-4">
                    {loggedInUser?.username === profile && (
                      <UpdateProfile
                        accessToken={accessToken}
                        setData={setData}
                        data={userProfile}
                      />
                    )}
                    {loggedInUser?._id !== userProfile?._id && (
                      <button
                        className="btn btn-accent btn-sm text-white focus:outline-none"
                        onClick={toggleFollowUser}
                        title={
                          loggedInUser?.following?.includes(userProfile?._id)
                            ? "Unfollow"
                            : "Follow"
                        }
                      >
                        {loggedInUser?.following?.includes(userProfile?._id)
                          ? followText
                            ? followText
                            : "Following"
                          : followText
                          ? followText
                          : "Follow"}
                      </button>
                    )}
                    <button
                      className="btn btn-neutral btn-sm text-white focus:outline-none"
                      onClick={
                        loggedInUser?.isVerified === true
                          ? () => {}
                          : resendVerification
                      }
                    >
                      {loggedInUser?.isVerified === true
                        ? "Verified"
                        : followText
                        ? followText
                        : "Verify Email"}
                      {loggedInUser?.isVerified === true && <CheckCheck />}
                    </button>
                  </div>
                </div>
                <div className="hidden mt-6 md:flex items-center gap-4">
                  <h1 className="text-lg flex-1">
                    <span className="font-bold mr-2">
                      {data?.userPostsCount}
                    </span>
                    posts
                  </h1>
                  <div className="flex items-center gap-4">
                    <Followers userProfile={userProfile} profile={profile} />
                    <Following userProfile={userProfile} profile={profile} />
                  </div>
                </div>
                <h1 className="mt-3 text-md font-bold">
                  {userProfile?.fullname}
                </h1>
                <p className="text-sm">
                  {userProfile?.bio ||
                    "Tech lover, web developer, arts lover. #RealMadrid White"}
                </p>
              </div>
            </div>
            <div className="my-8 text-center">
              <CreateStory />
              <p>Create story</p>
            </div>
            <div className="divider m-0 md:hidden mt-4"></div>
            <div className="flex justify-between items-center md:hidden px-12 md:px-4">
              <div className="text-center">
                <p className="font-bold">{data?.userPostsCount}</p>
                <span className="text-neutral text-sm">posts</span>
              </div>
              <Followers userProfile={userProfile} profile={profile} />
              <Following userProfile={userProfile} profile={profile} />
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
                        ? "font-semibold hover:text-neutral text-accent"
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
            <Suspense
              fallback={<div className="text-center">Fetching posts..</div>}
            >
              <Posts accessToken={accessToken} profileId={userProfile?._id} />
            </Suspense>
          ) : (
            <Outlet />
          )}
        </>
      </div>
    </>
  );
}
