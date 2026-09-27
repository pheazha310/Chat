interface SpinnerProps {
  label?: string;
  fullHeight?: boolean;
}

export function Spinner({
  label = "Loading…",
  fullHeight = false,
}: SpinnerProps) {
  return (
    <div
      className={`flex items-center justify-center gap-2 ${fullHeight ? "min-h-40" : "py-4"}`}
    >
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-transparent"
      />
      <span className="text-sm text-slate-500">{label}</span>
    </div>
  );
}