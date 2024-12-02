import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuthStore } from "@/hooks";
import { handleError, inputFields } from "@/utils";
import { toast } from "sonner";
import { ActionButton, Alert, FormInput } from ".";
import { updatePost } from "@/api/post";

export default function EditPost({ post, setPostData, modalId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      description: post?.description || "",
      tags: post?.tags?.join(", ") || "",
    },
  });

  const field = ["title"];

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Format tags
      const formattedTags = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      const formData = {
        ...data,
        tags: formattedTags,
      };

      const res = await updatePost(post._id, formData, accessToken);
      if (res.status === 200) {
        setPostData((prev) => ({
          ...prev,
          posts: prev.posts.map((p) =>
            p._id === post._id ? { ...p, ...res.data.post } : p
          ),
        }));
        toast.success(res.data.message);
        document.getElementById(modalId).close();
        reset();
      }
    } catch (error) {
      handleError(setError, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Edit post</h3>
        {error && <Alert error={error} classname="my-4" />}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            {inputFields
              .filter((item) => field.includes(item.name))
              .map(({ type, id, name, placeholder, validate }) => (
                <FormInput
                  type={type}
                  id={id}
                  name={name}
                  register={register}
                  placeholder={placeholder}
                  key={id}
                  errors={errors}
                  validate={validate}
                />
              ))}
          </div>

          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24 rounded-none"
              {...register("description")}
            />
          </div>

          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text">Tags (comma separated)</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full rounded-none"
              {...register("tags")}
              placeholder="nature, photography, travel"
            />
          </div>

          <div className="modal-action">
            <ActionButton
              type="submit"
              text={isLoading ? "Saving..." : "Save changes"}
              loading={isLoading}
              classname="btn-secondary"
            />
            <button
              type="button"
              className="btn rounded-none"
              onClick={() => document.getElementById(modalId).close()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
