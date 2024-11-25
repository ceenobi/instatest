import { Bookmark, Dot, Ellipsis, Heart, MessageCircle } from "lucide-react";
import TimeAgo from "timeago-react";
import { useState } from "react";

export default function Card({ post }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("next");

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
        {post?.images?.length > 0 && (
          <div className="carousel-item w-full relative">
            <div
              className="w-full h-[550px] relative transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(${
                  slideDirection === "next" ? "-100%" : "100%"
                })`,
                opacity: 0,
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
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
              <button
                onClick={handlePrevImage}
                className="btn btn-circle btn-sm"
              >
                ❮
              </button>
              <button
                onClick={handleNextImage}
                className="btn btn-circle btn-sm"
              >
                ❯
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="px-4 md:px-0 mt-2 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Heart />
          <MessageCircle />
        </div>
        <Bookmark />
      </div>
      <p className="px-4 md:px-0 mt-2">{post?.likes?.length} likes</p>
      <p className="px-4 md:px-0 mt-2 text-sm">
        <span className="font-bold">{post?.user?.username}</span>{" "}
        {post?.description}
      </p>
      <style type="text/css">{`
        @keyframes slideIn {
          from {
            transform: translateX(${
              slideDirection === "next" ? "100%" : "-100%"
            });
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
