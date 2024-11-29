import { Image, ImagePlus } from "lucide-react";
import { useState } from "react";
import Modal from "./Modal";
import { useForm } from "react-hook-form";
import { handleError, inputFields } from "@/utils";
import { FormInput } from "./FormField";
import ActionButton from "./ActionButton";
import { createPost, getAllPosts } from "@/api/post";
import { useAuthStore, useFetch } from "@/hooks";
import { toast } from "sonner";
import Alert from "./Alert";
import { Helmet } from "react-helmet-async";

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
  const { setData } = useFetch(getAllPosts, accessToken);

  const handleImage = (e) => {
    const files = Array.from(e.target.files || []);
    setErr(null);

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setErr("Please upload image files only");
        return false;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErr("Each file size must be less than 2MB");
        return false;
      }
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSelectedImages((prev) => [...prev, reader.result]);
      };
      reader.onerror = () => {
        setErr("Error reading file");
      };
    });
  };

  const handleTags = (currentTags) => {
    if (currentTags.length > 0) {
      setTags([...tags, ...currentTags]);
    }
  };

  const field = ["title"];

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      tags,
      images: selectedImages,
    };
    try {
      const res = await createPost(formData, accessToken, setUploadProgress);
      if (res.status === 201) {
        setData((prev) => [res.data, ...prev]);
        setSelectedImages([]);
        setTags([]);
        reset();
        setStatus("success");
        setUploadProgress(100);
        toast.success(res.data.message);
        setIsOpen(false);
      }
    } catch (error) {
      setStatus("error");
      setUploadProgress(0);
      handleError(setErr, error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create post</title>
        <meta name="description" content="Create post" />
      </Helmet>
      <div>
        <ImagePlus
          size="28px"
          className="cursor-pointer"
          onClick={() => setIsOpen(true)}
        />
        <Modal
          title="Create post"
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          step={step}
          setStep={setStep}
          selectedImages={selectedImages}
        >
          <form className="my-10" onSubmit={handleSubmit(onSubmit)}>
            {err && <Alert error={err} classname="my-4" />}
            {step === 1 && (
              <div className="flex flex-col justify-center gap-4 items-center relative">
                <Image size="64px" />
                <p className="font-semibold">Choose image file(s)</p>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full max-w-xs h-full absolute top-0 inset-y-0 opacity-0 z-20 cursor-pointer"
                  accept="image/*"
                  multiple
                  {...register("photo", { required: true })}
                  onChange={handleImage}
                />
                {selectedImages && (
                  <div className="flex flex-wrap gap-4 items-center">
                    {selectedImages.map((item, index) => (
                      <div key={index} className="relative w-[80px]">
                        <img
                          src={item}
                          alt="Selected image posts"
                          loading="lazy"
                          className="mt-4 mx-auto w-[60px] h-[60px] object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0"
                          onClick={() => {
                            setSelectedImages((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <span className="text-red-500">X</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {step === 2 && (
              <>
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
                <fieldset>
                  <textarea
                    className="textarea textarea-bordered w-full focus:border-zinc-600 focus:outline-none"
                    placeholder="Description"
                    name="description"
                    id="description"
                    {...register("description", { required: true })}
                  ></textarea>
                  {errors.description && (
                    <p className="text-sm my-2 text-red-500">
                      Description is required
                    </p>
                  )}
                </fieldset>
                <fieldset className="my-4">
                  <input
                    type="text"
                    className="w-full border-[1.5px] p-2 text-sm focus:border-zinc-600 focus:outline-none"
                    placeholder="Tags"
                    name="tags"
                    id="tags"
                    {...register("tags")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const currentTags = e.currentTarget.value
                          .split(", ")
                          .filter((tag) => tag);
                        handleTags(currentTags);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                </fieldset>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="badge border-zinc-600 cursor-pointer"
                        onClick={() =>
                          setTags((prev) => prev.filter((_, i) => i !== index))
                        }
                      >
                        {tag}{" "}
                        <span className="cursor-pointer font-bold ml-2">x</span>
                      </div>
                    ))}
                  </div>
                )}
                <ActionButton
                  text="Create post"
                  type="submit"
                  loading={isSubmitting}
                  classname="w-full btn-sm btn-secondary mt-4"
                />
                {status === "uploading" && (
                  <div className="space-y-2">
                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2.5 rounded-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {uploadProgress}% uploaded
                    </p>
                    <progress
                      className="progress w-56"
                      value={uploadProgress}
                      max="100%"
                    ></progress>
                  </div>
                )}
                {status === "success" && (
                  <p className="text-sm text-green-600">
                    Files uploaded successfully!
                  </p>
                )}

                {status === "error" && (
                  <p className="text-sm text-red-600">
                    Upload failed. Please try again.
                  </p>
                )}
              </>
            )}
          </form>
        </Modal>
      </div>
    </>
  );
}
