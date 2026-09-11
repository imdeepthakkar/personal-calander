export type CalendarSource = 'google' | 'microsoft' | 'ical' | 'local';

export type TaskSource = 'google-tasks' | 'microsoft-todo' | 'local';

export type HeatLevel = 'zero' | 'low' | 'medium' | 'high';

export interface CalendarEvent {
  id: string;
  source: CalendarSource;
  calendarName: string;
  calendarColor: string; // hex code
  title: string;
  description?: string;
  startTime: string; // ISO 8601
  endTime: string;   // ISO 8601
  allDay: boolean;
  location?: string;
  meetingUrl?: string; // Meet, Teams, Zoom
  timezone?: string;
}

export interface ToDoItem {
  id: string;
  source: TaskSource;
  title: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
  notes?: string;
}

export interface DayWorkload {
  date: Date;
  dateKey: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  totalCount: number;
  tz1Count: number; // e.g. IST
  tz2Count: number; // e.g. CST
  heatLevel: HeatLevel;
  events: CalendarEvent[];
  todos: ToDoItem[];
}

export interface ICalFeed {
  id: string;
  name: string;
  url: string;
  color: string;
  enabled: boolean;
  lastSynced?: string;
}

export interface UserSettings {
  primaryTimezone: string; 
  primaryLabel: string;    
  secondaryTimezone: string; 
  secondaryLabel: string;  
  workingHoursStart: number; // 9 (9 AM)
  workingHoursEnd: number;   // 18 (6 PM)
  boardTitle: string;        // "PERSONAL CALENDAR"
  googleConnected: boolean;
  microsoftConnected: boolean;
  icalFeeds: ICalFeed[];
  useDemoData: boolean;
}
