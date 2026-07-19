import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import storage from "@/utils/storage";
import { STORAGE_KEYS } from "@/utils/constants";
import { generateId } from "@/utils/formatters";

export const ChatContext = createContext(null);

/**
 * Owns chat SESSIONS (the "Chat History" feature) and the currently
 * active session id. Individual message send/receive logic lives in
 * `useChat`; this context is purely about which conversations exist
 * and persisting them to localStorage (swap-ready for a Django/Sheets
 * backed history endpoint later).
 */
export function ChatProvider({ children }) {
  const [sessions, setSessions] = useState(() => storage.get(STORAGE_KEYS.CHAT_SESSIONS, []));
  const [activeSessionId, setActiveSessionId] = useState(() => sessions[0]?.id ?? null);

  // Persist sessions to localStorage, but strip the (potentially large)
  // base64 `audio` field from each message first. Audio is only needed for
  // immediate playback right after a reply arrives — keeping it around in
  // localStorage has no purpose and was blowing past the ~5-10MB browser
  // storage quota after just a few voice replies, silently breaking ALL
  // persistence (not just audio) once the quota was hit.
  useEffect(() => {
    const sessionsForStorage = sessions.map((session) => ({
      ...session,
      messages: session.messages.map(({ audio, ...rest }) => rest),
    }));
    storage.set(STORAGE_KEYS.CHAT_SESSIONS, sessionsForStorage);
  }, [sessions]);

  const createSession = useCallback((firstMessageText = "New conversation") => {
    const newSession = {
      id: generateId("session"),
      title: firstMessageText.slice(0, 40) || "New conversation",
      createdAt: new Date().toISOString(),
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    return newSession;
  }, []);

  const deleteSession = useCallback(
    (sessionId) => {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) setActiveSessionId(null);
    },
    [activeSessionId]
  );

  const renameSession = useCallback((sessionId, title) => {
    setSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, title } : s)));
  }, []);

  const appendMessage = useCallback((sessionId, message) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              messages: [...s.messages, message],
              title: s.messages.length === 0 && message.role === "user" ? message.content.slice(0, 40) : s.title,
            }
          : s
      )
    );
  }, []);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) ?? null,
    [sessions, activeSessionId]
  );

  const value = useMemo(
    () => ({
      sessions,
      activeSession,
      activeSessionId,
      setActiveSessionId,
      createSession,
      deleteSession,
      renameSession,
      appendMessage,
    }),
    [sessions, activeSession, activeSessionId, createSession, deleteSession, renameSession, appendMessage]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
