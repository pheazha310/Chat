import { useMessageStore } from "../../entities/message/model/message.store";
import { useUserStore } from "../../entities/user/model/user.store";
import type { User } from "../../entities/user/model/types";
import { formatTime } from "../../shared/lib/format";
import { Avatar } from "../../shared/ui/Avatar";

export function UserListItem({ user }: { user: User }) {
  const online = useUserStore((state) => state.onlineIds.has(user.id));
  const active = useMessageStore((state) => state.activeUserId === user.id);
  const unread = useMessageStore((state) => state.unreadCounts[user.id] ?? 0);
  const conversations = useMessageStore((state) => state.conversations);
  const messages = conversations[user.id] ?? [];
  const lastMessage = messages[messages.length - 1];

  return (
    <li>
      <button
        className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-200 ${
          active
            ? "bg-indigo-600 text-white shadow-[0_12px_24px_rgba(79,70,229,0.18)]"
            : "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100"
        }`}
        onClick={() =>
          void useMessageStore.getState().selectConversation(user.id)
        }
        type="button"
      >
        <Avatar name={user.name} online={online} />
        <span className="min-w-0 flex-1">
          <span
            className={`block truncate text-sm font-semibold ${
              active ? "text-white" : "text-slate-900"
            }`}
          >
            {user.name}
          </span>
          {lastMessage ? (
            <span
              className={`block truncate text-xs ${
                active ? "text-indigo-100" : "text-slate-500"
              }`}
            >
              {lastMessage.content}
            </span>
          ) : (
            <span
              className={`block text-xs ${active ? "text-indigo-100" : "text-slate-400"}`}
            >
              No messages yet
            </span>
          )}
        </span>
        <span className="flex flex-col items-end gap-1">
          {lastMessage ? (
            <span
              className={
                active
                  ? "text-[10px] text-indigo-200"
                  : "text-[10px] text-slate-400"
              }
            >
              {formatTime(lastMessage.createdAt)}
            </span>
          ) : null}
          {unread > 0 ? (
            <span
              aria-label={`${unread} unread`}
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                active ? "bg-white/20 text-white" : "bg-indigo-600 text-white"
              }`}
            >
              {unread}
            </span>
          ) : null}
        </span>
      </button>
    </li>
  );
}
