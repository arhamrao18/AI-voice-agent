/** Small circular avatar rendering initials (no external image dependency). */
export default function Avatar({ initials = "?", size = "md", className = "" }) {
  const sizes = { sm: "h-7 w-7 text-xs", md: "h-9 w-9 text-sm", lg: "h-12 w-12 text-base" };
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600 font-semibold text-white ${sizes[size]} ${className}`}
    >
      {initials}
    </div>
  );
}
