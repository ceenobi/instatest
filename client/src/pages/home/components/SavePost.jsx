import { saveUserPost, unsaveUserPost } from "@/utils";
import { Bookmark } from "lucide-react";

export default function SavePost({ post, accessToken, setData, loggedInUser }) {
  return (
    <div title={post?.savedBy?.includes(loggedInUser?._id) ? "Unsave" : "Save"}>
      {post?.savedBy?.includes(loggedInUser?._id) ? (
        <Bookmark
          role="button"
          onClick={() => unsaveUserPost(post._id, accessToken, setData)}
          fill="black"
          strokeWidth={0}
        />
      ) : (
        <Bookmark
          role="button"
          onClick={() => saveUserPost(post._id, accessToken, setData)}
        />
      )}
    </div>
  );
}
