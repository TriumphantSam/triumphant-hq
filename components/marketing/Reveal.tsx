"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  variant?: "up" | "fade" | "left" | "right";
  stagger?: boolean;
  delayMs?: number;
  threshold?: number;
  rootMargin?: string;
};

export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
  variant = "up",
  stagger = false,
  delayMs = 0,
  threshold = 0.16,
  rootMargin = "0px 0px -8% 0px",
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setVisible(true);
      return;
    }

    setArmed(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  const style: CSSProperties | undefined = delayMs
    ? ({ ["--reveal-delay" as string]: `${delayMs}ms` } as CSSProperties)
    : undefined;

  return (
    <Tag
      ref={ref}
      className={[
        "reveal",
        `reveal-${variant}`,
        armed ? "reveal-armed" : "",
        visible ? "is-visible" : "",
        stagger ? "reveal-stagger" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {children}
    </Tag>
  );
}
