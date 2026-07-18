import n8nClient from "@/api/axiosClient";
import env from "@/config/env";

/**
 * Call service -- triggers an n8n workflow that uses the Twilio Voice API
 * to dial the selected business and bridge the call to the user's phone.
 *
 * IMPORTANT: The AI never speaks on this call. n8n instructs Twilio to
 * simply connect two numbers (user <-> business). See
 * n8n-workflows/twilio-call-workflow.json for the exact <Dial> TwiML used.
 *
 * REQUEST  POST {{N8N_BASE_URL}}{{CALL_PATH}}
 *   {
 *     "userPhoneNumber": string,     // E.164 format, e.g. "+15551234567"
 *     "businessPhoneNumber": string, // E.164 format
 *     "businessName": string,
 *     "userId": string,
 *     "context": {                   // for the Google Sheets log entry
 *       "question": string,
 *       "location": { "latitude": number, "longitude": number }
 *     }
 *   }
 *
 * RESPONSE 200
 *   {
 *     "callSid": string,
 *     "status": "queued" | "dialing" | "in-progress" | "failed",
 *     "message": string
 *   }
 */
export async function initiateCall({ userPhoneNumber, businessPhoneNumber, businessName, userId, context }) {
  const { data } = await n8nClient.post(env.n8n.paths.call, {
    userPhoneNumber,
    businessPhoneNumber,
    businessName,
    userId,
    context,
  });
  return data;
}
