/** Small status/label pill used for ratings, open/closed status, call status, etc. */
export default function Badge({ children, tone = "neutral", className = "" }) {
  const tones = {
    neutral: "bg-surface-sunken text-ink-700",
    success: "bg-teal-50 text-teal-700",
    warning: "bg-signal-50 text-signal-600",
    danger: "bg-danger-500/10 text-danger-600",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
