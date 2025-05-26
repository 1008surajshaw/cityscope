import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getNameInitials = (name: string) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('');
  return initials.toUpperCase();
};