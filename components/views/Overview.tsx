import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { Task, ClassEvent, PlannerEvent, Subject } from '../../types';
import { COLOR_PALETTE } from '../../constants';
import { MenuIcon, PlayIcon } from '../icons';

interface OverviewProps {
  tasks: Task[];
  classes: ClassEvent[];
  subjects: Subject[];
  onEdit: (event: PlannerEvent) => void;
  onStartFocus: (event: PlannerEvent) => void;
}

const WeeklyReportChart: React.FC<{tasks: Task[]}> = ({tasks}) => {
    const today = new Date();
    const data = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - (6 - i));
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
        const events = tasks.filter(t => new Date(t.dueDate).toDateString() === date.toDateString()).length;
        return { name: dayName, events };
    });

    return (
        <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '0.5rem', borderColor: '#e5e7eb' }} />
                    <Line type="monotone" dataKey="events" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

// Utility function to get the start of the current week (Monday)
const getWeekStartDate = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
};


const DashboardTimetable: React.FC<{ classes: ClassEvent[], tasks: Task[], subjects: Subject[], onEdit: (event: PlannerEvent) => void }> = ({ classes, tasks, subjects, onEdit }) => {
    const hours = Array.from({ length: 15 }, (_, i) => 7 + i); // 7 AM to 9 PM
    const today = new Date();
    const weekStartDate = getWeekStartDate(today);
    const weekDates = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(weekStartDate);
        date.setDate(weekStartDate.getDate() + i);
        return date;
    });

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
    
    const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString();

    const allEvents = [
      ...classes.map(c => ({...c, type: 'class'})),
      ...tasks
        .filter(t => t.startTime && t.endTime && new Date(t.dueDate) >= weekDates[0] && new Date(t.dueDate) <= weekDates[6])
        .map(t => ({...t, type: 'task'}))
    ];
    
    const now = new Date();
    const currentTimeInMinutes = (now.getHours() - 7) * 60 + now.getMinutes();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 h-full flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{today.toLocaleString('default', { month: 'long' })}</h2>
            
            <div className="grid grid-cols-7 text-center mb-4 flex-shrink-0">
                {weekDates.map(date => (
                  <div key={date.toISOString()}>
                    <p className="text-sm font-medium text-gray-500">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold mx-auto mt-2 text-sm ${isSameDay(date, today) ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>{date.getDate()}</div>
                  </div>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto -mr-6 pr-2">
                 <div className="flex">
                    <div className="pr-2 sm:pr-4 flex flex-col">
                        {hours.map(hour => (
                        <div key={hour} className="h-20 flex justify-end items-start flex-shrink-0">
                            <span className="text-xs text-gray-400 -mt-1.5">{hour > 12 ? hour - 12 : hour <= 0 ? 12 : hour}{hour < 12 || hour === 24 ? 'am' : 'pm'}</span>
                        </div>
                        ))}
                    </div>

                    <div className="flex-1 grid grid-cols-7 relative" style={{minHeight: `${hours.length * 80}px`}}>
                        {hours.slice(0).map((_, index) => (
                            <div key={`line-${index}`} className="col-span-7 border-t border-gray-100 h-20"></div>
                        ))}

                        {allEvents.map(event => {
                            if (!event.startTime || !event.endTime) return null;
                            const top = timeToPosition(event.startTime) * (80 / 60);
                            const duration = timeToPosition(event.endTime) - timeToPosition(event.startTime);
                            const height = Math.max(20, duration * (80 / 60) - 4);
                            const color = getSubjectColor(event.subject);

                            let dayIndex;
                            if(event.type === 'class') {
                                dayIndex = weekDates.findIndex(d => d.getDay() === (event as ClassEvent).day);
                            } else {
                                dayIndex = weekDates.findIndex(d => isSameDay(d, new Date((event as Task).dueDate)));
                            }
                            if (dayIndex === -1) return null;

                            return (
                                <div
                                key={`${event.type}-${event.id}`}
                                onClick={() => onEdit(event as PlannerEvent)}
                                className={`absolute w-[calc(100%-4px)] mx-[2px] p-1.5 rounded-lg flex flex-col cursor-pointer hover:ring-2 ring-blue-400 transition-shadow ${color.bg} ${color.text} ${event.type === 'task' ? 'border border-dashed '+color.border : ''}`}
                                style={{ top: `${top}px`, height: `${height}px`, left: `${dayIndex * (100 / 7)}%` }}
                                >
                                <p className="font-bold text-xs leading-tight">{'title' in event ? event.title : event.subject}</p>
                                </div>
                            );
                        })}
                         { now.getHours() >= 7 && now.getHours() < 22 &&
                            <div className="absolute w-full border-t-2 border-blue-500 z-10 pointer-events-none" style={{top: `${currentTimeInMinutes * (80 / 60)}px`}}>
                                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full -mt-[5px] -ml-[4px] border-2 border-white"></div>
                            </div>
                         }
                    </div>
                 </div>
            </div>
        </div>
    );
};

const Overview: React.FC<OverviewProps> = ({ tasks, classes, subjects, onEdit, onStartFocus }) => {
    const today = new Date();
    const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString();

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
    
    const todayEvents = [...tasks.filter(t => isSameDay(new Date(t.dueDate), today) && !t.completed), ...classes.filter(c => c.day === today.getDay())]
      .sort((a, b) => {
        const timeA = 'startTime' in a && a.startTime ? a.startTime : '23:59';
        const timeB = 'startTime' in b && b.startTime ? b.startTime : '23:59';
        return timeA.localeCompare(timeB);
      });
      
    const upcomingTasksCount = tasks.filter(t => {
        const due = new Date(t.dueDate);
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        return due >= today && due <= nextWeek;
    }).length;

    return (
        <div className="p-4 md:p-6 lg:p-8 h-full flex flex-col">
            <div className="flex items-center mb-6 flex-shrink-0">
                <button className="p-2 rounded-full hover:bg-gray-100 lg:hidden">
                    <MenuIcon className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-3xl font-bold text-gray-900 ml-2 lg:ml-0">Overview</h1>
            </div>

            <div className="flex flex-col xl:flex-row gap-8 flex-1 min-h-0">
                <div className="w-full xl:w-[420px] flex-shrink-0 space-y-8 flex flex-col">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Weekly report</h2>
                            <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-800">Show more</a>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{upcomingTasksCount} events next 7 days</p>
                        <WeeklyReportChart tasks={tasks} />
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex-1 min-h-0 flex flex-col">
                        <div className="flex justify-between items-center flex-shrink-0">
                            <h2 className="text-xl font-bold text-gray-800">Today</h2>
                            <p className="text-sm text-gray-500">{today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div className="space-y-4 mt-4 overflow-y-auto -mr-6 pr-4">
                            {todayEvents.length > 0 ? (
                                todayEvents.map(event => {
                                    const colorInfo = getSubjectColor(event.subject);
                                    const bgColor = (colorInfo?.bg || COLOR_PALETTE.gray.bg).replace('-100', '-400');
                                    return (
                                    <div key={event.id} className="flex items-center gap-3 group">
                                        <div className={`w-2 h-10 rounded-full ${bgColor}`}></div>
                                        <div className="flex-1 flex items-center cursor-pointer" onClick={() => onEdit(event)}>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-700 group-hover:text-blue-600">{'title' in event ? event.title : event.subject}</p>
                                                <p className="text-sm text-gray-500">
                                                  {'dueDate' in event // Is it a Task?
                                                    ? (event.startTime // Does the task have a start time?
                                                        ? `${event.startTime}${event.endTime ? ` - ${event.endTime}` : ''}`
                                                        : 'Due today')
                                                    : `${event.startTime} - ${event.endTime}` // It's a Class
                                                  }
                                                </p>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-400">
                                              {event.startTime && event.endTime ? `${(new Date(`1970-01-01T${event.endTime}:00`).getTime() - new Date(`1970-01-01T${event.startTime}:00`).getTime()) / 60000}m` : ''}
                                            </div>
                                        </div>
                                        <button onClick={() => onStartFocus(event)} className="p-2 -mr-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors">
                                            <PlayIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                )})
                            ) : (
                                <p className="text-gray-500 text-center py-8">No events for today.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-h-[600px] xl:min-h-0">
                    <DashboardTimetable classes={classes} tasks={tasks} subjects={subjects} onEdit={onEdit} />
                </div>
            </div>
        </div>
    );
};

export default Overview;
