import { CalendarEvent } from '@/types/calendar';

/**
 * Minimalist robust iCal (RFC 5545) VEVENT parser
 */
export function parseICalFeed(icalText: string, calendarName = 'Subscribed iCal', calendarColor = '#059669'): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const lines = icalText.replace(/\r\n /g, '').split(/\r\n|\n|\r/);

  let inEvent = false;
  let currentEvent: Partial<CalendarEvent> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      currentEvent = {
        id: `ical-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        source: 'ical',
        calendarName,
        calendarColor,
        allDay: false,
      };
      continue;
    }

    if (line === 'END:VEVENT') {
      inEvent = false;
      if (currentEvent.title && currentEvent.startTime) {
        if (!currentEvent.endTime) {
          // Default to 1 hour after start if end is missing
          const end = new Date(new Date(currentEvent.startTime).getTime() + 60 * 60 * 1000);
          currentEvent.endTime = end.toISOString();
        }
        events.push(currentEvent as CalendarEvent);
      }
      currentEvent = {};
      continue;
    }

    if (!inEvent) continue;

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const rawKey = line.substring(0, colonIndex);
    const value = line.substring(colonIndex + 1);
    const key = rawKey.split(';')[0].toUpperCase();

    if (key === 'SUMMARY') {
      currentEvent.title = unescapeICal(value);
    } else if (key === 'DESCRIPTION') {
      currentEvent.description = unescapeICal(value);
      // Try to extract meeting url from description if present
      const match = value.match(/https:\/\/(meet\.google\.com|teams\.microsoft\.com|zoom\.us\/j)\/[^\s]+/i);
      if (match) {
        currentEvent.meetingUrl = match[0];
      }
    } else if (key === 'LOCATION') {
      currentEvent.location = unescapeICal(value);
      if (value.startsWith('http://') || value.startsWith('https://')) {
        currentEvent.meetingUrl = value;
      }
    } else if (key === 'DTSTART') {
      currentEvent.startTime = parseICalDate(value, rawKey);
    } else if (key === 'DTEND') {
      currentEvent.endTime = parseICalDate(value, rawKey);
    } else if (key === 'URL') {
      currentEvent.meetingUrl = value;
    }
  }

  return events;
}

function unescapeICal(text: string): string {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

function parseICalDate(value: string, rawKey: string): string {
  // Format: 20260911T143000Z or 20260911
  const clean = value.replace(/[^0-9TZ]/g, '');
  if (clean.length === 8) {
    // All day: YYYYMMDD
    const y = clean.substring(0, 4);
    const m = clean.substring(4, 6);
    const d = clean.substring(6, 8);
    return `${y}-${m}-${d}T00:00:00Z`;
  }

  if (clean.includes('T')) {
    const parts = clean.split('T');
    const datePart = parts[0];
    const timePart = parts[1].replace('Z', '');
    const y = datePart.substring(0, 4);
    const m = datePart.substring(4, 6);
    const d = datePart.substring(6, 8);
    const hh = timePart.substring(0, 2);
    const mm = timePart.substring(2, 4);
    const ss = timePart.substring(4, 6) || '00';

    if (clean.endsWith('Z')) {
      return `${y}-${m}-${d}T${hh}:${mm}:${ss}Z`;
    }
    return `${y}-${m}-${d}T${hh}:${mm}:${ss}`;
  }

  return new Date().toISOString();
}
