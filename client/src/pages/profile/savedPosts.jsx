import { getUserSavedPosts } from "@/api/post";
import { Alert } from "@/components";
import { useAuthStore, useFetch } from "@/hooks";
import { Link } from "react-router-dom";

export default function SavedPosts() {
  const { accessToken, user } = useAuthStore();
  const { data: loggedInUser } = user || {};
  const { error, data, loading } = useFetch(
    getUserSavedPosts,
    loggedInUser?._id,
    accessToken
  );
  const posts = data?.posts || [];

  return (
    <>
      {loggedInUser?.isPublic === true ||
      loggedInUser?._id === data?.currentUserId ? (
        <>
          {error && <Alert error={error} />}
          {loading && (
            <div className="flex justify-center items-center h-[300px]">
              <span className="loading loading-spinner loading-md bg-accent"></span>
            </div>
          )}
          {!loading && posts.length === 0 && (
            <div className="flex justify-center items-center h-[300px]">
              <h1 className="text-2xl font-bold">No saved posts found</h1>
            </div>
          )}
          <div className="px-4 md:px-0 mt-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div key={post._id}>
                <Link to={`/comments/${post._id}`}>
                  <img
                    src={post.images[0]}
                    alt={post.title}
                    className="w-full h-[250px]md:h-[300px] object-cover aspect-square"
                  />
                </Link>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-[200px] px-4 md:px-0">
          <h1>You cannot see this page</h1>
        </div>
      )}
    </>
  );
}
