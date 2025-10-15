import React from 'react';
import { type Subject, type Grade } from '../../types';
import { SUBJECT_COLORS } from '../../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface GradeTrackerProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  grades: Grade[];
  setGrades: React.Dispatch<React.SetStateAction<Grade[]>>;
}

const GradeTracker: React.FC<GradeTrackerProps> = ({ subjects, grades }) => {
  
  const calculateCurrentGrade = (subjectId: string) => {
    const subjectGrades = grades.filter(g => g.subjectId === subjectId);
    if (subjectGrades.length === 0) return { grade: 'N/A', weighted: 0, totalWeight: 0 };
    
    const totalWeightedScore = subjectGrades.reduce((acc, g) => acc + (g.score / g.total) * g.weight, 0);
    const totalWeight = subjectGrades.reduce((acc, g) => acc + g.weight, 0);

    if (totalWeight === 0) return { grade: 'N/A', weighted: 0, totalWeight: 0 };

    const currentGrade = (totalWeightedScore / totalWeight) * 100;
    return { grade: currentGrade.toFixed(2), weighted: totalWeightedScore, totalWeight };
  };

  const chartData = subjects.map(subject => {
    const { grade } = calculateCurrentGrade(subject.id);
    return {
      name: subject.name,
      'Current Grade': grade === 'N/A' ? 0 : parseFloat(grade),
      'Goal Grade': subject.goal,
    };
  });
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Grade Tracker</h1>
      
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Grade Overview</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-bold text-gray-800">{subject.name}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color.bg} ${color.text}`}>
                  {subject.credits} Credits
                </span>
              </div>
              <div className="my-4 text-center">
                <p className="text-4xl font-bold text-gray-900">{grade}%</p>
                <p className="text-sm text-gray-500">Goal: {subject.goal}%</p>
              </div>
              
              <h4 className="text-sm font-semibold text-gray-600 mb-2">Assignments</h4>
              <div className="space-y-2 text-sm">
                {grades.filter(g => g.subjectId === subject.id).map(g => (
                  <div key={g.id} className="flex justify-between">
                    <span className="text-gray-700">{g.name}</span>
                    <span className="font-medium text-gray-800">{g.score}/{g.total}</span>
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
