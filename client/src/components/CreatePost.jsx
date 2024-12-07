import { useState } from "react";
import { Plus } from "lucide-react";
import Modal from "./Modal";
import { useForm } from "react-hook-form";
import { handleError, inputFields } from "@/utils";
import { FormInput } from "./FormField";
import { createPost } from "@/api/post";
import { useAuthStore, usePostStore } from "@/hooks";
import { toast } from "sonner";
import Alert from "./Alert";
import { Helmet } from "react-helmet-async";
import ActionButton from "./ActionButton";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedImages, setSelectedImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [err, setErr] = useState(null);
  const [status, setStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const { accessToken } = useAuthStore();
  const { setPosts } = usePostStore();
  const navigate = useNavigate();

  const handleImage = (e) => {
    const files = Array.from(e.target.files || []);
    setErr(null);

    if (files.length > 10) {
      setErr("You can only upload up to 10 images");
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setErr("Please upload only image files");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErr("Image size should be less than 5MB");
        return false;
      }
      return true;
    });
    // Clear previous images before adding new ones
    setSelectedImages([]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        //console.log("File read complete:", file.name);
        setSelectedImages((prev) => {
          const newState = [...prev, { file, preview: reader.result }];
          return newState;
        });
      };
      reader.onerror = () => {
        console.error("Error reading file:", file.name);
        setErr("Error reading file");
      };
      reader.readAsDataURL(file);
    });
  };

  const handleTags = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = e.target.value.trim();
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
        e.target.value = "";
      }
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const field = ["title"];

  const onSubmit = async (data) => {
    if (selectedImages.length === 0) {
      setErr("Please select at least one image");
      return;
    }
    try {
      setStatus("loading");
      const formData = {
        ...data,
        tags,
        images: selectedImages.map(({ preview }) => preview),
      };

      const res = await createPost(formData, accessToken, setUploadProgress);
      if (res.status === 201) {
        // Update the posts data in the store with new post at the beginning
        setPosts((prevPosts) => [res.data.post, ...prevPosts]);
        setSelectedImages([]);
        setTags([]);
        reset();
        setStatus("success");
        setUploadProgress(100);
        toast.success(res.data.message);
        setIsOpen(false);
        navigate("/");
      }
    } catch (error) {
      setStatus("error");
      setUploadProgress(0);
      handleError(setErr, error);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep(1);
    setSelectedImages([]);
    setTags([]);
    setErr(null);
    setStatus("idle");
    setUploadProgress(0);
    reset();
  };

  const getProgressColor = () => {
    switch (status) {
      case "loading":
        return "progress-accent";
      case "success":
        return "progress-success";
      case "error":
        return "progress-error";
      default:
        return "progress-accent";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "loading":
        return `Uploading... ${uploadProgress}%`;
      case "success":
        return "Upload complete!";
      case "error":
        return "Upload failed";
      default:
        return "";
    }
  };

  return (
    <>
      <Helmet>
        <title>Create New Post - Instapics</title>
        <meta name="description" content="Create a new post on Instapics" />
      </Helmet>
      <button
        className="btn btn-circle btn-accent text-white focus:outline-none"
        onClick={() => setIsOpen(true)}
      >
        <Plus />
      </button>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={step === 1 ? "Create new post" : "Add post details"}
        id="create-postModal"
        step={step}
        setStep={setStep}
        classname="max-w-2xl"
        selectedImages={selectedImages}
      >
        {err && <Alert error={err} classname="my-4" />}
        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <>
              <div className="form-control w-full">
                <label
                  htmlFor="images"
                  className="h-[300px] border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer overflow-auto p-2"
                >
                  {selectedImages.length === 0 ? (
                    <div className="text-center">
                      <Plus className="mx-auto mb-2" />
                      <p>Upload photos</p>
                      <p className="text-xs text-gray-500">
                        Upload up to 10 photos
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 w-full relative z-20">
                      {selectedImages.map(({ preview }, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`preview-${index}`}
                            className="w-full h-[150px] object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedImages((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                            }}
                            className="absolute top-1 right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  name="images"
                  id="images"
                  accept="image/*"
                  multiple
                  className="w-full max-w-xs h-full absolute top-0 inset-y-0 opacity-0  cursor-pointer"
                  onChange={handleImage}
                />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="mt-4 space-y-4 text-start">
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
                <div className="form-control">
                  {/* <label className="label">
                    <span className="label-text">Description</span>
                  </label> */}
                  <textarea
                    className="textarea textarea-bordered rounded-none"
                    placeholder="Description"
                    {...register("description", inputFields.description)}
                    rows="4"
                  ></textarea>
                  {errors.description && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.description.message}
                      </span>
                    </label>
                  )}
                </div>
                <div className="form-control">
                  {/* <label className="label">
                    <span className="label-text">Tags</span>
                  </label> */}
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="badge badge-neutral gap-2"
                        onClick={() => removeTag(index)}
                      >
                        {tag}
                        <button type="button">&times;</button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    className="input input-bordered mt-2 rounded-none"
                    placeholder="Add tags (press Enter or comma to add)"
                    onKeyDown={handleTags}
                  />
                </div>
                <ActionButton
                  text="Share"
                  type="submit"
                  loading={isSubmitting}
                  classname="w-full btn-sm btn-secondary mt-4"
                />
              </div>
              {status !== "idle" && (
                <div className="mt-4 space-y-2">
                  <div className="w-full flex items-center gap-2">
                    <progress
                      className={`progress w-full ${getProgressColor()}`}
                      value={uploadProgress}
                      max="100"
                    />
                    <span className="text-sm whitespace-nowrap">
                      {uploadProgress}%
                    </span>
                  </div>
                  <p
                    className={`text-sm ${
                      status === "error" ? "text-error" : "text-accent"
                    }`}
                  >
                    {getStatusText()}
                  </p>
                </div>
              )}
            </>
          )}
        </form>
      </Modal>
    </>
  );
}
