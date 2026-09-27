import { useEffect, useRef } from "react";
import { useAuthStore } from "../../features/auth/model/auth.store";
import { useTypingStore } from "../../features/typing-indicator/model/typing.store";
import { useMessageStore } from "../../entities/message/model/message.store";
import { useUserStore } from "../../entities/user/model/user.store";
import { Alert } from "../../shared/ui/Alert";
import { EmptyState } from "../../shared/ui/EmptyState";
import { Spinner } from "../../shared/ui/Spinner";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

export function MessageList() {
  const messages = useMessageStore((state) => state.messages);
  const loading = useMessageStore((state) => state.loading);
  const error = useMessageStore((state) => state.error);
  const currentUserId = useAuthStore((state) => state.user?.id);
  const activeUserId = useMessageStore((state) => state.activeUserId);
  const isTyping = useTypingStore((state) =>
    activeUserId ? state.typingUserIds.has(activeUserId) : false,
  );
  const otherUser = useUserStore((state) =>
    activeUserId
      ? state.users.find((user) => user.id === activeUserId)
      : undefined,
  );
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  return (
    <section className="min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.08),transparent_28%),#f8fafc] px-4 py-4">
      {loading ? (
        <Spinner label="Loading messages…" />
      ) : error ? (
        <div className="flex flex-col items-center gap-2">
          <Alert message={error} />
          <button
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-100"
            onClick={() => void useMessageStore.getState().loadHistory()}
            type="button"
          >
            Try again
          </button>
        </div>
      ) : messages.length === 0 ? (
        <EmptyState
          hint={`Say hello to ${otherUser?.name ?? "them"}!`}
          title="No messages yet"
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {messages.map((message) => (
            <MessageBubble
              content={message.content}
              createdAt={message.createdAt}
              key={message.id}
              own={message.senderId === currentUserId}
            />
          ))}
        </ul>
      )}
      {isTyping ? (
        <TypingIndicator name={otherUser?.name ?? "Someone"} />
      ) : null}
      <div aria-hidden="true" className="h-1 opacity-0" ref={bottomRef} />
    </section>
  );
}
