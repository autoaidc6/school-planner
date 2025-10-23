import React, { useState, useMemo } from 'react';
import type { Task, ClassEvent, Subject } from '../../types';
import { COLOR_PALETTE } from '../../constants';
import { BellIcon, PlayIcon } from '../icons';

interface CalendarViewProps {
  tasks: Task[];
  classes: ClassEvent[];
  subjects: Subject[];
  onEdit: (event: Task | ClassEvent) => void;
  onStartFocus: (event: Task | ClassEvent) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, classes, subjects, onEdit, onStartFocus }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

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
                    {dayEvents.dailyTasks.slice(0, 3).map(task => {
                      const colorInfo = getSubjectColor(task.subject);
                      const bgColor = (colorInfo?.bg || COLOR_PALETTE.gray.bg).replace('-100', '-400');
                      return <div key={task.id} className={`w-1.5 h-1.5 rounded-full ${bgColor}`}></div>;
                    })}
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
                        {selectedDayEvents.dailyTasks.map(task => {
                             const color = getSubjectColor(task.subject);
                             return (
                             <div key={task.id} className={`p-3 rounded-lg text-sm transition-shadow ${color.bg} ${color.text}`}>
                                <div className="flex items-start gap-2">
                                    <div className="flex-1 cursor-pointer" onClick={() => onEdit(task)}>
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold">{task.title}</p>
                                            <span className="text-xs font-medium opacity-70 bg-black/10 px-1.5 py-0.5 rounded">Task</span>
                                        </div>
                                        <p className="text-xs opacity-80 mt-0.5">{task.category}</p>
                                        {task.reminder && task.reminder !== 'None' && (
                                            <div className="flex items-center text-xs opacity-70 mt-1">
                                                <BellIcon className="w-3 h-3 mr-1" />
                                                <span>{task.reminder}</span>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => onStartFocus(task)} className={`p-1 -mr-1 -mt-1 rounded-full hover:bg-black/10 transition-colors ${color.text}`}>
                                        <PlayIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                        )})}
                        </div>
                    ) : <p className="text-sm text-gray-400">No tasks due.</p>}
                </div>
                 <div>
                    <h4 className="font-semibold text-gray-600 mb-2">Classes</h4>
                     {selectedDayEvents.dailyClasses.length > 0 ? (
                        <div className="space-y-2">
                        {selectedDayEvents.dailyClasses.map(cls => {
                            const color = getSubjectColor(cls.subject);
                            return (
                             <div key={cls.id} className={`p-3 rounded-lg text-sm transition-shadow ${color.bg} ${color.text}`}>
                                <div className="flex items-start gap-2">
                                    <div className="flex-1 cursor-pointer" onClick={() => onEdit(cls)}>
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold">{cls.subject}</p>
                                            <span className="text-xs font-medium opacity-70 bg-black/10 px-1.5 py-0.5 rounded">Class</span>
                                        </div>
                                        <p className="text-xs opacity-80 mt-0.5">{cls.startTime} - {cls.endTime}</p>
                                        {cls.reminder && cls.reminder !== 'None' && (
                                            <div className="flex items-center text-xs opacity-70 mt-1">
                                                <BellIcon className="w-3 h-3 mr-1" />
                                                <span>{cls.reminder}</span>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => onStartFocus(cls)} className={`p-1 -mr-1 -mt-1 rounded-full hover:bg-black/10 transition-colors ${color.text}`}>
                                        <PlayIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                        )})}
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
