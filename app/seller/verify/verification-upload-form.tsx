"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { submitVerificationApplication } from "@/app/actions/seller-actions";

const schema = z.object({
  description: z.string().min(20, "Please provide at least 20 characters describing your season tickets"),
  ticketAccountId: z.string().min(2, "Please provide your ticket account ID"),
});

type FormData = z.infer<typeof schema>;

interface UploadedFile {
  name: string;
  type: string;
  dataUrl: string;
  docType: string;
}

interface Props {
  existingProfileId?: string;
}

const inputClass = "w-full bg-white border border-[#DDDDDD] rounded-xl px-4 py-3 text-sm text-[#222222] placeholder-[#BBBBBB] outline-none focus:border-[#222222] transition-colors";
const labelClass = "block text-xs font-semibold text-[#717171] mb-2";

export function VerificationUploadForm({ existingProfileId }: Props) {
  const router = useRouter();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, docType: string) {
    const selected = Array.from(e.target.files ?? []);
    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setFiles((prev) => [
          ...prev,
          { name: file.name, type: file.type, dataUrl: reader.result as string, docType },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(data: FormData) {
    if (files.length === 0) {
      setError("Please upload at least one document.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("description", data.description);
      formData.set("ticketAccountId", data.ticketAccountId);
      formData.set("filesJson", JSON.stringify(files));
      if (existingProfileId) formData.set("existingProfileId", existingProfileId);

      const result = await submitVerificationApplication(formData);
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const DOC_TYPES = [
    { value: "invoice", label: "Invoice / Receipt" },
    { value: "account_screenshot", label: "Account Screenshot" },
    { value: "ticket_account_id", label: "Ticket Account ID" },
    { value: "other", label: "Other Document" },
  ];

  return (
    <div className="rounded-2xl border border-[#DDDDDD] bg-white p-7">
      <h2 className="font-semibold text-[#222222] mb-6">Submit verification documents</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label className={labelClass}>Describe your season tickets</label>
          <textarea
            {...register("description")}
            placeholder="e.g., I've been a Lakers season ticket holder since 2018, section 114, 2 seats. My account is under the name John Smith."
            rows={4}
            className={`${inputClass} resize-none`}
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Ticket account ID / member number</label>
          <input
            {...register("ticketAccountId")}
            placeholder="e.g., LAK-123456789"
            className={inputClass}
          />
          {errors.ticketAccountId && <p className="text-xs text-red-500 mt-1">{errors.ticketAccountId.message}</p>}
        </div>

        <div className="space-y-3">
          <div>
            <label className={labelClass}>Upload documents</label>
            <p className="text-xs text-[#717171]">PDF, JPG, or PNG. Max 10MB each. At least 1 required.</p>
          </div>

          {DOC_TYPES.map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-[#DDDDDD] hover:border-[#222222] hover:bg-[#F7F7F7] transition-all cursor-pointer"
            >
              <Upload className="h-4 w-4 text-[#717171]" />
              <span className="text-sm text-[#717171]">Upload {label}</span>
              <input
                type="file"
                className="sr-only"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={(e) => handleFileChange(e, value)}
              />
            </label>
          ))}

          {files.length > 0 && (
            <div className="space-y-2 mt-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#F7F7F7] border border-[#DDDDDD] text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-team-primary flex-shrink-0" />
                    <span className="truncate text-[#222222] font-medium">{file.name}</span>
                    <span className="text-xs text-[#717171] flex-shrink-0">
                      ({DOC_TYPES.find((d) => d.value === file.docType)?.label})
                    </span>
                  </div>
                  <button type="button" onClick={() => removeFile(i)} className="flex-shrink-0">
                    <X className="h-4 w-4 text-[#717171] hover:text-red-500 transition-colors" />
                  </button>
                </div>
              ))}
            </div>
          )}
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
          {isSubmitting ? "Submitting..." : "Submit for review"}
        </button>

        <p className="text-xs text-[#717171] text-center">
          Your documents are stored securely and only reviewed by our team. We never share them.
        </p>
      </form>
    </div>
  );
}
