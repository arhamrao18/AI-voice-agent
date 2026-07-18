import { useState } from "react";
import BusinessList from "@/components/business/BusinessList";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useCall } from "@/hooks/useCall";
import { useAuth } from "@/hooks/useAuth";

/**
 * Connects a business-results chat message to the calling pipeline.
 * `question` and `location` are carried through for the Google Sheets log.
 */
export default function NearbyBusinessResults({ summary, results, question, location }) {
  const { user } = useAuth();
  const { placeCall, isCalling, error } = useCall();
  const [callingBusinessId, setCallingBusinessId] = useState(null);
  const [lastCallStatus, setLastCallStatus] = useState(null);

  const handleCall = async (business) => {
    setCallingBusinessId(business.placeId);
    setLastCallStatus(null);
    try {
      const result = await placeCall({
        userPhoneNumber: user?.phoneNumber,
        business,
        question,
        location,
        userId: user?.id,
      });
      setLastCallStatus({ business: business.name, status: result?.status || "dialing" });
    } catch {
      // error surfaced via `error` from useCall
    } finally {
      setCallingBusinessId(null);
    }
  };

  return (
    <div className="space-y-3">
      <BusinessList
        summary={summary}
        results={results}
        onCall={handleCall}
        callingBusinessId={isCalling ? callingBusinessId : null}
      />
      {error && <ErrorMessage message={error.message || "Could not place the call."} />}
      {lastCallStatus && (
        <p className="text-xs font-medium text-teal-700">
          Connecting you with {lastCallStatus.business}… ({lastCallStatus.status})
        </p>
      )}
    </div>
  );
}
