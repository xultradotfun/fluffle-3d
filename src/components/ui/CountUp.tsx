"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  from?: number;
  to: number;
  separator?: string;
  direction?: "up" | "down";
  duration?: number;
  className?: string;
}

export default function CountUp({
  from = 0,
  to,
  separator = ",",
  direction = "up",
  duration = 1,
  className = "",
}: CountUpProps) {
  const [count, setCount] = useState(from);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const startValue = direction === "up" ? from : to;
          const endValue = direction === "up" ? to : from;
          const difference = endValue - startValue;

          const animate = () => {
            const currentTime = Date.now();
            const elapsed = (currentTime - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(startValue + difference * easeOut);

            setCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(endValue);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [from, to, direction, duration, hasAnimated]);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  };

  return (
    <span ref={elementRef} className={className}>
      {formatNumber(count)}
    </span>
  );
}

