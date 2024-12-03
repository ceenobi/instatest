import { getRandomPosts } from "@/api/post";
import { Alert, DataSpinner } from "@/components";
import { useAuthStore } from "@/hooks";
import { handleError } from "@/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { accessToken } = useAuthStore();
  const observer = useRef();
  const match = useLocation().pathname === "/explore";

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchPosts = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await getRandomPosts(page, accessToken);
      if (res.status === 200) {
        setPosts((prev) => {
          // Create a Set of existing post IDs
          const existingIds = new Set(prev.map((post) => post._id));
          // Filter out duplicates from new posts
          const uniqueNewPosts = res.data.posts.filter(
            (post) => !existingIds.has(post._id)
          );
          return [...prev, ...uniqueNewPosts];
        });
        setHasMore(res.data.pagination.hasMore);
      }
    } catch (error) {
      handleError(toast.error, error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [accessToken, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (error) {
    return (
      <div className="mt-4">
        <Alert variant="error" message={error.message} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Explore - Discover new posts</title>
        <meta
          name="description"
          content="Explore and discover new posts from users you might like"
        />
      </Helmet>

      <div className="max-w-[1200px] mx-auto py-6 px-4">
        {match ? (
          <>
            <h1 className="text-2xl font-bold mb-6">Explore</h1>

            {posts.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <p className="text-lg font-medium text-gray-600">
                  No posts found
                </p>
                <p className="text-sm text-gray-500">
                  Follow more users to see their posts here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {posts.map((post, index) => {
                  const isLastPost = posts.length === index + 1;
                  return (
                    <div
                      key={post._id}
                      ref={isLastPost ? lastPostRef : null}
                      className="relative group aspect-square overflow-hidden rounded-lg"
                    >
                      <Link to={`/comments/${post._id}`}>
                        <img
                          src={post.images[0]}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="text-white text-center">
                            <p className="font-medium mb-2">{post.title}</p>
                            <p className="text-sm">by @{post.user.username}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            {loading && (
              <div className="mt-8 flex justify-center">
                <DataSpinner />
              </div>
            )}
          </>
        ) : (
          <Outlet />
        )}
      </div>
    </>
  );
}
