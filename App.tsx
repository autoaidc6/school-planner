import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './components/views/Overview';
import Agenda from './components/views/Agenda';
import Timetable from './components/views/Timetable';
import CalendarView from './components/views/CalendarView';
import AddEventModal from './components/AddEventModal';
import { PlusIcon } from './components/icons';
import type { View, Task, ClassEvent, PlannerEvent } from './types';
import { INITIAL_TASKS, INITIAL_CLASSES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('Overview');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [classes, setClasses] = useState<ClassEvent[]>(INITIAL_CLASSES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleAddEvent = (event: PlannerEvent) => {
    if ('title' in event) { // It's a Task
        setTasks(prev => [...prev, event]);
    } else { // It's a ClassEvent
        setClasses(prev => [...prev, event]);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'Overview':
        return <Overview tasks={tasks} classes={classes} />;
      case 'Agenda':
        return <Agenda tasks={tasks} onToggleTask={handleToggleTask} />;
      case 'Timetable':
        return <Timetable classes={classes} />;
      case 'Calendar':
        return <CalendarView tasks={tasks} classes={classes} />;
      default:
        return <Overview tasks={tasks} classes={classes} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
        aria-label="Add new event"
      >
        <PlusIcon className="w-8 h-8" />
      </button>

      {isModalOpen && <AddEventModal onClose={() => setIsModalOpen(false)} onAddEvent={handleAddEvent} />}
    </div>
  );
};

export default App;
