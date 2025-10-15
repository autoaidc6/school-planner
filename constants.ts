import { TaskCategory, ReminderOption, type Task, type ClassEvent, type Subject, type Grade } from './types';

export const SUBJECT_COLORS: { [key: string]: { bg: string; text: string; border: string; } } = {
  'Mathematics': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' },
  'Physics': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-500' },
  'Literature': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-500' },
  'History': { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-500' },
  'Computer Science': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' },
  'Art': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
  'Personal': { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-500' },
  'Default': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-500' },
};

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Complete Algebra Homework',
    subject: 'Mathematics',
    category: TaskCategory.Homework,
    dueDate: today,
    completed: false,
    description: 'Chapter 3, problems 1-15.',
    reminder: ReminderOption.OneHour,
  },
  {
    id: '2',
    title: 'Study for Physics Midterm',
    subject: 'Physics',
    category: TaskCategory.Study,
    dueDate: tomorrow,
    completed: false,
    description: 'Review chapters on kinematics and dynamics.',
    reminder: ReminderOption.OneDay,
  },
  {
    id: '3',
    title: 'Write Essay on "The Great Gatsby"',
    subject: 'Literature',
    category: TaskCategory.Project,
    dueDate: nextWeek,
    completed: false,
    description: '5-page essay on the theme of the American Dream.',
    reminder: ReminderOption.OneDay,
  },
  {
    id: '4',
    title: 'History Presentation',
    subject: 'History',
    category: TaskCategory.Project,
    dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
    completed: true,
    description: 'Presentation on the Roman Empire.',
    reminder: ReminderOption.None,
  }
];

export const INITIAL_CLASSES: ClassEvent[] = [
  {
    id: 'c1',
    subject: 'Mathematics',
    day: 1, // Monday
    startTime: '09:00',
    endTime: '10:30',
    reminder: ReminderOption.FifteenMin,
  },
  {
    id: 'c2',
    subject: 'Physics',
    day: 2, // Tuesday
    startTime: '11:00',
    endTime: '12:30',
    reminder: ReminderOption.FifteenMin,
  },
  {
    id: 'c3',
    subject: 'Literature',
    day: 1, // Monday
    startTime: '13:00',
    endTime: '14:00',
    reminder: ReminderOption.None,
  },
  {
    id: 'c4',
    subject: 'Computer Science',
    day: 3, // Wednesday
    startTime: '10:00',
    endTime: '12:00',
    reminder: ReminderOption.FifteenMin,
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
    { id: 's1', name: 'Mathematics', credits: 4, goal: 90 },
    { id: 's2', name: 'Physics', credits: 4, goal: 85 },
    { id: 's3', name: 'Literature', credits: 3, goal: 88 },
];

export const INITIAL_GRADES: Grade[] = [
    { id: 'g1', subjectId: 's1', name: 'Homework 1', score: 95, total: 100, weight: 10 },
    { id: 'g2', subjectId: 's1', name: 'Midterm', score: 85, total: 100, weight: 30 },
    { id: 'g3', subjectId: 's2', name: 'Lab Report 1', score: 90, total: 100, weight: 20 },
    { id: 'g4', subjectId: 's3', name: 'Essay 1', score: 88, total: 100, weight: 40 },
];