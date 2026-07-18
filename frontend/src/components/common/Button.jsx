import { forwardRef } from "react";

/**
 * Reusable button with a small set of intentional variants/sizes.
 * Keeping variants centralised avoids ad-hoc Tailwind class soup
 * scattered across feature components.
 */
const VARIANTS = {
  primary: "bg-teal-500 text-white hover:bg-teal-600 focus-visible:outline-teal-600 shadow-card",
  signal: "bg-signal-500 text-white hover:bg-signal-600 focus-visible:outline-signal-600 shadow-card",
  secondary: "bg-ink-900 text-white hover:bg-ink-800 focus-visible:outline-ink-800",
  ghost: "bg-transparent text-ink-700 hover:bg-surface-sunken focus-visible:outline-ink-600",
  outline: "bg-white text-ink-900 border border-ink-900/10 hover:bg-surface-muted focus-visible:outline-ink-600",
  danger: "bg-danger-500 text-white hover:bg-danger-600 focus-visible:outline-danger-600",
};

const SIZES = {
  sm: "text-sm px-3 py-1.5 rounded-lg gap-1.5",
  md: "text-sm px-4 py-2.5 rounded-xl gap-2",
  lg: "text-base px-5 py-3 rounded-xl gap-2",
  icon: "p-2.5 rounded-full",
};

const Button = forwardRef(function Button(
  { variant = "primary", size = "md", isLoading = false, disabled = false, className = "", children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-semibold transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          <span>Working…</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
});

export default Button;
