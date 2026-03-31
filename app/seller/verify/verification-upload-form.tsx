"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    <Card>
      <CardContent className="p-6">
        <h2 className="font-bold text-lg mb-6">Submit Verification Documents</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Describe Your Season Tickets</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="e.g., I've been a Lakers season ticket holder since 2018, section 114, 2 seats. My account is under the name John Smith."
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Account ID */}
          <div className="space-y-1.5">
            <Label htmlFor="ticketAccountId">Ticket Account ID / Member Number</Label>
            <Input
              id="ticketAccountId"
              {...register("ticketAccountId")}
              placeholder="e.g., LAK-123456789"
            />
            {errors.ticketAccountId && (
              <p className="text-sm text-red-600">{errors.ticketAccountId.message}</p>
            )}
          </div>

          {/* File upload */}
          <div className="space-y-3">
            <Label>Upload Documents</Label>
            <p className="text-xs text-muted-foreground">
              Upload PDF, JPG, or PNG files. Max 10MB each. At least 1 required.
            </p>

            {DOC_TYPES.map(({ value, label }) => (
              <div key={value} className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border hover:border-blue-400 transition-colors">
                <label className="flex-1 cursor-pointer flex items-center gap-2 text-sm">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Upload {label}</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => handleFileChange(e, value)}
                  />
                </label>
              </div>
            ))}

            {/* Uploaded files list */}
            {files.length > 0 && (
              <div className="space-y-2 mt-3">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50 text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        ({DOC_TYPES.find((d) => d.value === file.docType)?.label})
                      </span>
                    </div>
                    <button type="button" onClick={() => removeFile(i)}>
                      <X className="h-4 w-4 text-muted-foreground hover:text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-sm text-red-700 dark:text-red-300">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
            Submit for Review
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Your documents are stored securely and only reviewed by our team. We never share them.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
