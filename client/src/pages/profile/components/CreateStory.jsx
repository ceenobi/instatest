import { createStory } from "@/api/story";
import { ActionButton, Alert, Modal } from "@/components";
import { useAuthStore } from "@/hooks";
import { handleError } from "@/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";

export default function CreateStory() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [err, setErr] = useState(null);
  const [status, setStatus] = useState("idle");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const { accessToken } = useAuthStore();

  const handleClose = () => {
    setIsOpen(false);
    setSelectedImages([]);
    setErr(null);
    reset();
  };

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
    setSelectedImages([]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
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

  const onSubmit = async (data) => {
    if (selectedImages.length === 0) {
      setErr("Please select at least one image");
      return;
    }
    try {
      setStatus("loading");
      const formData = {
        ...data,
        images: selectedImages.map(({ preview }) => preview),
      };

      await createStory(formData, accessToken);
      setStatus("success");
      handleClose();
    } catch (error) {
      handleError(setErr, error);
      setStatus("error");
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Story - Instapics</title>
        <meta name="description" content="Create a new story on Instapics" />
      </Helmet>
      <button
        className="btn btn-circle bg-gray-300 text-white focus:outline-none"
        onClick={() => setIsOpen(true)}
      >
        <Plus size={48}/>
      </button>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Create a Story"
        id="create-story-modal"
        classname="max-w-2xl"
        selectedImages={selectedImages}
      >
        {err && <Alert error={err} classname="my-4" />}
        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
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
          <ActionButton
            text="Share"
            type="submit"
            loading={isSubmitting}
            classname="w-full btn-sm btn-secondary mt-4"
          />
        </form>
      </Modal>
    </>
  );
}
