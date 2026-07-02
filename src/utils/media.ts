// Shared video-source helpers. Media on this site follows a convention: each clip
// is a matched webm (primary) + mp4 (fallback) pair sharing one base name. Blocks
// reference a single path and derive both <source>s from it.

export const VIDEO_EXT = /\.(webm|mp4|mov)$/i;

/** True if the src points at a video clip (by extension). */
export const isVideo = (src: string): boolean => VIDEO_EXT.test(src);

/** Strip the extension so `${videoBase(src)}.webm` / `.mp4` can be derived. */
export const videoBase = (src: string): string => src.replace(VIDEO_EXT, '');
