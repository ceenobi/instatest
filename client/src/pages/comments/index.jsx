import { addPostComment, getPostComments } from "@/api/comment";
import { Alert, DataSpinner } from "@/components";
import { useAuthStore, useFetch, usePostStore, useSlide } from "@/hooks";
import {
  handleCommentLike,
  handleDeleteComment,
  handleError,
  handleLike,
  handleSavePost,
} from "@/utils";
import { Bookmark, CirclePlus, Ellipsis, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import TimeAgo from "timeago-react";
import { Helmet } from "react-helmet-async";

export default function Comments() {
  const [page, setPage] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isCommentLiked, setIsCommentLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, sethasMore] = useState(false);
  const [commentsArray, setCommentsArray] = useState([]);
  const { postId } = useParams();
  const { accessToken, user } = useAuthStore();
  const { setData: setPostData, posts } = usePostStore();
  const loggedInUser = user?.data;
  const {
    error,
    data: postComments,
    loading,
    setLoading,
    setData,
  } = useFetch(getPostComments, postId, accessToken, page);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const { post, comments, pagination } = postComments || {};
  const {
    currentIndex,
    slideDirection,
    handlePrev,
    handleNext,
    setSlideDirection,
    setCurrentIndex,
  } = useSlide({ post });

  const handleMoreCommments = () => {
    sethasMore(true);
    setPage((prev) => prev + 1);
  };

  //prevent loading state after first render
  useEffect(() => {
    if (page !== 1) {
      setLoading(false);
    }
  }, [hasMore, page, setLoading]);

  useEffect(() => {
    if (comments) {
      setCommentsArray((prev) => {
        // Filter out any duplicates from new comments
        const newComments = comments.filter(
          (newComment) =>
            !prev.some(
              (existingComment) => existingComment._id === newComment._id
            )
        );
        return [...prev, ...newComments];
      });
      sethasMore(false);
    }
  }, [comments]);

  const addComment = async (data) => {
    try {
      const res = await addPostComment(postId, data, accessToken);
      if (res.status === 201) {
        // Update the comments array with the new comment
        setCommentsArray((prev) => [res.data.data, ...prev]);
        // Update the post data
        setData((prevData) => ({
          ...prevData,
          comments: [res.data.data, ...(prevData?.comments || [])],
        }));
        toast.success(res.data.message);
        reset({ comment: "" });
      }
    } catch (error) {
      handleError(setErr, error);
    }
  };

  useEffect(() => {
    const getPost = posts.filter((p) => p._id === postId);
    setIsLiked(getPost[0]?.likes?.includes(loggedInUser?._id));
    setIsSaved(getPost[0]?.savedBy?.includes(loggedInUser?._id));
    setIsCommentLiked(
      commentsArray?.some((c) => c?.likes?.includes(loggedInUser?._id))
    );
  }, [commentsArray, loggedInUser?._id, postId, posts]);

  const handleLikeFn = async () => {
    const updatedLike = await handleLike(
      postId,
      accessToken,
      setPostData,
      setData
    );
    return updatedLike;
  };

  const handleSaveFn = async () => {
    const updatedSavedPost = await handleSavePost(
      postId,
      accessToken,
      setPostData
    );
    return updatedSavedPost;
  };

  const handleLikeCommentFn = async (commentId) => {
    const updatedLikeComments = await handleCommentLike(
      commentId,
      accessToken,
      setData,
      postId,
      page,
      setCommentsArray
    );
    return updatedLikeComments;
  };

  const deleteCommentFn = async (commentId) => {
    setIsLoading(true);
    const updatedComments = await handleDeleteComment(
      commentId,
      accessToken,
      postId,
      setData,
      page,
      setCommentsArray
    );
    setIsLoading(false);
    return updatedComments;
  };

  if (error) return <Alert error={error} />;
  if (loading) return <DataSpinner />;

  return (
    <>
      <Helmet>
        <title>{`${post?.user?.username} post - ${post?.title}`}</title>
        <meta name="description" content="Instapics post" />
      </Helmet>
      <div className="max-w-[1200px] mx-auto">
        <div className="my-4 bg-base-100 rounded-lg">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-0">
            <div className="lg:px-4 lg:w-[60%] h-full carousel overflow-hidden">
              <figure className="relative overflow-hidden">
                <div
                  className={`flex transition-transform duration-300 ease-in-out transform ${
                    slideDirection === "next"
                      ? "-translate-x-full"
                      : "translate-x-full"
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
                            index === currentIndex
                              ? "bg-primary"
                              : "bg-base-300"
                          }`}
                          onClick={() => {
                            setSlideDirection(
                              index > currentIndex ? "next" : "prev"
                            );
                            setCurrentIndex(index);
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </figure>
            </div>
            <div className="lg:w-[40%] px-4 relative">
              <div className="flex w-full">
                <div>
                  <Link to={`/${post?.user?.username}`}>
                    <img
                      src={post?.user?.profilePicture}
                      alt={post?.user?.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Link>
                </div>
                <div className="flex-1 ml-4">
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
              <div className="h-[600px] lg:h-[calc(80dvh-2rem)] overflow-y-auto">
                {commentsArray?.length === 0 && (
                  <p className="text-center text-xl font-bold">
                    No comments yet
                  </p>
                )}
                {commentsArray?.map((comment) => (
                  <div key={comment?._id} className="mb-4">
                    <div className="flex w-full gap-4">
                      <div className="avatar placeholder">
                        <div className="w-12 h-12 rounded-full border-2">
                          <Link to={`/${comment?.user?.username}`}>
                            {comment?.user?.profilePicture ? (
                              <img
                                src={comment?.user?.profilePicture}
                                alt={comment?.user?.username}
                              />
                            ) : (
                              <span className="text-3xl">
                                {comment.user?.username?.charAt(0)}
                              </span>
                            )}
                          </Link>
                        </div>
                      </div>
                      <div className="flex-1">
                        <Link
                          to={`/${comment?.user?.username}`}
                          className="font-semibold text-sm"
                        >
                          {comment?.user?.username}
                        </Link>
                        <div>
                          <p className="text-sm flex-1 text-pretty">
                            {comment?.comment}
                          </p>
                          <TimeAgo
                            datetime={comment?.createdAt}
                            locale="en_US"
                            style={{ fontSize: "14px" }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col justify-center">
                        {comment?.user?._id === loggedInUser?._id && (
                          <div className="dropdown dropdown-bottom dropdown-end">
                            <div
                              tabIndex={0}
                              role="button"
                              className="btn btn-xs btn-ghost"
                            >
                              {" "}
                              <Ellipsis />
                            </div>
                            <ul
                              tabIndex={0}
                              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow"
                            >
                              <li>
                                <a
                                  onClick={() => deleteCommentFn(comment?._id)}
                                >
                                  {isLoading ? "Deleting..." : "Delete"}
                                </a>
                              </li>
                            </ul>
                          </div>
                        )}
                        <div className="mx-auto">
                          <button
                            className={`btn btn-ghost btn-circle btn-sm focus:outline-none ${
                              isCommentLiked ? "text-red-500" : ""
                            }`}
                            title={
                              comment?.likes?.includes(loggedInUser?._id)
                                ? "Liked"
                                : "Like"
                            }
                            onClick={() => handleLikeCommentFn(comment?._id)}
                          >
                            <Heart
                              className={
                                comment?.likes?.includes(loggedInUser?._id)
                                  ? "fill-current"
                                  : ""
                              }
                              size="16px"
                            />
                          </button>
                        </div>
                        <p className="text-sm text-center">
                          {comment?.likes?.length}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="w-full text-center">
                  {pagination?.pages > page && (
                    <button
                      className="btn btn-ghost btn-accent focus:outline-none hover:bg-transparent"
                      title="Load more comments"
                      onClick={handleMoreCommments}
                      disabled={hasMore}
                    >
                      {hasMore ? (
                        <span className="loading loading-spinner loading-md bg-accent"></span>
                      ) : (
                        <CirclePlus />
                      )}
                    </button>
                  )}
                  {pagination?.pages === page && (
                    <p className="text-sm">No more comments to load</p>
                  )}
                </div>
              </div>
              <div className="bg-white absolute bottom-0 w-full inset-x-0 px-4 py-3">
                <div className="flex">
                  <div className="flex gap-3">
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
                </div>
                <p className="font-semibold mt-2">
                  {post?.likes?.length} likes
                </p>
                <TimeAgo
                  datetime={post?.createdAt}
                  locale="en_US"
                  style={{ fontSize: "14px" }}
                />
                {err && <Alert error={err} classname="my-4" />}
                <div className="relative">
                  <form onSubmit={handleSubmit(addComment)}>
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
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Posting..." : "Post"}
                    </button>
                  </form>
                  {errors.comment && (
                    <p className="text-xs text-red-500">Comment is required</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
