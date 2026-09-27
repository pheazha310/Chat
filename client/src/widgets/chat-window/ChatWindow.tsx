import { useMessageStore } from "../../entities/message/model/message.store";
import { useUserStore } from "../../entities/user/model/user.store";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

/** The active conversation: header, scrollable message list, and input. */
export function ChatWindow() {
  const activeUserId = useMessageStore((state) => state.activeUserId);
  const otherUser = useUserStore((state) =>
    activeUserId
      ? state.users.find((user) => user.id === activeUserId)
      : undefined,
  );

  if (!activeUserId) {
    return (
      <section className="flex h-full flex-col items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">Welcome to Chat</h2>
          <p className="mt-1 text-sm text-slate-500">
            Pick someone from the list to start a conversation.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full flex-col">
      <ChatHeader user={otherUser} />
      <MessageList />
      <MessageInput
        otherName={otherUser?.name ?? ""}
        receiverId={activeUserId}
      />
    </section>
  );
}