import Layout from "@/components/layout/Layout";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileForm from "@/components/profile/ProfileForm";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <Layout>
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-6 sm:px-6">
        <h1 className="text-lg font-bold text-ink-900">Profile</h1>
        <ProfileCard user={user} />
        <ProfileForm />
      </div>
    </Layout>
  );
}
