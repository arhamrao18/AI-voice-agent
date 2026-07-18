import { useMutation } from "@tanstack/react-query";
import { findNearbyBusinesses } from "@/api/placesService";
import { useGeolocation } from "@/hooks/useGeolocation";

/**
 * Orchestrates the "Nearby Business" feature end-to-end:
 *   1. Ask the browser for geolocation permission + coordinates.
 *   2. Send coordinates + intent to the n8n webhook.
 *   3. n8n calls Google Places, Gemini summarises -> results come back.
 *
 * Exposes a single `search(intent, query)` entry point plus granular
 * status so the UI can show "Requesting location..." vs "Searching...".
 */
export function useNearbyBusiness({ userId } = {}) {
  const geolocation = useGeolocation();

  const mutation = useMutation({
    mutationFn: async ({ intent, query }) => {
      const coords = await geolocation.requestLocation();
      return findNearbyBusinesses({
        latitude: coords.latitude,
        longitude: coords.longitude,
        intent,
        query,
        userId,
      });
    },
  });

  return {
    search: (intent, query) => mutation.mutateAsync({ intent, query }),
    data: mutation.data,
    isSearching: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    geolocationStatus: geolocation.status,
    reset: mutation.reset,
  };
}
