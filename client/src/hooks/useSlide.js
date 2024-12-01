import { useState } from "react";

export default function useSlide({ post }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("next");

  const handlePrev = () => {
    if (!post?.images?.length) return;

    setSlideDirection("prev");
    setCurrentIndex((prev) => {
      const lastIndex = post.images.length - 1;
      return prev === 0 ? lastIndex : prev - 1;
    });
  };

  const handleNext = () => {
    if (!post?.images?.length) return;

    setSlideDirection("next");
    setCurrentIndex((prev) => {
      const lastIndex = post.images.length - 1;
      return prev === lastIndex ? 0 : prev + 1;
    });
  };

  return {
    currentIndex,
    slideDirection,
    handlePrev,
    handleNext,
  };
}
