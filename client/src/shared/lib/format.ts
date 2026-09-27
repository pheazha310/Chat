/** Formats an ISO date string as a local "HH:MM" clock time. */
export function formatTime(dateTime: string): string {
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** Builds a short "AB" avatar label from a full name. */
export function initials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);
  return parts.slice(0, 2).map((part) => part[0]!.toUpperCase()).join("") || "?";
}