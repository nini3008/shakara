import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertTo24Hour(timeStr: string): string {
  const [time, period] = timeStr.split(' ');
  const [hoursStr, minutes] = time.split(':');
  let hours = hoursStr;
  
  if (period === 'PM' && hours !== '12') {
    hours = String(parseInt(hours, 10) + 12);
  } else if (period === 'AM' && hours === '12') {
    hours = '00';
  }
  
  return `${hours.padStart(2, '0')}:${minutes}`;
}
