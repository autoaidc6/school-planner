import React, { useState, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_TASKS, INITIAL_CLASSES, INITIAL_SUBJECTS, INITIAL_GRADES } from './constants';
import { type Task, type ClassEvent, type Subject, type Grade, type User, type View } from './types';
import Sidebar from './components/Sidebar';
import Overview from './components/views/Overview';
import Agenda from './components/views/Agenda';
import Timetable from './components/views/Timetable';
import CalendarView from './components/views/CalendarView';
import GradeTracker from './components/views/GradeTracker';
import Profile from './components/views/Profile';
import AddEventModal from './components/AddEventModal';
import SubjectModal from './components/SubjectModal';
import GradeModal from './components/GradeModal';
import { useNotifications } from './hooks/useNotifications';
import BottomNavBar from './components/BottomNavBar';
import { useAuth } from './contexts/AuthContext';

interface PlannerProps {
  user: User;
}

export const Planner: React.FC<PlannerProps> = ({ user }) => {
  const [view, setView] = useState<View>('Overview');
  
  // Create dynamic keys for localStorage based on user ID
  const userKey = useMemo(() => user.uid, [user]);

  const [tasks, setTasks] = useLocalStorage<Task[]>(`tasks-${userKey}`, user.isGuest ? INITIAL_TASKS : []);
  const [classes, setClasses] = useLocalStorage<ClassEvent[]>(`classes-${userKey}`, user.isGuest ? INITIAL_CLASSES : []);
  const [subjects, setSubjects] = useLocalStorage<Subject[]>(`subjects-${userKey}`, user.isGuest ? INITIAL_SUBJECTS : []);
  const [grades, setGrades] = useLocalStorage<Grade[]>(`grades-${userKey}`, user.isGuest ? INITIAL_GRADES : []);

  useNotifications([...tasks, ...classes]);
  const { logout } = useAuth();

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Task | ClassEvent | null>(null);
  const [defaultDate, setDefaultDate] = useState<Date | undefined>();

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);

  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [gradeToEdit, setGradeToEdit] = useState<Grade | null>(null);
  const [currentSubjectIdForGrade, setCurrentSubjectIdForGrade] = useState<string>('');

  const handleOpenEventModal = (event?: Task | ClassEvent, date?: Date) => {
    setEventToEdit(event || null);
    setDefaultDate(date);
    setIsEventModalOpen(true);
  };
  
  const handleSaveEvent = (event: Task | ClassEvent) => {
    if ('dueDate' in event) { // Task
      setTasks(prev => {
        const index = prev.findIndex(t => t.id === event.id);
        if (index > -1) {
          const newTasks = [...prev];
          newTasks[index] = event;
          return newTasks;
        }
        return [...prev, event];
      });
    } else { // ClassEvent
      setClasses(prev => {
        const index = prev.findIndex(c => c.id === event.id);
        if (index > -1) {
          const newClasses = [...prev];
          newClasses[index] = event;
          return newClasses;
        }
        return [...prev, event];
      });
    }
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };
  
  const handleAddSubject = () => {
    setSubjectToEdit(null);
    setIsSubjectModalOpen(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setSubjectToEdit(subject);
    setIsSubjectModalOpen(true);
  };

  const handleDeleteSubject = (subjectId: string) => {
    if (window.confirm('Are you sure you want to delete this subject and all its grades?')) {
        setSubjects(prev => prev.filter(s => s.id !== subjectId));
        setGrades(prev => prev.filter(g => g.subjectId !== subjectId));
    }
  };

  const handleSaveSubject = (subject: Subject) => {
    setSubjects(prev => {
        const index = prev.findIndex(s => s.id === subject.id);
        if (index > -1) {
            const newSubjects = [...prev];
            newSubjects[index] = subject;
            return newSubjects;
        }
        return [...prev, subject];
    });
  };

  const handleAddGrade = (subjectId: string) => {
    setCurrentSubjectIdForGrade(subjectId);
    setGradeToEdit(null);
    setIsGradeModalOpen(true);
  };

  const handleEditGrade = (grade: Grade) => {
    setCurrentSubjectIdForGrade(grade.subjectId);
    setGradeToEdit(grade);
    setIsGradeModalOpen(true);
  };

  const handleDeleteGrade = (gradeId: string) => {
    setGrades(prev => prev.filter(g => g.id !== gradeId));
  };

  const handleSaveGrade = (grade: Grade) => {
    setGrades(prev => {
        const index = prev.findIndex(g => g.id === grade.id);
        if (index > -1) {
            const newGrades = [...prev];
            newGrades[index] = grade;
            return newGrades;
        }
        return [...prev, grade];
    });
  };
  
  const renderView = () => {
    switch(view) {
      case 'Overview':
        return <Overview tasks={tasks} classes={classes} onEdit={handleOpenEventModal} />;
      case 'Agenda':
        return <Agenda tasks={tasks} onToggleTask={handleToggleTask} onEditTask={(task) => handleOpenEventModal(task)} />;
      case 'Timetable':
        return <Timetable classes={classes} onEdit={(cls) => handleOpenEventModal(cls)} />;
      case 'Calendar':
        return <CalendarView tasks={tasks} classes={classes} onEdit={handleOpenEventModal} />;
      case 'Grades':
        return <GradeTracker 
            subjects={subjects} 
            grades={grades}
            onAddSubject={handleAddSubject}
            onEditSubject={handleEditSubject}
            onDeleteSubject={handleDeleteSubject}
            onAddGrade={handleAddGrade}
            onEditGrade={handleEditGrade}
            onDeleteGrade={handleDeleteGrade}
        />;
      case 'Profile':
        return <Profile user={user} onLogout={logout} />;
      default:
        return <Overview tasks={tasks} classes={classes} onEdit={handleOpenEventModal} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar currentView={view} setView={setView} onAddTask={() => handleOpenEventModal()} user={user} onLogout={logout} />
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {renderView()}
      </main>
      <BottomNavBar currentView={view} setView={setView} onAddTask={() => handleOpenEventModal()} />
      {isEventModalOpen && <AddEventModal onClose={() => setIsEventModalOpen(false)} onSaveEvent={handleSaveEvent} eventToEdit={eventToEdit} defaultDate={defaultDate} />}
      {isSubjectModalOpen && <SubjectModal onClose={() => setIsSubjectModalOpen(false)} onSave={handleSaveSubject} subjectToEdit={subjectToEdit} />}
      {isGradeModalOpen && <GradeModal onClose={() => setIsGradeModalOpen(false)} onSave={handleSaveGrade} gradeToEdit={gradeToEdit} subjectId={currentSubjectIdForGrade} />}
    </div>
  );
};
