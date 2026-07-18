/** Generic elevated surface used throughout the app for grouped content. */
export default function Card({ children, className = "", as: Component = "div", ...props }) {
  return (
    <Component
      className={`rounded-2xl border border-ink-900/5 bg-white shadow-card ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
