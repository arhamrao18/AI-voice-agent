import { useCallback, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import VoiceInputButton from "@/components/chat/VoiceInputButton";
import { useVoiceInput } from "@/hooks/useVoiceInput";

/**
 * Chat composer: text field, voice input, and a "3 Solutions" toggle
 * that tells the assistant this is a "solve my problem" style request.
 */
export default function ChatInput({ onSend, isSending }) {
  const [text, setText] = useState("");
  const [wantsSolutions, setWantsSolutions] = useState(false);
  const textareaRef = useRef(null);

  const handleVoiceResult = useCallback((transcript) => {
    setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
  }, []);

  const voice = useVoiceInput({ onResult: handleVoiceResult });

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    onSend(trimmed, { wantsSolutions });
    setText("");
    setWantsSolutions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-ink-900/5 bg-white px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-2">
        <button
          type="button"
          onClick={() => setWantsSolutions((v) => !v)}
          className={`self-start flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
            wantsSolutions ? "bg-teal-500 text-white" : "bg-surface-muted text-ink-600 hover:text-ink-900"
          }`}
        >
          <Sparkles className="h-3 w-3" />
          Give me 3 solutions
        </button>

        <div className="flex items-end gap-2 rounded-2xl border border-ink-900/10 bg-surface-muted p-1.5">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={voice.isListening ? "Listening…" : "Ask the assistant anything…"}
            rows={1}
            className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-ink-900 placeholder:text-ink-600/50 focus:outline-none"
          />
          <VoiceInputButton
            isSupported={voice.isSupported}
            isListening={voice.isListening}
            onToggle={voice.toggleListening}
          />
          <button
            type="button"
            onClick={submit}
            disabled={!text.trim() || isSending}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500 text-white transition-colors hover:bg-teal-600 disabled:opacity-40"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        {voice.interimTranscript && (
          <p className="px-2 text-xs italic text-ink-600/60">{voice.interimTranscript}</p>
        )}
      </div>
    </div>
  );
}
