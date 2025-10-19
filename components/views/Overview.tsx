import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { Task, ClassEvent } from '../../types';
import { SUBJECT_COLORS } from '../../constants';
import { MenuIcon } from '../icons';

interface OverviewProps {
  tasks: Task[];
  classes: ClassEvent[];
  onEdit: (event: Task | ClassEvent) => void;
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

const DashboardTimetable: React.FC<{ classes: ClassEvent[], onEdit: (event: ClassEvent) => void }> = ({ classes, onEdit }) => {
    const hours = Array.from({ length: 13 }, (_, i) => 8 + i); // 8 AM to 8 PM

    const timeToPosition = (time: string) => {
        const [hour, minute] = time.split(':').map(Number);
        return (hour - 8) * 60 + minute;
    };
    
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 h-full flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{currentMonth}</h2>
            
            <div className="grid grid-cols-7 text-center mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day} className="text-sm font-medium text-gray-500">{day}</div>)}
                {[4, 5, 6, 7, 8, 9, 10].map(date => 
                    <div key={date} className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold mx-auto mt-2 text-sm ${date === 5 ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>{date}</div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto -mr-6 pr-2">
                 <div className="flex">
                    <div className="pr-2 sm:pr-4 flex flex-col">
                        {hours.map(hour => (
                        <div key={hour} className="h-20 flex justify-end items-start flex-shrink-0">
                            <span className="text-xs text-gray-400 -mt-1.5">{hour % 12 === 0 ? 12 : hour % 12}{hour < 12 ? 'am' : 'pm'}</span>
                        </div>
                        ))}
                    </div>

                    <div className="flex-1 grid grid-cols-7 relative">
                        {hours.slice(0).map((_, index) => (
                            <div key={`line-${index}`} className="col-span-7 border-t border-gray-100 h-20"></div>
                        ))}

                        {classes.map(classEvent => {
                            const top = timeToPosition(classEvent.startTime) * (80 / 60);
                            const duration = timeToPosition(classEvent.endTime) - timeToPosition(classEvent.startTime);
                            const height = Math.max(20, duration * (80 / 60) - 4); // Min height and padding
                            const color = SUBJECT_COLORS[classEvent.subject] || SUBJECT_COLORS['Default'];
                            const dayIndex = classEvent.day; 
                            if (dayIndex < 0 || dayIndex > 6) return null;

                            return (
                                <div
                                key={classEvent.id}
                                onClick={() => onEdit(classEvent)}
                                className={`absolute w-[calc(100%-4px)] mx-[2px] p-1.5 rounded-lg flex flex-col cursor-pointer hover:ring-2 ring-blue-400 transition-shadow ${color.bg} ${color.text}`}
                                style={{ top: `${top}px`, height: `${height}px`, left: `${dayIndex * (100 / 7)}%` }}
                                >
                                <p className="font-bold text-xs leading-tight">{classEvent.subject}</p>
                                </div>
                            );
                        })}
                         <div className="absolute w-full border-t-2 border-blue-500" style={{top: `${timeToPosition("12:00") * (80 / 60)}px`}}>
                             <div className="w-2.5 h-2.5 bg-blue-500 rounded-full -mt-[4px] -ml-[4px] border-2 border-white"></div>
                         </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};

const Overview: React.FC<OverviewProps> = ({ tasks, classes, onEdit }) => {
    const today = new Date();
    const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString();
    
    const todayEvents = [...tasks.filter(t => isSameDay(new Date(t.dueDate), today) && !t.completed), ...classes.filter(c => c.day === today.getDay())]
      .sort((a, b) => {
        const timeA = 'startTime' in a ? a.startTime : '23:59';
        const timeB = 'startTime' in b ? b.startTime : '23:59';
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
                                todayEvents.map(event => (
                                    <div key={event.id} onClick={() => onEdit(event)} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-2 h-10 rounded-full ${SUBJECT_COLORS[event.subject]?.bg.replace('-100', '-400')}`}></div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-700 group-hover:text-blue-600">{'title' in event ? event.title : event.subject}</p>
                                            <p className="text-sm text-gray-500">{'startTime' in event ? `${event.startTime} - ${event.endTime}` : 'Due today'}</p>
                                        </div>
                                        <div className="text-sm font-semibold text-gray-400">
                                          {'startTime' in event && event.endTime ? `${(new Date(`1970-01-01T${event.endTime}:00`) as any - (new Date(`1970-01-01T${event.startTime}:00`) as any)) / 60000}m` : ''}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8">No events for today.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-h-[600px] xl:min-h-0">
                    <DashboardTimetable classes={classes} onEdit={onEdit} />
                </div>
            </div>
        </div>
    );
};

export default Overview;
