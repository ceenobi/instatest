import { useAuthStore, useFetch, usePostStore } from "@/hooks";
import { Alert } from "@/components";
import Skeleton from "./components/Skeleton";
import { lazy, Suspense, useState } from "react";
import { Helmet } from "react-helmet-async";
import { suggestUsers } from "@/api/user";
import { Link } from "react-router-dom";
import { toggleFollowUser } from "@/utils";

const Card = lazy(() => import("./components/Card"));

export default function Home() {
  const [followText, setFollowText] = useState("");
  const [err, setError] = useState(null);
  const [activeBtn, setActiveBtn] = useState(0);
  const { posts, loading, error, setData } = usePostStore();
  const { accessToken, user, setUser, handleLogout } = useAuthStore();
  const { data } = useFetch(suggestUsers, accessToken);
  const loggedInUser = user?.data;

  if (error || err) {
    return <Alert error={error} classname="my-4" />;
  }
  const suggestedUsers = data?.users || [];

  const toggleFollowUserFn = async (userId) => {
    const res = await toggleFollowUser(
      userId,
      setFollowText,
      accessToken,
      setUser,
      setError
    );
    return res;
  };

  return (
    <>
      <Helmet>
        <title>Your Instapics Feed</title>
        <meta name="description" content="Instapics Home" />
      </Helmet>
      <div className="max-w-[1200px] mx-auto ">
        <div className="py-8 md:flex justify-between w-full min-h-dvh">
          <div className="lg:w-[60%]">
            <div className="mb-6 px-4 md:px-0 flex gap-4 overflow-auto">
              <div className="avatar">
                <div className="w-[50px] rounded-full border-2 border-accent">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <div className="avatar">
                <div className="w-[50px] rounded-full border-2 border-accent">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
            </div>
            <div className="md:max-w-[400px] lg:max-w-[400px] xl:max-w-[600px] mx-auto">
              {loading ? (
                <Skeleton />
              ) : (
                <>
                  {posts.length === 0 && (
                    <h1 className="text-center text-2xl font-bold">
                      No posts yet
                    </h1>
                  )}
                  <Suspense
                    fallback={
                      <div className="text-center">Loading posts...</div>
                    }
                  >
                    {posts.map((post) => (
                      <Card key={post._id} post={post} setData={setData} />
                    ))}
                  </Suspense>
                </>
              )}
            </div>
          </div>
          <div className="hidden md:block min-w-[30%] lg:min-w-[30%]">
            <div className="flex justify-between items-center mb-8">
              <div className="flex gap-4 items-center">
                <div className="avatar placeholder">
                  <div className="w-12 rounded-full border-2">
                    {loggedInUser?.profilePicture ? (
                      <img
                        src={loggedInUser?.profilePicture}
                        alt={loggedInUser?.username}
                        loading="eager"
                        decoding="async"
                      />
                    ) : (
                      <span className="text-2xl">
                        {loggedInUser?.username?.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {loggedInUser?.username}
                  </p>
                  <p className="text-sm font-semibold text-zinc-500">
                    {loggedInUser?.fullname}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-outline btn-error focus:outline-none focus:text-white"
              >
                Sign out
              </button>
            </div>
            <div className="flex flex-wrap justify-between items-center">
              <p className="text-sm lg:text-base text-pretty">
                Suggested for you
              </p>
              {/* <button className="text-sm font-semibold">See all</button> */}
            </div>
            {suggestedUsers.map((user, index) => (
              <div
                className="mt-4 flex justify-between items-center"
                key={user._id}
              >
                <div className="flex gap-4 items-center">
                  <div className="avatar placeholder">
                    <div className="w-[50px] h-[50px] rounded-full border-2">
                      <Link to={`/${user.username}`}>
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.username}
                            loading="eager"
                            decoding="async"
                          />
                        ) : (
                          <span className="text-2xl">
                            {user.username?.charAt(0)}
                          </span>
                        )}
                      </Link>
                    </div>
                  </div>
                  <div>
                    <Link
                      to={`/${user.username}`}
                      className="text-sm font-semibold text-zinc-500"
                    >
                      {user.username}
                    </Link>
                    <p className="text-sm font-semibold">{user.fullname}</p>
                  </div>
                </div>
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    toggleFollowUserFn(user._id);
                    setActiveBtn(index);
                  }}
                >
                  {loggedInUser?.following.includes(user._id)
                    ? followText && activeBtn === index
                      ? followText
                      : "Following"
                    : followText && activeBtn === index
                    ? followText
                    : "Follow"}
                </button>
              </div>
            ))}
            <h1 className="mt-10 text-sm">
              &copy; {new Date().getFullYear()} INSTAPICS
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
