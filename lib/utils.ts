import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export const BUYER_FEE_RATE = 0.03; // 3%

export function calculateBuyerFee(subtotal: number): number {
  return Math.round(subtotal * BUYER_FEE_RATE * 100) / 100;
}

export function calculateTotal(subtotal: number): number {
  return subtotal + calculateBuyerFee(subtotal);
}

export const SPORTS_LABELS: Record<string, string> = {
  NFL: "NFL",
  NBA: "NBA",
  MLB: "MLB",
  NHL: "NHL",
  MLS: "MLS",
  COLLEGE_FOOTBALL: "College Football",
  COLLEGE_BASKETBALL: "College Basketball",
  OTHER: "Other",
};

export const VERIFICATION_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending Review",
  APPROVED: "Verified",
  REJECTED: "Rejected",
  REVOKED: "Revoked",
};

export const TRANSFER_METHOD_LABELS: Record<string, string> = {
  UPLOAD: "File Upload",
  MOBILE_TRANSFER: "Mobile Transfer",
  WILL_CALL: "Will Call",
  FLASH_SEATS: "Flash Seats",
  OTHER: "Other",
};
