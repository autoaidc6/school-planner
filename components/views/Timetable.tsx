import React from 'react';
import type { ClassEvent } from '../../types';
import { SUBJECT_COLORS } from '../../constants';
import { ClockIcon } from '../icons';

interface TimetableProps {
  classes: ClassEvent[];
  onEdit: (event: ClassEvent) => void;
}

const Timetable: React.FC<TimetableProps> = ({ classes, onEdit }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 12 }, (_, i) => 8 + i); // 8 AM to 7 PM

  const timeToPosition = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    return (hour - 8) * 60 + minute;
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Timetable</h1>
      {classes.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-6 overflow-x-auto">
            <div className="grid grid-cols-8 min-w-[700px]">
            <div />
            {days.slice(1).concat(days.slice(0,1)).map(day => ( // Mon-Sun
                <div key={day} className="text-center font-semibold text-gray-600 pb-4">{day}</div>
            ))}

            {/* Time column */}
            <div className="col-span-1 pr-4">
                {hours.map(hour => (
                <div key={hour} className="h-20 flex justify-end">
                    <span className="text-sm text-gray-400 -mt-2">{hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}</span>
                </div>
                ))}
            </div>

            {/* Schedule grid */}
            <div className="col-span-7 grid grid-cols-7 relative">
                {/* Horizontal Lines */}
                {hours.map((_, index) => (
                <div key={`line-${index}`} className="col-span-7 border-t border-gray-100 h-20"></div>
                ))}

                {/* Vertical Lines */}
                {days.slice(0, 6).map((_, index) => (
                <div key={`vline-${index}`} className="absolute top-0 bottom-0 border-l border-gray-100" style={{left: `${(index + 1) * (100/7)}%`}}></div>
                ))}

                {/* Events */}
                {classes.map(classEvent => {
                const top = timeToPosition(classEvent.startTime) * (80 / 60); // 80px per 60 mins
                const duration = timeToPosition(classEvent.endTime) - timeToPosition(classEvent.startTime);
                const height = duration * (80 / 60);
                const color = SUBJECT_COLORS[classEvent.subject] || SUBJECT_COLORS['Default'];

                const dayIndex = classEvent.day === 0 ? 6 : classEvent.day - 1; // Adjust for Mon first

                return (
                    <div
                    key={classEvent.id}
                    onClick={() => onEdit(classEvent)}
                    className={`absolute w-[calc(100%/7-4px)] mx-[2px] p-2 rounded-lg flex flex-col justify-between cursor-pointer hover:ring-2 ring-blue-400 transition-shadow ${color.bg} ${color.text}`}
                    style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        left: `${dayIndex * (100 / 7)}%`,
                    }}
                    >
                    <div className="flex justify-between items-start">
                        <p className="font-bold text-sm">{classEvent.subject}</p>
                        <span className="text-xs font-medium opacity-70 bg-white/30 px-1.5 py-0.5 rounded">Class</span>
                    </div>
                    <p className="text-xs">{classEvent.startTime} - {classEvent.endTime}</p>
                    </div>
                );
                })}
            </div>
            </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <ClockIcon className="w-16 h-16 mx-auto text-gray-300" />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">No Classes Scheduled</h2>
            <p className="mt-2 text-gray-500">Your timetable is empty. Add a class event to see it here.</p>
        </div>
      )}
    </div>
  );
};

export default Timetable;