import { CalendarEvent, ToDoItem, UserSettings } from "@/types/calendar";

export const DEFAULT_SETTINGS: UserSettings = {
  primaryTimezone: "Asia/Kolkata",
  primaryLabel: "IST",
  secondaryTimezone: "America/Chicago",
  secondaryLabel: "CST",
  workingHoursStart: 9,
  workingHoursEnd: 18,
  boardTitle: "PERSONAL CALENDAR",
  googleConnected: false,
  microsoftConnected: false,
  icalFeeds: [],
  useDemoData: true,
};

// Daily target distribution matching the screenshot exactly for September 2026
export const SEPTEMBER_2026_TARGETS: Record<number, { tz1: number; tz2: number }> = {
  1: { tz1: 4, tz2: 0 },
  2: { tz1: 9, tz2: 1 },
  3: { tz1: 6, tz2: 6 },
  4: { tz1: 4, tz2: 1 },
  5: { tz1: 0, tz2: 0 },
  6: { tz1: 1, tz2: 0 },
  7: { tz1: 9, tz2: 2 },
  8: { tz1: 6, tz2: 6 },
  9: { tz1: 11, tz2: 6 },
  10: { tz1: 12, tz2: 6 },
  11: { tz1: 5, tz2: 6 },
  12: { tz1: 0, tz2: 0 },
  13: { tz1: 0, tz2: 2 },
  14: { tz1: 4, tz2: 2 },
  15: { tz1: 8, tz2: 2 },
  16: { tz1: 1, tz2: 0 },
  17: { tz1: 2, tz2: 0 },
  18: { tz1: 0, tz2: 0 },
  19: { tz1: 0, tz2: 0 },
  20: { tz1: 0, tz2: 0 },
  21: { tz1: 1, tz2: 0 },
  22: { tz1: 0, tz2: 0 },
  23: { tz1: 0, tz2: 0 },
  24: { tz1: 0, tz2: 0 },
  25: { tz1: 0, tz2: 0 },
  26: { tz1: 0, tz2: 0 },
  27: { tz1: 0, tz2: 0 },
  28: { tz1: 0, tz2: 0 },
  29: { tz1: 0, tz2: 0 },
  30: { tz1: 0, tz2: 0 },
};

const SAMPLE_MEETINGS = [
  { title: "Sprint Planning & Backlog Grooming", color: "#2563eb", source: "google" as const, cal: "Work Google" },
  { title: "Executive Architecture Sync - Heracles Core", color: "#7c3aed", source: "microsoft" as const, cal: "Office 365" },
  { title: "Cross-functional Product Sync (IST / US)", color: "#059669", source: "ical" as const, cal: "Engineering Cal" },
  { title: "ICRB Milestone Review & Security Clearance", color: "#dc2626", source: "microsoft" as const, cal: "ICRB Review" },
  { title: "Design Systems & UI/UX Guild Review", color: "#d97706", source: "google" as const, cal: "Design Guild" },
  { title: "Client Demo & Q3 Deliverables Walkthrough", color: "#4f46e5", source: "google" as const, cal: "Client Calls" },
  { title: "1:1 Sync with Principal Lead", color: "#0891b2", source: "local" as const, cal: "Personal" },
  { title: "DevOps & Infrastructure Resilience Check", color: "#475569", source: "ical" as const, cal: "Cloud Ops" },
];

const SAMPLE_TODOS = [
  { title: "Review ICRB architecture RFC document", priority: "urgent" as const, tag: "Compliance" },
  { title: "Approve PR for multi-timezone calendar sync", priority: "high" as const, tag: "Engineering" },
  { title: "Prepare slide deck for quarterly planning", priority: "medium" as const, tag: "Leadership" },
  { title: "Sync with DevOps team regarding latency metrics", priority: "high" as const, tag: "Infra" },
  { title: "Update personal task priority list", priority: "low" as const, tag: "Personal" },
  { title: "Clear pending code reviews on GitHub", priority: "medium" as const, tag: "Code" },
];

export function generateSeptember2026Data(): { events: CalendarEvent[]; todos: ToDoItem[] } {
  const events: CalendarEvent[] = [];
  const todos: ToDoItem[] = [];

  Object.entries(SEPTEMBER_2026_TARGETS).forEach(([dayStr, counts]) => {
    const day = parseInt(dayStr, 10);
    const dateStr = `2026-09-${String(day).padStart(2, "0")}`;

    // Generate tz1 items
    for (let i = 0; i < counts.tz1; i++) {
      const isTodo = i % 3 === 2; // 1 out of 3 is a todo
      const hour = 10 + (i % 8); 
      const minute = i % 2 === 0 ? "00" : "30";

      if (isTodo) {
        const todoTemplate = SAMPLE_TODOS[(day + i) % SAMPLE_TODOS.length];
        todos.push({
          id: `todo-${dateStr}-tz1-${i}`,
          source: (i % 2 === 0 ? "google-tasks" : "microsoft-todo"),
          title: `${todoTemplate.title} (${day} Sep)`,
          dueDate: dateStr,
          dueTime: `${String(hour).padStart(2, "0")}:${minute}`,
          completed: day < 11, // Past days completed
          priority: todoTemplate.priority,
          tags: [todoTemplate.tag, DEFAULT_SETTINGS.primaryLabel],
          notes: "Scheduled via task automation.",
        });
      } else {
        const meetTemplate = SAMPLE_MEETINGS[(day + i) % SAMPLE_MEETINGS.length];
        const startIso = `${dateStr}T${String(hour).padStart(2, "0")}:${minute}:00+05:30`;
        const endIso = `${dateStr}T${String(hour + 1).padStart(2, "0")}:${minute}:00+05:30`;

        events.push({
          id: `event-${dateStr}-tz1-${i}`,
          source: meetTemplate.source,
          calendarName: meetTemplate.cal,
          calendarColor: meetTemplate.color,
          title: meetTemplate.title,
          description: "High priority sync scheduled with stakeholders.",
          startTime: startIso,
          endTime: endIso,
          allDay: false,
          location: "Virtual Meeting Room",
          meetingUrl: "https://meet.google.com/abc-heracles-def",
          timezone: DEFAULT_SETTINGS.primaryTimezone,
        });
      }
    }

    // Generate tz2 items
    for (let i = 0; i < counts.tz2; i++) {
      const isTodo = i % 3 === 2; // 1 out of 3 is a todo
      const hour = 8 + (i % 8); // morning CST
      const minute = i % 2 === 0 ? "15" : "45";

      if (isTodo) {
        const todoTemplate = SAMPLE_TODOS[(day + i + 2) % SAMPLE_TODOS.length];
        todos.push({
          id: `todo-${dateStr}-tz2-${i}`,
          source: (i % 2 === 0 ? "google-tasks" : "microsoft-todo"),
          title: `${todoTemplate.title} (${day} Sep)`,
          dueDate: dateStr,
          dueTime: `${String(hour).padStart(2, "0")}:${minute}`,
          completed: day < 11,
          priority: todoTemplate.priority,
          tags: [todoTemplate.tag, DEFAULT_SETTINGS.secondaryLabel],
          notes: "Follow up required before EOD.",
        });
      } else {
        const meetTemplate = SAMPLE_MEETINGS[(day + i + 2) % SAMPLE_MEETINGS.length];
        const startIso = `${dateStr}T${String(hour).padStart(2, "0")}:${minute}:00-05:00`;
        const endIso = `${dateStr}T${String(hour + 1).padStart(2, "0")}:${minute}:00-05:00`;

        events.push({
          id: `event-${dateStr}-tz2-${i}`,
          source: meetTemplate.source,
          calendarName: meetTemplate.cal,
          calendarColor: meetTemplate.color,
          title: meetTemplate.title,
          description: "Sync with regional team.",
          startTime: startIso,
          endTime: endIso,
          allDay: false,
          location: "Virtual Meeting Room",
          meetingUrl: "https://teams.microsoft.com/l/meetup-join/heracles",
          timezone: DEFAULT_SETTINGS.secondaryTimezone,
        });
      }
    }
  });

  return { events, todos };
}
