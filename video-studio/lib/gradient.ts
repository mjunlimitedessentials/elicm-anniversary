// Deterministic placeholder gradient per id, used anywhere we need a
// distinct-looking card without shipping stock photography (quiz options,
// project thumbnails before a real render/poster exists).
export function gradientFor(id: string) {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) % 360;
  const hue2 = (hash + 55) % 360;
  return `linear-gradient(135deg, hsl(${hash} 45% 18%), hsl(${hue2} 55% 10%))`;
}
