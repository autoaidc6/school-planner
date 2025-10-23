import React, { useState, useEffect } from 'react';
import { type Subject } from '../types';
import { XIcon } from './icons';
import { COLOR_PALETTE } from '../constants';

interface SubjectModalProps {
  onClose: () => void;
  onSave: (subject: Subject) => void;
  subjectToEdit?: Subject | null;
}

const colorKeys = Object.keys(COLOR_PALETTE);

const SubjectModal: React.FC<SubjectModalProps> = ({ onClose, onSave, subjectToEdit }) => {
  const isEditing = !!subjectToEdit;
  const [name, setName] = useState('');
  const [credits, setCredits] = useState(3);
  const [goal, setGoal] = useState(90);
  const [color, setColor] = useState(colorKeys[0]);

  useEffect(() => {
    if (subjectToEdit) {
      setName(subjectToEdit.name);
      setCredits(subjectToEdit.credits);
      setGoal(subjectToEdit.goal);
      setColor(subjectToEdit.color);
    } else {
      // Assign a default color for new subjects, maybe based on how many subjects already exist
      // For simplicity, we can just start with the first color or a random one.
      setColor(colorKeys[Math.floor(Math.random() * colorKeys.length)]);
    }
  }, [subjectToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newSubject: Subject = {
      id: isEditing ? subjectToEdit.id : Date.now().toString(),
      name,
      credits,
      goal,
      color,
    };
    onSave(newSubject);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{isEditing ? 'Edit Subject' : 'Add New Subject'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Subject Name</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <div className="mt-2 grid grid-cols-9 gap-2">
                {colorKeys.map(colorKey => (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => setColor(colorKey)}
                    className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${COLOR_PALETTE[colorKey].bg.replace('-100', '-400')} ${color === colorKey ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="credits" className="block text-sm font-medium text-gray-700">Credits</label>
              <input type="number" id="credits" value={credits} onChange={e => setCredits(Number(e.target.value))} required min="0" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
            </div>
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700">Goal Grade (%)</label>
              <input type="number" id="goal" value={goal} onChange={e => setGoal(Number(e.target.value))} required min="0" max="100" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
            </div>
            <div className="flex justify-end pt-2">
              <button type="button" onClick={onClose} className="mr-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">{isEditing ? 'Save Changes' : 'Add Subject'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubjectModal;