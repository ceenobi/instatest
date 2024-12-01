import { PostStore } from ".";
import { getAllPosts } from "@/api/post";
import { useAuthStore, useFetch } from "@/hooks";

export const PostProvider = ({ children }) => {
  const { accessToken } = useAuthStore();
  const { error, data, loading, setData } = useFetch(getAllPosts, accessToken);
  const posts = data?.posts || [];

  const value = { data, posts, error, loading, setData };
  return <PostStore.Provider value={value}>{children}</PostStore.Provider>;
};
