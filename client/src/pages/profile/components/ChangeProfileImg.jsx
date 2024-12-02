import { changeProfilePhoto } from "@/api/user";
import { ActionButton, Alert, Modal } from "@/components";
import { handleError } from "@/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ChangeProfileImg({
  accessToken,
  setUser,
  setData,
  data,
  loggedInUser,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [err, setErr] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [status, setStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    setErr(null); // Clear previous errors

    // Validate file type
    if (file && !file.type.startsWith("image/")) {
      setErr("Please upload an image file");
      return false;
    }

    // Validate file size (2MB)
    if (file && file.size > 2 * 1024 * 1024) {
      setErr("File size must be less than 2MB");
      return false;
    }

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.onerror = () => {
        setErr("Error reading file");
      };
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      setErr("Please select an image first");
      return;
    }

    setStatus("uploading");
    setUploadProgress(0);
    setErr(null);

    try {
      const res = await changeProfilePhoto(
        { photo: selectedImage },
        accessToken,
        setUploadProgress
      );

      if (res.status === 200) {
        setStatus("success");
        setUploadProgress(100);
        setUser((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            profilePicture: res.data.profilePicture,
          },
        }));
        setData((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            profilePicture: res.data.profilePicture,
          },
        }));
        reset();
        setSelectedImage(null);
        setStatus("idle");
        setIsOpen(false);
      }
    } catch (error) {
      setStatus("error");
      setUploadProgress(0);
      handleError(setErr, error);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedImage(null);
    setErr(null);
    setStatus("idle");
    setUploadProgress(0);
    reset();
  };

  return (
    <>
      <div
        className={`avatar flex justify-center ${
          loggedInUser?.username === data?.username ? "cursor-pointer" : ""
        }`}
        onClick={
          loggedInUser?.username === data?.username
            ? () => setIsOpen(true)
            : () => {}
        }
      >
        <div className="w-20 h-20 md:w-[160px] md:h-[160px] rounded-full">
          <img
            src={
              data?.profilePicture ||
              "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            }
            title="change profile photo"
            loading="lazy"
            alt={data?.username}
          />
        </div>
      </div>
      <Modal
        title="Change profile photo"
        isOpen={isOpen}
        onClose={handleClose}
        classname="max-w-2xl text-center"
      >
        {err && <Alert error={err} classname="my-4" />}
        <form className="mt-4" onSubmit={handleSubmit(handleImageUpload)}>
          <div className="form-control w-full">
            <label
              htmlFor="images"
              className="h-[300px] border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer overflow-auto p-2"
            >
              {selectedImage === null ? (
                <div className="text-center">
                  <Plus className="mx-auto mb-2" />
                  <p>
                    {data?.profilePicture ? "Change image" : "Choose image"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 w-full relative z-20">
                  <div className="relative group">
                    <img
                      src={selectedImage}
                      alt="Selected profile photo"
                      className="w-full h-[300px] object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedImage(null);
                      }}
                      className="absolute top-5 right-5 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </label>
            <input
              type="file"
              className="w-full max-w-xs h-[70%] absolute top-0 inset-y-0 opacity-0 cursor-pointer"
              accept="image/*"
              {...register("photo", { required: true })}
              onChange={handleImage}
            />
            {errors.photo && (
              <p className="text-red-600 text-sm">Provide an image to upload</p>
            )}
          </div>
          <div className="my-6 flex flex-col justify-center items-center gap-4">
            {selectedImage && (
              <ActionButton
                text={status === "uploading" ? "Uploading..." : "Upload"}
                type="submit"
                loading={isSubmitting}
                classname="w-full btn-sm btn-secondary mt-4"
              />
            )}
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
                File uploaded successfully!
              </p>
            )}

            {status === "error" && (
              <p className="text-sm text-red-600">
                Upload failed. Please try again.
              </p>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
}
