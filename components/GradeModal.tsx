import React, { useState, useEffect } from 'react';
import { type Grade } from '../types';
import { XIcon } from './icons';

interface GradeModalProps {
  onClose: () => void;
  onSave: (grade: Grade) => void;
  gradeToEdit?: Grade | null;
  subjectId: string;
}

const GradeModal: React.FC<GradeModalProps> = ({ onClose, onSave, gradeToEdit, subjectId }) => {
  const isEditing = !!gradeToEdit;
  const [name, setName] = useState('');
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(100);
  const [weight, setWeight] = useState(10);

  useEffect(() => {
    if (gradeToEdit) {
      setName(gradeToEdit.name);
      setScore(gradeToEdit.score);
      setTotal(gradeToEdit.total);
      setWeight(gradeToEdit.weight);
    }
  }, [gradeToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || total <= 0) return;

    const newGrade: Grade = {
      id: isEditing ? gradeToEdit.id : Date.now().toString(),
      subjectId,
      name,
      score,
      total,
      weight,
    };
    onSave(newGrade);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{isEditing ? 'Edit Grade' : 'Add New Grade'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Assignment Name</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="score" className="block text-sm font-medium text-gray-700">Score</label>
                <input type="number" id="score" value={score} onChange={e => setScore(Number(e.target.value))} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
              </div>
              <div className="w-1/2">
                <label htmlFor="total" className="block text-sm font-medium text-gray-700">Out of</label>
                <input type="number" id="total" value={total} onChange={e => setTotal(Number(e.target.value))} required min="1" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
              </div>
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (%)</label>
              <input type="number" id="weight" value={weight} onChange={e => setWeight(Number(e.target.value))} required min="0" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
            </div>
            <div className="flex justify-end pt-2">
              <button type="button" onClick={onClose} className="mr-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">{isEditing ? 'Save Changes' : 'Add Grade'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GradeModal;
