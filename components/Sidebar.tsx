import React from 'react';
import type { View } from '../types';
import { HomeIcon, AgendaIcon, TimetableIcon, CalendarIcon } from './icons';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const navItems: { view: View; icon: React.FC<{ className?: string }> }[] = [
  { view: 'Overview', icon: HomeIcon },
  { view: 'Agenda', icon: AgendaIcon },
  { view: 'Timetable', icon: TimetableIcon },
  { view: 'Calendar', icon: CalendarIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  return (
    <aside className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-6">
      <div className="text-blue-600 font-bold text-2xl">SP</div>
      <nav className="flex flex-col items-center space-y-4">
        {navItems.map(({ view, icon: Icon }) => (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            className={`p-3 rounded-xl transition-colors duration-200 ${
              currentView === view
                ? 'bg-blue-500 text-white'
                : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
            }`}
            aria-label={view}
            title={view}
          >
            <Icon className="w-6 h-6" />
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
