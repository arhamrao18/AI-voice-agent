import { Bell, Mic, Volume2, MapPin, Moon, Trash2 } from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useChatHistory } from "@/hooks/useChatHistory";
import { useState } from "react";
import { STORAGE_KEYS } from "@/utils/constants";

const DEFAULT_SETTINGS = {
  notifications: true,
  voiceInputEnabled: true,
  voiceOutputEnabled: true,
  shareLocationByDefault: true,
  darkMode: false,
};

/** Toggle row primitive. */
function ToggleRow({ icon: Icon, title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-ink-700">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-medium text-ink-900">{title}</p>
          <p className="text-xs text-ink-600">{description}</p>
        </div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-teal-500" : "bg-ink-900/15"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

/** Settings screen: preference toggles + destructive "clear history" action. */
export default function SettingsPanel() {
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  const { sessions, deleteSession } = useChatHistory();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const update = (key) => (value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const clearAllHistory = () => {
    sessions.forEach((s) => deleteSession(s.id));
    setIsConfirmOpen(false);
  };

  return (
    <div className="space-y-4">
      <Card className="divide-y divide-ink-900/5 p-5">
        <ToggleRow
          icon={Bell}
          title="Notifications"
          description="Get notified when a call connects or a search finishes."
          checked={settings.notifications}
          onChange={update("notifications")}
        />
        <ToggleRow
          icon={Mic}
          title="Voice input"
          description="Enable the microphone button in the chat composer."
          checked={settings.voiceInputEnabled}
          onChange={update("voiceInputEnabled")}
        />
        <ToggleRow
          icon={Volume2}
          title="Voice reply"
          description="Have the assistant speak its replies out loud."
          checked={settings.voiceOutputEnabled}
          onChange={update("voiceOutputEnabled")}
        />
        <ToggleRow
          icon={MapPin}
          title="Share location automatically"
          description="Skip the extra prompt when searching for nearby businesses."
          checked={settings.shareLocationByDefault}
          onChange={update("shareLocationByDefault")}
        />
        <ToggleRow
          icon={Moon}
          title="Dark mode"
          description="Switch the interface to a low-light theme."
          checked={settings.darkMode}
          onChange={update("darkMode")}
        />
      </Card>

      <Card className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm font-medium text-ink-900">Clear chat history</p>
          <p className="text-xs text-ink-600">Removes every conversation stored on this device.</p>
        </div>
        <Button variant="danger" size="sm" onClick={() => setIsConfirmOpen(true)}>
          <Trash2 className="h-3.5 w-3.5" />
          Clear
        </Button>
      </Card>

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Clear chat history?"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={clearAllHistory}>
              Clear history
            </Button>
          </>
        }
      >
        This deletes all {sessions.length} saved conversation{sessions.length === 1 ? "" : "s"} on this device. This
        cannot be undone.
      </Modal>
    </div>
  );
}
