import React from 'react';
import { HomeIcon, ListIcon, PlusIcon, UserIcon, BrainIcon } from './icons';
import { type View } from '../types';

interface BottomNavBarProps {
  currentView: View;
  setView: (view: View) => void;
  onAddTask: () => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
        {icon}
        <span className="mt-1">{label}</span>
    </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentView, setView, onAddTask }) => {
  const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
    { view: 'Overview', label: 'Overview', icon: <HomeIcon className="w-6 h-6" /> },
    { view: 'Agenda', label: 'Agenda', icon: <ListIcon className="w-6 h-6" /> },
    { view: 'Focus', label: 'Focus', icon: <BrainIcon className="w-6 h-6" /> },
    { view: 'Profile', label: 'Profile', icon: <UserIcon className="w-6 h-6" /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around items-center h-16">
            {navItems.slice(0, 2).map(item => (
                <NavItem
                    key={item.view}
                    icon={item.icon}
                    label={item.label}
                    isActive={currentView === item.view}
                    onClick={() => setView(item.view)}
                />
            ))}
            <button onClick={onAddTask} className="w-14 h-14 -mt-6 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700">
                <PlusIcon className="w-7 h-7" />
            </button>
            {navItems.slice(2).map(item => (
                <NavItem
                    key={item.view}
                    icon={item.icon}
                    label={item.label}
                    isActive={currentView === item.view}
                    onClick={() => setView(item.view)}
                />
            ))}
        </div>
    </div>
  );
};

export default BottomNavBar;