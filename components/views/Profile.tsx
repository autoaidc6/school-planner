import React from 'react';
import { type User } from '../../types';
import { LogOutIcon, UserIcon } from '../icons';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  return (
    <div className="p-4 md:p-8 h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-sm text-center">
        <UserIcon className="w-24 h-24 mx-auto text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Profile</h1>
        <p className="text-gray-500 mt-2 break-words">
          {user.isGuest ? "Guest User" : user.email}
        </p>
        <button 
          onClick={onLogout}
          className="mt-8 w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <LogOutIcon className="w-5 h-5 mr-2" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
