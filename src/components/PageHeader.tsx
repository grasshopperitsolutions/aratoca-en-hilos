import Reveal from './Reveal';

interface PageHeaderProps {
  /** Small uppercase eyebrow above the title. */
  accent?: string;
  title: string;
  /** Lead paragraph. Rendered against the fique rule, like the home hero. */
  intro?: string;
  /** Handwritten Caveat note under the intro. */
  note?: string;
}

/**
 * Shared top-of-page band. Keeps the vertical rhythm identical across
 * Artesanos, Taller Fique, Contacto and the legal pages, and reserves the
 * `pt-32` the fixed header needs.
 */
export default function PageHeader({ accent, title, intro, note }: PageHeaderProps) {
  return (
    <section className="px-6 md:px-12 pt-32 md:pt-40 pb-16 md:pb-20 bg-moss/10">
      <div className="max-w-4xl mx-auto">
        {accent && (
          <Reveal direction="up">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[1px] w-8 bg-penca" />
              <span className="text-penca font-bold uppercase tracking-widest text-xs">
                {accent}
              </span>
            </div>
          </Reveal>
        )}

        <Reveal direction="up" delay={100}>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-fraunces font-bold text-charcoal leading-[1.1]">
            {title}
          </h1>
        </Reveal>

        {intro && (
          <Reveal direction="up" delay={250}>
            <p className="text-lg md:text-xl text-charcoal/80 leading-relaxed mt-8 font-light border-l-2 border-fique pl-6 max-w-2xl">
              {intro}
            </p>
          </Reveal>
        )}

        {note && (
          <Reveal direction="up" delay={400}>
            <span className="font-caveat text-3xl text-penca block -rotate-2 mt-10">
              {note}
            </span>
          </Reveal>
        )}
      </div>
    </section>
  );
}
