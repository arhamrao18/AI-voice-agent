/** Three-dot "typing" loader, used for assistant responses and async panels. */
export default function Loader({ label = "Thinking" }) {
  return (
    <div className="flex items-center gap-2 text-sm text-ink-600" role="status" aria-live="polite">
      <span className="flex gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse-dot [animation-delay:-0.32s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse-dot [animation-delay:-0.16s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse-dot" />
      </span>
      <span>{label}…</span>
    </div>
  );
}
