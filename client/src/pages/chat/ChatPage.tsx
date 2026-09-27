import { useMessageStore } from "../../entities/message/model/message.store";
import { ChatWindow } from "../../widgets/chat-window/ChatWindow";
import { Sidebar } from "../../widgets/sidebar/Sidebar";

/**
 * Full-screen chat page.
 * Desktop shows sidebar + chat window side by side; on mobile only one
 * panel is visible at a time, toggled by the active conversation.
 */
export function ChatPage() {
  const hasActiveUser = useMessageStore((state) => state.activeUserId !== null);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-transparent p-2 sm:p-4">
      <div className="flex h-full w-full max-w-[1600px] overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm md:h-[calc(100vh-2rem)]">
        <aside
          className={`${hasActiveUser ? "hidden md:flex" : "flex"} w-full flex-col border-r border-slate-200 bg-slate-50/80 md:w-[340px] md:shrink-0`}
        >
          <Sidebar />
        </aside>
        <main
          className={`${hasActiveUser ? "flex" : "hidden md:flex"} min-w-0 flex-1 flex-col bg-white`}
        >
          <ChatWindow />
        </main>
      </div>
    </div>
  );
}
