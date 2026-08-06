import { Car } from "lucide-react";

export function ProductThumb({ image, size = "md" }) {
  const dims = size === "lg" ? "h-16 w-16" : "h-11 w-11";
  const iconSize = size === "lg" ? 26 : 18;

  if (image) {
    return (
      <img
        src={image}
        alt=""
        className={`${dims} shrink-0 rounded-xl object-cover`}
      />
    );
  }
  return (
    <div
      className={`flex ${dims} shrink-0 items-center justify-center rounded-xl bg-slate-100`}
    >
      <Car size={iconSize} className="text-slate-500" />
    </div>
  );
}