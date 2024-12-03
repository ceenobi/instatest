import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore, usePostStore } from "@/hooks";
import { handleLike, handleSavePost } from "@/utils/setFunction";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { useSlide } from "@/hooks";
import TimeAgo from "timeago-react";
import Comments from "./Comments";
import SeeWhoLiked from "./SeeWhoLiked";

export default function Card({ post }) {
  const { accessToken, user, setUser } = useAuthStore();
  const { setData } = usePostStore();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const {
    currentIndex,
    slideDirection,
    handlePrev,
    handleNext,
    setSlideDirection,
    setCurrentIndex,
  } = useSlide({ post });
  const { data: loggedInUser } = user || {};

  const formatTimeAgo = (timestamp) => {
    return <TimeAgo datetime={timestamp} locale="en-US" />;
  };

  useEffect(() => {
    setIsLiked(post?.likes?.includes(loggedInUser?._id));
    setIsSaved(post?.savedBy?.includes(loggedInUser?._id));
  }, [loggedInUser?._id, post]);

  const handleLikeFn = async () => {
    const updatedPost = await handleLike(post._id, accessToken, setData);
    return updatedPost;
  };

  const handleSaveFn = async () => {
    const updatedPost = await handleSavePost(post._id, accessToken, setData);
    return updatedPost;
  };

  return (
    <div className="card bg-base-100 mb-8 lg:w-[450px]">
      <div className="card-body py-2 px-4 md:px-0">
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="w-12 rounded-full border-2">
              {post?.user?.profilePicture ? (
                <img
                  src={post.user?.profilePicture}
                  alt={post.user?.username}
                />
              ) : (
                <span className="text-3xl">
                  {post.user?.username?.charAt(0)}
                </span>
              )}
            </div>
          </div>
          <div>
            <Link
              to={`/${post.user?.username}`}
              className="font-semibold hover:text-gray-500"
            >
              {post.user?.username}
            </Link>
            <p className="text-sm text-gray-500">
              {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <figure className="relative overflow-hidden">
        <div
          className={`flex transition-transform duration-300 ease-in-out transform ${
            slideDirection === "next" ? "-translate-x-full" : "translate-x-full"
          }`}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {post?.images?.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Post ${index + 1}`}
              className="w-full object-cover aspect-square shrink-0"
            />
          ))}
        </div>
        {post?.images?.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 btn btn-circle btn-sm opacity-75 hover:opacity-100"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              ❮
            </button>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-circle btn-sm opacity-75 hover:opacity-100"
              onClick={handleNext}
              disabled={currentIndex === post.images.length - 1}
            >
              ❯
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {post.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-primary" : "bg-base-300"
                  }`}
                  onClick={() => {
                    setSlideDirection(index > currentIndex ? "next" : "prev");
                    setCurrentIndex(index);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </figure>

      <div className="card-body p-1 px-4 md:px-0">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <button
              className={`btn btn-ghost btn-circle btn-sm focus:outline-none ${
                isLiked ? "text-red-500" : ""
              }`}
              onClick={handleLikeFn}
              title={
                post?.likes?.includes(loggedInUser?._id)
                  ? "You liked this post"
                  : "Like this post"
              }
            >
              <Heart className={isLiked ? "fill-current" : ""} />
            </button>
            <Link
              to={`/comments/${post._id}`}
              className="btn btn-ghost btn-circle btn-sm"
            >
              <MessageCircle />
            </Link>
          </div>
          <button
            className={`btn btn-ghost btn-circle btn-sm focus:outline-none ${
              isSaved ? "text-yellow-500" : ""
            }`}
            onClick={handleSaveFn}
            title={
              post?.savedBy?.includes(loggedInUser?._id)
                ? "You saved this post"
                : "Save this post"
            }
          >
            <Bookmark className={isSaved ? "fill-current" : ""} />
          </button>
        </div>
        <div className="space-y-1">
          <SeeWhoLiked
            post={post}
            accessToken={accessToken}
            loggedInUser={loggedInUser}
            setUser={setUser}
          />
          <div>
            <Link
              to={`/${post.user?.username}`}
              className="font-semibold hover:underline"
            >
              {post.user?.username}
            </Link>{" "}
            {post.title}
          </div>
          {post.description && (
            <p className="text-gray-600 text-sm">{post.description}</p>
          )}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="text-zinc-900">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <Comments post={post} accessToken={accessToken} />
      </div>
    </div>
  );
}
