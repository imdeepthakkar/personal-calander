import { CalendarEvent, ToDoItem, UserSettings } from "@/types/calendar";

export const DEFAULT_SETTINGS: UserSettings = {
  primaryTimezone: "Asia/Kolkata",
  primaryLabel: "IST",
  secondaryTimezone: "America/Chicago",
  secondaryLabel: "CST",
  workingHoursStart: 9,
  workingHoursEnd: 18,
  boardTitle: "HERACLES",
  googleConnected: false,
  microsoftConnected: false,
  icalFeeds: [],
  useDemoData: true,
};

// Daily target distribution matching the screenshot exactly for September 2026
export const SEPTEMBER_2026_TARGETS: Record<number, { ist: number; cst: number }> = {
  1: { ist: 4, cst: 0 },
  2: { ist: 9, cst: 1 },
  3: { ist: 6, cst: 6 },
  4: { ist: 4, cst: 1 },
  5: { ist: 0, cst: 0 },
  6: { ist: 1, cst: 0 },
  7: { ist: 9, cst: 2 },
  8: { ist: 6, cst: 6 },
  9: { ist: 11, cst: 6 },
  10: { ist: 7, cst: 3 },
  11: { ist: 6, cst: 5 },
  12: { ist: 0, cst: 0 },
  13: { ist: 0, cst: 2 },
  14: { ist: 4, cst: 2 },
  15: { ist: 8, cst: 2 },
  16: { ist: 1, cst: 0 },
  17: { ist: 2, cst: 0 },
  18: { ist: 0, cst: 0 },
  19: { ist: 0, cst: 0 },
  20: { ist: 0, cst: 0 },
  21: { ist: 1, cst: 0 },
  22: { ist: 0, cst: 0 },
  23: { ist: 0, cst: 0 },
  24: { ist: 0, cst: 0 },
  25: { ist: 0, cst: 0 },
  26: { ist: 0, cst: 0 },
  27: { ist: 0, cst: 0 },
  28: { ist: 0, cst: 0 },
  29: { ist: 0, cst: 0 },
  30: { ist: 0, cst: 0 },
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

    // Generate IST items
    for (let i = 0; i < counts.ist; i++) {
      const isTodo = i % 3 === 2; // 1 out of 3 is a todo
      const hour = 10 + (i % 8); // 10:00 to 18:00 IST
      const minute = i % 2 === 0 ? "00" : "30";

      if (isTodo) {
        const todoTemplate = SAMPLE_TODOS[(day + i) % SAMPLE_TODOS.length];
        todos.push({
          id: `todo-${dateStr}-ist-${i}`,
          source: (i % 2 === 0 ? "google-tasks" : "microsoft-todo"),
          title: `${todoTemplate.title} (${day} Sep)`,
          dueDate: dateStr,
          dueTime: `${String(hour).padStart(2, "0")}:${minute}`,
          completed: day < 11, // Past days completed
          priority: todoTemplate.priority,
          tags: [todoTemplate.tag, "IST"],
          notes: "Scheduled via Heracles task automation.",
        });
      } else {
        const meetTemplate = SAMPLE_MEETINGS[(day + i) % SAMPLE_MEETINGS.length];
        const startIso = `${dateStr}T${String(hour).padStart(2, "0")}:${minute}:00+05:30`;
        const endIso = `${dateStr}T${String(hour + 1).padStart(2, "0")}:${minute}:00+05:30`;

        events.push({
          id: `event-${dateStr}-ist-${i}`,
          source: meetTemplate.source,
          calendarName: meetTemplate.cal,
          calendarColor: meetTemplate.color,
          title: meetTemplate.title,
          description: "High priority sync scheduled with cross-timezone stakeholders.",
          startTime: startIso,
          endTime: endIso,
          allDay: false,
          location: "Virtual Meeting Room",
          meetingUrl: "https://meet.google.com/abc-heracles-def",
          timezone: "Asia/Kolkata",
        });
      }
    }

    // Generate CST items
    for (let j = 0; j < counts.cst; j++) {
      const isTodo = j % 3 === 2;
      const cstHour = 9 + (j % 6); // 9:00 to 15:00 CST
      const minute = j % 2 === 0 ? "00" : "30";

      if (isTodo) {
        const todoTemplate = SAMPLE_TODOS[(day + j + 3) % SAMPLE_TODOS.length];
        todos.push({
          id: `todo-${dateStr}-cst-${j}`,
          source: "microsoft-todo",
          title: `${todoTemplate.title} [US Team]`,
          dueDate: dateStr,
          dueTime: `${String(cstHour).padStart(2, "0")}:${minute}`,
          completed: day < 11,
          priority: todoTemplate.priority,
          tags: [todoTemplate.tag, "CST"],
          notes: "Coordinated with Chicago CST team.",
        });
      } else {
        const meetTemplate = SAMPLE_MEETINGS[(day + j + 2) % SAMPLE_MEETINGS.length];
        const startIso = `${dateStr}T${String(cstHour).padStart(2, "0")}:${minute}:00-05:00`;
        const endIso = `${dateStr}T${String(cstHour + 1).padStart(2, "0")}:${minute}:00-05:00`;

        events.push({
          id: `event-${dateStr}-cst-${j}`,
          source: meetTemplate.source,
          calendarName: meetTemplate.cal,
          calendarColor: meetTemplate.color,
          title: meetTemplate.title,
          description: "US Central alignment and decision session.",
          startTime: startIso,
          endTime: endIso,
          allDay: false,
          location: "Teams Meeting Room",
          meetingUrl: "https://teams.microsoft.com/l/meetup-join/heracles",
          timezone: "America/Chicago",
        });
      }
    }
  });

  return { events, todos };
}
