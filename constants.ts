import { TaskCategory, type Task, type ClassEvent } from './types';

export const SUBJECT_COLORS: { [key: string]: { bg: string; text: string; border: string; } } = {
  'Philosophy': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' },
  'Physics': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-500' },
  'Spanish': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' },
  'English': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
  'Art': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-500' },
  'Biology': { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-500' },
  'Maths': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' },
  'History': { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-500' },
  'Computer Science': { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-500' },
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
    title: 'Research about resistant bacteria',
    subject: 'Biology',
    dueDate: today,
    completed: false,
    category: TaskCategory.Homework,
  },
  {
    id: '2',
    title: 'Integrals and derivatives exercises',
    subject: 'Maths',
    dueDate: today,
    completed: false,
    category: TaskCategory.Assignment,
  },
  {
    id: '3',
    title: 'Study Gauss\' law and the electric flux',
    subject: 'Physics',
    dueDate: tomorrow,
    completed: true,
    category: TaskCategory.Homework,
  },
   {
    id: '4',
    title: 'Exam on kinematics',
    subject: 'Physics',
    dueDate: nextWeek,
    completed: false,
    category: TaskCategory.Exam,
  },
];

export const INITIAL_CLASSES: ClassEvent[] = [
  { id: 'c1', subject: 'Philosophy', day: 1, startTime: '08:00', endTime: '09:00' },
  { id: 'c2', subject: 'Biology', day: 1, startTime: '09:00', endTime: '10:30' },
  { id: 'c3', subject: 'History', day: 1, startTime: '11:00', endTime: '12:30' },
  { id: 'c4', subject: 'Physics', day: 2, startTime: '08:00', endTime: '09:30' },
  { id: 'c5', subject: 'Art', day: 2, startTime: '09:30', endTime: '11:00' },
  { id: 'c6', subject: 'English', day: 2, startTime: '11:00', endTime: '12:00' },
  { id: 'c7', subject: 'Spanish', day: 3, startTime: '08:00', endTime: '09:30' },
  { id: 'c8', subject: 'Maths', day: 3, startTime: '10:00', endTime: '11:30' },
  { id: 'c9', subject: 'History', day: 3, startTime: '11:30', endTime: '13:00' },
  { id: 'c10', subject: 'English', day: 4, startTime: '08:00', endTime: '09:00' },
  { id: 'c11', subject: 'History', day: 4, startTime: '10:30', endTime: '12:00' },
  { id: 'c12', subject: 'Philosophy', day: 4, startTime: '12:00', endTime: '13:00' },
  { id: 'c13', subject: 'Art', day: 5, startTime: '08:00', endTime: '09:30' },
  { id: 'c14', subject: 'Maths', day: 5, startTime: '09:30', endTime: '11:00' },
  { id: 'c15', subject: 'Computer Science', day: 5, startTime: '12:00', endTime: '13:30' },
];
