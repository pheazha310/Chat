import { initials } from "../lib/format";

interface AvatarProps {
  name: string;
  size?: "sm" | "md";
  online?: boolean;
}

export function Avatar({ name, size = "md", online = false }: AvatarProps) {
  const dimensions = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";
  return (
    <div className="relative shrink-0">
      <div
        className={`flex ${dimensions} items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700`}
      >
        {initials(name)}
      </div>
      {online ? (
        <span
          aria-label="Online"
          className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
        />
      ) : null}
    </div>
  );
}