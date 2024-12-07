import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteStory, viewStory } from "@/api/story";
import { useAuthStore, usePostStore } from "@/hooks";
import { handleError } from "@/utils";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

export default function Stories() {
  const [currentStory, setCurrentStory] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { accessToken, user } = useAuthStore();
  const { stories } = usePostStore();
  const { username, storyId } = useParams();
  const navigate = useNavigate();
  const loggedInUser = user?.data;

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const res = await viewStory(storyId, accessToken);
        if (res.status === 200) {
          setCurrentStory(res.data.story);
          setCurrentImageIndex(0);
        }
      } catch (error) {
        handleError(toast.error, error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (storyId && accessToken) {
      fetchStory();
    }
  }, [storyId, accessToken, navigate]);

  const viewNextStory = useCallback(() => {
    if (!stories) return;

    // Find current story index
    const currentIndex = stories.findIndex((story) => story._id === storyId);

    // If there's a next story, navigate to it
    if (currentIndex < stories.length - 1) {
      const nextStory = stories[currentIndex + 1];
      navigate(`/stories/${nextStory.user.username}/${nextStory._id}`);
    } else {
      // If we're at the last story, go back to home
      navigate("/");
    }
  }, [navigate, stories, storyId]);

  const viewPrevStory = useCallback(() => {
    if (!stories) return;

    // Find current story index
    const currentIndex = stories.findIndex((story) => story._id === storyId);

    // If there's a previous story, navigate to it
    if (currentIndex > 0) {
      const prevStory = stories[currentIndex - 1];
      navigate(`/stories/${prevStory.user.username}/${prevStory._id}`);
    } else {
      // If we're at the first story, go back to home
      navigate("/");
    }
  }, [navigate, stories, storyId]);

  const handleNext = useCallback(() => {
    if (currentImageIndex < currentStory.media.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    } else {
      viewNextStory();
    }
  }, [currentImageIndex, currentStory?.media?.length, viewNextStory]);

  const handlePrevious = useCallback(() => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    } else {
      viewPrevStory();
    }
  }, [currentImageIndex, viewPrevStory]);

  const handleClose = useCallback(() => {
    navigate("/");
  }, [navigate]);

  // Auto-advance to next image/story after 5 seconds
  useEffect(() => {
    if (!currentStory) return;

    const timer = setTimeout(() => {
      handleNext();
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentStory, currentImageIndex, handleNext]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          handlePrevious();
          break;
        case "ArrowRight":
          handleNext();
          break;
        case "Escape":
          handleClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    currentStory,
    currentImageIndex,
    handlePrevious,
    handleNext,
    handleClose,
  ]);

  const deleteAStory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await deleteStory(storyId, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      handleError(toast.error, error);
    } finally {
      setLoading(false);
    }
  }, [accessToken, navigate, storyId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-accent"></span>
      </div>
    );
  }

  if (!currentStory) return null;

  return (
    <>
      <Helmet>
        <title>Instapics stories - @{username} </title>
        <meta name="description" content="View stories" />
      </Helmet>
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
          {/* Story content */}
          {loggedInUser?._id === currentStory.user._id && (
            <div className="dropdown dropdown-bottom dropdown-end w-full text-right">
              <div tabIndex={0} role="button" className="btn btn-xs btn-ghost">
                <Ellipsis className="text-white" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow"
              >
                <li>
                  <button onClick={deleteAStory}>
                    {loading ? "Deleting..." : "Delete story"}
                  </button>
                </li>
              </ul>
            </div>
          )}
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
    </>
  );
}
