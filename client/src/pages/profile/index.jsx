import { followUser, getUser } from "@/api/user";
import { Alert, DataSpinner } from "@/components";
import { useAuthStore, useFetch, useScroll } from "@/hooks";
import { Helmet } from "react-helmet-async";
import {
  NavLink,
  Outlet,
  useMatch,
  useParams,
  useNavigate,
} from "react-router-dom";
import ChangeProfileImg from "./components/ChangeProfileImg";
import UpdateProfile from "./components/UpdateProfile";
import {
  Bookmark,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
} from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { toast } from "sonner";
import { handleError } from "@/utils";
import { sendVerifyEmailLink } from "@/api";
import Followers from "./components/Followers";
import Following from "./components/Following";
import CreateStory from "../../components/CreateStory";
import { getUserStories } from "@/api/story";

const Posts = lazy(() => import("./components/Posts"));

export default function Profile() {
  const { profile } = useParams();
  const [followText, setFollowText] = useState("");
  const match = useMatch(`/${profile}`);
  const navigate = useNavigate();
  const { accessToken, setUser, user } = useAuthStore();
  const { error, loading, data, setData } = useFetch(
    getUser,
    profile,
    accessToken
  );
  const {
    err: storyErr,
    loading: storyLoading,
    data: storyData,
  } = useFetch(getUserStories, data.user?._id, accessToken);
  const { storiesContainerRef, scrollPosition, handleScroll } = useScroll();
  const { data: loggedInUser } = user || {};
  const userProfile = data?.user;
  const stories = storyData?.stories || [];

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

  const viewStory = (username, storyId) => {
    navigate(`/stories/${username}/${storyId}`);
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
                    storyData={storyData}
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
                      className={`btn btn-neutral btn-sm text-white focus:outline-none ${
                        loggedInUser?.isVerified === true &&
                        "cursor-not-allowed"
                      }`}
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
                  {userProfile?.bio || "Like what you see? Come get at me!"}
                </p>
              </div>
            </div>
            <div className="my-8 flex gap-4 px-4 md:px-0 items-center">
              <div className="w-[120px] text-center">
                <CreateStory />
                <p className="mt-2">Create story</p>
              </div>
              <div className="relative w-full md:mt-6">
                <div className="absolute left-0 top-[25%] -translate-y-1/2 z-10">
                  <button
                    onClick={() => handleScroll("left")}
                    className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    style={{ display: scrollPosition <= 0 ? "none" : "block" }}
                  >
                    <ChevronLeft size={12} />
                  </button>
                </div>
                <div
                  ref={storiesContainerRef}
                  className="w-full mb-6 px-4 md:px-0 flex gap-4 overflow-auto scrollbar-hide"
                >
                  {storyErr && (
                    <p className="text-red-500 text-sm">{storyErr}</p>
                  )}
                  {storyLoading && (
                    <div className="flex gap-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          className="skeleton h-12 w-12 shrink-0 rounded-full"
                          key={i}
                        ></div>
                      ))}
                    </div>
                  )}
                  {stories.map((story) => (
                    <div
                      key={story._id}
                      className="flex flex-col justify-center items-center"
                      onClick={() =>
                        viewStory(story?.user?.username, story._id)
                      }
                    >
                      <img
                        src={story.media[0]}
                        alt={story?.user?.username}
                        className={`h-14 w-14 shrink-0 rounded-full border-2 hover:border-2 hover:border-neutral ${
                          !story.viewers.includes(loggedInUser?._id) &&
                          "border-accent"
                        } cursor-pointer`}
                        loading="eager"
                        decoding="async"
                        title="View story"
                      />
                      <p className="font-bold mt-2">
                        {story.caption?.length > 13
                          ? `${story.caption.slice(0, 13)}...`
                          : story.caption}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="absolute right-0 top-[25%] -translate-y-1/2 z-10">
                  <button
                    onClick={() => handleScroll("right")}
                    className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    style={{
                      display:
                        storiesContainerRef.current &&
                        scrollPosition >=
                          storiesContainerRef.current.scrollWidth -
                            storiesContainerRef.current.clientWidth
                          ? "none"
                          : "block",
                    }}
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
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
          <div className="divider"></div>
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
