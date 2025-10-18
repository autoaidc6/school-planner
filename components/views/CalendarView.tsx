import React, { useState } from 'react';
import type { Task, ClassEvent } from '../../types';
import { SUBJECT_COLORS } from '../../constants';
import { BellIcon } from '../icons';

interface CalendarViewProps {
  tasks: Task[];
  classes: ClassEvent[];
  onEdit: (event: Task | ClassEvent) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, classes, onEdit }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const days = [];
  let day = new Date(startDate);
  while (day <= endDate) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }
  
  const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

  const eventsForDay = (date: Date) => {
    const dailyTasks = tasks.filter(task => isSameDay(new Date(task.dueDate), date));
    const dailyClasses = classes.filter(cls => cls.day === date.getDay());
    return { dailyTasks, dailyClasses };
  };

  const selectedDayEvents = eventsForDay(selectedDate);

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };
  
  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Calendar</h1>
      <div className="flex flex-col lg:flex-row flex-grow gap-8">
        <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => changeMonth(-1)} className="p-2 rounded-md hover:bg-gray-100">&lt;</button>
            <h2 className="text-xl font-semibold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            <button onClick={() => changeMonth(1)} className="p-2 rounded-md hover:bg-gray-100">&gt;</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 font-medium">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 mt-2">
            {days.map(d => {
              const isToday = isSameDay(d, new Date());
              const isSelected = isSameDay(d, selectedDate);
              const isCurrentMonth = d.getMonth() === currentDate.getMonth();
              const dayEvents = eventsForDay(d);
              
              return (
                <div key={d.toString()} className={`aspect-square p-1 border border-transparent rounded-lg cursor-pointer transition-colors hover:bg-gray-100 ${isCurrentMonth ? '' : 'text-gray-300'}`} onClick={() => setSelectedDate(d)}>
                  <div className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isToday ? 'bg-blue-600 text-white' : ''} ${isSelected ? 'border-2 border-blue-400' : ''}`}>
                    {d.getDate()}
                  </div>
                   <div className="flex justify-center space-x-1 mt-1 h-2">
                    {dayEvents.dailyTasks.slice(0, 3).map(task => (
                      <div key={task.id} className={`w-1.5 h-1.5 rounded-full ${SUBJECT_COLORS[task.subject]?.bg.replace('-100', '-400') || 'bg-gray-400'}`}></div>
                    ))}
                    {dayEvents.dailyClasses.length > 0 && dayEvents.dailyTasks.length < 3 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="w-full lg:w-1/3">
            <h3 className="text-xl font-semibold text-gray-800">{selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
            <div className="mt-4 space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-600 mb-2">Tasks</h4>
                    {selectedDayEvents.dailyTasks.length > 0 ? (
                        <div className="space-y-2">
                        {selectedDayEvents.dailyTasks.map(task => (
                             <div key={task.id} onClick={() => onEdit(task)} className={`p-3 rounded-lg text-sm cursor-pointer hover:shadow-md transition-shadow ${SUBJECT_COLORS[task.subject].bg} ${SUBJECT_COLORS[task.subject].text}`}>
                                <div className="flex justify-between items-start">
                                  <p className="font-semibold">{task.title}</p>
                                  <span className="text-xs font-medium opacity-70 bg-black/10 px-1.5 py-0.5 rounded">Task</span>
                                </div>
                                <p className="text-xs opacity-80">{task.category}</p>
                                {task.reminder && task.reminder !== 'None' && (
                                    <div className="flex items-center text-xs opacity-70 mt-1">
                                        <BellIcon className="w-3 h-3 mr-1" />
                                        <span>{task.reminder}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        </div>
                    ) : <p className="text-sm text-gray-400">No tasks due.</p>}
                </div>
                 <div>
                    <h4 className="font-semibold text-gray-600 mb-2">Classes</h4>
                     {selectedDayEvents.dailyClasses.length > 0 ? (
                        <div className="space-y-2">
                        {selectedDayEvents.dailyClasses.map(cls => (
                             <div key={cls.id} onClick={() => onEdit(cls)} className={`p-3 rounded-lg text-sm cursor-pointer hover:shadow-md transition-shadow ${SUBJECT_COLORS[cls.subject].bg} ${SUBJECT_COLORS[cls.subject].text}`}>
                                <div className="flex justify-between items-start">
                                  <p className="font-semibold">{cls.subject}</p>
                                  <span className="text-xs font-medium opacity-70 bg-black/10 px-1.5 py-0.5 rounded">Class</span>
                                </div>
                                <p className="text-xs opacity-80">{cls.startTime} - {cls.endTime}</p>
                                {cls.reminder && cls.reminder !== 'None' && (
                                    <div className="flex items-center text-xs opacity-70 mt-1">
                                        <BellIcon className="w-3 h-3 mr-1" />
                                        <span>{cls.reminder}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        </div>
                    ) : <p className="text-sm text-gray-400">No classes scheduled.</p>}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;