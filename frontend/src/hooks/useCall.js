import { useMutation } from "@tanstack/react-query";
import { initiateCall } from "@/api/callService";
import { logAssistantActivity } from "@/api/sheetsService";
import { CALL_STATUS } from "@/utils/constants";

/**
 * Handles the "Call" button flow:
 *   1. POST to n8n -> n8n calls Twilio -> Twilio dials the business and
 *      bridges it to the user's own phone number (AI does not speak).
 *   2. Regardless of outcome, log the attempt to Google Sheets
 *      (with localStorage fallback) for audit/history purposes.
 */
export function useCall() {
  const mutation = useMutation({
    mutationFn: async ({ userPhoneNumber, business, question, location, userId }) => {
      let callResult;
      let status = CALL_STATUS.FAILED;
      try {
        callResult = await initiateCall({
          userPhoneNumber,
          businessPhoneNumber: business.phoneNumber,
          businessName: business.name,
          userId,
          context: { question, location },
        });
        status = callResult.status === "failed" ? CALL_STATUS.FAILED : CALL_STATUS.DIALING;
      } finally {
        await logAssistantActivity({
          userQuestion: question,
          businessName: business.name,
          phoneNumber: business.phoneNumber,
          time: new Date().toISOString(),
          location,
          status,
        });
      }
      return callResult;
    },
  });

  return {
    placeCall: mutation.mutateAsync,
    isCalling: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
