import React from 'react';
import { HomeIcon, ListIcon, CalendarIcon, ClockIcon, AwardIcon, PlusIcon, UserIcon, LogOutIcon } from './icons';
import { type User, type View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  onAddTask: () => void;
  user: User;
  onLogout: () => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
        {icon}
        <span className="ml-3">{label}</span>
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onAddTask, user, onLogout }) => {
  const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
    { view: 'Overview', label: 'Overview', icon: <HomeIcon className="w-5 h-5" /> },
    { view: 'Agenda', label: 'Agenda', icon: <ListIcon className="w-5 h-5" /> },
    { view: 'Timetable', label: 'Timetable', icon: <ClockIcon className="w-5 h-5" /> },
    { view: 'Calendar', label: 'Calendar', icon: <CalendarIcon className="w-5 h-5" /> },
    { view: 'Grades', label: 'Grade Tracker', icon: <AwardIcon className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center mb-8">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">S</div>
        <h1 className="ml-3 text-xl font-bold text-gray-800">Studier</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map(item => (
          <NavItem
            key={item.view}
            icon={item.icon}
            label={item.label}
            isActive={currentView === item.view}
            onClick={() => setView(item.view)}
          />
        ))}
      </nav>
      <div className="mt-auto">
        <button onClick={onAddTask} className="w-full mb-4 flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Event
        </button>
        <div className="border-t pt-4">
            <div className="flex items-center">
                <UserIcon className="w-8 h-8 text-gray-400 p-1 bg-gray-100 rounded-full" />
                <div className="ml-2 overflow-hidden">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user.isGuest ? 'Guest User' : user.email}</p>
                </div>
                <button onClick={onLogout} className="ml-auto text-gray-500 hover:text-red-600 p-1">
                    <LogOutIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;