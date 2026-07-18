import { Link } from "react-router-dom";
import Button from "@/components/common/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-muted px-4 text-center">
      <h1 className="text-4xl font-bold text-ink-900">404</h1>
      <p className="text-sm text-ink-600">This page does not exist.</p>
      <Link to="/chat">
        <Button size="sm">Back to Assistant</Button>
      </Link>
    </div>
  );
}
