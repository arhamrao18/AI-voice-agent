import { AlertTriangle } from "lucide-react";

/** Standard inline error banner. The interface's voice: state what happened, offer a next step. */
export default function ErrorMessage({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-danger-500/20 bg-danger-500/5 p-3.5 text-sm text-danger-600">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1">
        <p className="font-medium">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="mt-1.5 font-semibold underline underline-offset-2 hover:text-danger-700">
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
