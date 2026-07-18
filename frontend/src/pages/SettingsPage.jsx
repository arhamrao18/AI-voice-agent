import Layout from "@/components/layout/Layout";
import SettingsPanel from "@/components/settings/SettingsPanel";

export default function SettingsPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-6 sm:px-6">
        <h1 className="text-lg font-bold text-ink-900">Settings</h1>
        <SettingsPanel />
      </div>
    </Layout>
  );
}
