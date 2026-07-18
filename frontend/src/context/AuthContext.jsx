import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import * as authService from "@/api/authService";

export const AuthContext = createContext(null);

/**
 * Provides authentication state to the whole app. Deliberately thin --
 * all the actual logic lives in `authService`, this just wires it to
 * React state and exposes a stable API via `useAuth`.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Re-hydrate on mount in case storage changed in another tab.
    setUser(authService.getCurrentUser());
  }, []);

  const signIn = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: loggedInUser } = await authService.login(credentials);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      setError(err.message || "Unable to sign in.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
    return updated;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      signIn,
      signOut,
      updateProfile,
    }),
    [user, isLoading, error, signIn, signOut, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
