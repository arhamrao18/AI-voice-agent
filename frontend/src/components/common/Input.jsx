import { forwardRef } from "react";

/** Reusable text input with label + error slot, used across auth/settings forms. */
const Input = forwardRef(function Input({ label, error, id, className = "", ...props }, ref) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/50
          focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-colors
          ${error ? "border-danger-500" : "border-ink-900/10"} ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-danger-500">{error}</p>}
    </div>
  );
});

export default Input;
