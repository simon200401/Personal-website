/** Stand-in for a photo that has not been added yet. */
export default function PlaceholderTile({ index }: { index: number }) {
  const angle = (index * 47) % 360;
  return (
    <div
      aria-hidden="true"
      className="h-full w-full"
      style={{
        background: `linear-gradient(${angle}deg, rgb(var(--p-sage) / 0.35), rgb(var(--p-teal) / 0.12))`,
      }}
    />
  );
}
