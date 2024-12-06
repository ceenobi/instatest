import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { viewStory } from "@/api/story";
import { useAuthStore, usePostStore } from "@/hooks";
import { handleError } from "@/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function Stories() {
  const [currentStory, setCurrentStory] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { storyId, username } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const { stories } = usePostStore();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const res = await viewStory(storyId, accessToken);
        if (res.data.hasViewed) {
          toast.info("You have already viewed this story", {
            id: "viewedStory",
          });
        }
        setCurrentStory(res.data.story);
      } catch (error) {
        handleError(setError, error);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [storyId, accessToken]);

  const handleNext = () => {
    if (currentImageIndex < currentStory.media.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    } else {
      navigate(-1);
    }
  };

  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  const viewNextStory = () => {
    navigate(`/stories/${username}/${storyId}`);
  };

  const viewPrevStory = () => {
    navigate(-1);
  };

  console.log("st", stories);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-accent"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-500 mb-4">{error.message}</p>
          <button onClick={handleClose} className="btn btn-accent">
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="hidden md:flex absolute inset-y-0 left-40 items-center">
        {stories.length - 1 > 0 && (
          <button
            onClick={viewPrevStory}
            className="p-2 text-white hover:text-accent"
          >
            <ChevronLeft size={24} />
          </button>
        )}
      </div>
      <div className="hidden md:flex absolute inset-y-0 right-40 items-center">
        {stories.length - 1 > 0 && (
          <button
            onClick={viewNextStory}
            className="p-2 text-white hover:text-accent"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      <div className="mt-10 relative w-full h-[70vh] md:h-[80vh] md:w-[600px] lg:w-[400px]">
        {/* Close button */}
        {/* <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 text-white hover:text-accent"
        >
          <X size={24} />
        </button> */}

        {/* Story content */}
        <div className="relative w-full h-full">
          <img
            src={currentStory.media[currentImageIndex]}
            alt={`Story by ${username}`}
            className="w-full h-full object-cover aspect-square"
          />

          {/* Navigation buttons */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            {currentImageIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="p-2 text-white hover:text-accent"
              >
                <ChevronLeft size={24} />
              </button>
            )}
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            {currentImageIndex < currentStory.media.length - 1 && (
              <button
                onClick={handleNext}
                className="p-2 text-white hover:text-accent"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Progress indicators */}
          <div className="absolute top-0 left-0 right-0 flex gap-1">
            {currentStory.media.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full ${
                  index === currentImageIndex ? "bg-accent" : "bg-gray-600"
                }`}
              />
            ))}
          </div>

          {/* User info */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 p-2 rounded-full">
            <div className="avatar">
              <div className="w-7 h-7 rounded-full">
                {currentStory.user?.profilePicture ? (
                  <img
                    src={currentStory.user.profilePicture}
                    alt={currentStory.user.username}
                  />
                ) : (
                  <div className="bg-accent text-white flex items-center justify-center text-sm">
                    {currentStory.user.username[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <span className="text-white font-medium">
              {currentStory.user.username}
            </span>
          </div>

          {/* Caption */}
          {currentStory.caption && (
            <div className="px-4 md:px-0">
              <p className="text-white text-sm">{currentStory.caption}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
