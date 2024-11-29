import { Dot, Ellipsis, Heart, MessageCircle } from "lucide-react";
import TimeAgo from "timeago-react";
import { useState } from "react";
import { likePost, unlikePost } from "@/api/post";
import { useAuthStore } from "@/hooks";
import { toast } from "sonner";
import { handleError } from "@/utils";
import SeeWhoLiked from "./SeeWhoLiked";
import { Link } from "react-router-dom";
import SavePost from "./SavePost";
import Comments from "./Comments";

export default function Card({ post, setData }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("next");
  const { accessToken, user, setUser } = useAuthStore();
  const { data } = user || {};

  const handlePrevImage = () => {
    setSlideDirection("prev");
    setCurrentImageIndex((prev) =>
      prev === 0 ? post.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSlideDirection("next");
    setCurrentImageIndex((prev) =>
      prev === post.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleLike = async () => {
    try {
      const res = await likePost(post._id, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message);
        setData((prev) => ({
          ...prev,
          posts: prev.posts.map((p) => {
            if (p._id === post._id) {
              return {
                ...p,
                likes: res.data.post.likes,
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

  const handleUnlike = async () => {
    try {
      const res = await unlikePost(post._id, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message);
        setData((prev) => ({
          ...prev,
          posts: prev.posts.map((p) => {
            if (p._id === post._id) {
              return {
                ...p,
                likes: res.data.post.likes,
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

  if (!post) {
    return null;
  }

  return (
    <div className="mb-6 w-full md:w-[80%] lg:w-[450px]">
      <div className="px-4 md:px-0 flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <div className="avatar">
            <div className="w-[40px] rounded-full border-2 border-accent">
              <img
                src={
                  post?.user?.profilePicture ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
              />
            </div>
          </div>
          <p className="font-bold">{post?.user?.username} </p>
          <div className="flex items-center">
            <Dot />
            <TimeAgo
              datetime={post.createdAt}
              locale="en_US"
              style={{ fontSize: "14px" }}
            />
          </div>
        </div>
        <Ellipsis />
      </div>
      <div className="mt-2 carousel w-full overflow-hidden">
        <div className="carousel-item w-full relative">
          <div
            className={`w-full h-[550px] relative transition-transform duration-300 ease-in-out  ${
              currentImageIndex === currentImageIndex
                ? slideDirection === "next"
                  ? "translate-x-0 animate-slideInRight"
                  : "translate-x-0 animate-slideInLeft"
                : slideDirection === "next"
                ? "-translate-x-full"
                : "translate-x-full"
            }`}
            style={{
              animation: "slideIn 0.3s forwards",
            }}
          >
            <img
              src={post.images[currentImageIndex]}
              className="w-full h-full object-cover"
              alt="image post"
              loading="lazy"
            />
          </div>
          {post?.images?.length > 1 && (
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
              <button
                onClick={handlePrevImage}
                className="btn btn-circle btn-sm focus:outline-none"
              >
                ❮
              </button>
              <button
                onClick={handleNextImage}
                className="btn btn-circle btn-sm focus:outline-none"
              >
                ❯
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="px-4 md:px-0 mt-2 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div
            title={
              post?.likes?.includes(data?._id)
                ? "You liked this post"
                : "Like this post"
            }
          >
            {post?.likes?.includes(data?._id) ? (
              <Heart
                role="button"
                onClick={handleUnlike}
                fill="red"
                strokeWidth={0}
              />
            ) : (
              <Heart role="button" onClick={handleLike} />
            )}
          </div>
          <MessageCircle title="Comment" />
        </div>
        <SavePost
          post={post}
          accessToken={accessToken}
          loggedInUser={data}
          setData={setData}
        />
      </div>
      <SeeWhoLiked
        post={post}
        accessToken={accessToken}
        loggedInUser={data}
        setUser={setUser}
      />
      <p className="px-4 md:px-0 mt-2 text-sm">
        <Link to={`/${post?.user?.username}`} className="font-bold">
          {post?.user?.username}
        </Link>{" "}
        {post?.description?.length > 200
          ? post?.description?.slice(0, 200) + "..." + " " + "more"
          : post?.description}
      </p>
      <Comments
        post={post}
        accessToken={accessToken}
        loggedInUser={data}
        setData={setData}
      />
    </div>
  );
}
