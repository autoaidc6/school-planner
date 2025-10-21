import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleIcon } from './icons';

type AuthMode = 'signin' | 'signup';

const Login: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const { login, signup, signInWithGoogle, resetPassword, loginAsGuest } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      if (mode === 'signin') {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', '').replace(/\(auth\/.*\)\.?/, ''));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setMessage('');
      try {
          await resetPassword(email);
          setMessage('Password reset email sent! Check your inbox.');
          setShowResetModal(false);
      } catch (err: any) {
          setError(err.message.replace('Firebase: ', ''));
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center mb-6">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">SPP</div>
          <h1 className="ml-4 text-3xl font-bold text-gray-800">School Planner Pro</h1>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="flex border-b mb-6">
            <button onClick={() => {setMode('signin'); setError('');}} className={`w-1/2 py-3 text-sm font-semibold transition-colors ${mode === 'signin' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Sign In</button>
            <button onClick={() => {setMode('signup'); setError('');}} className={`w-1/2 py-3 text-sm font-semibold transition-colors ${mode === 'signup' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Sign Up</button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-500 text-sm">{message}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-md font-semibold hover:bg-blue-700 transition-colors">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</button>
          </form>

          {mode === 'signin' && (
            <div className="text-center mt-4">
                <button onClick={() => setShowResetModal(true)} className="text-sm text-blue-600 hover:underline">Forgot password?</button>
            </div>
          )}
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">OR</span></div>
          </div>
          
          <button onClick={handleGoogleSignIn} className="w-full flex justify-center items-center py-2.5 border rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <GoogleIcon className="w-5 h-5 mr-3" />
            Continue with Google
          </button>
        </div>
        <div className="text-center mt-6">
          <button onClick={loginAsGuest} className="text-sm text-gray-600 hover:underline">Continue as Guest</button>
        </div>
      </div>
      {showResetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
                  <h2 className="text-xl font-bold mb-4">Reset Password</h2>
                  <p className="text-sm text-gray-600 mb-4">Enter your email address and we will send you a link to reset your password.</p>
                  <form onSubmit={handlePasswordReset}>
                      <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded-md" required />
                      <div className="flex justify-end mt-4">
                          <button type="button" onClick={() => setShowResetModal(false)} className="mr-2 px-4 py-2 border rounded-md">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Send Link</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Login;