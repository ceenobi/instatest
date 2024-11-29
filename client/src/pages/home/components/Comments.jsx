import { addPostComment } from "@/api/comment";
import { handleError } from "@/utils";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Comments({ post, accessToken }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
      }
    } catch (error) {
      handleError(toast.error, error);
    }
  };

  return (
    <>
      <div className="my-2 px-4 md:px-0">
        <p className="text-sm" role="button" onClick={handleOpen}>
          View all comments
        </p>
      </div>
      <div className="px-4 md:px-0 w-full relative">
        <textarea
          className="textarea textarea-xs rounded-none focus:outline-none border-0 border-b-[1px] border-gray-200 w-full"
          placeholder="Add a comment..."
          name="comment"
          id="comment"
          {...register("comment", { required: true })}
        ></textarea>
        <button
          className="text-sm font-bold transition-opacity outline-none focus:outline-none absolute top-0 right-[15px] md:right-0 text-accent z-20"
          onClick={handleSubmit(addComment)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
        {errors.comment && (
          <p className="text-xs text-red-500">Comment is required</p>
        )}
      </div>
    </>
  );
}
