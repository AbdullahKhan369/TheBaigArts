/**
 * Converts a painting title into a URL-safe slug.
 * e.g. "Rising Tide in Blue" -> "rising-tide-in-blue"
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // strip punctuation
    .replace(/[\s_]+/g, '-')    // spaces/underscores -> hyphen
    .replace(/-+/g, '-')        // collapse repeats
    .replace(/^-|-$/g, '')      // trim leading/trailing hyphen
}

/**
 * Appends a short random suffix — used only if a generated slug collides
 * with an existing one (checked against the DB before insert).
 */
export function withUniqueSuffix(slug) {
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${slug}-${suffix}`
}
