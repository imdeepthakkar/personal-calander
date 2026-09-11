export interface TimezoneOption {
  value: string;
  label: string;
  shortLabel: string;
  utcOffset: string;
}

export const POPULAR_TIMEZONES: TimezoneOption[] = [
  { value: "Asia/Kolkata", label: "India Standard Time (IST)", shortLabel: "IST", utcOffset: "UTC+5:30" },
  { value: "America/Chicago", label: "Central Standard Time (CST)", shortLabel: "CST", utcOffset: "UTC-6:00 / -5:00" },
  { value: "America/New_York", label: "Eastern Time (EST/EDT)", shortLabel: "EST", utcOffset: "UTC-5:00 / -4:00" },
  { value: "America/Los_Angeles", label: "Pacific Time (PST/PDT)", shortLabel: "PST", utcOffset: "UTC-8:00 / -7:00" },
  { value: "Europe/London", label: "Greenwich / BST (GMT/BST)", shortLabel: "GMT", utcOffset: "UTC+0:00 / +1:00" },
  { value: "Europe/Berlin", label: "Central European Time (CET/CEST)", shortLabel: "CET", utcOffset: "UTC+1:00 / +2:00" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST)", shortLabel: "GST", utcOffset: "UTC+4:00" },
  { value: "Asia/Singapore", label: "Singapore Time (SGT)", shortLabel: "SGT", utcOffset: "UTC+8:00" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)", shortLabel: "JST", utcOffset: "UTC+9:00" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AEST)", shortLabel: "AEST", utcOffset: "UTC+10:00 / +11:00" },
];

/**
 * Format date in specific timezone with custom format
 */
export function formatInTimezone(
  date: Date | string,
  timeZone: string,
  options: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    ...options,
  }).format(d);
}

/**
 * Get hour of day (0-23) in a specific timezone
 */
export function getHourInTimezone(date: Date | string, timeZone: string): number {
  const d = typeof date === "string" ? new Date(date) : date;
  const hourStr = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    hourCycle: "h23",
  }).format(d);
  return parseInt(hourStr, 10);
}

/**
 * Formats a dual time string, e.g. "09:00 CST / 19:30 IST"
 */
export function formatDualTime(
  date: Date | string,
  tz1: string,
  label1: string,
  tz2: string,
  label2: string
): { time1: string; time2: string; dualLabel: string } {
  const d = typeof date === "string" ? new Date(date) : date;
  const time1 = new Intl.DateTimeFormat("en-US", {
    timeZone: tz1,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);

  const time2 = new Intl.DateTimeFormat("en-US", {
    timeZone: tz2,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);

  return {
    time1,
    time2,
    dualLabel: `${label1}: ${time1} | ${label2}: ${time2}`,
  };
}
