import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function generateOrderNumber(): string {
  const date = new Date()
  const dateStr = date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0')
  const random = Math.floor(1000 + Math.random() * 9000).toString()
  return `ZB${dateStr}${random}`
}

export function generateTicketNumber(): string {
  const date = new Date();
  const datePart = date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TK${datePart}${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getDeliveryEstimate(
  productType: 'freshly_bakes' | 'regular',
  isSameDayAvailable: boolean,
  cutoffHour: number = 14
): string {
  const now = new Date()
  const currentHour = now.getHours()

  if (productType === 'freshly_bakes') {
    if (isSameDayAvailable && currentHour < cutoffHour) {
      return 'Today by 9 PM'
    }
    return 'Tomorrow'
  }
  return '2-3 business days'
}

export function calculateDiscount(
  price: number,
  discountPrice: number | null
): number {
  if (!discountPrice) return 0
  return Math.round(((price - discountPrice) / price) * 100)
}

