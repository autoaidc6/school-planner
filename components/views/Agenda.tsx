import React from 'react';
import { type Task } from '../../types';
import { SUBJECT_COLORS } from '../../constants';
import { CheckCircleIcon, CircleIcon, BellIcon } from '../icons';

interface AgendaProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
}

const TaskItem: React.FC<{ task: Task; onToggleTask: (taskId: string) => void }> = ({ task, onToggleTask }) => {
  const color = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS['Default'];
  
  return (
    <div className="flex items-start space-x-4 py-4">
      <button onClick={() => onToggleTask(task.id)} className="mt-1">
        {task.completed ? <CheckCircleIcon className="w-6 h-6 text-blue-500" /> : <CircleIcon className="w-6 h-6 text-gray-300" />}
      </button>
      <div className="flex-1">
        <p className={`font-medium text-gray-800 ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</p>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <div className={`w-2.5 h-2.5 rounded-full mr-2 ${color.bg.replace('bg-','bg-').replace('-100','-400')}`}></div>
          <span>{task.subject}</span>
          <span className="mx-2">·</span>
          <span>{task.category}</span>
        </div>
        {task.reminder && task.reminder !== 'None' && (
          <div className="flex items-center text-xs text-gray-500 mt-1">
              <BellIcon className="w-3 h-3 mr-1.5" />
              <span>Reminder: {task.reminder}</span>
          </div>
        )}
        {task.completed && (
            <p className="text-xs text-green-600 mt-1">Completed on {new Date().toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
};

const Agenda: React.FC<AgendaProps> = ({ tasks, onToggleTask }) => {
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const groupTasks = () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const groups: { [key: string]: Task[] } = {
      'Today': [],
      'Tomorrow': [],
      'Upcoming': [],
      'Past': [],
    };

    tasks.forEach(task => {
      const dueDate = new Date(task.dueDate);
      if (isSameDay(dueDate, today)) {
        groups['Today'].push(task);
      } else if (isSameDay(dueDate, tomorrow)) {
        groups['Tomorrow'].push(task);
      } else if (dueDate > tomorrow) {
        groups['Upcoming'].push(task);
      } else {
         groups['Past'].push(task);
      }
    });
    return groups;
  };
  
  const groupedTasks = groupTasks();
  
  const formatDateHeader = (date: Date) => {
    return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const renderTaskGroup = (title: string, tasks: Task[]) => {
    if (tasks.length === 0) return null;
    
    // Custom sort: incomplete tasks first, then by subject
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        return a.subject.localeCompare(b.subject);
    });

    return (
      <div key={title} className="mb-8">
        <div className="flex items-baseline mb-2">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <p className="ml-3 text-sm text-gray-500">{formatDateHeader(title === 'Today' ? new Date() : new Date(new Date().setDate(new Date().getDate() + 1)))}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200 px-4">
            {sortedTasks.map(task => (
                <TaskItem key={task.id} task={task} onToggleTask={onToggleTask} />
            ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
      </div>
      {renderTaskGroup('Today', groupedTasks['Today'])}
      {renderTaskGroup('Tomorrow', groupedTasks['Tomorrow'])}
      {/* For upcoming, we could further group by date */}
      {groupedTasks['Upcoming'].length > 0 &&
        <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Upcoming</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200 px-4">
                {groupedTasks['Upcoming'].map(task => (
                    <TaskItem key={task.id} task={task} onToggleTask={onToggleTask} />
                ))}
            </div>
        </div>
      }
    </div>
  );
};

export default Agenda;