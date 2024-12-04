import { useRef, useCallback } from "react";

export default function useInfiniteScroll(loading, hasMore, setPage) {
  const observer = useRef();
  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, setPage]
  );

  return { lastPostRef, hasMore, observer };
}
