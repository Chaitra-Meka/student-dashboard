
import { useEffect, useRef } from "react";

interface InfiniteScrollOptions {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function useInfiniteScroll({
  loading,
  hasMore,
  onLoadMore,
}: InfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = sentinelRef.current;

    if (!element || loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: "150px" }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [loading, hasMore, onLoadMore]);

  return sentinelRef;
}
