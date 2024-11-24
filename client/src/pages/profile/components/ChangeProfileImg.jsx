import { changeProfilePhoto } from "@/api/user";
import { Alert, Modal } from "@/components";
import { handleError } from "@/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ChangeProfileImg({
  accessToken,
  setUser,
  setData,
  data,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [err, setErr] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [status, setStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
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
          profilePicture: res.data.profilePicture,
        }));
        setSelectedImage(null);
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
      <div
        className="avatar flex justify-center cursor-pointer"
        onClick={() => setIsOpen(true)}
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
        onClose={() => setIsOpen(false)}
      >
        <div className="my-6 flex flex-col justify-center items-center gap-4">
          <form>
            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-xs h-[40px]"
              accept="image/*"
              {...register("photo", { required: true })}
              onChange={handleImage}
            />
            {errors.photo && (
              <p className="text-red-600 text-sm">Provide an image to upload</p>
            )}
            {err && <Alert error={err} classname="my-4" />}
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Selected profile photo"
                loading="lazy"
                className="mt-4 mx-auto w-[150px] h-[150px] object-cover"
              />
            )}
          </form>
          {selectedImage && (
            <button
              className="btn btn-accent w-[50%] text-white"
              onClick={handleSubmit(handleImageUpload)}
            >
              {status === "uploading" ? "Uploading..." : "Upload"}
            </button>
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
      </Modal>
    </>
  );
}
