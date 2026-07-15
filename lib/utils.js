export function formatImagePath(src) {
  if (!src) return "";
  if (
    src.startsWith("http://") || 
    src.startsWith("https://") || 
    src.startsWith("data:")
  ) {
    return src;
  }
  if (src.startsWith("/")) return src;
  return `/${src}`;
}
