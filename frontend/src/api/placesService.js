import n8nClient from "@/api/axiosClient";
import env from "@/config/env";

/**
 * Places service -- sends the user coordinates + intent to n8n, which:
 *   1. Calls Google Places API (Nearby Search) for the given business type.
 *   2. Passes the raw results to Gemini for a short, friendly summary.
 *   3. Returns a normalised list the UI can render directly.
 *
 * REQUEST  POST {{N8N_BASE_URL}}{{NEARBY_BUSINESS_PATH}}
 *   {
 *     "latitude": number,
 *     "longitude": number,
 *     "intent": "electrician" | "plumber" | "hospital" | "restaurant" | string,
 *     "query": string,        // original free-text user query, for Gemini context
 *     "userId": string
 *   }
 *
 * RESPONSE 200
 *   {
 *     "summary": string,                 // Gemini short natural-language summary
 *     "results": [
 *       {
 *         "placeId": string,
 *         "name": string,
 *         "rating": number | null,
 *         "userRatingsTotal": number | null,
 *         "distanceMeters": number,
 *         "address": string,
 *         "phoneNumber": string | null,
 *         "isOpenNow": boolean | null
 *       }
 *     ]
 *   }
 */
export async function findNearbyBusinesses({ latitude, longitude, intent, query, userId }) {
  const { data } = await n8nClient.post(env.n8n.paths.nearbyBusiness, {
    latitude,
    longitude,
    intent,
    query,
    userId,
  });
  return data;
}
