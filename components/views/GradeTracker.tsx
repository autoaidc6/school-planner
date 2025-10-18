import React from 'react';
import { type Subject, type Grade } from '../../types';
import { SUBJECT_COLORS } from '../../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { PlusIcon, EditIcon, TrashIcon, AwardIcon } from '../icons';

interface GradeTrackerProps {
  subjects: Subject[];
  grades: Grade[];
  onAddSubject: () => void;
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
  onAddGrade: (subjectId: string) => void;
  onEditGrade: (grade: Grade) => void;
  onDeleteGrade: (gradeId: string) => void;
}

const GradeTracker: React.FC<GradeTrackerProps> = ({ subjects, grades, onAddSubject, onEditSubject, onDeleteSubject, onAddGrade, onEditGrade, onDeleteGrade }) => {
  
  const calculateCurrentGrade = (subjectId: string) => {
    const subjectGrades = grades.filter(g => g.subjectId === subjectId);
    if (subjectGrades.length === 0) return { grade: 'N/A' };
    
    const totalWeightedScore = subjectGrades.reduce((acc, g) => acc + (g.score / g.total) * g.weight, 0);
    const totalWeight = subjectGrades.reduce((acc, g) => acc + g.weight, 0);

    if (totalWeight === 0) return { grade: 'N/A' };

    const currentGrade = (totalWeightedScore / totalWeight) * 100;
    return { grade: currentGrade.toFixed(2) };
  };

  const chartData = subjects.map(subject => {
    const { grade } = calculateCurrentGrade(subject.id);
    return {
      name: subject.name.substring(0, 10) + (subject.name.length > 10 ? '...' : ''), // Shorten name for chart
      'Current Grade': grade === 'N/A' ? 0 : parseFloat(grade),
      'Goal Grade': subject.goal,
    };
  });
  
  if (subjects.length === 0) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-center">
        <div className="max-w-md">
            <AwardIcon className="w-16 h-16 mx-auto text-gray-300" />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">Track Your Grades</h2>
            <p className="mt-2 text-gray-500">Add your first subject to start tracking your academic progress and see how you're doing against your goals.</p>
            <button onClick={onAddSubject} className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
                Add Subject
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Grade Tracker</h1>
        <button onClick={onAddSubject} className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
          Add Subject
        </button>
      </div>
      
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Grade Overview</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '0.5rem', borderColor: '#e5e7eb' }} />
              <Legend />
              <Bar dataKey="Current Grade" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Goal Grade" fill="#a5b4fc" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(subject => {
          const { grade } = calculateCurrentGrade(subject.id);
          const color = SUBJECT_COLORS[subject.name] || SUBJECT_COLORS['Default'];

          return (
            <div key={subject.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 ${color.border}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{subject.name}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color.bg} ${color.text}`}>
                    {subject.credits} Credits
                  </span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <button onClick={() => onEditSubject(subject)} className="text-gray-400 hover:text-blue-600 p-1"><EditIcon className="w-4 h-4" /></button>
                    <button onClick={() => onDeleteSubject(subject.id)} className="text-gray-400 hover:text-red-600 p-1"><TrashIcon className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="my-4 text-center">
                <p className="text-4xl font-bold text-gray-900">{grade}%</p>
                <p className="text-sm text-gray-500">Goal: {subject.goal}%</p>
              </div>
              
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-gray-600">Assignments</h4>
                <button onClick={() => onAddGrade(subject.id)} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  <PlusIcon className="w-4 h-4 mr-1" /> Add
                </button>
              </div>
              <div className="space-y-2 text-sm mt-2">
                {grades.filter(g => g.subjectId === subject.id).map(g => (
                  <div key={g.id} className="flex justify-between items-center group">
                    <span className="text-gray-700 truncate pr-2" title={g.name}>{g.name}</span>
                    <div className="flex items-center flex-shrink-0">
                        <span className="font-medium text-gray-800 mr-2">{g.score}/{g.total}</span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                            <button onClick={() => onEditGrade(g)} className="text-gray-400 hover:text-blue-600 p-0.5"><EditIcon className="w-4 h-4" /></button>
                            <button onClick={() => onDeleteGrade(g.id)} className="text-gray-400 hover:text-red-600 p-0.5"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    </div>
                  </div>
                ))}
                {grades.filter(g => g.subjectId === subject.id).length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-2">No grades entered yet.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GradeTracker;