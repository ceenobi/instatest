import { getUserPosts } from "@/api/post";
import { Alert } from "@/components";
import { useFetch } from "@/hooks";
import { Link } from "react-router-dom";

export default function Posts({ accessToken, profileId }) {
  const { error, data, loading } = useFetch(
    getUserPosts,
    profileId,
    accessToken
  );
  const posts = data?.posts || [];

  return (
    <>
      {error && !profileId && <Alert error={error} />}
      {loading && (
        <div className="flex justify-center items-center h-[300px]">
          <span className="loading loading-spinner loading-md bg-accent"></span>
        </div>
      )}
      {!loading && posts.length === 0 && (
        <div className="flex justify-center items-center h-[300px]">
          <h1 className="text-2xl font-bold">No posts found</h1>
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
  );
}
