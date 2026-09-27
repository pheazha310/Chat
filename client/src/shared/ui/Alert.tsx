interface AlertProps {
  message: string;
}

export function Alert({ message }: AlertProps) {
  return (
    <div
      aria-live="assertive"
      className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
      role="alert"
    >
      {message}
    </div>
  );
}