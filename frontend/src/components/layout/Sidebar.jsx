import { NavLink } from "react-router-dom";
import { MessageSquare, User, Settings, LogOut, Plus, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useChatHistory } from "@/hooks/useChatHistory";
import { truncate, formatDate } from "@/utils/formatters";

const NAV_ITEMS = [
  { to: "/chat", label: "Assistant", icon: MessageSquare },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

/**
 * Primary navigation + chat history list. Rendered as a fixed column on
 * desktop and an off-canvas drawer on mobile (controlled by `isOpen`).
 */
export default function Sidebar({ isOpen, onClose }) {
  const { signOut } = useAuth();
  const { sessions, activeSessionId, setActiveSessionId, createSession, deleteSession } = useChatHistory();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-ink-950/40 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-ink-900/5 bg-ink-900 text-white
          transition-transform duration-200 lg:static lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <span className="text-sm font-semibold tracking-wide text-white/70">Navigation</span>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-white/10 lg:hidden" aria-label="Close menu">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-1 px-3">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-teal-500 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-5 flex items-center justify-between px-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/40">Chat history</span>
          <button
            onClick={() => createSession()}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Start new conversation"
            title="New conversation"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex-1 space-y-1 overflow-y-auto px-3 pb-3">
          {sessions.length === 0 && (
            <p className="px-3 py-4 text-xs text-white/40">No conversations yet. Start by asking anything.</p>
          )}
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                session.id === activeSessionId ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
              onClick={() => {
                setActiveSessionId(session.id);
                onClose?.();
              }}
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{truncate(session.title, 26)}</p>
                <p className="text-[11px] text-white/35">{formatDate(session.createdAt)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 rounded-lg p-1 text-white/40 hover:text-danger-500"
                aria-label={`Delete conversation ${session.title}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
