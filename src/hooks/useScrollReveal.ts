import { useState, useEffect, useRef, type RefObject } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
): [RefObject<T | null>, boolean] {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<T | null>(null);
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px' } = options;

  useEffect(() => {
    const element = domRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [domRef, isVisible];
}