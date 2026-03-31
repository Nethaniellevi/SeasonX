"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const inputClass = "w-full bg-white border border-[#DDDDDD] rounded-xl px-4 py-3 text-sm text-[#222222] placeholder-[#BBBBBB] outline-none focus:border-[#222222] transition-colors";
const labelClass = "block text-xs font-semibold text-[#717171] mb-2";
const errorClass = "text-xs text-red-500 mt-1";

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
    <div className="rounded-2xl border border-[#DDDDDD] bg-white overflow-hidden shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="p-7 space-y-10">

        {/* Event Details */}
        <div className="space-y-5">
          <div className="pb-2 border-b border-[#DDDDDD]">
            <p className="text-sm font-semibold text-[#222222]">Event details</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Sport *</label>
              <Controller
                name="sport"
                control={control}
                render={({ field }) => (
                  <select value={field.value} onChange={field.onChange} className={inputClass}>
                    {Object.entries(SPORTS_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                )}
              />
            </div>
            <div>
              <label className={labelClass}>Event date & time *</label>
              <input type="datetime-local" {...register("eventDate")} className={inputClass} />
              {errors.eventDate && <p className={errorClass}>{errors.eventDate.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Home team *</label>
              <input placeholder="e.g., Los Angeles Lakers" {...register("homeTeam")} className={inputClass} />
              {errors.homeTeam && <p className={errorClass}>{errors.homeTeam.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Away team *</label>
              <input placeholder="e.g., Golden State Warriors" {...register("awayTeam")} className={inputClass} />
              {errors.awayTeam && <p className={errorClass}>{errors.awayTeam.message}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Venue</label>
            <input placeholder="e.g., Crypto.com Arena" {...register("venue")} className={inputClass} />
          </div>
        </div>

        {/* Seat Information */}
        <div className="space-y-5">
          <div className="pb-2 border-b border-[#DDDDDD]">
            <p className="text-sm font-semibold text-[#222222]">Seat information</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Section *</label>
              <input placeholder="e.g., 114" {...register("section")} className={inputClass} />
              {errors.section && <p className={errorClass}>{errors.section.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Row</label>
              <input placeholder="e.g., 5" {...register("row")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Quantity *</label>
              <input type="number" min={1} max={50} {...register("quantity")} className={inputClass} />
              {errors.quantity && <p className={errorClass}>{errors.quantity.message}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Seat numbers *</label>
            <input placeholder="e.g., 12, 13 (comma separated)" {...register("seats")} className={inputClass} />
            {errors.seats && <p className={errorClass}>{errors.seats.message}</p>}
          </div>
        </div>

        {/* Pricing & Transfer */}
        <div className="space-y-5">
          <div className="pb-2 border-b border-[#DDDDDD]">
            <p className="text-sm font-semibold text-[#222222]">Pricing & transfer</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Price per ticket ($) *</label>
              <input type="number" step="0.01" min={1} placeholder="150.00" {...register("pricePerTicket")} className={inputClass} />
              {errors.pricePerTicket && <p className={errorClass}>{errors.pricePerTicket.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Transfer method *</label>
              <Controller
                name="transferMethod"
                control={control}
                render={({ field }) => (
                  <select value={field.value} onChange={field.onChange} className={inputClass}>
                    {Object.entries(TRANSFER_METHOD_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                )}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Additional notes</label>
            <textarea
              placeholder="Any extra information for buyers..."
              {...register("notes")}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-team-primary hover:bg-team-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-4 rounded-full transition-colors"
        >
          {isSubmitting ? "Publishing..." : "Publish listing"}
        </button>
      </form>
    </div>
  );
}
