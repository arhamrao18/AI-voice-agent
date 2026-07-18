import BusinessCard from "@/components/business/BusinessCard";

/** Renders the summary + grid of BusinessCards returned by the nearby-business pipeline. */
export default function BusinessList({ summary, results, onCall, callingBusinessId }) {
  if (!results || results.length === 0) {
    return <p className="text-sm text-ink-600">No matching businesses were found nearby.</p>;
  }

  return (
    <div className="space-y-3">
      {summary && <p className="text-sm text-ink-700">{summary}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        {results.map((business) => (
          <BusinessCard
            key={business.placeId}
            business={business}
            onCall={onCall}
            isCalling={callingBusinessId === business.placeId}
          />
        ))}
      </div>
    </div>
  );
}
