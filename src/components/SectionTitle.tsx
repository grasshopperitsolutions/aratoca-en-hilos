import Reveal from './Reveal';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  accent?: string;
  align?: 'center' | 'left';
}

export default function SectionTitle({
  title,
  subtitle,
  accent,
  align = 'center',
}: SectionTitleProps) {
  return (
    <Reveal>
      <div className={`mb-20 ${align === 'center' ? 'text-center' : 'text-left'}`}>
        {accent && (
          <p className="text-sm font-bold uppercase tracking-widest text-penca mb-4">
            {accent}
          </p>
        )}
        <h2 className="text-4xl md:text-5xl font-fraunces text-charcoal">
          {title}
        </h2>
        {subtitle && (
          <p className="text-stone max-w-md mt-4 font-light text-lg mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </Reveal>
  );
}