import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomItemFromArray(items: string[]) {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}
