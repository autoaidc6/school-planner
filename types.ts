export enum TaskCategory {
  Homework = 'Homework',
  Exam = 'Exam',
  Assignment = 'Assignment',
  Reminder = 'Reminder',
}

export enum ReminderOption {
  None = 'None',
  AtTime = 'At time of event',
  FiveMin = '5 minutes before',
  FifteenMin = '15 minutes before',
  OneHour = '1 hour before',
  OneDay = '1 day before',
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: Date;
  completed: boolean;
  category: TaskCategory;
  description?: string;
  reminder?: ReminderOption;
}

export interface ClassEvent {
  id: string;
  subject: string;
  day: number; // 0 for Sunday, 1 for Monday, etc.
  startTime: string; // "HH:mm" format
  endTime: string; // "HH:mm" format
  location?: string;
  reminder?: ReminderOption;
}

export type View = 'Overview' | 'Agenda' | 'Timetable' | 'Calendar';

export type PlannerEvent = Task | ClassEvent;