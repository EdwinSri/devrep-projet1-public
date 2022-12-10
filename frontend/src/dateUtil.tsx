export const LONG_DATE_TIME_FORMAT = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', hour12: false, hour: '2-digit', minute: '2-digit' });
export const LONG_DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' });
export const SHORT_DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' });
export const TIME_FORMAT = new Intl.DateTimeFormat('fr-FR', { hour12: false, hour: '2-digit', minute: '2-digit' });

export function toLocalDateTimeString(date: Date): string {
  return date.toLocaleString('sv').replace(' ', 'T');
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + 1000 * 60 * minutes);
}
