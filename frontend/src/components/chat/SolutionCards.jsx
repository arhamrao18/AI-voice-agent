import { CheckCircle2, ArrowRight } from "lucide-react";
import Card from "@/components/common/Card";

/**
 * Renders exactly three AI-generated solutions as selectable cards.
 * Selecting one calls `onChoose(solution)` which continues the
 * conversation down that specific path (see useChat.chooseSolution).
 */
export default function SolutionCards({ solutions, onChoose, disabled }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {solutions.slice(0, 3).map((solution, index) => (
        <Card key={solution.id || index} className="flex flex-col p-4 transition-shadow hover:shadow-panel">
          <div className="mb-2 flex items-center gap-2 text-teal-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Option {index + 1}</span>
          </div>
          <h4 className="mb-1.5 text-sm font-semibold text-ink-900">{solution.title}</h4>
          <p className="mb-3 flex-1 text-sm text-ink-600">{solution.description}</p>
          {Array.isArray(solution.steps) && solution.steps.length > 0 && (
            <ul className="mb-3 space-y-1 text-xs text-ink-600">
              {solution.steps.slice(0, 3).map((step, i) => (
                <li key={i} className="flex gap-1.5">
                  <span className="text-teal-500">•</span>
                  {step}
                </li>
              ))}
            </ul>
          )}
          <button
            disabled={disabled}
            onClick={() => onChoose(solution)}
            className="mt-auto flex items-center justify-center gap-1.5 rounded-lg bg-ink-900 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-600 disabled:opacity-50"
          >
            Choose this
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </Card>
      ))}
    </div>
  );
}
