import { useAuthStore, useFetch, usePostStore, useScroll } from "@/hooks";
import { Alert, CreateStory } from "@/components";
import Skeleton from "./components/Skeleton";
import { lazy, Suspense, useState } from "react";
import { Helmet } from "react-helmet-async";
import { suggestUsers } from "@/api/user";
import { Link, useNavigate } from "react-router-dom";
import { toggleFollowUser } from "@/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Card = lazy(() => import("./components/Card"));

export default function Home() {
  const [followText, setFollowText] = useState("");
  const [err, setError] = useState(null);
  const navigate = useNavigate();
  const [activeBtn, setActiveBtn] = useState(0);
  const { storiesContainerRef, scrollPosition, handleScroll } = useScroll();
  const {
    posts,
    loading,
    error,
    setData,
    lastPostRef,
    stories,
    err: storiesErr,
    isLoading,
  } = usePostStore();
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

  const viewStory = (username, storyId) => {
    navigate(`/stories/${username}/${storyId}`);
  };

  return (
    <>
      <Helmet>
        <title>Your Instapics Feed</title>
        <meta name="description" content="Instapics Home" />
      </Helmet>
      <div className="max-w-[1200px] mx-auto ">
        <div className="py-4 md:py-8 md:flex justify-between w-full min-h-dvh">
          <div className="lg:w-[60%]">
            <div className="relative flex gap-4 px-4 md:px-0">
            <CreateStory />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                <button
                  onClick={() => handleScroll("left")}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  style={{ display: scrollPosition <= 0 ? "none" : "block" }}
                >
                  <ChevronLeft size={20} />
                </button>
              </div>

              <div
                ref={storiesContainerRef}
                className="mb-6 px-4 md:px-0 flex gap-4 overflow-auto scrollbar-hide"
              >
              
                {storiesErr && (
                  <p className="text-red-500 text-sm">{storiesErr}</p>
                )}
                {isLoading && (
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
                  <img
                    key={story._id}
                    src={story.media[0]}
                    alt={story?.user?.username}
                    className={`h-14 w-14 shrink-0 rounded-full border-2 ${
                      !story.viewers.includes(loggedInUser?._id) &&
                      "border-accent"
                    } cursor-pointer`}
                    loading="eager"
                    onClick={() => viewStory(story?.user?.username, story._id)}
                    decoding="async"
                  />
                ))}
              </div>

              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
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
                  <ChevronRight size={20} />
                </button>
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
                    {posts.map((post, index) => {
                      const isLastPost = posts.length === index + 1;
                      return (
                        <Card
                          key={post._id}
                          post={post}
                          setData={setData}
                          isLastPost={isLastPost}
                          lastPostRef={lastPostRef}
                        />
                      );
                    })}
                  </Suspense>
                </>
              )}
            </div>
          </div>
          <div className="hidden md:block min-w-[30%] lg:min-w-[30%]">
            <div className="flex justify-between items-center mb-8">
              <div className="flex gap-3 items-center">
                <div className="avatar placeholder">
                  <div className="w-12 rounded-full border-2">
                    {loggedInUser?.profilePicture ? (
                      <Link to={`/${loggedInUser?.username}`}>
                        <img
                          src={loggedInUser?.profilePicture}
                          alt={loggedInUser?.username}
                          loading="eager"
                          decoding="async"
                        />
                      </Link>
                    ) : (
                      <Link to={`/${loggedInUser?.username}`}>
                        <span className="text-2xl">
                          {loggedInUser?.username?.charAt(0)}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Link
                    to={`/${loggedInUser?.username}`}
                    className="text-sm font-semibold"
                  >
                    {loggedInUser?.username}
                  </Link>
                  <Link
                    to={`/${loggedInUser?.username}`}
                    className="text-sm font-semibold text-zinc-500"
                  >
                    {loggedInUser?.fullname}
                  </Link>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-sm border-accent focus:outline-none focus:text-white text-accent"
              >
                Log out
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
                <div className="flex gap-3 items-center">
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
