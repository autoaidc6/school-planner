import React, { useState } from 'react';
import { TaskCategory, ReminderOption, type Task, type ClassEvent } from '../types';
import { SUBJECT_COLORS } from '../constants';
import { SparklesIcon, XIcon } from './icons';
import { generateStudyPlan } from '../services/geminiService';

interface AddEventModalProps {
  onClose: () => void;
  onAddEvent: (event: Task | ClassEvent) => void;
  defaultDate?: Date;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ onClose, onAddEvent, defaultDate }) => {
  const [eventType, setEventType] = useState<'task' | 'class'>('task');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(Object.keys(SUBJECT_COLORS)[0]);
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.Homework);
  const [dueDate, setDueDate] = useState(defaultDate ? defaultDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  
  const [day, setDay] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [reminder, setReminder] = useState<ReminderOption>(ReminderOption.None);

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePlan = async () => {
    if (!title || !subject) {
      alert('Please enter a title and select a subject first.');
      return;
    }
    setIsGenerating(true);
    const plan = await generateStudyPlan(title, subject);
    setDescription(prev => prev ? `${prev}\n\nAI Study Plan:\n${plan}` : `AI Study Plan:\n${plan}`);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventType === 'task') {
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        subject,
        category,
        dueDate: new Date(dueDate),
        completed: false,
        description,
        reminder,
      };
      onAddEvent(newTask);
    } else {
        const newClass: ClassEvent = {
            id: Date.now().toString(),
            subject,
            day,
            startTime,
            endTime,
            reminder
        };
        onAddEvent(newClass);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-full overflow-y-auto">
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Add New Event</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="mb-6">
                <div className="flex border border-gray-200 rounded-lg p-1">
                <button onClick={() => setEventType('task')} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${eventType === 'task' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Task</button>
                <button onClick={() => setEventType('class')} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${eventType === 'class' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Class</button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {eventType === 'task' && (
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
                    </div>
                )}
                 <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                    <select id="subject" value={subject} onChange={e => setSubject(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 bg-white">
                        {Object.keys(SUBJECT_COLORS).filter(s => s !== 'Default').map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                </div>

                {eventType === 'task' ? (
                <>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select id="category" value={category} onChange={e => setCategory(e.target.value as TaskCategory)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 bg-white">
                            {Object.values(TaskCategory).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                        <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
                    </div>
                </>
                ) : (
                <>
                    <div>
                        <label htmlFor="day" className="block text-sm font-medium text-gray-700">Day of the Week</label>
                        <select id="day" value={day} onChange={e => setDay(Number(e.target.value))} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 bg-white">
                            <option value={1}>Monday</option>
                            <option value={2}>Tuesday</option>
                            <option value={3}>Wednesday</option>
                            <option value={4}>Thursday</option>
                            <option value={5}>Friday</option>
                            <option value={6}>Saturday</option>
                            <option value={0}>Sunday</option>
                        </select>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                            <input type="time" id="startTime" value={startTime} onChange={e => setStartTime(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                            <input type="time" id="endTime" value={endTime} onChange={e => setEndTime(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
                        </div>
                    </div>
                </>
                )}
                 <div>
                    <label htmlFor="reminder" className="block text-sm font-medium text-gray-700">Reminder</label>
                    <select id="reminder" value={reminder} onChange={e => setReminder(e.target.value as ReminderOption)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 bg-white">
                        {Object.values(ReminderOption).map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
                {eventType === 'task' && (
                    <div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description / Sub-tasks</label>
                            <button type="button" onClick={handleGeneratePlan} disabled={isGenerating} className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed">
                                <SparklesIcon className="w-4 h-4 mr-1" />
                                {isGenerating ? 'Generating...' : 'AI Study Plan'}
                            </button>
                        </div>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"></textarea>
                    </div>
                )}
                <div className="flex justify-end pt-2">
                    <button type="button" onClick={onClose} className="mr-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Cancel</button>
                    <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Add Event</button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;