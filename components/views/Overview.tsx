import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { Task, ClassEvent } from '../../types';
import { SUBJECT_COLORS } from '../../constants';
import { BellIcon } from '../icons';

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
        <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '0.5rem', borderColor: '#e5e7eb' }} />
                    <Line type="monotone" dataKey="events" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4, fill: '#4f46e5' }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

const TodayEvent: React.FC<{ event: Task | ClassEvent, onEdit: (event: Task | ClassEvent) => void }> = ({ event, onEdit }) => {
    const color = SUBJECT_COLORS[event.subject] || SUBJECT_COLORS['Default'];
    const isTask = 'title' in event;

    const getTime = () => {
        if (isTask) {
            if (event.startTime) {
                return `${event.startTime}${event.endTime ? ` - ${event.endTime}` : ''}`;
            }
            return `Due today`;
        }
        return `${event.startTime} - ${event.endTime}`;
    }

    return (
        <button onClick={() => onEdit(event)} className={`w-full text-left p-4 rounded-lg flex items-start gap-4 border-l-4 transition-shadow hover:shadow-lg ${color.border} ${color.bg}`}>
            <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${color.bg.replace('bg-', 'bg-').replace('-100', '-500')}`}></div>
            <div className="flex-grow">
                 <div className="flex justify-between items-start">
                    <p className={`font-semibold ${color.text}`}>{isTask ? event.title : event.subject}</p>
                    <span className={`text-xs font-medium uppercase tracking-wider opacity-70 ${color.text}`}>{isTask ? 'Task' : 'Class'}</span>
                </div>
                <p className={`text-sm opacity-80 ${color.text}`}>{getTime()}</p>
                {event.reminder && event.reminder !== 'None' && (
                    <div className={`flex items-center text-xs mt-1 opacity-70 ${color.text}`}>
                        <BellIcon className="w-3 h-3 mr-1" />
                        <span>{event.reminder}</span>
                    </div>
                )}
            </div>
        </button>
    );
};

const Overview: React.FC<OverviewProps> = ({ tasks, classes, onEdit }) => {
    const today = new Date();
    const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString();

    const todayTasks = tasks.filter(task => isSameDay(new Date(task.dueDate), today) && !task.completed);
    const todayClasses = classes.filter(cls => cls.day === today.getDay());
    
    const todayEvents = [...todayTasks, ...todayClasses].sort((a, b) => {
        const timeA = 'startTime' in a && a.startTime ? a.startTime.replace(':', '') : ('dueDate' in a ? '2359' : '0000');
        const timeB = 'startTime' in b && b.startTime ? b.startTime.replace(':', '') : ('dueDate' in b ? '2359' : '0000');
        return Number(timeA) - Number(timeB);
    });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-500 mt-1">
            Welcome back! Here's what's on your plate.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Today's Events */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Today</h2>
                <p className="text-sm text-gray-500 mb-4">{today.toDateString()}</p>
                <div className="space-y-3">
                    {todayEvents.length > 0 ? (
                        todayEvents.map(event => <TodayEvent key={event.id} event={event} onEdit={onEdit} />)
                    ) : (
                        <p className="text-gray-500 text-center py-8">No events scheduled for today. Enjoy your day!</p>
                    )}
                </div>
            </div>
        </div>
        
        {/* Right Column - Weekly Report */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Weekly Report</h2>
                <p className="text-sm text-gray-500 mb-4">{tasks.length} events this week</p>
                <WeeklyReportChart tasks={tasks} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;