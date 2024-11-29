import { addPostComment, getPostComments } from "@/api/comment";
import { Alert, DataSpinner } from "@/components";
import { useAuthStore, useFetch, useSlide } from "@/hooks";
import {
  handleError,
  handleLikePostPage,
  handleUnlikePostPage,
  savePostPage,
  unsavePostPage,
} from "@/utils";
import { Bookmark, Heart } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import TimeAgo from "timeago-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Helmet } from "react-helmet-async";

export default function Comments() {
  const [page, setPage] = useState(1);
  const [err, setErr] = useState(null);
  const { postId } = useParams();
  const { accessToken, user } = useAuthStore();
  const loggedInUser = user?.data;
  const { error, data, loading, setData } = useFetch(
    getPostComments,
    postId,
    accessToken,
    page
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const { post, comments } = data || {};
  const {
    currentImageIndex,
    slideDirection,
    handlePrevImage,
    handleNextImage,
  } = useSlide({ post });

  const addComment = async (data) => {
    try {
      const res = await addPostComment(postId, data, accessToken);
      if (res.status === 201) {
        // Refetch comments
        const updatedData = await getPostComments(postId, accessToken, page);
        setData(updatedData.data);
        toast.success(res.data.message);
        reset();
      }
    } catch (error) {
      handleError(setErr, error);
    }
  };

  if (error) return <Alert message={error} />;
  if (loading) return <DataSpinner />;

  return (
    <>
      <Helmet>
        <title>Instapics post - {`${post?.title}`}</title>
        <meta name="description" content="Instapics post" />
      </Helmet>
      <div className="max-w-[1200px] mx-auto">
        <div className="my-4 bg-base-100 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4 md:gap-0">
            <div className="md:px-4 md:w-[60%] h-full carousel overflow-hidden">
              {post?.images?.map((image, index) => (
                <div
                  className={`carousel-item w-full h-[600px] relative transform transition-transform duration-300 ${
                    index === currentImageIndex ? "block" : "hidden"
                  } ${
                    index === currentImageIndex
                      ? slideDirection === "next"
                        ? "translate-x-0 animate-slideInRight"
                        : "translate-x-0 animate-slideInLeft"
                      : slideDirection === "next"
                      ? "-translate-x-full"
                      : "translate-x-full"
                  }`}
                  key={index}
                >
                  <LazyLoadImage
                    src={image}
                    alt={`post-${index + 1}`}
                    className="object-cover"
                    effect="blur"
                  />
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
              ))}
            </div>
            <div className="md:w-[40%] px-4 relative">
              <div className="flex gap-4 w-full">
                <div>
                  <Link to={`/${post?.user?.username}`}>
                    <img
                      src={post?.user?.profilePicture}
                      alt={post?.user?.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Link>
                </div>
                <div>
                  <Link
                    to={`/${post?.user?.username}`}
                    className="font-semibold text-sm"
                  >
                    {post?.user?.username}
                  </Link>
                  <p className="text-sm flex-1 text-gray-600 font-semibold">
                    {post?.description}
                  </p>
                </div>
              </div>
              <div className="divider"></div>
              {/* Comments section */}
              <div className="h-[calc(80dvh-2rem)] overflow-y-auto">
                {comments?.length === 0 && (
                  <div className="text-center text-xl font-bold">
                    No comments yet
                  </div>
                )}
                {comments?.map((comment) => (
                  <div key={comment?._id} className="mb-4">
                    <div className="flex gap-4">
                      <Link to={`/${comment?.user?.username}`}>
                        <img
                          src={comment?.user?.profilePicture}
                          alt={comment?.user?.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </Link>
                      <div className="w-full">
                        <div className="flex flex-wrap gap-2 w-full">
                          <Link
                            to={`/${comment?.user?.username}`}
                            className="font-semibold text-sm"
                          >
                            {comment?.user?.username}
                          </Link>
                          <p className="text-sm flex-1">{comment?.comment}</p>
                          <Heart size="16px" role="button" />
                        </div>
                        <TimeAgo
                          datetime={comment?.createdAt}
                          locale="en_US"
                          style={{ fontSize: "14px" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="absolute bottom-0 w-full inset-x-0 px-4">
                  <div className="flex">
                    <div className="flex gap-3">
                      <div
                        title={
                          post?.likes?.includes(loggedInUser?._id)
                            ? "You liked this post"
                            : "Like this post"
                        }
                      >
                        {post?.likes?.includes(loggedInUser?._id) ? (
                          <Heart
                            role="button"
                            fill="red"
                            strokeWidth={0}
                            onClick={() =>
                              handleUnlikePostPage(
                                post._id,
                                accessToken,
                                setData,
                                post
                              )
                            }
                          />
                        ) : (
                          <Heart
                            role="button"
                            onClick={() =>
                              handleLikePostPage(
                                post._id,
                                accessToken,
                                setData,
                                post
                              )
                            }
                          />
                        )}
                      </div>
                      <div
                        title={
                          post?.savedBy?.includes(loggedInUser?._id)
                            ? "Unsave"
                            : "Save"
                        }
                      >
                        {post?.savedBy?.includes(loggedInUser?._id) ? (
                          <Bookmark
                            role="button"
                            onClick={() =>
                              unsavePostPage(
                                post._id,
                                accessToken,
                                page,
                                setData
                              )
                            }
                            fill="black"
                            strokeWidth={0}
                          />
                        ) : (
                          <Bookmark
                            role="button"
                            onClick={() =>
                              savePostPage(post._id, accessToken, page, setData)
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {err && <Alert error={err} classname="my-4" />}
                  <div className="relative">
                    <textarea
                      className="textarea textarea-sm rounded-none focus:outline-none border-0 border-b-[1px] border-gray-200 w-full"
                      placeholder="Add a comment..."
                      name="comment"
                      id="comment"
                      {...register("comment", { required: true })}
                      rows="1"
                    ></textarea>
                    <button
                      className="text-sm font-bold transition-opacity outline-none focus:outline-none absolute inset-y-0 right-[15px] md:right-0 text-accent z-20"
                      onClick={handleSubmit(addComment)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Posting..." : "Post"}
                    </button>
                    {errors.comment && (
                      <p className="text-xs text-red-500">
                        Comment is required
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
