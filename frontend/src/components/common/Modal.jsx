import { X } from "lucide-react";
import { useEffect } from "react";

/** Minimal accessible modal used for confirmations (e.g. delete chat, sign out). */
export default function Modal({ isOpen, onClose, title, children, footer }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-panel animate-slide-up"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-ink-600 hover:bg-surface-muted"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="text-sm text-ink-700">{children}</div>
        {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
