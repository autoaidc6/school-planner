import React from 'react';
import { type View } from '../types';
import { HomeIcon, ListIcon, ClockIcon, CalendarIcon, AwardIcon } from './icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const navItems: { view: View; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { view: 'Overview', label: 'Overview', icon: HomeIcon },
  { view: 'Agenda', label: 'Agenda', icon: ListIcon },
  { view: 'Timetable', label: 'Timetable', icon: ClockIcon },
  { view: 'Calendar', label: 'Calendar', icon: CalendarIcon },
  { view: 'GradeTracker', label: 'Grade Tracker', icon: AwardIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Studee</h1>
        <p className="text-sm text-gray-500">Your Academic Planner</p>
      </div>
      <nav className="flex-1 px-4 py-2">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
              ${
                currentView === item.view
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }
            `}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4">
        {/* User profile section could go here */}
      </div>
    </div>
  );
};

export default Sidebar;
