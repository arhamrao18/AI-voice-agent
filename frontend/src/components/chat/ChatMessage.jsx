import { Bot, AlertCircle } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import SolutionCards from "@/components/chat/SolutionCards";
import NearbyBusinessResults from "@/components/business/NearbyBusinessResults";
import { MESSAGE_ROLE, MESSAGE_TYPE } from "@/utils/constants";
import { formatTime } from "@/utils/formatters";
import { useAuth } from "@/hooks/useAuth";

/** Renders a single chat bubble, dispatching on message.type for rich content. */
export default function ChatMessage({ message, onChooseSolution, isChoosingSolution }) {
  const { user } = useAuth();
  const isUser = message.role === MESSAGE_ROLE.USER;

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {isUser ? (
        <Avatar initials={user?.avatarInitials || "U"} size="sm" />
      ) : (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900 text-teal-400">
          <Bot className="h-4 w-4" />
        </span>
      )}

      <div className={`flex max-w-[85%] flex-col gap-1.5 sm:max-w-[70%] ${isUser ? "items-end" : "items-start"}`}>
        {message.type === MESSAGE_TYPE.TEXT && (
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              isUser ? "bg-teal-500 text-white rounded-tr-sm" : "bg-white text-ink-900 shadow-card rounded-tl-sm"
            }`}
          >
            {message.content}
          </div>
        )}

        {message.type === MESSAGE_TYPE.SOLUTIONS && (
          <div className="w-full min-w-[280px] space-y-2 sm:min-w-[520px]">
            <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-sm text-ink-900 shadow-card">
              {message.content}
            </div>
            <SolutionCards
              solutions={message.solutions}
              onChoose={onChooseSolution}
              disabled={isChoosingSolution}
            />
          </div>
        )}

        {message.type === MESSAGE_TYPE.BUSINESS_RESULTS && (
          <div className="w-full min-w-[280px] sm:min-w-[480px]">
            <NearbyBusinessResults
              summary={message.summary}
              results={message.results}
              question={message.question}
              location={message.location}
            />
          </div>
        )}

        {message.type === MESSAGE_TYPE.ERROR && (
          <div className="flex items-center gap-2 rounded-2xl bg-danger-500/10 px-4 py-2.5 text-sm text-danger-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {message.content}
          </div>
        )}

        <span className="px-1 text-[11px] text-ink-600/50">{formatTime(message.createdAt)}</span>
      </div>
    </div>
  );
}
