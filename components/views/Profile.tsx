import React, { useState } from 'react';
import { type User, type Task, type Grade, type Subject } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { LogOutIcon, EditIcon, CheckIcon, AwardIcon, ListIcon, CheckCircleIcon, XIcon } from '../icons';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  tasks: Task[];
  grades: Grade[];
  subjects: Subject[];
}

const StatCard: React.FC<{icon: React.ReactNode, label: string, value: string | number}> = ({ icon, label, value }) => (
    <div className="bg-gray-100 rounded-xl p-4 flex items-center">
        <div className="p-2 bg-white rounded-full mr-4">
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{label}</p>
            <p className="text-gray-800 text-xl font-bold">{value}</p>
        </div>
    </div>
);

const Profile: React.FC<ProfileProps> = ({ user, onLogout, tasks, grades, subjects }) => {
  const { resetPassword, updateUserProfile } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [message, setMessage] = useState('');

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.isGuest) return;
    if (displayName.trim() === '') return;
    try {
        await updateUserProfile(displayName.trim());
        setMessage('Display name updated successfully!');
        setIsEditingName(false);
        setTimeout(() => setMessage(''), 3000);
    } catch (error) {
        console.error("Error updating profile:", error);
        setMessage('Failed to update name. Please try again.');
    }
  };

  const handlePasswordReset = async () => {
      if (user.email) {
        try {
            await resetPassword(user.email);
            setMessage('Password reset email sent. Check your inbox.');
            setTimeout(() => setMessage(''), 5000);
        } catch (error) {
            console.error("Error sending password reset email:", error);
            setMessage('Failed to send reset email. Please try again.');
        }
      }
  };
  
  // Calculate stats
  const tasksCompleted = tasks.filter(t => t.completed).length;
  const subjectsTracked = subjects.length;

  const calculateCurrentGrade = (subjectId: string): number | null => {
    const subjectGrades = grades.filter(g => g.subjectId === subjectId);
    if (subjectGrades.length === 0) return null;
    const totalWeightedScore = subjectGrades.reduce((acc, g) => acc + (g.score / g.total) * g.weight, 0);
    const totalWeight = subjectGrades.reduce((acc, g) => acc + g.weight, 0);
    if (totalWeight === 0) return null;
    return (totalWeightedScore / totalWeight) * 100;
  };

  const allSubjectGrades = subjects
    .map(s => calculateCurrentGrade(s.id))
    .filter((g): g is number => g !== null);

  const overallAverage = allSubjectGrades.length > 0
    ? (allSubjectGrades.reduce((acc, g) => acc + g, 0) / allSubjectGrades.length).toFixed(1) + '%'
    : 'N/A';

  const getInitials = () => {
      if (user.isGuest) return 'G';
      const name = user.displayName || user.email || 'U';
      return name.charAt(0).toUpperCase();
  }

  return (
    <div className="p-4 md:p-8 h-full bg-gray-50 flex justify-center">
      <div className="w-full max-w-2xl space-y-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 mt-1">Manage your profile, view progress, and handle account settings.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center">
                <div className="w-16 h-16 text-2xl text-white bg-blue-500 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {getInitials()}
                </div>
                <div className="ml-4 flex-1">
                    {isEditingName && !user.isGuest ? (
                        <form onSubmit={handleNameUpdate} className="flex items-center gap-2">
                           <input 
                                type="text"
                                value={displayName}
                                onChange={e => setDisplayName(e.target.value)}
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg p-2"
                           />
                           <button type="submit" className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200"><CheckIcon className="w-5 h-5" /></button>
                           <button type="button" onClick={() => setIsEditingName(false)} className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"><XIcon className="w-5 h-5" /></button>
                        </form>
                    ) : (
                        <div className="flex items-center group">
                            <h2 className="text-2xl font-bold text-gray-800">{user.displayName || "Student"}</h2>
                            {!user.isGuest && (
                                <button onClick={() => setIsEditingName(true)} className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <EditIcon className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    )}
                    <p className="text-gray-500 break-words">{user.email}</p>
                </div>
            </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Progress at a Glance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <StatCard icon={<CheckCircleIcon className="w-6 h-6 text-green-500"/>} label="Tasks Completed" value={tasksCompleted} />
               <StatCard icon={<ListIcon className="w-6 h-6 text-indigo-500"/>} label="Subjects Tracked" value={subjectsTracked} />
               <StatCard icon={<AwardIcon className="w-6 h-6 text-yellow-500"/>} label="Overall Average" value={overallAverage} />
            </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Account Settings</h3>
            <div className="space-y-4">
                {!user.isGuest && (
                    <div className="flex justify-between items-center">
                        <p className="text-gray-700">Change your password</p>
                        <button onClick={handlePasswordReset} className="font-semibold text-blue-600 hover:text-blue-800">Send Reset Link</button>
                    </div>
                )}
                <div className="flex justify-between items-center">
                    <p className="text-gray-700">Log out from your account</p>
                    <button onClick={onLogout} className="font-semibold text-red-600 hover:text-red-800 flex items-center">
                        <LogOutIcon className="w-4 h-4 mr-1" /> Log Out
                    </button>
                </div>
            </div>
        </div>

        {message && (
             <p className="text-center text-green-600 font-semibold">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Profile;