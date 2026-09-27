import { useMessageStore } from "../../entities/message/model/message.store";
import { useUserStore } from "../../entities/user/model/user.store";
import type { User } from "../../entities/user/model/types";
import { Avatar } from "../../shared/ui/Avatar";

interface ChatHeaderProps {
  user: User | undefined;
}

export function ChatHeader({ user }: ChatHeaderProps) {
  const online = useUserStore((state) =>
    user ? state.onlineIds.has(user.id) : false,
  );
  const clearConversation = useMessageStore((state) => state.clearConversation);

  return (
    <header className="flex items-center gap-3 border-b border-slate-200 bg-gradient-to-r from-white to-slate-50 px-4 py-3 shadow-sm">
      <button
        aria-label="Back to conversations"
        className="rounded-full p-2 text-lg text-slate-500 transition hover:bg-slate-100 md:hidden"
        onClick={clearConversation}
        type="button"
      >
        ‹
      </button>
      <Avatar name={user?.name ?? "?"} online={online} size="sm" />
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-base font-semibold text-slate-900">
          {user?.name ?? "Unknown user"}
        </h2>
        <p className="text-xs font-medium text-slate-500">
          {online ? "Online now" : "Offline"}
        </p>
      </div>
    </header>
  );
}
