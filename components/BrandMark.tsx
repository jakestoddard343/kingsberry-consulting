import {
  BRAND_MARK_PATH,
  BRAND_MARK_TRANSFORM,
  BRAND_MARK_VIEWBOX,
} from "@/lib/brand-mark";

/**
 * The Kingsberry mark, filled with `currentColor` so callers set the colour:
 * brand burgundy on light surfaces, white reversed out of a burgundy tile.
 * No gradient or clip IDs inside, which is what makes it safe to inline more
 * than once on a page.
 */
export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox={BRAND_MARK_VIEWBOX}
      className={className}
      role="img"
      aria-label="Kingsberry"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        transform={BRAND_MARK_TRANSFORM}
        d={BRAND_MARK_PATH}
      />
    </svg>
  );
}
