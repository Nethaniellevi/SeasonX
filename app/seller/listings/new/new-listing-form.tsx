"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { createListing } from "@/app/actions/seller-actions";
import { SPORTS_LABELS, TRANSFER_METHOD_LABELS } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

const schema = z.object({
  sport: z.enum(["NFL", "NBA", "MLB", "NHL", "MLS", "COLLEGE_FOOTBALL", "COLLEGE_BASKETBALL", "OTHER"]),
  homeTeam: z.string().min(2, "Home team required"),
  awayTeam: z.string().min(2, "Away team required"),
  venue: z.string().optional(),
  eventDate: z.string().min(1, "Event date required"),
  section: z.string().min(1, "Section required"),
  row: z.string().optional(),
  seats: z.string().min(1, "Enter seat numbers (comma separated)"),
  quantity: z.coerce.number().int().min(1).max(50),
  pricePerTicket: z.coerce.number().min(1, "Price required"),
  transferMethod: z.enum(["UPLOAD", "MOBILE_TRANSFER", "WILL_CALL", "FLASH_SEATS", "OTHER"]),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function NewListingForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      sport: "NFL",
      transferMethod: "UPLOAD",
      quantity: 2,
    },
  });

  async function onSubmit(data: FormData) {
    setError(null);
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) formData.set(k, String(v));
    });

    const result = await createListing(formData);
    if (result.error) {
      setError(result.error);
    } else if (result.listingId) {
      router.push(`/listings/${result.listingId}?created=1`);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Event details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Event Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="sport">Sport *</Label>
                <Controller
                  name="sport"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(SPORTS_LABELS).map(([v, l]) => (
                          <SelectItem key={v} value={v}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="eventDate">Event Date & Time *</Label>
                <Input id="eventDate" type="datetime-local" {...register("eventDate")} />
                {errors.eventDate && <p className="text-xs text-red-600">{errors.eventDate.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="homeTeam">Home Team *</Label>
                <Input id="homeTeam" placeholder="e.g., Los Angeles Lakers" {...register("homeTeam")} />
                {errors.homeTeam && <p className="text-xs text-red-600">{errors.homeTeam.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="awayTeam">Away Team *</Label>
                <Input id="awayTeam" placeholder="e.g., Golden State Warriors" {...register("awayTeam")} />
                {errors.awayTeam && <p className="text-xs text-red-600">{errors.awayTeam.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="venue">Venue</Label>
              <Input id="venue" placeholder="e.g., Crypto.com Arena" {...register("venue")} />
            </div>
          </div>

          {/* Seat info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Seat Information</h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="section">Section *</Label>
                <Input id="section" placeholder="e.g., 114" {...register("section")} />
                {errors.section && <p className="text-xs text-red-600">{errors.section.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="row">Row</Label>
                <Input id="row" placeholder="e.g., 5" {...register("row")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input id="quantity" type="number" min={1} max={50} {...register("quantity")} />
                {errors.quantity && <p className="text-xs text-red-600">{errors.quantity.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="seats">Seat Numbers *</Label>
              <Input id="seats" placeholder="e.g., 12, 13 (comma separated)" {...register("seats")} />
              {errors.seats && <p className="text-xs text-red-600">{errors.seats.message}</p>}
            </div>
          </div>

          {/* Pricing & Transfer */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Pricing & Transfer</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="pricePerTicket">Price Per Ticket ($) *</Label>
                <Input id="pricePerTicket" type="number" step="0.01" min={1} placeholder="150.00" {...register("pricePerTicket")} />
                {errors.pricePerTicket && <p className="text-xs text-red-600">{errors.pricePerTicket.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Transfer Method *</Label>
                <Controller
                  name="transferMethod"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(TRANSFER_METHOD_LABELS).map(([v, l]) => (
                          <SelectItem key={v} value={v}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea id="notes" placeholder="Any extra information for buyers..." {...register("notes")} rows={3} />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-sm text-red-700 dark:text-red-300">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
            Publish Listing
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
