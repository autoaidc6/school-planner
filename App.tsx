import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './components/views/Overview';
import Agenda from './components/views/Agenda';
import Timetable from './components/views/Timetable';
import CalendarView from './components/views/CalendarView';
import GradeTracker from './components/views/GradeTracker';
import AddEventModal from './components/AddEventModal';
import { type View, type Task, type ClassEvent, type Subject, type Grade } from './types';
import { INITIAL_TASKS, INITIAL_CLASSES, INITIAL_SUBJECTS, INITIAL_GRADES } from './constants';
import { PlusIcon } from './components/icons';
import { useLocalStorage } from './hooks/useLocalStorage';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('Overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Task | ClassEvent | null>(null);

  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', INITIAL_TASKS);
  const [classes, setClasses] = useLocalStorage<ClassEvent[]>('classes', INITIAL_CLASSES);
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('subjects', INITIAL_SUBJECTS);
  const [grades, setGrades] = useLocalStorage<Grade[]>('grades', INITIAL_GRADES);

  const handleSaveEvent = (event: Task | ClassEvent) => {
    if ('dueDate' in event) { // It's a Task
      setTasks(prev => {
        const exists = prev.some(t => t.id === event.id);
        if (exists) {
          return prev.map(t => t.id === event.id ? event : t);
        }
        return [...prev, event];
      });
    } else { // It's a ClassEvent
      setClasses(prev => {
        const exists = prev.some(c => c.id === event.id);
        if (exists) {
          return prev.map(c => c.id === event.id ? event : c);
        }
        return [...prev, event];
      });
    }
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const handleOpenModal = () => setIsModalOpen(true);
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleEditEvent = (event: Task | ClassEvent) => {
    setEditingEvent(event);
    handleOpenModal();
  };

  const renderView = () => {
    switch (currentView) {
      case 'Overview':
        return <Overview tasks={tasks} classes={classes} onEdit={handleEditEvent} />;
      case 'Agenda':
        return <Agenda tasks={tasks} onToggleTask={handleToggleTask} onEditTask={handleEditEvent as (task: Task) => void} />;
      case 'Timetable':
        return <Timetable classes={classes} onEdit={handleEditEvent as (event: ClassEvent) => void} />;
      case 'Calendar':
        return <CalendarView tasks={tasks} classes={classes} onEdit={handleEditEvent} />;
      case 'GradeTracker':
        return <GradeTracker subjects={subjects} setSubjects={setSubjects} grades={grades} setGrades={setGrades} />;
      default:
        return <Overview tasks={tasks} classes={classes} onEdit={handleEditEvent} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
      <button 
        onClick={handleOpenModal}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 z-40"
        aria-label="Add new event"
      >
        <PlusIcon className="w-6 h-6" />
      </button>
      {isModalOpen && <AddEventModal onClose={handleCloseModal} onSaveEvent={handleSaveEvent} eventToEdit={editingEvent} />}
    </div>
  );
};