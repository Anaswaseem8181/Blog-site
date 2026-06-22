import { useEffect, useState, useCallback } from 'react';

export default function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [element, setElement] = useState(null);

  const ref = useCallback((node) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) {
      setIsIntersecting(false);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, options.root, options.rootMargin, options.threshold]); 

  return [ref, isIntersecting];
}
