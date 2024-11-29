import { savePost, unsavePost } from "@/api/post";
import { handleError } from "@/utils";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";

export default function SavePost({ post, accessToken, setData, loggedInUser }) {
  const saveUserPost = async () => {
    try {
      const res = await savePost(post._id, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message);
        setData((prev) => ({
          ...prev,
          posts: prev.posts.map((p) => {
            if (p._id === post._id) {
              return {
                ...p,
                savedBy: res.data.post.savedBy,
              };
            }
            return p;
          }),
        }));
      }
    } catch (error) {
      handleError(toast.error, error);
    }
  };

  const removeUserPost = async () => {
    try {
      const res = await unsavePost(post._id, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message);
        setData((prev) => ({
          ...prev,
          posts: prev.posts.map((p) => {
            if (p._id === post._id) {
              return {
                ...p,
                savedBy: res.data.post.savedBy,
              };
            }
            return p;
          }),
        }));
      }
    } catch (error) {
      handleError(toast.error, error);
    }
  };

  return (
    <div title={post.savedBy.includes(loggedInUser?._id) ? "Unsave" : "Save"}>
      {post.savedBy.includes(loggedInUser?._id) ? (
        <Bookmark
          role="button"
          onClick={removeUserPost}
          fill="red"
          strokeWidth={0}
        />
      ) : (
        <Bookmark role="button" onClick={saveUserPost} />
      )}
    </div>
  );
}
