import { getFollowingStories } from "@/api/story";
import { PostStore } from ".";
import { getAllPosts } from "@/api/post";
import { useAuthStore, useFetch, useInfiniteScroll } from "@/hooks";
import { handleError } from "@/utils";
import { useCallback, useEffect, useState } from "react";

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { lastPostRef } = useInfiniteScroll(loading, hasMore, setPage);
  const { accessToken } = useAuthStore();
  const {
    error: err,
    loading: isLoading,
    data: storyData,
    setData: setStoryData,
  } = useFetch(getFollowingStories, accessToken);

  const fetchPosts = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    const controller = new AbortController();

    try {
      const res = await getAllPosts(page, accessToken, {
        signal: controller.signal,
      });

      if (!controller.signal.aborted) {
        setPosts((prevPosts) =>
          page === 1 ? res.data.posts : [...prevPosts, ...res.data.posts]
        );
        setHasMore(res.data.pagination.hasMore);
      }
    } catch (error) {
      if (!controller.signal.aborted && error.name !== "AbortError") {
        handleError(setError, error);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }

    return controller;
  }, [accessToken, page]);

  useEffect(() => {
    let controller;

    const loadPosts = async () => {
      controller = await fetchPosts();
    };

    loadPosts();

    return () => {
      controller?.abort();
    };
  }, [fetchPosts]);

  const setData = useCallback((newData) => {
    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.map((post) =>
        post._id === newData._id ? newData : post
      );
      return updatedPosts;
    });
  }, []);

  const stories = storyData?.stories || [];

  const value = {
    posts,
    error,
    loading,
    setData,
    lastPostRef,
    stories,
    err,
    isLoading,
    setPosts,
    setStoryData
  };

  return <PostStore.Provider value={value}>{children}</PostStore.Provider>;
};
