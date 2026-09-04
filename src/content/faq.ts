/**
 * FAQ ids for the Taller Fique page, in display order.
 *
 * Lives here rather than in the page component because the SEO layer also needs
 * it to emit FAQPage structured data, and importing a page into the SEO module
 * would drag the whole component tree along with it.
 */
export const FAQ_IDS = ['que', 'donde', 'costo', 'pdf', 'quien', 'taller'] as const;
