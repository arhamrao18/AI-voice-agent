import { Menu, Radio } from "lucide-react";
import { APP_NAME } from "@/utils/constants";
import Avatar from "@/components/common/Avatar";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

/** Top bar shown on all authenticated pages; also hosts the mobile menu trigger. */
export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-ink-900/5 bg-white/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-ink-700 hover:bg-surface-muted lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-teal-400">
            <Radio className="h-4 w-4" />
          </span>
          <span className="text-base font-bold tracking-tight text-ink-900">{APP_NAME}</span>
        </div>
      </div>

      <Link to="/profile" className="flex items-center gap-2 rounded-full pr-1 hover:bg-surface-muted">
        <span className="hidden text-sm font-medium text-ink-700 sm:block">{user?.name || "Guest"}</span>
        <Avatar initials={user?.avatarInitials || "?"} size="sm" />
      </Link>
    </header>
  );
}
