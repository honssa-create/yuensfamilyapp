export function toDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isValidDateString(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const probe = new Date(year, month - 1, day);
  return probe.getFullYear() === year && probe.getMonth() === month - 1 && probe.getDate() === day;
}

/** Gregorian month-day, MM-DD. Leap day is allowed. */
export function isValidMonthDay(value: string): boolean {
  const match = /^(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const day = Number(match[2]);
  const probe = new Date(2000, month - 1, day);
  return probe.getMonth() === month - 1 && probe.getDate() === day;
}

export function formatMonthDay(monthDay: string): string {
  if (!isValidMonthDay(monthDay)) return monthDay;
  const [month, day] = monthDay.split('-').map(Number);
  return new Date(2000, month - 1, day).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
}

export function formatRecordDate(dateString: string): string {
  if (!isValidDateString(dateString)) return dateString;
  const date = new Date(`${dateString}T12:00:00`);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDisplayDate(dateString: string): string {
  const date = new Date(`${dateString}T12:00:00`);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function shiftDate(dateString: string, days: number): string {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + days);
  return toDateString(date);
}

export function isToday(dateString: string): boolean {
  return dateString === toDateString();
}

export function isTomorrow(dateString: string): boolean {
  return dateString === shiftDate(toDateString(), 1);
}

export const SCHEDULE_MAX_DAYS = 14;

export function maxScheduleDate(from: Date = new Date()): string {
  return shiftDate(toDateString(from), SCHEDULE_MAX_DAYS);
}

export function isWithinScheduleWindow(dateString: string, from: Date = new Date()): boolean {
  const today = toDateString(from);
  const max = maxScheduleDate(from);
  return dateString >= today && dateString <= max;
}
