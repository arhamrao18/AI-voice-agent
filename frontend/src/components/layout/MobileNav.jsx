import { NavLink } from "react-router-dom";
import { MessageSquare, User, Settings } from "lucide-react";

const ITEMS = [
  { to: "/chat", label: "Assistant", icon: MessageSquare },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

/** Bottom tab bar shown only on small screens for fast thumb navigation. */
export default function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-ink-900/5 bg-white/95 backdrop-blur-md sm:hidden">
      {ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
              isActive ? "text-teal-600" : "text-ink-600/60"
            }`
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
