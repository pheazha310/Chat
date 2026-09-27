import { useMessageStore } from "../../entities/message/model/message.store";
import { useAuthStore } from "../../features/auth/model/auth.store";
import { Avatar } from "../../shared/ui/Avatar";

/** Shows the signed-in user and a log-out action under the conversation list. */
export function UserProfile() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const clearConversation = useMessageStore((state) => state.clearConversation);
  if (!user) return null;

  return (
    <div className="flex items-center gap-3 border-t border-slate-200 px-4 py-3">
      <Avatar name={user.name} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">
          {user.name}
        </p>
        <p className="truncate text-xs text-slate-500">{user.email}</p>
      </div>
      <button
        className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
        onClick={() => {
          logout();
          clearConversation();
        }}
        type="button"
      >
        Log out
      </button>
    </div>
  );
}