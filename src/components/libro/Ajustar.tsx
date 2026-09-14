import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Shrinks its content just enough to fit the page it sits on.
 *
 * Pagination is by declared weight rather than by measurement (see
 * `paginar.ts`), so a page is only ever approximately full — and an activity
 * that reveals its explanation grows after the fact. Either can push a page
 * into scrolling, which a book should never do.
 *
 * The fit uses `zoom` rather than `transform: scale()` because zoom reflows:
 * the text re-wraps at the smaller size instead of being squeezed, so the
 * measure stays readable. Each pass starts from full size and then closes in on
 * a fit, so the result depends only on the content and the box — never on
 * whatever scale happened to be left over from last time.
 *
 * The floor is deliberate. Past it the page keeps its scrollbar rather than
 * shrinking the text to something unreadable: a scrollbar is a nuisance, lost
 * or illegible text is a defect. Once the page does fit, the rail is hidden —
 * so a book never draws one for the sake of a rounded pixel, but a page that
 * genuinely has more to read still says so.
 */

const MINIMO = 0.55;

export default function Ajustar({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const caja = useRef<HTMLDivElement>(null);
  const interior = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fuera = caja.current;
    const dentro = interior.current;
    if (!fuera || !dentro) return;

    let pendiente = 0;

    const ajustar = () => {
      pendiente = 0;
      // Always start from full size, so a page that has just lost content grows
      // back. Every run therefore ends on the same value for the same content,
      // which is what stops the observer oscillating.
      dentro.style.zoom = '1';

      const disponible = fuera.clientHeight;
      if (disponible <= 0) return;

      // Then close in. One division is usually enough, but not always: a
      // shrunken page re-wraps, and re-wrapped text does not lose height in
      // exact proportion. Re-measuring at the applied scale corrects for that
      // instead of leaving a stubborn last few pixels of scrollbar.
      let escala = 1;
      for (let intento = 0; intento < 6; intento += 1) {
        // Both heights are read off the scroll container, so they are in the
        // same coordinate space and the comparison holds whatever zoom is
        // currently applied to the content inside it.
        const usado = fuera.scrollHeight;
        if (usado <= 0 || usado <= disponible) break;

        // Aim a pixel under the box rather than exactly at it, and never take a
        // step smaller than half a percent: scrollHeight is rounded to whole
        // pixels, so a purely proportional step can converge on a value that is
        // forever two pixels too tall — and two pixels is still a scrollbar.
        const proporcional = escala * ((disponible - 1) / usado);
        const siguiente = Math.max(MINIMO, Math.min(proporcional, escala * 0.995));
        if (siguiente >= escala) break;
        escala = siguiente;
        dentro.style.zoom = String(escala);
      }

      if (escala === 1) dentro.style.zoom = '';

      // The rail is hidden only when there is nothing left to scroll to.
      fuera.classList.toggle('libro-sin-barra', fuera.scrollHeight <= disponible);
    };

    const programar = () => {
      if (pendiente) return;
      pendiente = requestAnimationFrame(ajustar);
    };

    const observador = new ResizeObserver(programar);
    observador.observe(dentro);
    observador.observe(fuera);
    programar();

    return () => {
      observador.disconnect();
      if (pendiente) cancelAnimationFrame(pendiente);
    };
  }, []);

  return (
    <div ref={caja} className="libro-sin-barra h-full overflow-y-auto">
      <div ref={interior} className={className}>
        {children}
      </div>
    </div>
  );
}
