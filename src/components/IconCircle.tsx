import type { LucideIcon } from 'lucide-react';

interface IconCircleProps {
  icon: LucideIcon;
  color: string;
  size?: number;
}

export default function IconCircle({
  icon: Icon,
  color,
  size = 24,
}: IconCircleProps) {
  return (
    <div
      className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg text-cream"
      style={{ backgroundColor: color }}
    >
      <Icon size={size} className="md:w-7 md:h-7" />
    </div>
  );
}