import Avatar from "@/components/common/Avatar";
import Card from "@/components/common/Card";

/** Read-only summary card at the top of the Profile page. */
export default function ProfileCard({ user }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <Avatar initials={user?.avatarInitials || "?"} size="lg" />
      <div>
        <h2 className="text-base font-semibold text-ink-900">{user?.name || "Guest"}</h2>
        <p className="text-sm text-ink-600">{user?.email}</p>
        {user?.phoneNumber && <p className="text-xs text-ink-600/70">{user.phoneNumber}</p>}
      </div>
    </Card>
  );
}
