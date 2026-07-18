import { Star, MapPin, Phone, PhoneCall } from "lucide-react";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import { formatDistance } from "@/utils/formatters";

/**
 * Displays a single nearby-business result: name, rating, distance,
 * phone number, and a Call button that hands off to the Twilio flow.
 */
export default function BusinessCard({ business, onCall, isCalling }) {
  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-ink-900">{business.name}</h4>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-600">
            <MapPin className="h-3 w-3" />
            {business.address}
          </p>
        </div>
        {business.isOpenNow != null && (
          <Badge tone={business.isOpenNow ? "success" : "danger"}>
            {business.isOpenNow ? "Open now" : "Closed"}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-ink-700">
        {business.rating != null && (
          <span className="flex items-center gap-1 font-medium">
            <Star className="h-3.5 w-3.5 fill-signal-500 text-signal-500" />
            {business.rating.toFixed(1)}
            {business.userRatingsTotal != null && (
              <span className="text-ink-600/60">({business.userRatingsTotal})</span>
            )}
          </span>
        )}
        <span>{formatDistance(business.distanceMeters)} away</span>
      </div>

      <div className="flex items-center justify-between border-t border-ink-900/5 pt-3">
        <span className="flex items-center gap-1.5 text-xs font-medium text-ink-700">
          <Phone className="h-3.5 w-3.5" />
          {business.phoneNumber || "No number on file"}
        </span>
        <Button
          variant="signal"
          size="sm"
          disabled={!business.phoneNumber}
          isLoading={isCalling}
          onClick={() => onCall(business)}
        >
          <PhoneCall className="h-3.5 w-3.5" />
          Call
        </Button>
      </div>
    </Card>
  );
}
