import { useCallback, useState } from "react";

/**
 * Wraps the browser Geolocation API in a promise-friendly hook.
 * Used by the "Nearby Business" feature to request lat/lng before
 * calling the n8n webhook, per the spec:
 *   "React must request browser geolocation. After permission: send
 *    latitude and longitude to n8n webhook."
 */
export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | requesting | granted | denied | error
  const [error, setError] = useState(null);

  const requestLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        const err = new Error("Geolocation is not supported by this browser.");
        setStatus("error");
        setError(err.message);
        reject(err);
        return;
      }

      setStatus("requesting");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setCoords(location);
          setStatus("granted");
          setError(null);
          resolve(location);
        },
        (geoError) => {
          setStatus(geoError.code === geoError.PERMISSION_DENIED ? "denied" : "error");
          setError(geoError.message || "Unable to determine your location.");
          reject(geoError);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }, []);

  return { coords, status, error, requestLocation };
}
