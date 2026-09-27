import { useEffect } from "react";
import { useUserStore } from "../../entities/user/model/user.store";
import { UserProfile } from "../user-profile/UserProfile";
import { Alert } from "../../shared/ui/Alert";
import { EmptyState } from "../../shared/ui/EmptyState";
import { Spinner } from "../../shared/ui/Spinner";
import { UserListItem } from "./UserListItem";

/** Conversation list: every other user, their presence, and unread counts. */
export function Sidebar() {
  const users = useUserStore((state) => state.users);
  const loaded = useUserStore((state) => state.loaded);
  const loading = useUserStore((state) => state.loading);
  const error = useUserStore((state) => state.error);
  const onlineCount = useUserStore((state) => state.onlineIds.size);

  useEffect(() => {
    const { loaded, loading } = useUserStore.getState();
    if (!loaded && !loading) {
      void useUserStore.getState().loadUsers();
    }
  }, [loaded, loading]);

  return (
    <div className="flex h-full flex-col bg-slate-50/80">
      <header className="border-b border-slate-200 bg-white/70 px-4 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-500">
              Inbox
            </p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900">
              Messages
            </h1>
          </div>
          <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
            {onlineCount} online
          </span>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {loading ? (
          <Spinner fullHeight label="Loading people…" />
        ) : !loaded && error ? (
          <div className="px-4 py-3">
            <Alert message={error} />
            <button
              className="mt-2 rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-100"
              onClick={() => void useUserStore.getState().loadUsers()}
              type="button"
            >
              Try again
            </button>
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            hint="Create a second account to start chatting."
            title="No other users yet"
          />
        ) : (
          <ul className="space-y-2">
            {users.map((user) => (
              <UserListItem key={user.id} user={user} />
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-slate-200 bg-white/60 px-3 py-3 backdrop-blur-sm">
        <UserProfile />
      </div>
    </div>
  );
}
