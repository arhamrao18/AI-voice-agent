import n8nClient from "@/api/axiosClient";
import env from "@/config/env";

/**
 * Chat service — talks to the SINGLE n8n webhook that wraps OpenAI.
 *
 * Everything (plain chat, "give me 3 solutions", nearby-business search,
 * placing a Twilio call) goes through this one endpoint. The n8n workflow
 * uses OpenAI function-calling to decide what to do with each message —
 * the frontend just forwards the message, conversation history, and the
 * user's current location (if known), and renders whatever comes back.
 *
 * REQUEST  POST {{N8N_BASE_URL}}{{CHAT_PATH}}
 *   {
 *     "message": string,
 *     "history": [{ role: "user"|"assistant", content: string }],
 *     "userId": string,
 *     "requestSolutions": boolean,        // optional hint; OpenAI also auto-detects "I have a problem" style messages
 *     "location": { "latitude": number, "longitude": number } | null
 *   }
 *
 * RESPONSE 200
 *   {
 *     "type": "text" | "solutions" | "business_results",
 *     "reply": string,                    // always present — spoken/displayed text
 *     "audio": string,                    // optional — base64 mp3 from OpenAI TTS
 *     "solutions": [                      // present when type === "solutions"
 *       { "id": string, "title": string, "description": string, "steps": string[] }
 *     ],
 *     "businesses": [                     // present when type === "business_results"
 *       { "name": string, "phoneNumber": string, "address": string, "rating": number }
 *     ]
 *   }
 */
export async function sendChatMessage({ message, history = [], userId, requestSolutions = false, location = null }) {
  const { data } = await n8nClient.post(env.n8n.chatPath, {
    message,
    history,
    userId,
    requestSolutions,
    location,
  });
  return data;
}

/**
 * Explicit helper for "solve my problem" style requests, always asking
 * the backend/OpenAI for exactly three distinct solutions.
 */
export async function requestThreeSolutions({ message, history = [], userId, location = null }) {
  return sendChatMessage({ message, history, userId, requestSolutions: true, location });
}

/**
 * Continue the conversation after the user picks one of the three
 * generated solutions, so the assistant can go deeper on that path.
 */
export async function continueWithChosenSolution({ solution, history = [], userId, location = null }) {
  const { data } = await n8nClient.post(env.n8n.chatPath, {
    message: `I choose this solution: "${solution.title}". Please continue helping me with it.`,
    history,
    userId,
    chosenSolution: solution,
    requestSolutions: false,
    location,
  });
  return data;
}
