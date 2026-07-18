import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";
import AppRoutes from "@/routes/AppRoutes";

// One QueryClient for the whole app; sane defaults for a chat-like UI
// where we generally want fresh data and no surprise background retries
// hammering the n8n webhooks.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ChatProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
