import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { createStory } from "@/api/story";
import { useAuthStore, usePostStore } from "@/hooks";
import { handleError } from "@/utils";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { ActionButton, Alert, Modal } from "@/components";

export default function CreateStory() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [err, setErr] = useState(null);
  const fileInputRef = useRef(null);
  const { accessToken } = useAuthStore();
  const { setStoryData } = usePostStore();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm();

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
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select an image file (JPEG, PNG, GIF, or WebP)");
        return;
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

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleOpen = () => {
    setIsOpen(true);
    handleClick();
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedImages([]);
    setErr(null);
    reset();
  };

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      media: selectedImages.map(({ preview }) => preview),
    };
    try {
      const res = await createStory(formData, accessToken);
      if (res.status === 201) {
        toast.success(res.data.message);
        setStoryData((prev) => ({
          ...prev,
          stories: [res.data.story, ...(prev?.stories || [])],
        }));
        setSelectedImages([]);
        setErr(null);
        reset();
        setIsOpen(false);
      }
    } catch (error) {
      handleError(setErr, error);
    }
  };

  return (
    <>
      <div className="relative inline-block">
        <div
          onClick={handleOpen}
          className="w-14 h-14 rounded-full border-2 border-accent flex items-center justify-center cursor-pointer hover:bg-accent/10 transition-colors"
          title="Create Story"
        >
          <Plus size={28} className="text-accent" />
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Create Story"
        id="create-storyModal"
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
              ref={fileInputRef}
              onChange={handleImage}
              accept="image/*"
              multiple
              className="hidden"
            />
          </div>
          <div className="form-control mt-2 text-start">
            <label className="label">
              <span className="label-text">Caption</span>
            </label>
            <input
              type="text"
              className="input input-bordered rounded-none"
              placeholder="Add a caption (optional)"
              {...register("caption")}
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
