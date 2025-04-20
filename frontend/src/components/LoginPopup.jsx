import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginOrCreateUser } from '../stores/userSlice';

const LoginPopup = ({ isOpen, onClose, onLoginSuccess, message }) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const { error } = useSelector(state => state.user);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    try {
      setIsLoading(true);
      await dispatch(loginOrCreateUser(username.trim())).unwrap();
      setIsLoading(false);
      
      console.log('Login successful, calling success callback with username:', username);
      
      // Save the username to pass to the callback
      const loggedInUsername = username.trim();
      
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(loggedInUsername);
        } else {
          onClose();
        }
      }, 50);
    } catch (err) {
      setIsLoading(false);
      console.error('Login error:', err);
      // Error will be handled by the userSlice
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          <span role="img" aria-label="Close">❌</span>
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-6">
            {message || 'You need to sign in to continue with this action.'}
          </p>
          
          <form onSubmit={handleLogin}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="flex justify-between items-center">
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md
                  ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                `}
              >
                {isLoading ? 'Signing in...' : 'Continue'}
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup; 