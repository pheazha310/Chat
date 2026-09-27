import { formatTime } from "../../shared/lib/format";

interface MessageBubbleProps {
  content: string;
  createdAt: string;
  own: boolean;
}

export function MessageBubble({ content, createdAt, own }: MessageBubbleProps) {
  return (
    <li className={own ? "flex justify-end" : "flex justify-start"}>
      <div
        className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
          own
            ? "rounded-br-md bg-gradient-to-br from-indigo-600 to-violet-600 text-white"
            : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
        }`}
      >
        <div>{content}</div>
        <span
          className={`mt-1.5 block text-right text-[10px] ${
            own ? "text-indigo-100" : "text-slate-400"
          }`}
        >
          {formatTime(createdAt)}
        </span>
      </div>
    </li>
  );
}
