import { useState } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import { useAuth } from "@/hooks/useAuth";

/**
 * Editable profile fields. `phoneNumber` matters functionally: it is the
 * number Twilio bridges business calls to, so we surface that clearly.
 */
export default function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phoneNumber: user?.phoneNumber || "",
  });
  const [status, setStatus] = useState("idle"); // idle | saving | saved

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("saving");
    await updateProfile(form);
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 1800);
  };

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-semibold text-ink-900">Edit profile</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input id="name" label="Full name" value={form.name} onChange={handleChange("name")} placeholder="Jordan Rivera" />
        <Input
          id="phoneNumber"
          label="Your phone number"
          value={form.phoneNumber}
          onChange={handleChange("phoneNumber")}
          placeholder="+1 555 123 4567"
        />
        <p className="text-xs text-ink-600/70">
          Used to bridge calls when you tap Call on a nearby business. Use E.164 format, e.g. +15551234567.
        </p>
        <Button type="submit" isLoading={status === "saving"}>
          {status === "saved" ? "Saved" : "Save changes"}
        </Button>
      </form>
    </Card>
  );
}
