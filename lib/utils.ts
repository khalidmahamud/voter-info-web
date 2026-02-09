import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Bengali ↔ Arabic numeral conversion utilities
const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
const arabicNumerals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

export function bengaliToArabic(str: string): string {
  let result = str
  for (let i = 0; i < 10; i++) {
    result = result.replaceAll(bengaliNumerals[i], arabicNumerals[i])
  }
  return result
}

export function arabicToBengali(str: string): string {
  let result = str
  for (let i = 0; i < 10; i++) {
    result = result.replaceAll(arabicNumerals[i], bengaliNumerals[i])
  }
  return result
}

export function normalizeVoterNumber(str: string): string {
  // Convert all Bengali numerals to Arabic for consistent searching
  return bengaliToArabic(str)
}
