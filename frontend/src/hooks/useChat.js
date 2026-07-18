import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendChatMessage, requestThreeSolutions, continueWithChosenSolution } from "@/api/chatService";
import { useChatHistory } from "@/hooks/useChatHistory";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";
import { MESSAGE_ROLE, MESSAGE_TYPE } from "@/utils/constants";
import { generateId } from "@/utils/formatters";

/**
 * Core chat orchestration hook used by <ChatPage>.
 *
 * Responsibilities:
 *  - Persist every user/assistant message into the active chat session
 *    (via ChatContext) so "Chat History" works out of the box.
 *  - Talk to the Gemini-backed n8n webhook through `chatService`.
 *  - Detect "solve my problem" style requests and surface exactly three
 *    solution cards, keeping the conversation going once one is chosen.
 */
export function useChat() {
  const { user } = useAuth();
  const { activeSession, activeSessionId, createSession, appendMessage } = useChatHistory();
  const { coords, requestLocation } = useGeolocation();
  const [isTyping, setIsTyping] = useState(false);

  /**
   * Best-effort location for the current message. We never block sending a
   * message on this — if permission was denied or geolocation fails, we
   * just send `location: null` and let the backend fall back to plain
   * chat / ask the user for a city instead of a hard error.
   */
  const resolveLocation = useCallback(async () => {
    if (coords) return { latitude: coords.latitude, longitude: coords.longitude };
    try {
      const loc = await requestLocation();
      return { latitude: loc.latitude, longitude: loc.longitude };
    } catch {
      return null;
    }
  }, [coords, requestLocation]);

  const ensureSession = useCallback(
    (seedText) => {
      if (activeSessionId) return activeSessionId;
      const created = createSession(seedText);
      return created.id;
    },
    [activeSessionId, createSession]
  );

  const historyForApi = useCallback(() => {
    return (activeSession?.messages ?? [])
      .filter((m) => m.type === MESSAGE_TYPE.TEXT)
      .map((m) => ({ role: m.role, content: m.content }));
  }, [activeSession]);

  const sendMutation = useMutation({
    mutationFn: async ({ text, requestSolutions, location }) => {
      if (requestSolutions) {
        return requestThreeSolutions({ message: text, history: historyForApi(), userId: user?.id, location });
      }
      return sendChatMessage({ message: text, history: historyForApi(), userId: user?.id, requestSolutions: false, location });
    },
  });

  const chooseSolutionMutation = useMutation({
    mutationFn: async ({ solution, location }) =>
      continueWithChosenSolution({ solution, history: historyForApi(), userId: user?.id, location }),
  });

  /** Send a free-text message. Pass `wantsSolutions` for "solve my problem" flows. */
  const sendMessage = useCallback(
    async (text, { wantsSolutions = false } = {}) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const sessionId = ensureSession(trimmed);
      appendMessage(sessionId, {
        id: generateId("msg"),
        role: MESSAGE_ROLE.USER,
        type: MESSAGE_TYPE.TEXT,
        content: trimmed,
        createdAt: new Date().toISOString(),
      });

      setIsTyping(true);
      try {
        const location = await resolveLocation();
        const response = await sendMutation.mutateAsync({ text: trimmed, requestSolutions: wantsSolutions, location });

        if (response.type === "solutions" && Array.isArray(response.solutions)) {
          appendMessage(sessionId, {
            id: generateId("msg"),
            role: MESSAGE_ROLE.ASSISTANT,
            type: MESSAGE_TYPE.SOLUTIONS,
            solutions: response.solutions.slice(0, 3),
            content: response.reply ?? "Here are three ways to solve this:",
            audio: response.audio ?? null,
            createdAt: new Date().toISOString(),
          });
        } else if (response.type === "business_results" && Array.isArray(response.businesses)) {
          appendMessage(sessionId, {
            id: generateId("msg"),
            role: MESSAGE_ROLE.ASSISTANT,
            type: MESSAGE_TYPE.BUSINESS_RESULTS,
            content: response.reply ?? "Here is what I found nearby:",
            summary: response.reply,
            results: response.businesses,
            audio: response.audio ?? null,
            createdAt: new Date().toISOString(),
          });
        } else {
          appendMessage(sessionId, {
            id: generateId("msg"),
            role: MESSAGE_ROLE.ASSISTANT,
            type: MESSAGE_TYPE.TEXT,
            content: response.reply ?? "I was unable to generate a response.",
            audio: response.audio ?? null,
            createdAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        appendMessage(sessionId, {
          id: generateId("msg"),
          role: MESSAGE_ROLE.ASSISTANT,
          type: MESSAGE_TYPE.ERROR,
          content: error.message || "Something went wrong. Please try again.",
          createdAt: new Date().toISOString(),
        });
      } finally {
        setIsTyping(false);
      }
    },
    [ensureSession, appendMessage, sendMutation, resolveLocation]
  );

  /** Called when the user taps one of the three generated solution cards. */
  const chooseSolution = useCallback(
    async (solution) => {
      const sessionId = ensureSession(solution.title);
      appendMessage(sessionId, {
        id: generateId("msg"),
        role: MESSAGE_ROLE.USER,
        type: MESSAGE_TYPE.TEXT,
        content: `Let us go with: ${solution.title}`,
        createdAt: new Date().toISOString(),
      });

      setIsTyping(true);
      try {
        const location = await resolveLocation();
        const response = await chooseSolutionMutation.mutateAsync({ solution, location });
        appendMessage(sessionId, {
          id: generateId("msg"),
          role: MESSAGE_ROLE.ASSISTANT,
          type: MESSAGE_TYPE.TEXT,
          content: response.reply ?? `Great choice. Let us continue with "${solution.title}".`,
          audio: response.audio ?? null,
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        appendMessage(sessionId, {
          id: generateId("msg"),
          role: MESSAGE_ROLE.ASSISTANT,
          type: MESSAGE_TYPE.ERROR,
          content: error.message || "Something went wrong continuing this solution.",
          createdAt: new Date().toISOString(),
        });
      } finally {
        setIsTyping(false);
      }
    },
    [ensureSession, appendMessage, chooseSolutionMutation, resolveLocation]
  );

  /** Push an arbitrary pre-built message (e.g. business results) into the active session. */
  const pushMessage = useCallback(
    (message, seedText) => {
      const sessionId = ensureSession(seedText ?? message.content ?? "New conversation");
      appendMessage(sessionId, { id: generateId("msg"), createdAt: new Date().toISOString(), ...message });
      return sessionId;
    },
    [ensureSession, appendMessage]
  );

  return {
    messages: activeSession?.messages ?? [],
    isTyping,
    sendMessage,
    chooseSolution,
    pushMessage,
  };
}
