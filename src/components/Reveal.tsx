import { type ReactNode } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
  className?: string;
}

export default function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: RevealProps) {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>();

  const getTransform = () => {
    if (isVisible) return 'translate-y-0 translate-x-0 opacity-100';
    switch (direction) {
      case 'up':
        return 'translate-y-12 opacity-0';
      case 'left':
        return '-translate-x-12 opacity-0';
      case 'right':
        return 'translate-x-12 opacity-0';
      default:
        return 'translate-y-12 opacity-0';
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] ${getTransform()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}