"use client";

import React, { useEffect, useRef, useState, ReactNode } from "react";

interface StaggeredFadeInProps {
  children: ReactNode;
  className?: string;
}

export function StaggeredFadeIn({ children, className = "" }: StaggeredFadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const childElements = ref.current?.children;
    if (!childElements) return;

    Array.from(childElements).forEach((child, index) => {
      setTimeout(() => {
        (child as HTMLElement).style.opacity = "1";
        (child as HTMLElement).style.transform = "translateY(0)";
      }, index * 150);
    });
  }, [isVisible]);

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="translate-y-5 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
        >
          {child}
        </div>
      ))}
    </div>
  );
}
