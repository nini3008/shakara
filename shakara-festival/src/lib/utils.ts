import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to convert time strings to 24-hour format for proper sorting
export function convertTo24Hour(timeStr: string): string {
  if (!timeStr) return '00:00';

  // If already in 24-hour format (contains ':' and no AM/PM), return as is
  if (timeStr.includes(':') && !timeStr.toLowerCase().includes('am') && !timeStr.toLowerCase().includes('pm')) {
    return timeStr.padStart(5, '0'); // Ensure HH:MM format
  }

  // Handle 12-hour format
  const time = timeStr.toLowerCase().trim();
  const isPM = time.includes('pm');
  const isAM = time.includes('am');

  // Extract just the time part (remove am/pm)
  const timePart = time.replace(/\s*(am|pm)/g, '').trim();

  // Split hours and minutes
  const [hours, minutes = '00'] = timePart.split(':');
  let hour = parseInt(hours, 10);

  // Convert to 24-hour format
  if (isPM && hour !== 12) {
    hour += 12;
  } else if (isAM && hour === 12) {
    hour = 0;
  }

  return `${hour.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}
