import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function colorToParam(color: string): string {
  if (color.startsWith('#')) {
    return 'hex_' + color.slice(1);
  }
  return color;
}

export function paramToColor(param: string): string {
  if (param.startsWith('hex_')) {
    return '#' + param.slice(4);
  }
  return param;
}