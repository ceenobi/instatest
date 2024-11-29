import { useState } from "react";

export default function useSlide({ post }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("next");

  const handlePrevImage = () => {
    setSlideDirection("prev");
    setCurrentImageIndex((prev) =>
      prev === 0 ? (post?.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSlideDirection("next");
    setCurrentImageIndex((prev) =>
      prev === (post?.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };
  return {
    currentImageIndex,
    slideDirection,
    handlePrevImage,
    handleNextImage,
  };
}
