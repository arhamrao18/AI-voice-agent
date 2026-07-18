import { useEffect, useRef } from "react";
import { Radio, Volume2 } from "lucide-react";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import SuggestedPrompts from "@/components/chat/SuggestedPrompts";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useChat } from "@/hooks/useChat";
import { useNearbyBusiness } from "@/hooks/useNearbyBusiness";
import { useAuth } from "@/hooks/useAuth";
import { useVoiceOutput } from "@/hooks/useVoiceOutput";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { detectNearbyBusinessIntent } from "@/utils/intent";
import { MESSAGE_TYPE, MESSAGE_ROLE, STORAGE_KEYS } from "@/utils/constants";

/**
 * Main chat surface. Every submitted message is first checked for a
 * "nearby business" intent (electrician, plumber, hospital, restaurant,
 * ...); if matched, it is routed through the geolocation -> Places ->
 * Gemini-summary pipeline instead of plain chat, per the product spec.
 */
export default function ChatWindow() {
  const { user } = useAuth();
  const { messages, isTyping, sendMessage, chooseSolution, pushMessage } = useChat();
  const { search, isSearching, geolocationStatus } = useNearbyBusiness({ userId: user?.id });
  const [settings] = useLocalStorage(STORAGE_KEYS.SETTINGS, { voiceOutputEnabled: true });
  const { isSupported: isVoiceOutputSupported, isSpeaking, speak, stop } = useVoiceOutput();
  const bottomRef = useRef(null);
  const locationErrorHandled = useRef(false);
  const lastSpokenMessageId = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isSearching]);

  // Speak the latest assistant reply out loud, once, when voice reply is on.
  useEffect(() => {
    if (!settings.voiceOutputEnabled || !isVoiceOutputSupported) return;
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== MESSAGE_ROLE.ASSISTANT) return;
    if (lastMessage.id === lastSpokenMessageId.current) return;

    const textToSpeak =
      lastMessage.type === MESSAGE_TYPE.TEXT || lastMessage.type === MESSAGE_TYPE.SOLUTIONS
        ? lastMessage.content
        : lastMessage.type === MESSAGE_TYPE.BUSINESS_RESULTS
        ? lastMessage.summary
        : null;

    if (textToSpeak) {
      lastSpokenMessageId.current = lastMessage.id;
      speak(textToSpeak);
    }
  }, [messages, settings.voiceOutputEnabled, isVoiceOutputSupported, speak]);

  const handleSend = async (text, { wantsSolutions } = {}) => {
    const intent = detectNearbyBusinessIntent(text);

    if (intent) {
      locationErrorHandled.current = false;
      pushMessage({ role: "user", type: MESSAGE_TYPE.TEXT, content: text }, text);
      try {
        const result = await search(intent, text);
        pushMessage({
          role: "assistant",
          type: MESSAGE_TYPE.BUSINESS_RESULTS,
          content: result.summary,
          summary: result.summary,
          results: result.results,
          question: text,
          location: null,
        });
      } catch (error) {
        if (!locationErrorHandled.current) {
          locationErrorHandled.current = true;
          pushMessage({
            role: "assistant",
            type: MESSAGE_TYPE.ERROR,
            content:
              error?.code === error?.PERMISSION_DENIED || error?.message?.includes("denied")
                ? "Location access was denied, so nearby results could not be found. Enable location access and try again."
                : error.message || "Could not find nearby businesses right now.",
          });
        }
      }
      return;
    }

    await sendMessage(text, { wantsSolutions });
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

          {(isTyping || isSearching) && (
            <div className="pl-12">
              <Loader label={isSearching ? "Searching nearby" : "Thinking"} />
              {isSearching && geolocationStatus === "requesting" && (
                <p className="mt-1 text-xs text-ink-600/60">Requesting your location…</p>
              )}
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

      <ChatInput onSend={handleSend} isSending={isTyping || isSearching} />
    </div>
  );
}
