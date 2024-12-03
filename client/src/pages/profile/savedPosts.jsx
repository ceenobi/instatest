import { getUserSavedPosts } from "@/api/post";
import { Alert } from "@/components";
import { useAuthStore, useFetch } from "@/hooks";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BookmarkX } from "lucide-react";

export default function SavedPosts() {
  const { profile } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAuthStore();
  const { data: loggedInUser } = user || {};

  const { error, data, loading } = useFetch(
    getUserSavedPosts,
    loggedInUser?._id,
    accessToken
  );

  const posts = data?.posts || [];
  const isAuthorized = loggedInUser?._id === data?.currentUserId;
  const isOwnProfile = loggedInUser?.username === profile;

  useEffect(() => {
    // Redirect if not authorized
    if (!loading && !isOwnProfile) {
      navigate(`/${profile}`, { replace: true });
    }
  }, [loading, isOwnProfile, profile, navigate]);

  if (error) return <Alert error={error} />;
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <span className="loading loading-spinner loading-md bg-accent"></span>
      </div>
    );
  }
  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <BookmarkX size={48} className="text-gray-400" />
        <h1 className="text-xl font-semibold text-gray-600">
          You cannot view this page
        </h1>
        <p className="text-gray-500">This content is private</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <BookmarkX size={48} className="text-gray-400" />
        <h1 className="text-xl font-semibold text-gray-600">
          No saved posts yet
        </h1>
        <p className="text-gray-500">Save posts to view them here later</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-0 mt-6">
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
    </div>
  );
}
