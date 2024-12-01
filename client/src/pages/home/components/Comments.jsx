import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { addPostComment, getPostComments } from "@/api/comment";
import { handleError } from "@/utils";
import { toast } from "sonner";
import { useFetch } from "@/hooks";

export default function Comments({ post, accessToken }) {
  const {
    error,
    data: postComments,
    setData,
  } = useFetch(getPostComments, post._id, accessToken);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/comments/${post._id}`);
  };

  const addComment = async (data) => {
    try {
      const res = await addPostComment(post._id, data, accessToken);
      if (res.status === 201) {
        toast.success(res.data.message);
        setData((prev) => ({
          ...prev,
          comments: [res.data.data, ...(prev?.comments || [])],
        }));
        reset({ comment: "" });
      }
    } catch (error) {
      handleError(toast.error, error);
    }
  };

  return (
    <>
      {error && (
        <p className="text-xs text-red-500">failed to fetch comments</p>
      )}
      <p
        className="block text-gray-500 hover:underline"
        role="button"
        onClick={handleOpen}
      >
        View all {postComments?.comments?.length || 0} comments
      </p>
      <div className="w-full relative">
        <form onSubmit={handleSubmit(addComment)}>
          <textarea
            className="textarea rounded-none focus:outline-none border-0 border-b-[1px] border-gray-200 w-full resize-none"
            placeholder="Add a comment..."
            name="comment"
            id="comment"
            {...register("comment", { required: true })}
            rows="1"
          ></textarea>
          <button
            type="submit"
            className="text-sm font-bold transition-opacity outline-none focus:outline-none absolute inset-y-0 right-[15px] md:right-0 text-accent z-20"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </form>
        {errors.comment && (
          <p className="text-xs text-red-500">Comment is required</p>
        )}
      </div>
    </>
  );
}
