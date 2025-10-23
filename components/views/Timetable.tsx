import React, { useRef, useState, useMemo } from 'react';
import type { Task, ClassEvent, PlannerEvent, Subject } from '../../types';
import { COLOR_PALETTE } from '../../constants';
import { ClockIcon, ChevronLeftIcon, ChevronRightIcon } from '../icons';

// Utility functions to manage week dates
const getWeekStartDate = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

const getWeekDates = (startDate: Date) => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  return dates;
};

interface TimetableProps {
  tasks: Task[];
  classes: ClassEvent[];
  subjects: Subject[];
  onEdit: (event: PlannerEvent) => void;
  onRescheduleClass: (classId: string, newDay: number, newStartTime: string, newEndTime: string) => void;
  onRescheduleTask: (taskId: string, newDate: Date, newStartTime: string, newEndTime: string) => void;
}

const Timetable: React.FC<TimetableProps> = ({ tasks, classes, subjects, onEdit, onRescheduleClass, onRescheduleTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const weekStartDate = getWeekStartDate(currentDate);
  const weekDates = getWeekDates(weekStartDate);
  
  const hours = Array.from({ length: 15 }, (_, i) => 7 + i); // 7 AM to 9 PM
  const gridRef = useRef<HTMLDivElement>(null);
  const [draggedItem, setDraggedItem] = useState<{id: string; type: 'task' | 'class'} | null>(null);

  const subjectMap = useMemo(() => 
    subjects.reduce((acc, subject) => {
      acc[subject.name] = subject;
      return acc;
    }, {} as { [key: string]: Subject }), 
  [subjects]);

  const getSubjectColor = (subjectName: string) => {
    const colorName = subjectMap[subjectName]?.color || 'gray';
    return COLOR_PALETTE[colorName] || COLOR_PALETTE['gray'];
  };

  const timeToPosition = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    return (hour - 7) * 60 + minute; // Adjust for 7 AM start
  };

  const changeWeek = (offset: number) => {
    setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() + offset * 7);
        return newDate;
    });
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, event: PlannerEvent, type: 'task' | 'class') => {
    e.dataTransfer.setData('eventId', event.id);
    e.dataTransfer.setData('eventType', type);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => setDraggedItem({ id: event.id, type }), 0);
  };
  
  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('eventId');
    const eventType = e.dataTransfer.getData('eventType') as 'task' | 'class';
    if (!eventId || !gridRef.current) return;
    
    const event = eventType === 'task' ? tasks.find(t => t.id === eventId) : classes.find(c => c.id === eventId);
    if (!event || !event.startTime || !event.endTime) return;

    const duration = timeToPosition(event.endTime) - timeToPosition(event.startTime);

    const gridRect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - gridRect.left;
    const y = e.clientY - gridRect.top;
    
    const dayIndex = Math.floor((x / gridRect.width) * 7);
    const newDate = weekDates[dayIndex];
    const newDayOfWeek = newDate.getDay();

    const minutesFromTop = (y / (gridRect.height)) * (hours.length * 60);
    const totalMinutes = 7 * 60 + minutesFromTop;
    const roundedMinutes = Math.round(totalMinutes / 15) * 15;

    const newStartHour = Math.floor(roundedMinutes / 60);
    const newStartMinute = roundedMinutes % 60;
    
    if(newStartHour < 7 || newStartHour > 21) return;

    const newStartTime = `${String(newStartHour).padStart(2, '0')}:${String(newStartMinute).padStart(2, '0')}`;
    
    const endTotalMinutes = roundedMinutes + duration;
    const newEndHour = Math.floor(endTotalMinutes / 60);
    const newEndMinute = endTotalMinutes % 60;
    const newEndTime = `${String(newEndHour).padStart(2, '0')}:${String(newEndMinute).padStart(2, '0')}`;

    if (eventType === 'class') {
        onRescheduleClass(eventId, newDayOfWeek, newStartTime, newEndTime);
    } else {
        onRescheduleTask(eventId, newDate, newStartTime, newEndTime);
    }
    setDraggedItem(null);
  };

  const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString();

  const eventsForWeek = [
      ...classes.map(c => ({...c, type: 'class'})),
      ...tasks
        .filter(t => t.startTime && t.endTime && new Date(t.dueDate) >= weekDates[0] && new Date(t.dueDate) <= weekDates[6])
        .map(t => ({...t, type: 'task'}))
  ];

  return (
    <div className="p-4 md:p-8 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
        <div className="flex items-center space-x-2">
            <button onClick={() => changeWeek(-1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-5 h-5" /></button>
            <h2 className="text-xl font-semibold text-gray-700 w-48 text-center">{weekStartDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            <button onClick={() => changeWeek(1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon className="w-5 h-5" /></button>
        </div>
      </div>
      {(tasks.length > 0 || classes.length > 0) ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-6 flex-1 overflow-auto">
            <div className="grid grid-cols-8 min-w-[800px]">
            <div />
            {weekDates.map(date => (
                <div key={date.toString()} className="text-center font-semibold text-gray-600 pb-4">
                    <p className="text-sm">{date.toLocaleDateString(undefined, { weekday: 'short' })}</p>
                    <p className={`text-2xl mt-1 ${isSameDay(date, new Date()) ? 'text-blue-600' : 'text-gray-800'}`}>{date.getDate()}</p>
                </div>
            ))}

            <div className="col-span-1 pr-4">
                {hours.map(hour => (
                <div key={hour} className="h-20 flex justify-end">
                    <span className="text-sm text-gray-400 -mt-2">{hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}</span>
                </div>
                ))}
            </div>

            <div className="col-span-7 grid grid-cols-7 relative" ref={gridRef} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
                {hours.map((_, index) => (
                <div key={`line-${index}`} className="col-span-7 border-t border-gray-100 h-20"></div>
                ))}

                {Array.from({length: 6}).map((_, index) => (
                <div key={`vline-${index}`} className="absolute top-0 bottom-0 border-l border-gray-100" style={{left: `${(index + 1) * (100/7)}%`}}></div>
                ))}
                
                {eventsForWeek.map(event => {
                    if (!event.startTime || !event.endTime) return null;
                    const top = timeToPosition(event.startTime) * (80 / 60);
                    const duration = timeToPosition(event.endTime) - timeToPosition(event.startTime);
                    const height = duration * (80 / 60);
                    const color = getSubjectColor(event.subject);

                    let dayIndex;
                    if(event.type === 'class') {
                        const classEvent = event as ClassEvent;
                        dayIndex = weekDates.findIndex(d => d.getDay() === classEvent.day);
                    } else {
                        const taskEvent = event as Task;
                        dayIndex = weekDates.findIndex(d => isSameDay(d, new Date(taskEvent.dueDate)));
                    }

                    if (dayIndex === -1) return null;

                    const isDragged = draggedItem?.id === event.id && draggedItem?.type === event.type;
                    
                    return (
                        <div
                            key={`${event.type}-${event.id}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, event, event.type as 'task' | 'class')}
                            onDragEnd={handleDragEnd}
                            onClick={() => onEdit(event as PlannerEvent)}
                            className={`absolute w-[calc(100%/7-4px)] mx-[2px] p-2 rounded-lg flex flex-col cursor-grab hover:ring-2 ring-blue-400 transition-all ${color.bg} ${color.text} ${isDragged ? 'opacity-50 scale-105 shadow-lg' : 'shadow-sm'} ${event.type === 'task' ? 'border-2 border-dashed ' + color.border : ''}`}
                            style={{
                                top: `${top}px`,
                                height: `${height}px`,
                                left: `${dayIndex * (100 / 7)}%`,
                            }}
                        >
                            <p className="font-bold text-sm">{'title' in event ? event.title : event.subject}</p>
                            <p className="text-xs mt-auto">{event.startTime} - {event.endTime}</p>
                        </div>
                    );
                })}
            </div>
            </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200 flex-1">
            <ClockIcon className="w-16 h-16 mx-auto text-gray-300" />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">No Events Scheduled</h2>
            <p className="mt-2 text-gray-500">Your timetable is empty. Add a class or a timed task to see it here.</p>
        </div>
      )}
    </div>
  );
};

export default Timetable;
