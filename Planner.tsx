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
import { useFirestoreCollection } from './hooks/useFirestoreCollection';
import * as firestoreService from './services/firestoreService';


interface PlannerProps {
  user: User;
}

export const Planner: React.FC<PlannerProps> = ({ user }) => {
  const [view, setView] = useState<View>('Overview');
  
  // Create dynamic keys for localStorage based on user ID for guests
  const userKey = useMemo(() => user.uid, [user]);

  // LOCAL STATE for guests
  const [localTasks, setLocalTasks] = useLocalStorage<Task[]>(`tasks-${userKey}`, user.isGuest ? INITIAL_TASKS : []);
  const [localClasses, setLocalClasses] = useLocalStorage<ClassEvent[]>(`classes-${userKey}`, user.isGuest ? INITIAL_CLASSES : []);
  const [localSubjects, setLocalSubjects] = useLocalStorage<Subject[]>(`subjects-${userKey}`, user.isGuest ? INITIAL_SUBJECTS : []);
  const [localGrades, setLocalGrades] = useLocalStorage<Grade[]>(`grades-${userKey}`, user.isGuest ? INITIAL_GRADES : []);

  // FIRESTORE STATE for authenticated users
  const { data: firestoreTasks, loading: loadingTasks } = useFirestoreCollection<Task>(!user.isGuest ? `users/${user.uid}/tasks` : '');
  const { data: firestoreClasses, loading: loadingClasses } = useFirestoreCollection<ClassEvent>(!user.isGuest ? `users/${user.uid}/classes` : '');
  const { data: firestoreSubjects, loading: loadingSubjects } = useFirestoreCollection<Subject>(!user.isGuest ? `users/${user.uid}/subjects` : '');
  const { data: firestoreGrades, loading: loadingGrades } = useFirestoreCollection<Grade>(!user.isGuest ? `users/${user.uid}/grades` : '');

  // Determine which data source to use
  const tasks = user.isGuest ? localTasks : firestoreTasks;
  const classes = user.isGuest ? localClasses : firestoreClasses;
  const subjects = user.isGuest ? localSubjects : firestoreSubjects;
  const grades = user.isGuest ? localGrades : firestoreGrades;

  const loadingData = !user.isGuest && (loadingTasks || loadingClasses || loadingSubjects || loadingGrades);

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
    const { id, ...data } = event;
    const isTask = 'dueDate' in event;
    const collectionName = isTask ? 'tasks' : 'classes';
    // New events from modal have a timestamp-based string ID from Date.now()
    const isNew = id.length > 15;

    if (user.isGuest) {
      const setter = isTask ? setLocalTasks : setLocalClasses;
      setter((prev: any[]) => {
        if (isNew) return [...prev, event];
        const index = prev.findIndex((item: any) => item.id === id);
        if (index > -1) {
          const newItems = [...prev];
          newItems[index] = event;
          return newItems;
        }
        return [...prev, event];
      });
    } else {
      if (isNew) {
        firestoreService.addDocument(user.uid, collectionName, data);
      } else {
        firestoreService.updateDocument(user.uid, collectionName, id, data);
      }
    }
  };

  const handleToggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (user.isGuest) {
      setLocalTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    } else {
       const { id, ...data } = task;
       firestoreService.updateDocument(user.uid, 'tasks', id, { ...data, completed: !task.completed });
    }
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
        if (user.isGuest) {
            setLocalSubjects(prev => prev.filter(s => s.id !== subjectId));
            setLocalGrades(prev => prev.filter(g => g.subjectId !== subjectId));
        } else {
            firestoreService.deleteDocument(user.uid, 'subjects', subjectId);
            // Delete associated grades
            grades.filter(g => g.subjectId === subjectId).forEach(g => {
                firestoreService.deleteDocument(user.uid, 'grades', g.id);
            });
        }
    }
  };

  const handleSaveSubject = (subject: Subject) => {
    const { id, ...data } = subject;
    const isNew = id.length > 15;

    if(user.isGuest) {
        setLocalSubjects(prev => {
            if (isNew) return [...prev, subject];
            const index = prev.findIndex(s => s.id === id);
            if (index > -1) {
                const newSubjects = [...prev];
                newSubjects[index] = subject;
                return newSubjects;
            }
            return [...prev, subject];
        });
    } else {
        if (isNew) {
            firestoreService.addDocument(user.uid, 'subjects', data);
        } else {
            firestoreService.updateDocument(user.uid, 'subjects', id, data);
        }
    }
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
     if(user.isGuest) {
        setLocalGrades(prev => prev.filter(g => g.id !== gradeId));
     } else {
        firestoreService.deleteDocument(user.uid, 'grades', gradeId);
     }
  };

  const handleSaveGrade = (grade: Grade) => {
    const { id, ...data } = grade;
    const isNew = id.length > 15;

    if(user.isGuest) {
        setLocalGrades(prev => {
            if (isNew) return [...prev, grade];
            const index = prev.findIndex(g => g.id === id);
            if (index > -1) {
                const newGrades = [...prev];
                newGrades[index] = grade;
                return newGrades;
            }
            return [...prev, grade];
        });
    } else {
        if (isNew) {
            firestoreService.addDocument(user.uid, 'grades', data);
        } else {
            firestoreService.updateDocument(user.uid, 'grades', id, data);
        }
    }
  };

  if (loadingData) {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }
  
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