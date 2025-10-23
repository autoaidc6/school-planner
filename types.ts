import type { User as FirebaseUser } from 'firebase/auth';

export enum TaskCategory {
  Homework = 'Homework',
  Study = 'Study',
  Exam = 'Exam',
  Project = 'Project',
  Personal = 'Personal',
  Other = 'Other',
}

export enum ReminderOption {
  None = 'None',
  AtTime = 'At time of event',
  FiveMin = '5 minutes before',
  FifteenMin = '15 minutes before',
  OneHour = '1 hour before',
  OneDay = '1 day before',
}

export enum RecurrenceOption {
  None = 'None',
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  category: TaskCategory;
  dueDate: Date;
  completed: boolean;
  description: string;
  reminder: ReminderOption;
  startTime?: string; // "HH:mm"
  endTime?: string; // "HH:mm"
  recurrence: RecurrenceOption;
}

export interface ClassEvent {
  id: string;
  subject: string;
  day: number; // 0 for Sunday, 1 for Monday, etc.
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  description: string;
  reminder: ReminderOption;
}

export interface Subject {
  id: string;
  name: string;
  credits: number;
  goal: number;
  color: string; // Color name key from COLOR_PALETTE
}

export interface Grade {
  id:string;
  subjectId: string;
  name: string;
  score: number;
  total: number;
  weight: number;
}

export type User = FirebaseUser | { uid: string; isGuest: true; email: string | null; displayName?: string; };

export type View = 'Overview' | 'Agenda' | 'Timetable' | 'Calendar' | 'Grades' | 'Profile' | 'Focus';

export type PlannerEvent = Task | ClassEvent;