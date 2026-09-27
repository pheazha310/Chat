import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import {
  MAX_MESSAGE_LENGTH,
  sendMessage,
} from "../../features/send-message/model/send-message";
import {
  sendTypingStart,
  sendTypingStop,
} from "../../features/typing-indicator/model/typing.send";

export function MessageInput({
  otherName,
  receiverId,
}: {
  otherName: string;
  receiverId: number;
}) {
  const [value, setValue] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);
  const typingRef = useRef(false);

  function notifyTyping(currentValue: string): void {
    const shouldType = currentValue.trim().length > 0;
    if (shouldType && !typingRef.current) {
      typingRef.current = true;
      sendTypingStart(receiverId);
    } else if (!shouldType && typingRef.current) {
      typingRef.current = false;
      sendTypingStop(receiverId);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (sendMessage(receiverId, value)) {
      setValue("");
      notifyTyping("");
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  // Stop the typing indicator if the input unmounts mid-keystroke.
  useEffect(
    () => () => {
      if (typingRef.current) sendTypingStop(receiverId);
    },
    [receiverId],
  );

  const sendDisabled =
    value.trim().length === 0 || value.trim().length > MAX_MESSAGE_LENGTH;

  return (
    <form
      className="flex items-end gap-3 border-t border-slate-200 bg-white/90 px-4 py-3 shadow-[0_-6px_18px_rgba(15,23,42,0.02)] backdrop-blur-sm"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <textarea
        aria-label="Message"
        className="max-h-32 min-h-12 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
        onChange={(event) => {
          setValue(event.target.value);
          notifyTyping(event.target.value);
        }}
        onKeyDown={handleKeyDown}
        placeholder={`Message ${otherName}`}
        rows={1}
        value={value}
      />
      <button
        className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:translate-y-[-1px] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        disabled={sendDisabled}
        type="submit"
      >
        Send
      </button>
    </form>
  );
}
