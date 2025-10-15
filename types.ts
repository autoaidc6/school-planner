export type View = 'Overview' | 'Agenda' | 'Timetable' | 'Calendar' | 'GradeTracker';

export enum TaskCategory {
  Homework = 'Homework',
  Study = 'Study Session',
  Exam = 'Exam',
  Project = 'Project',
  Break = 'Break',
  Lunch = 'Lunch',
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

export interface Task {
  id: string;
  title: string;
  subject: string;
  category: TaskCategory;
  dueDate: Date;
  completed: boolean;
  description: string;
  reminder: ReminderOption;
}

export interface ClassEvent {
  id: string;
  subject: string;
  day: number; // 0 for Sunday, 1 for Monday, etc.
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  reminder: ReminderOption;
}

export interface Subject {
    id: string;
    name: string;
    credits: number;
    goal: number;
}

export interface Grade {
    id:string;
    subjectId: string;
    name: string;
    score: number;
    total: number;
    weight: number;
}