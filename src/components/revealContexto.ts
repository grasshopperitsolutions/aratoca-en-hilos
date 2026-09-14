import { createContext } from 'react';

/**
 * Switches `Reveal` off for the subtree beneath it.
 *
 * `Reveal` is a scroll-reveal: it waits for an element to enter the viewport
 * and then eases it in. That is right for a long scrolling page and wrong
 * inside the book reader, where a "page" is a small fixed box whose blocks all
 * enter at once — and where the same page can exist twice for the length of a
 * turn (once on the leaf, once on the spread underneath), so every block
 * animated itself, then animated again when the turn committed.
 *
 * The reader supplies its own single entry animation per page instead.
 */
export const RevealInerte = createContext(false);
