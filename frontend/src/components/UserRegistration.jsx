import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../stores/userSlice';
import { updateUserScore } from '../services/api';

const UserRegistration = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    try {
      // In a real app, this would create a new user in the backend
      dispatch(setUser({ username, score: 0 }));
      await updateUserScore(username, 0, false);
    } catch (error) {
      setError('Failed to create user. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Account</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default UserRegistration; 