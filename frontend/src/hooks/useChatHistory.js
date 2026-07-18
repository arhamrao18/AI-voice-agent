import { useContext } from "react";
import { ChatContext } from "@/context/ChatContext";

/** Access chat session history (list, create, delete, rename, append). */
export function useChatHistory() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatHistory must be used within a ChatProvider");
  return ctx;
}
