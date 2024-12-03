import { getUserPosts } from "@/api/post";
import { Alert } from "@/components";
import { useFetch } from "@/hooks";
import { BookmarkX } from "lucide-react";
import { Link } from "react-router-dom";

export default function Posts({ accessToken, profileId }) {
  const { error, data, loading } = useFetch(
    getUserPosts,
    profileId,
    accessToken
  );
  const posts = data?.posts || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <span className="loading loading-spinner loading-md bg-accent"></span>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <BookmarkX size={48} className="text-gray-400" />
        <h1 className="text-xl font-semibold text-gray-600">No posts yet</h1>
        <p className="text-gray-500">Create posts to view them here</p>
      </div>
    );
  }

  if (error && !profileId) return <Alert error={error} />;

  return (
    <>
      {/* {error && !profileId && <Alert error={error} />} */}
      {/* {loading && (
        <div className="flex justify-center items-center h-[300px]">
          <span className="loading loading-spinner loading-md bg-accent"></span>
        </div>
      )} */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={post._id}
            to={`/comments/${post._id}`}
            className="aspect-square group relative overflow-hidden"
          >
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <p className="text-white font-medium">{post.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
