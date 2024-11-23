import { changeProfilePhoto, getUser } from "@/api/user";
import { Alert, DataSpinner, Modal } from "@/components";
import { useAuthStore, useFetch } from "@/hooks";
import { handleError } from "@/utils";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

export default function Profile() {
  const [err, setErr] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [status, setStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const { profile } = useParams();
  const { error, loading, data, setData } = useFetch(getUser, profile);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { accessToken, setUser } = useAuthStore();

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
        <title>Your Instapics profile - {profile} </title>
        <meta name="description" content="Get access to Instashot" />
      </Helmet>
      <div className="py-12 md:py-8">
        {error && <Alert error={error} classname="my-4" />}
        {loading ? (
          <DataSpinner />
        ) : (
          <>
            <div className="grid md:grid-cols-12 gap-4 md:gap-8 max-w-[968px] mx-auto">
              <div className="md:col-span-4">
                <div className="flex gap-6">
                  <div
                    className="avatar flex justify-center cursor-pointer"
                    onClick={() =>
                      document.getElementById("my_modal_1").showModal()
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
                  <div className="md:hidden">
                    <h1 className="text-xl font-bold">{profile}</h1>
                    <div className="mt-2 flex items-center gap-4">
                      <button className="btn btn-accent btn-sm text-white">
                        Edit profile
                      </button>
                      <button className="btn btn-neutral btn-sm">
                        Edit profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-7">
                <div className="hidden md:flex items-center gap-4">
                  <h1 className="text-xl font-bold flex-1">{profile}</h1>
                  <div className="flex items-center gap-4">
                    <button className="btn btn-accent btn-sm text-white">
                      Edit profile
                    </button>
                    <button className="btn btn-neutral btn-sm">
                      Edit profile
                    </button>
                  </div>
                </div>
                <div className="hidden mt-6 md:flex items-center gap-4">
                  <h1 className="text-lg flex-1">
                    <span className="font-bold">4</span> posts
                  </h1>
                  <div className="flex items-center gap-4">
                    <h1 className="text-lg">
                      <span className="font-bold">4</span> followers
                    </h1>
                    <h1 className="text-lg">
                      <span className="font-bold">4</span> following
                    </h1>
                  </div>
                </div>
                <h1 className="mt-3 text-md font-bold">{data?.fullname}</h1>
                <p className="text-sm">
                  {data?.bio ||
                    "Tech lover, web developer, arts lover. #RealMadrid White"}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center md:hidden mt-4 p-3 border border-gray-200">
              <div className="text-center">
                <p className="font-bold">4</p>
                <span className="">posts</span>
              </div>
              <div className="text-center">
                <p className="font-bold">4</p>
                <span className="">followers</span>
              </div>
              <div className="text-center">
                <p className="font-bold">4</p>
                <span className="">following</span>
              </div>
            </div>
          </>
        )}
      </div>
      <Modal title="Change profile photo">
        <div className="my-6 flex flex-col justify-center items-center gap-4">
          <form>
            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
              accept="image/*"
              {...register("photo", { required: true })}
              onChange={handleImage}
            />
            {errors.photo && (
              <p className="text-red-600 text-sm">Provide an image to upload</p>
            )}
            {err && <p className="text-red-600 text-sm">{err}</p>}
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
