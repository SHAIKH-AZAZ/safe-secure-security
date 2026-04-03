'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { createElement, useEffect, useRef } from 'react';

interface SectionRevealProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  delay?: number;
  as?: 'div' | 'article' | 'blockquote';
}

export default function SectionReveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
  ...props
}: SectionRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    let timeoutId: number | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        timeoutId = window.setTimeout(() => {
          element.classList.add('visible');
        }, delay);

        observer.unobserve(element);
      },
      { threshold: 0.12 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [delay]);

  const Tag = as;

  return createElement(
    Tag,
    {
      ...(props as HTMLAttributes<HTMLElement>),
      ref,
      className: ['reveal', className].filter(Boolean).join(' '),
    },
    children
  );
}
