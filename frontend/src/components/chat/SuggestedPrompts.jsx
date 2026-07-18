import * as Icons from "lucide-react";
import { SUGGESTED_PROMPTS } from "@/utils/constants";

/** Horizontally-wrapping chips shown when a conversation is empty. */
export default function SuggestedPrompts({ onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {SUGGESTED_PROMPTS.map((prompt) => {
        const Icon = Icons[prompt.icon] || Icons.Sparkles;
        return (
          <button
            key={prompt.id}
            onClick={() => onSelect(prompt.label)}
            className="flex items-center gap-2 rounded-full border border-ink-900/10 bg-white px-4 py-2 text-sm font-medium text-ink-700 shadow-card transition-colors hover:border-teal-500/40 hover:text-teal-700"
          >
            <Icon className="h-3.5 w-3.5 text-teal-500" />
            {prompt.label}
          </button>
        );
      })}
    </div>
  );
}
