import type { ImageMetadata } from 'astro';

// Astro can only optimise images it imports from src/ — anything referenced by
// an absolute path into public/ is copied verbatim and shipped at full size.
// The site's authoring convention is those absolute paths ("/projects/slug/x.jpg"
// in MDX frontmatter and block props), so rather than rewrite every reference,
// the files live in src/assets and this maps a public-style path onto them at
// build time.
//
// eager: the map has to be readable synchronously inside component frontmatter.
const ASSETS = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{jpeg,jpg,png,webp,avif}',
  { eager: true },
);

/**
 * Resolve "/projects/safecracker/safe-hero-7x5.jpeg" to its imported asset.
 *
 * Returns the original string when there is no match, which keeps <Image>
 * working as a passthrough — that covers anything still living in public/ and
 * means a typo degrades to an unoptimised image rather than a build failure.
 */
export function resolveImage(src: string): ImageMetadata | string {
  if (!src || !src.startsWith('/')) return src;
  return ASSETS[`/src/assets${src}`]?.default ?? src;
}

/** True when the path resolved to a real imported asset. */
export function isOptimised(src: string): boolean {
  return typeof resolveImage(src) !== 'string';
}
