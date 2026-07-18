import { Mic, MicOff } from "lucide-react";

/** Toggle button reflecting live voice-capture state. Falls back to disabled when unsupported. */
export default function VoiceInputButton({ isSupported, isListening, onToggle }) {
  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        title="Voice input is not supported in this browser"
        className="rounded-xl p-2.5 text-ink-600/30"
      >
        <MicOff className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      title={isListening ? "Stop listening" : "Start voice input"}
      className={`rounded-xl p-2.5 transition-colors ${
        isListening ? "bg-danger-500/10 text-danger-600 animate-pulse" : "text-ink-600 hover:bg-surface-muted"
      }`}
    >
      <Mic className="h-4 w-4" />
    </button>
  );
}
