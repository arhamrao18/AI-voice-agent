import { useEffect, useRef } from "react";
import { Radio, Volume2 } from "lucide-react";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import SuggestedPrompts from "@/components/chat/SuggestedPrompts";
import Loader from "@/components/common/Loader";
import { useChat } from "@/hooks/useChat";
import { useVoiceOutput } from "@/hooks/useVoiceOutput";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { MESSAGE_ROLE, STORAGE_KEYS } from "@/utils/constants";

/**
 * Main chat surface.
 *
 * Every message — plain chat, "solve my problem", "find a plumber near
 * me", "call that business" — goes through the SAME single n8n webhook
 * (see useChat/chatService). There is no client-side keyword routing
 * anymore: OpenAI function-calling inside the n8n workflow decides what
 * to do with each message and returns a `type` telling this component
 * how to render it (text / solutions / business_results). The frontend
 * never decides logic, it only displays whatever the backend returns —
 * including playing back backend-generated voice audio, never synthesizing
 * anything itself.
 */
export default function ChatWindow() {
  const { messages, isTyping, sendMessage, chooseSolution } = useChat();
  const [settings] = useLocalStorage(STORAGE_KEYS.SETTINGS, { voiceOutputEnabled: true });
  const { isSpeaking, playAudio, stop } = useVoiceOutput();
  const bottomRef = useRef(null);
  const lastSpokenMessageId = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Play the latest assistant reply's audio, once, when voice reply is on.
  // Nothing is synthesized here — this only plays audio the backend already
  // generated (response.audio). If the backend didn't send audio, nothing plays.
  useEffect(() => {
    if (!settings.voiceOutputEnabled) return;
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== MESSAGE_ROLE.ASSISTANT) return;
    if (lastMessage.id === lastSpokenMessageId.current) return;
    if (!lastMessage.audio) return;

    lastSpokenMessageId.current = lastMessage.id;
    playAudio(lastMessage.audio);
  }, [messages, settings.voiceOutputEnabled, playAudio]);

  const handleSend = async (text, options) => {
    await sendMessage(text, options);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {isEmpty && (
            <div className="flex flex-col items-center gap-5 py-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-900 text-teal-400">
                <Radio className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-ink-900">How can I help you today?</h2>
                <p className="mt-1 text-sm text-ink-600">
                  Ask me anything, or try one of these to get started.
                </p>
              </div>
              <SuggestedPrompts onSelect={(label) => handleSend(label)} />
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} onChooseSolution={chooseSolution} />
          ))}

          {isTyping && (
            <div className="pl-12">
              <Loader label="Thinking" />
            </div>
          )}

          {isSpeaking && (
            <div className="flex items-center gap-2 pl-12 text-xs text-ink-600/60">
              <Volume2 className="h-3.5 w-3.5 animate-pulse text-teal-500" />
              Speaking…
              <button type="button" onClick={stop} className="font-semibold text-teal-600 hover:underline">
                Stop
              </button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <ChatInput onSend={handleSend} isSending={isTyping} />
    </div>
  );
}
